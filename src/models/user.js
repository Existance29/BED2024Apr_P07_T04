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
        //check if user exists
        if (!result) return null
        //get more stats
        const quizStats = await this.getQuizOverall(id)
        const coursesCompleted = {"completed_courses": await this.getCompletedCourses(id)}
        //merge the objects and return it
        return {...result, ...quizStats, ...coursesCompleted}
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

    static async addSubLecture(userID, subLectureID){
        //update the sub lecture table
        await this.query("INSERT INTO User_Sub_Lectures(user_id,sub_lecture_id) VALUES (@uid,@lid);", {"uid":userID,"lid":subLectureID})
        //check if the user has completed the course after viewing the sub lecture
        //query returns the id of the course if its completed, else returns nothing
        const sql = `
        SELECT courseID FROM (
            SELECT MAX(c.CourseID) AS courseID, CASE WHEN COUNT(*) = COUNT(usl.user_id) THEN 'T' ELSE 'F' END AS 'Completed'
            FROM User_Sub_Lectures usl
            RIGHT JOIN SubLectures sl ON usl.sub_lecture_id = sl.SubLectureID AND usl.user_id = @id
            LEFT JOIN Lectures l ON sl.LectureID = l.LectureID
            LEFT JOIN CourseLectures cl ON l.LectureID = cl.LectureID
            LEFT JOIN Courses c ON c.CourseID = cl.CourseID
            GROUP BY c.Title
            HAVING max( CASE "SubLectureID"  WHEN @slid THEN 1 ELSE 0 END ) = 1
        ) AS a 
        WHERE Completed = 'T'
        `
        const result = (await this.query(sql, {"id":userID,"slid":subLectureID})).recordset[0]
        //check if course completed and if it is, update the completed courses table
        if (!result) return
        const completedCourseID = result.courseID
        await this.query("INSERT User_Completed_Courses (user_id,course_id,date_completed) VALUES (@uid,@cid,GETDATE());", {"uid":userID, "cid":completedCourseID})
    }

    static async hasViewedSubLecture(userID, subLectureID){
        const result = await this.query("SELECT * FROM User_Sub_Lectures WHERE user_id = @uid AND sub_lecture_id = @lid", {"uid":userID,"lid":subLectureID})
        return Boolean(result.recordset.length) 
    }

    static async getViewedSubLecturesByCourse(userID, courseID){
        //return all viewed sublectures under a course by a user
        const sql = 
        `
        SELECT usl.sub_lecture_id
        FROM User_Sub_Lectures usl
        RIGHT JOIN SubLectures sl ON usl.sub_lecture_id = sl.SubLectureID AND usl.user_id = @uid
        LEFT JOIN Lectures l ON sl.LectureID = l.LectureID
        LEFT JOIN CourseLectures cl ON l.LectureID = cl.LectureID
        INNER JOIN Courses c ON c.CourseID = cl.CourseID AND c.CourseID = @cid
        WHERE usl.user_id IS NOT NULL 
        `

        const result = await this.query(sql, {"uid": userID, "cid":courseID})
        //unlike the other get functions, dont return null if its empty. Just return the empty array
        //return an array containing the ints representing the sublecture ids
        return result.recordset.map((x) => x.sub_lecture_id)
    }

    static async getCompletedCourses(userID){
        //return a list of objects of the complete courses
        const result = (await this.query("SELECT course_id, date_completed FROM User_Completed_Courses WHERE user_id = @id", {"id":userID})).recordset
        //return null if no courses are completed
        return result.length? result : null
    }

    static async getQuizOverall(id){
        //get the user's overall quiz stats, all-time avg accuracy + total questions answered
        const params = {"id": id}
       //grab the highest score for each quiz and the number of questions
        //limitation: number of questions for each quiz must never change
        //return the average of all scores for every quiz and the total number of questions
        const result  = (await this.query("SELECT AVG(s) AS score, SUM(q) AS questions FROM (SELECT MAX((score + 0.0)/(totalMarks + 0.0)) AS s, MAX(totalQuestions) AS q FROM Results WHERE userId = @id GROUP BY quizId) AS hi;", params)).recordset[0]
        
        //default to 0
        let quizAccuracy = result.score ? result.score : 0
        let questionsCompleted = result.questions? result.questions : 0
        return {
            quiz_accuracy: quizAccuracy,
            questions_completed: questionsCompleted,

        }
    }
}
  
  module.exports = User