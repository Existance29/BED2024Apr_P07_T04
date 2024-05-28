//import sql stuff
const sql = require("mssql")
const dbConfig = require("../database/dbConfig")

class User {
    //setup user object
    constructor(id, first_name, last_name, email, password, about_me, country) {
      this.id = id
      this.first_name = first_name
      this.email = email
      this.last_name = last_name
      this.password = password
      this.about_me = about_me
      this.country = country
    }

    //pass the sql recordset into the user constructor
    static toUserObj(row){
        return new User(row.id, row.first_name, row.last_name, row.email, row.password, row.about_me, row.country)
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
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "password": user.password,
            "about_me": user.about_me,
            "country": user.country
        }
        //catch unique key constrain 
        const result = await this.query("INSERT INTO Users (first_name, last_name, email, password, about_me, country) VALUES (@first_name, @last_name, @email, @password, @about_me, @country); SELECT SCOPE_IDENTITY() AS id;", params)
        
        //get the newly created user and return it
        return this.getUserById(result.recordset[0].id)
    }
}
  
  module.exports = User