const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

class Comment {
    constructor(commentID, message, rating) {
        this.commentID = commentID;
        this.message = message;
        this.rating = rating;
    }

    static async getAllComments() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Comments`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map(
            (row) => new Course(row.CommentID, row.Message, row.Rating)
        );
    }

    static async createComment(newCommentData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            INSERT INTO Comments (Message, Rating)
            VALUES (@message, @rating);
            SELECT SCOPE_IDENTITY() AS CommentID;
        `;
        const request = connection.request();
        request.input("message", newCommentData.message);
        request.input("rating", newCommentData.rating);

        const result = await request.query(sqlQuery);

        connection.close();

        return this.getCommentById(result.recordset[0].CommentID);
    }

    static async editComment(commentID, newCommentData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            UPDATE Comment SET
                Message = @message,
                Rating = @rating
            WHERE CommentID = @commentID;
        `;
        const request = connection.request();
        request.input("commentID", commentID);
        request.input("message", newCommentData.message || null);
        request.input("rating", newCommentData.rating || null);

        await request.query(sqlQuery);

        connection.close();

        return this.getCommentById(commentID);
    }
}

module.exports = Comment