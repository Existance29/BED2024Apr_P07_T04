const query = require("../lib/query")

class User {
    constructor(id, username, passwordHash, role){
        this.id = id,
        this.username = username,
        this.passwordHash = passwordHash
        this.role = role
    }

    //pass a objj from sql recordset  
    //returns a user object
    static toUserObj(row){
        return new User(row.id, row.username, row.passwordHash, row.role)
    }

    static async getUserByUsername(username){
        //get first user from database that matches username
        const result = (await query.query("SELECT * FROM Users WHERE username = @username", {username:username})).recordset[0]
        //return null if no user found, else return the user
        return result ? this.toUserObj(result) : null
    }

    static async createUser(user){
        //no need to make an id, rely on sql to generate one
        const params = {username: user.username, passwordHash: user.passwordHash, role: user.role}
        //nothing to return
        await query.query("INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role); SELECT SCOPE_IDENTITY() AS user_id;", params)

    }
}

module.exports = User