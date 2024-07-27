const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

// Define the Course class to manage course-related data
class Course {
    // Constructor to initialize a new Course instance
    constructor(courseID, title, thumbnail, description, details, caption, category, totalRate = 0, ratings = 0, video) {
        this.courseID = courseID;            // ID of the course
        this.title = title;                  // Title of the course
        this.thumbnail = thumbnail;          // Thumbnail image (stored as binary data)
        this.description = description;      // Description of the course
        this.details = details;              // Detailed content of the course
        this.caption = caption;              // Caption for the course
        this.category = category;            // Category to which the course belongs
        this.totalRate = totalRate;          // Total rating of the course
        this.ratings = ratings;              // Number of ratings
        this.video = video;                  // Video content (stored as binary data)
    }

    // Method to create a new course in the database
    static async createCourse(newCourseData) {
        try {
            const connection = await sql.connect(dbConfig);  // Connect to the database using the provided configuration
    
            // Check if the title already exists
            const checkTitleQuery = `SELECT COUNT(*) as count FROM Courses WHERE Title = @title`;
            const checkTitleRequest = connection.request();
            checkTitleRequest.input("title", sql.NVarChar, newCourseData.title);
            const titleResult = await checkTitleRequest.query(checkTitleQuery);
    
            if (titleResult.recordset[0].count > 0) {
                connection.close();
                const error = new Error("Course title already exists. Please choose a different title.");
                error.statusCode = 400;  // Set status code for duplicate title
                throw error;
            }
    
            // If the title does not exist, proceed with insertion
            const sqlQuery = `
                INSERT INTO Courses (Title, Thumbnail, Description, Details, Caption, Category, Video)
                VALUES (@title, @thumbnail, @description, @details, @caption, @category, @video);
                SELECT SCOPE_IDENTITY() AS CourseID;
            `; // SQL query to insert a new course and return the new course ID
            const request = connection.request();
            request.input("title", sql.NVarChar, newCourseData.title);  // Set title input parameter
            request.input("thumbnail", sql.VarBinary, newCourseData.thumbnail);  // Set thumbnail input parameter
            request.input("description", sql.NVarChar, newCourseData.description);  // Set description input parameter
            request.input("details", sql.NVarChar, newCourseData.details);  // Set details input parameter
            request.input("caption", sql.NVarChar, newCourseData.caption);  // Set caption input parameter
            request.input("category", sql.NVarChar, newCourseData.category);  // Set category input parameter
            request.input("video", sql.VarBinary, newCourseData.video);  // Set video input parameter
    
            const result = await request.query(sqlQuery);  // Execute the SQL query
            connection.close();  // Close the database connection

            return this.getCourseById(result.recordset[0].CourseID);  // Retrieve and return the newly created course by its ID
        } catch (error) {
            console.error("Database error:", error);  // Log any database errors
            throw new Error(error.message || "Error inserting course data");  // Throw an error if the insert operation fails
        }
    }

    // Method to retrieve all courses from the database
    static async getAllCourses() {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `SELECT * FROM Courses`;  // SQL query to select all courses
        const request = connection.request();
        const result = await request.query(sqlQuery);  // Execute the SQL query
        connection.close();  // Close the database connection

        return result.recordset.map(
            (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings, row.Video)
        );  // Map each row to a new Course instance and return the array of courses
    }

    // Method to retrieve all courses without their videos from the database
    static async getAllCoursesWithoutVideo() {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `SELECT CourseID, Title, Thumbnail, Description, Details, Caption, Category, TotalRate, Ratings FROM Courses`;  // SQL query to select all courses without videos
        const request = connection.request();
        const result = await request.query(sqlQuery);  // Execute the SQL query
        connection.close();  // Close the database connection

        return result.recordset.map(
            (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings)
        );  // Map each row to a new Course instance without video and return the array of courses
    }

    // Method to retrieve a course by its ID from the database
    static async getCourseById(courseID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `SELECT * FROM Courses WHERE CourseID = @courseID`;  // SQL query to select a course by its ID
        const request = connection.request();
        request.input("courseID", sql.Int, courseID);  // Set courseID input parameter
        const result = await request.query(sqlQuery);  // Execute the SQL query

        connection.close();  // Close the database connection
        if (result.recordset.length === 0) {  // Check if the course was found
            return null;  // Return null if no course was found
        }
        return new Course(
            result.recordset[0].CourseID,
            result.recordset[0].Title,
            result.recordset[0].Thumbnail,
            result.recordset[0].Description,
            result.recordset[0].Details,
            result.recordset[0].Caption,
            result.recordset[0].Category,
            result.recordset[0].TotalRate,
            result.recordset[0].Ratings,
            result.recordset[0].Video
        );  // Return the found course as a new Course instance
    }

    // Method to retrieve a course by its ID without its video from the database
    static async getCourseByIdWithoutVideo(courseID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `SELECT CourseID, Title, Thumbnail, Description, Details, Caption, Category, TotalRate, Ratings FROM Courses WHERE CourseID = @courseID`;  // SQL query to select a course by its ID without video
        const request = connection.request();
        request.input("courseID", sql.Int, courseID);  // Set courseID input parameter
        const result = await request.query(sqlQuery);  // Execute the SQL query

        connection.close();  // Close the database connection
        if (result.recordset.length === 0) {  // Check if the course was found
            return null;  // Return null if no course was found
        }
        return new Course(
            result.recordset[0].CourseID,
            result.recordset[0].Title,
            result.recordset[0].Thumbnail,
            result.recordset[0].Description,
            result.recordset[0].Details,
            result.recordset[0].Caption,
            result.recordset[0].Category,
            result.recordset[0].TotalRate,
            result.recordset[0].Ratings,
        );  // Return the found course as a new Course instance without video
    }

    // Method to update a course in the database
    static async updateCourse(courseID, newCourseData) {
        const connection = await sql.connect(dbConfig);  // Connect to the database

        // Check if the title already exists
        const checkTitleQuery = `SELECT COUNT(*) as count FROM Courses WHERE Title = @title AND CourseID != @courseID`;
        const checkTitleRequest = connection.request();
        checkTitleRequest.input("title", sql.NVarChar, newCourseData.title);
        checkTitleRequest.input("courseID", sql.Int, courseID);
        const titleResult = await checkTitleRequest.query(checkTitleQuery);

        if (titleResult.recordset[0].count > 0) {
            connection.close();
            const error = new Error("Course title already exists. Please choose a different title.");
            error.statusCode = 400;  // Set status code for duplicate title
            throw error;
        }
    
        const setFields = [];  // Array to hold fields to be updated
        const request = connection.request();
    
        // Add fields to update based on the provided data
        if (newCourseData.title) {
            setFields.push("Title = @title");
            request.input("title", sql.NVarChar, newCourseData.title);
        }
        if (newCourseData.thumbnail) {
            setFields.push("Thumbnail = @thumbnail");
            request.input("thumbnail", sql.VarBinary, newCourseData.thumbnail);
        }
        if (newCourseData.description) {
            setFields.push("Description = @description");
            request.input("description", sql.NVarChar, newCourseData.description);
        }
        if (newCourseData.details) {
            setFields.push("Details = @details");
            request.input("details", sql.NVarChar, newCourseData.details);
        }
        if (newCourseData.caption) {
            setFields.push("Caption = @caption");
            request.input("caption", sql.NVarChar, newCourseData.caption);
        }
        if (newCourseData.category) {
            setFields.push("Category = @category");
            request.input("category", sql.NVarChar, newCourseData.category);
        }
        if (newCourseData.totalRate !== undefined) {
            setFields.push("TotalRate = @totalRate");
            request.input("totalRate", sql.Int, newCourseData.totalRate);
        }
        if (newCourseData.ratings !== undefined) {
            setFields.push("Ratings = @ratings");
            request.input("ratings", sql.Int, newCourseData.ratings);
        }
        if (newCourseData.video) {
            setFields.push("Video = @video");
            request.input("video", sql.VarBinary, newCourseData.video);
        }
    
        const sqlQuery = `
            UPDATE Courses SET
                ${setFields.join(", ")}
            WHERE CourseID = @courseID;
        `;  // SQL query to update the course with the specified fields
    
        request.input("courseID", sql.Int, courseID);  // Set courseID input parameter
    
        await request.query(sqlQuery);  // Execute the SQL query
        connection.close();  // Close the database connection
    
        return this.getCourseById(courseID);  // Retrieve and return the updated course by its ID
    }

    // Method to delete a course from the database
    static async deleteCourse(courseID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const transaction = new sql.Transaction(connection);  // Begin a new transaction
    
        try {
            await transaction.begin();  // Start the transaction
            const request = transaction.request();
    
            // Delete all entries in User_Completed_Courses associated with the course
            await request.input("courseID", sql.Int, courseID);
            await request.query(`DELETE FROM User_Completed_Courses WHERE course_id = @courseID`);
    
            // Delete all sub-lectures associated with the course
            await request.query(`
                DELETE FROM SubLectures
                WHERE LectureID IN (SELECT LectureID FROM CourseLectures WHERE CourseID = @courseID)
            `);
    
            // Delete all references in the CourseLectures table
            await request.query(`DELETE FROM CourseLectures WHERE CourseID = @courseID`);
    
            // Delete all lectures associated with the course
            await request.query(`
                DELETE FROM Lectures
                WHERE LectureID IN (SELECT LectureID FROM CourseLectures WHERE CourseID = @courseID)
            `);
    
            // Finally, delete the course itself
            await request.query(`DELETE FROM Courses WHERE CourseID = @courseID`);
    
            await transaction.commit();  // Commit the transaction
    
            return true;  // Return true to indicate success
        } catch (error) {
            if (transaction) {
                await transaction.rollback();  // Rollback the transaction in case of error
            }
            throw error;  // Throw the error
        } finally {
            connection.close();  // Close the database connection
        }
    }

    // Method to search for courses in the database
    static async searchCourses(searchTerm) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        try {
            const sqlQuery = `
                SELECT CourseID,Title,Thumbnail,Description,Details,Caption,Category,TotalRate,Ratings FROM Courses
                WHERE Title LIKE '%${searchTerm}%'
                OR Description LIKE '%${searchTerm}%'
                OR Details LIKE '%${searchTerm}%'
                OR Caption LIKE '%${searchTerm}%'
                OR Category LIKE '%${searchTerm}%'
            `;  // SQL query to search for courses based on the search term
            const request = connection.request();
            const result = await request.query(sqlQuery);  // Execute the SQL query
            return result.recordset.map(
                (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings, row.Video)
            );  // Map each row to a new Course instance and return the array of courses
        } catch (error) {
            throw new Error("Error searching courses");  // Throw an error if the search operation fails
        } finally {
            await connection.close();  // Close the database connection
        }
    }
}

// Export the Course class to be used in other modules
module.exports = Course;
