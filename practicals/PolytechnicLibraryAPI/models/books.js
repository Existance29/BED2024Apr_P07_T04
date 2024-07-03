const query = require("../lib/query")

class Book {
    constructor(id, title, author, availability){
        this.id = id,
        this.title = title,
        this.author = author,
        this.availability = availability
    }

    //pass a objj from sql recordset  
    //returns a book object
    static toBookObj(row){
        return new Book(row.id, row.title, row.author, row.availability)
    }

    static async getAllBooks(){
        //get first user from database that matches username
        const result = (await query.query("SELECT * FROM Books")).recordset
        //return null if no books found, else return the list of boo objects
        return result.length ? result.map(x => this.toBookObj(x)) : null
    }

    static async getBookByID(id){
        //get first book from database that matches id
        const result = (await query.query("SELECT * FROM Books WHERE book_id = @id", {id:id})).recordset[0]
        //return null if no user found, else return the user
        return result ? this.toBookObj(result) : null
    }
    static async updateBookAvailability(id, newAvailability){
        //update book
        const params = {id: id, availability: newAvailability}
        //nothing to return
        await query.query("UPDATE Books SET availability = @availability WHERE book_id = @id", params)

    }
}

module.exports = Book