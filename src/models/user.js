//import sql stuff
const sql = require("mssql")
const dbConfig = require("../database/dbConfig")
const fs = require("fs");

class User {
    //setup user object
    constructor(id, first_name, last_name, email, about_me, country, join_date, job_title, role) {
      this.id = id
      this.first_name = first_name
      this.last_name = last_name
      this.email = email
      this.about_me = about_me
      this.country = country
      this.join_date = join_date
      this.job_title = job_title
      this.role = role
    }

    //pass the sql recordset in
    //returns a new user obj
    static toUserObj(row){
        return new User(row.id, row.first_name, row.last_name, row.email, row.about_me, row.country, row.join_date, row.job_title, row.role)
    }
    

    //execute a query and return the result
    //note: there is a need to create a new connection for every query, so this function will not accept multiple queries with queryString as an array
    //mssql seems to have a bug when running more than 1 query per connection, https://github.com/tediousjs/node-mssql/issues/138
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

    //query but we can choose what columns to exclude
    //only for select statements
    static async exceptSelectQuery(columnExclude, queryString, params){
        //first we load the data into a temp table
        let sql = `
        SELECT * INTO #TempTable
        FROM (${queryString}) AS a
        `
        //then drop the columns from said temp table
        columnExclude.forEach(e => {
            sql += `
                ALTER TABLE #TempTable
                DROP COLUMN ${e}
                `
        });
        // Get results
        sql += "SELECT * FROM #TempTable"
        //run the query
        const result = await this.query(sql,params)
        //Delete the temp table
        await this.query("IF OBJECT_ID('#TempTable', 'U') IS NOT NULL DROP TABLE #TempTable")
        return result
    }

    static async getAllUsers() {
        //get all users excluding the password and email
        const result  = (await this.exceptSelectQuery(["password","email"],"SELECT * FROM Users")).recordset
        
        //if there is result array is blank, return null
        //else, map it into the user obj
        return result.length ? result.map((x) => this.toUserObj(x)) : null
    }
  
    static async getUserById(id) {

        //assign sql params to their respective values
        const params = {"id": id}
         //get first user from database that matches id and exclude the password
        const result = (await this.exceptSelectQuery(["password","email"],"SELECT * FROM Users WHERE id = @id", params)).recordset[0]
        //return null if no user found
        return result ? this.toUserObj(result) : null
        
    }

    static async getPrivateUserById(id){
        //unlike getUserById, this function is only meant to be accessed by the logged in user
        //returns email, still exclude password
         //get first user from database that matches id and exclude the password
        const result = (await this.exceptSelectQuery(["password"],"SELECT * FROM Users WHERE id = @id", {"id": id})).recordset[0]
        //return null if no user found
        return result ? this.toUserObj(result) : null
    }

    static async getCompleteUserByID(id) {
        //get all profile data related to the user and return them (excluding password)
        //user_id can also be excluded as it is redundant
        //this is mostly meant for the user's profile page
        const query = "SELECT * FROM Users INNER JOIN Profile_Pictures ON Profile_Pictures.user_id = Users.id WHERE id = @id"
        const result = (await this.exceptSelectQuery(["password","email","user_id"],query,{"id":id})).recordset[0]
        //check if user exists
        if (!result) return null
        //get more stats
        const quizStats = await this.getQuizOverall(id) //quiz data (al)
        const coursesCompleted = {"completed_courses": await this.getCompletedCourses(id)} //courses completed (courseID, date of completion)
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
        return result ? result : null
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
            "job_title": user.job_title,
            "role": user.role
        }
        //add user data
        const result = await this.query("INSERT INTO Users (first_name, last_name, email, password, about_me, country, join_date, job_title, role) VALUES (@first_name, @last_name, @email, @password, @about_me, @country, GETDATE(), @job_title, @role); SELECT SCOPE_IDENTITY() AS id;", params)

        
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
        //update the base64 of the user's profile pic
        const params = {
            "user_id": userid,
            "img": imageBuffer,
        }
        await this.query("UPDATE Profile_Pictures SET img = @img WHERE user_id = @user_id", params)
    }

    static async updateUser(id,user){
        //accept a object and add it to the database
        const params = {
            "id": id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "about_me": user.about_me,
            "country": user.country,
            "job_title": user.job_title,
        }
        await this.query("UPDATE Users SET first_name = @first_name, last_name = @last_name, email = @email, about_me = @about_me, country = @country, job_title = @job_title WHERE id = @id", params)
        //return the updated user
        return this.getUserById(id)
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
        //merge the user's completed sublectures with all sublectures, lectures, courses
        //group the resulting table by course
        //if the total number of sublectures in a course = total number of sublectures user (counted using userid) has completed in the same course, 
        //set complete to the course as "T", else "F"
        //from there, select the course if its "T"
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
        //this is done by joining the user's viewed sublectures -> all sublectures -> lectures -> course tables together
        //and filtering out the userid and courseid that matches the parameters
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
        //return an array containing ints representing the sublecture ids
        return result.recordset.map((x) => x.sub_lecture_id)
    }

    static async getCompletedCourses(userID){
        //return a list of objects of the complete courses (sorted by date descending)
        const result = (await this.query("SELECT course_id, date_completed FROM User_Completed_Courses WHERE user_id = @id ORDER BY date_completed DESC", {"id":userID})).recordset
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

    static async searchUsers(q){
        //return the account data + profile picture
        //check if name (first name + last name), about me, or job title matchezs
        const query = `
            SELECT * FROM Users INNER JOIN Profile_Pictures ON Profile_Pictures.user_id = Users.id 
            WHERE CONCAT(first_name, ' ', last_name) LIKE '%${q}%'
            OR about_me LIKE '%${q}%'
            OR job_title LIKE '%${q}%'
            `
        //omit password and email for privacy reasons
        //omit user_id since it is redundant
        const result = (await this.exceptSelectQuery(["password","email","user_id"],query)).recordset[0]
        //no need to check if result is empty, returning an empty array is fine
        return result

    }
}
  
  module.exports = User