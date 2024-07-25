const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

class Quiz {
    constructor(id, title, description, totalQuestions, totalMarks, duration, maxAttempts) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.totalQuestions = totalQuestions;
        this.totalMarks = totalMarks;
        this.duration = duration;
        this.maxAttempts = maxAttempts; 
    }

    static toQuizObj(row) {
        return new Quiz(row.id, row.title, row.description, row.totalQuestions, row.totalMarks, row.duration, row.maxAttempts);
    }

    static toQuestionObj(row) {
        return {
            id: row.id,
            quizId: row.quizId,
            text: row.text,
            options: JSON.parse(row.options),  // Ensure options are parsed correctly
            correctAnswer: row.correctAnswer
        };
    }

    static async query(queryString, params) {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();

        if (params) {
            for (const [key, value] of Object.entries(params)) {
                request.input(key, value);
            }
        }

        const result = await request.query(queryString);
        return result;
    }

    static async getAllQuizzes() {
        const result = (await this.query("SELECT * FROM Quizzes")).recordset;
        return result.length ? result.map((x) => this.toQuizObj(x)) : [];
    }

    static async getQuizById(id) {
        const params = { "id": id };
        const result = (await this.query("SELECT * FROM Quizzes WHERE id = @id", params)).recordset[0];
        return result ? this.toQuizObj(result) : null;
    }

    static async getQuizQuestions(id) {
        const params = { "quizId": id };
        const result = (await this.query("SELECT * FROM Questions WHERE quizId = @quizId", params)).recordset;
        return result.length ? result.map((x) => this.toQuestionObj(x)) : [];
    }

    static async deleteQuiz(quizId) {
        const connection = await sql.connect(dbConfig);
        const transaction = new sql.Transaction(connection);

        try {
            // Start a transaction
            await transaction.begin();
            const request = transaction.request();

            // Delete all entries in UserQuizAttempts associated with the quiz
            await request.input("quizId", sql.Int, quizId);
            await request.query(`DELETE FROM UserQuizAttempts WHERE quizId = @quizId`);

            // Delete all entries in IncorrectQuestions associated with the quiz
            await request.query(`
                DELETE FROM IncorrectQuestions
                WHERE questionId IN (SELECT id FROM Questions WHERE quizId = @quizId)
            `);

            // Delete all entries in Answers associated with the quiz
            await request.query(`DELETE FROM Answers WHERE quizId = @quizId`);

            // Delete all entries in Results associated with the quiz
            await request.query(`DELETE FROM Results WHERE quizId = @quizId`);

            // Delete all questions associated with the quiz
            await request.query(`DELETE FROM Questions WHERE quizId = @quizId`);

            // Finally, delete the quiz itself
            await request.query(`DELETE FROM Quizzes WHERE id = @quizId`);

            // Commit the transaction
            await transaction.commit();

            return true;
        } catch (error) {
            // If there's an error, rollback the transaction
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        } finally {
            connection.close();
        }
    }

    static async submitQuizAnswers(quizId, userId, answers, duration) {
        let score = 0;
        let totalQuestions = answers.length;
        let correctAnswers = 0;
        let incorrectQuestions = [];

        for (const answer of answers) {
            const question = await this.query(
                "SELECT * FROM Questions WHERE id = @questionId AND quizId = @quizId",
                { questionId: answer.questionId, quizId: quizId }
            );
            const correctAnswer = question.recordset[0].correctAnswer;
            if (answer.answer === correctAnswer) {
                score += 10;  // Assuming each question is worth 10 points
                correctAnswers++;
            } else {
                incorrectQuestions.push({
                    id: question.recordset[0].id,
                    text: question.recordset[0].text,
                    options: JSON.parse(question.recordset[0].options),
                    correctAnswer: correctAnswer,
                    userAnswer: answer.answer
                });
            }
        }

        const totalMarks = totalQuestions * 10;  // Calculate total marks
        const grade = calculateGrade(score, totalMarks);  // Calculate grade

        // Store the result in the database
        const result = await this.query(
            `INSERT INTO Results (quizId, userId, score, totalQuestions, correctAnswers, timeTaken, totalMarks, grade) 
             VALUES (@quizId, @userId, @score, @totalQuestions, @correctAnswers, @timeTaken, @totalMarks, @grade);
             SELECT SCOPE_IDENTITY() AS id;`,
            {
                quizId: quizId,
                userId: userId, // Ensure userId is included here
                score: score,
                totalQuestions: totalQuestions,
                correctAnswers: correctAnswers,
                timeTaken: duration,  // Use the duration from the client
                totalMarks: totalMarks,
                grade: grade
            }
        );

        const resultId = result.recordset[0].id;

        // Insert incorrect questions into the IncorrectQuestions table
        for (const incorrectQuestion of incorrectQuestions) {
            await this.query(
                `INSERT INTO IncorrectQuestions (resultId, text, userAnswer, correctAnswer, questionId)
                 VALUES (@resultId, @text, @userAnswer, @correctAnswer, @questionId);`,
                {
                    resultId: resultId,
                    text: incorrectQuestion.text,
                    userAnswer: incorrectQuestion.userAnswer,
                    correctAnswer: incorrectQuestion.correctAnswer,
                    questionId: incorrectQuestion.id
                }
            );
        }

        // Update the user's quiz attempts
        const userQuizAttempt = await this.query(
            "SELECT * FROM UserQuizAttempts WHERE userId = @userId AND quizId = @quizId",
            { userId: userId, quizId: quizId }
        );

        if (userQuizAttempt.recordset.length === 0) {
            await this.query(
                `INSERT INTO UserQuizAttempts (userId, quizId, attempts)
                 VALUES (@userId, @quizId, @attempts);`,
                {
                    userId: userId,
                    quizId: quizId,
                    attempts: 1
                }
            );
        } else {
            await this.query(
                `UPDATE UserQuizAttempts SET attempts = attempts + 1 WHERE userId = @userId AND quizId = @quizId`,
                {
                    userId: userId,
                    quizId: quizId
                }
            );
        }

        return {
            score,
            totalQuestions,
            correctAnswers,
            incorrectQuestions,
            resultId,
            grade
        };
    }

    static async getQuizResult(quizId, resultId, userId) {
        const result = await this.query(
            "SELECT * FROM Results WHERE id = @resultId AND quizId = @quizId",
            { resultId: resultId, quizId: quizId }
        );

        if (result.recordset.length === 0) {
            throw new Error("Result not found");
        }

        const quizResult = result.recordset[0];

        // Get the total marks for the quiz
        const quiz = await this.getQuizById(quizId);

        // Get incorrect questions
        const incorrectQuestionsResult = await this.query(
            `SELECT iq.*, q.options 
            FROM IncorrectQuestions iq
            JOIN Questions q ON iq.questionId = q.id
            WHERE iq.resultId = @resultId`,
            { resultId: resultId }
        );

        const incorrectQuestions = incorrectQuestionsResult.recordset;

        // Get the user's attempt data
        const userAttemptResult = await this.query(
            "SELECT * FROM UserQuizAttempts WHERE userId = @userId AND quizId = @quizId",
            { userId: userId, quizId: quizId }
        );

        const userAttempts = userAttemptResult.recordset.length ? userAttemptResult.recordset[0].attempts : 0;

        return {
            ...quizResult,
            incorrectQuestions,
            totalMarks: quiz.totalMarks,
            grade: calculateGrade(quizResult.score, quiz.totalMarks),
            attempts: userAttempts,
            maxAttempts: quiz.maxAttempts
        };
    }

    static async canAttemptQuiz(quizId, userId) {
        try {
            const quizResult = await this.query(
                'SELECT maxAttempts FROM Quizzes WHERE id = @quizId',
                { quizId }
            );

            if (quizResult.recordset.length === 0) {
                throw new Error('Quiz not found');
            }

            const maxAttempts = quizResult.recordset[0].maxAttempts;

            const userAttemptResult = await this.query(
                'SELECT * FROM UserQuizAttempts WHERE quizId = @quizId AND userId = @userId',
                { quizId, userId }
            );

            const attempts = userAttemptResult.recordset.length ? userAttemptResult.recordset[0].attempts : 0;

            return { canAttempt: attempts < maxAttempts, attempts: attempts, maxAttempts: maxAttempts };
        } catch (err) {
            throw new Error(`Error checking quiz attempt eligibility: ${err.message}`);
        }
    }

    static async getUserQuizResults(userId) {
        try {
            const userResults = await this.query(`
                SELECT q.title, r.score, r.totalMarks, r.grade, r.timeTaken, r.quizId, r.id
                FROM Results r
                JOIN Quizzes q ON r.quizId = q.id
                WHERE r.userId = @userId
                ORDER BY r.quizId, r.id
            `, { userId });

            return userResults.recordset;
        } catch (err) {
            throw new Error(`Error fetching user quiz results: ${err.message}`);
        }
    }
}

function calculateGrade(score, totalMarks) {
    const percentage = (score / totalMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
}

module.exports = Quiz;
