const query = require("../lib/query")

class Book {
    constructor(id, title, author, availability){
        this.id = id,
        this.title = title,
        this.author = author,
        this.availability = availability
    }

    //pass a objj from sql recordset  
    //returns a user object
    static toUserObj(row){
        return new Book(row.id, row.title, row.author, row.availability)
    }

    static async getAllBooks(){
        //get first user from database that matches username
        const result = (await query.query("SELECT * FROM Books")).recordset
        //return null if no books found, else return the list of boo objects
        return result.length ? result.map(x => this.toUserObj(x)) : null
    }

    static async updateBook(id){
        //no need to make an id, rely on sql to generate one
        const params = {username: user.username, passwordHash: user.passwordHash, role: user.role}
        //nothing to return
        await query.query("INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role); SELECT SCOPE_IDENTITY() AS user_id;", params)

    }
}

module.exports = Book