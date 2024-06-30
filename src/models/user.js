//import sql stuff
const sql = require("mssql")
const dbConfig = require("../database/dbConfig")
const fs = require("fs");

class User {
    //setup user object
    constructor(id, first_name, last_name, email, password, about_me, country, join_date) {
      this.id = id
      this.first_name = first_name
      this.last_name = last_name
      this.email = email
      this.password = password
      this.about_me = about_me
      this.country = country
      this.join_date = join_date
    }

    //pass the sql recordset into the user constructor
    static toUserObj(row){
        return new User(row.id, row.first_name, row.last_name, row.email, row.password, row.about_me, row.country, row.join_date)
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

    static async getCompleteUserByID(id) {
        //join all tables related to the user and return them
        const query = "SELECT * FROM Users INNER JOIN Profile_Pictures ON Profile_Pictures.user_id = Users.id WHERE id = @id"
        const result = (await this.query(query,{"id":id})).recordset[0]
        return result ? result : null
    }

    //get a user by their email
    static async getUserByEmail(email){
        //assign sql params to their respective values
        const params = {"email": email}
         //get first user from database that matches id
        const result = (await this.query("SELECT * FROM Users WHERE email = @email", params)).recordset[0]
        //return null if no user found
        return result ? this.toUserObj(result) : null
    }

    static async createUser(user) {
        //accept a object and add it to the database
        //join_date is excluded (it will be added with SQL)
        const params = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "password": user.password,
            "about_me": user.about_me,
            "country": user.country,
        }
        //add user data
        const result = await this.query("INSERT INTO Users (first_name, last_name, email, password, about_me, country, join_date) VALUES (@first_name, @last_name, @email, @password, @about_me, @country, GETDATE()); SELECT SCOPE_IDENTITY() AS id;", params)

        
        //get the newly-created user
        const newUser = await this.getUserById(result.recordset[0].id)

        //create the profile picture with a default one
        const imageBuffer = fs.readFileSync("../src/public/assets/profile/default-profile-picture.jpg", {encoding: 'base64'})
        const picParams = {
            "user_id": newUser.id,
            "img": imageBuffer,
        }
        this.query("INSERT INTO Profile_Pictures (user_id,img) VALUES (@user_id, @img); SELECT SCOPE_IDENTITY() AS id;", picParams)

        //return the newly created user
        return newUser
    }

    static async getProfilePic(id){
        //return the base64 for the user's profile picture
        const query = "SELECT * FROM Profile_Pictures WHERE user_id = @id"
        const result = (await this.query(query,{"id":id})).recordset[0]
        return result ? result : null
    }

    static async updateProfilePic(userid, imageBuffer) {
        const params = {
            "user_id": userid,
            "img": imageBuffer,
        }
        await this.query("UPDATE Profile_Pictures SET img = @img WHERE user_id = @user_id", params)
    }

    static async updateUser(user){
        //accept a object and add it to the database
        const params = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "about_me": user.about_me,
            "country": user.country
        }
        await this.query("UPDATE Users SET first_name = @first_name, last_name = @last_name, email = @email, about_me = @about_me, country = @country WHERE id = @id", params)
        //return the updated user
        return this.getUserById(user.id)
    }

    static async updatePassword(id, newPassword){
        await this.query("UPDATE Users SET password = @password WHERE id = @id", {"id":id,"password":newPassword})
        //return the updated user
        return this.getUserById(id)
    }
}
  
  module.exports = User