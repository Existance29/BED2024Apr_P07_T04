const sql = require('mssql');
const dbConfig = require('../dbConfig');

class Book {
    constructor(book_id, title, author, availability){
        this.book_id = book_id,
        this.title = title,
        this.author = author,
        this.availability = availability
    }

    static async getAllBooks() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT * FROM Books`;
            const request = connection.request();
            const result = await request.query(sqlQuery);
            if (result.recordset.length === 0) {
                return null;
            }
            return result.recordset.map(row => new Book(row.book_id, row.title, row.author, row.availability));
        } catch (error) {
            console.log(error);
            throw new Error("Error in book.js Could not get all books");
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    static async getBookById(bookId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT * FROM Books WHERE book_id=@bookId`;
            const request = connection.request();
            request.input('bookId', bookId);
            const result = await request.query(sqlQuery);
            if (result.recordset[0] === 0) {
                return null;
            }
            const row = result.recordset[0];
            return new Book(row.id, row.title, row.author, row.availability)
        } catch (error) {
            console.log(error);
            throw new Error("Error in book.js Could not get book");
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    static async updateBookAvailability(bookId, availability) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `UPDATE Books SET availability=@avail WHERE book_id=@bookId`;
            const request = connection.request();
            request.input('avail', availability);
            request.input('bookId', bookId);
            const result = await request.query(sqlQuery);
            if (result.rowsAffected[0] === 0) {
                return null;
            }
            //return result.rowsAffected[0] > 0; // returns true 
            connection.close();
            return this.getBookById(bookId);
        } catch (error) {
            console.log(error);
            throw new Error("Error in book.js Could not udpate book availability");
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
}

module.exports = Book;