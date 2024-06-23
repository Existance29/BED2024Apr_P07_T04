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
        return result.length ? result.map(x => this.toQuizObj(x)) : null;
    }

    static async getQuizById(id) {
        const params = { "id": id };
        const result = (await this.query("SELECT * FROM Quizzes WHERE id = @id", params)).recordset[0];
        return result ? this.toQuizObj(result) : null;
    }

    static async getQuizQuestions(quizId) {
        const params = { "quizId": quizId };
        const result = (await this.query("SELECT * FROM Questions WHERE quizId = @quizId", params)).recordset;
        return result.length ? result : null;
    }

    static async submitQuizAnswers(quizId, answers) {
        // Here we should handle the logic to submit answers, calculate score, etc.
        // For simplicity, let's assume we just store the answers.
        for (const answer of answers) {
            const params = {
                "quizId": quizId,
                "questionId": answer.questionId,
                "answer": answer.answer
            };
            await this.query("INSERT INTO Answers (quizId, questionId, answer) VALUES (@quizId, @questionId, @answer)", params);
        }

        // Return a mock score for now
        return { score: 85 };
    }
}

module.exports = Quiz;
