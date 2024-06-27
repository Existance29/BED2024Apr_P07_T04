const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

class Quiz {
    constructor(id, title, description, totalQuestions, totalMarks, duration) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.totalQuestions = totalQuestions;
        this.totalMarks = totalMarks;
        this.duration = duration;
    }

    static toQuizObj(row) {
        return new Quiz(row.id, row.title, row.description, row.totalQuestions, row.totalMarks, row.duration);
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
        const connection = await sql.connect(dbConfig);
        const request = connection.request();

        if (params) {
            for (const [key, value] of Object.entries(params)) {
                request.input(key, value);
            }
        }

        const result = await request.query(queryString);
        connection.close();
        return result;
    }

    static async getAllQuizzes() {
        const result = (await this.query("SELECT * FROM Quizzes")).recordset;
        return result.length ? result.map((x) => this.toQuizObj(x)) : null;
    }

    static async getQuizById(id) {
        const params = { "id": id };
        const result = (await this.query("SELECT * FROM Quizzes WHERE id = @id", params)).recordset[0];
        return result ? this.toQuizObj(result) : null;
    }

    static async getQuizQuestions(id) {
        const params = { "quizId": id };
        const result = (await this.query("SELECT * FROM Questions WHERE quizId = @quizId", params)).recordset;
        return result.length ? result.map((x) => this.toQuestionObj(x)) : null;
    }

    static async submitQuizAnswers(quizId, answers) {
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
            `INSERT INTO Results (quizId, score, totalQuestions, correctAnswers, timeTaken, totalMarks, grade) 
             VALUES (@quizId, @score, @totalQuestions, @correctAnswers, @timeTaken, @totalMarks, @grade);
             SELECT SCOPE_IDENTITY() AS id;`,
            {
                quizId: quizId,
                score: score,
                totalQuestions: totalQuestions,
                correctAnswers: correctAnswers,
                timeTaken: 30,  // Assume time taken is 30 minutes for simplicity
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
    
        return {
            score,
            totalQuestions,
            correctAnswers,
            incorrectQuestions,
            resultId,
            grade
        };
    }
    
    static async getQuizResult(quizId, resultId) {
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

        return {
            ...quizResult,
            incorrectQuestions,
            totalMarks: quiz.totalMarks,
            grade: calculateGrade(quizResult.score, quiz.totalMarks)  
        };
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
