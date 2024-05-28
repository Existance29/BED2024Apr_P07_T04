//import sql stuff
const sql = require("mssql")
const dbConfig = require("../database/dbConfig")

class User {
    //setup user object
    constructor(id, firstName, lastName, email, password, aboutMe, country) {
      this.id = id
      this.firstName = firstName
      this.email = email
      this.lastName = lastName
      this.password = password
      this.aboutMe = aboutMe
      this.country = country
    }

    //pass the sql recordset into the user constructor
    static toUserObj(row){
        return new User(row.id, row.firstName, row.lastName, row.email, row.password, row.aboutMe, row.country)
    }

    //execute a query and return the result
    static async query(queryString, params){
        //queryString is the query to run
        //params is a dictionary for the parameters, key: sql param, value: value to pass

        //connect to database
        const connection = await sql.connect(dbConfig); 
        const request = connection.request();

        //deal with parameters
        //iterate through params and apply the input
        if (params){
            for (const [key, value] of Object.entries(params)) {
                request.input(key, value)
            }
        }
        const result = await request.query(queryString); //execute query and store result

        connection.close(); //close connection
        return result
    }

    //functions
    static async getAllUsers() {
        //get all users
        const result  = (await this.query("SELECT * FROM Users")).recordset
        
        //if there is result array is blank, return null
        //else, map it into the user obj
        return result.length ? result.map((x) => this.toUserObj(x)) : null
    }
  
    static async getUserById(id) {

        //assign sql params to their respective values
        const params = {"id": id}
         //get first user from database that matches id
        const result = (await this.query("SELECT * FROM Users WHERE id = @id", params)).recordset[0]
        //return null if no user found
        return result ? this.toUserObj(result) : null
        
    }

    static async createUser(user) {
        //accept a object and add it to the database
        const params = {
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "password": user.password,
            "aboutMe": user.aboutMe,
            "country": user.country
        }
        //catch unique key constrain 
        const result = await this.query("INSERT INTO Users (firstName, lastName, email, password, aboutMe, country) VALUES (@firstName, @lastName, @email, @password, @aboutMe, @country); SELECT SCOPE_IDENTITY() AS id;", params)
        
        //get the newly created user and return it
        return this.getUserById(result.recordset[0].id)
    }
}
  
  module.exports = User