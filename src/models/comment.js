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
            (row) => new Comment(row.CommentID, row.Message, row.Rating)
        );
    }
    
    static async getCommentByID(commentID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Comments WHERE CommentID = @commentID`;
        const request = connection.request();
        request.input("commentID", sql.Int, commentID);
        const result = await request.query(sqlQuery);
        connection.close();

        if (result.recordset.length > 0) {
            const row = result.recordset[0];
            return new Comment(row.CommentID, row.Message, row.Rating);
        } else {
            return null;
        }
    }

    static async createComment(newCommentData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            INSERT INTO Comments (UserID, subLectureID, Message, Rating)
            VALUES (1, 1, @message, @rating);
            SELECT SCOPE_IDENTITY() AS CommentID;
        `;
        const request = connection.request();
        request.input("message", newCommentData.message);
        request.input("rating", newCommentData.rating);

        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0].CommentID;
    }

    static async editComment(commentID, newCommentData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            UPDATE Comments SET
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

        return this.getCommentByID(commentID);
    }

    static async deleteComment(commentID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Comments WHERE CommentID = @commentID`;
        const request = connection.request();
        request.input("commentID", sql.Int, commentID);

        const result = await request.query(sqlQuery);
        
        connection.close();

        return result.rowsAffected[0] > 0; // Returns true if a row was deleted
    }
}

module.exports = Comment