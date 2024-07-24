const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

class Course {
    constructor(courseID, title, thumbnail, description, details, caption, category, totalRate = 0, ratings = 0, video) {
        this.courseID = courseID;
        this.title = title;
        this.thumbnail = thumbnail;
        this.description = description;
        this.details = details;
        this.caption = caption;
        this.category = category;
        this.totalRate = totalRate;
        this.ratings = ratings;
        this.video = video;
    }

    static async createCourse(newCourseData) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                INSERT INTO Courses (Title, Thumbnail, Description, Details, Caption, Category, Video)
                VALUES (@title, @thumbnail, @description, @details, @caption, @category, @video);
                SELECT SCOPE_IDENTITY() AS CourseID;
            `;
            const request = connection.request();
            request.input("title", sql.NVarChar, newCourseData.title);
            request.input("thumbnail", sql.VarBinary, newCourseData.thumbnail);
            request.input("description", sql.NVarChar, newCourseData.description);
            request.input("details", sql.NVarChar, newCourseData.details);
            request.input("caption", sql.NVarChar, newCourseData.caption);
            request.input("category", sql.NVarChar, newCourseData.category);
            request.input("video", sql.VarBinary, newCourseData.video);

            const result = await request.query(sqlQuery);
            connection.close();

            return this.getCourseById(result.recordset[0].CourseID);
        } catch (error) {
            console.error("Database error:", error);
            throw new Error("Error inserting course data");
        }
    }

    static async getAllCourses() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Courses`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map(
            (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings, row.Video)
        );
    }

    static async getAllCoursesWithoutVideo() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT CourseID, Title, Thumbnail, Description, Details, Caption, Category, TotalRate, Ratings FROM Courses`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map(
            (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings)
        );
    }

    static async getCourseById(courseID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Courses WHERE CourseID = @courseID`;
        const request = connection.request();
        request.input("courseID", sql.Int, courseID);  // Changed this line to explicitly set the type
        const result = await request.query(sqlQuery);

        connection.close();
        if (result.recordset.length === 0) {
            return null;
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
        );
    }

    static async updateCourse(courseID, newCourseData) {
        const connection = await sql.connect(dbConfig);
    
        const setFields = [];
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
        `;
    
        request.input("courseID", sql.Int, courseID);
    
        await request.query(sqlQuery);
        connection.close();
    
        return this.getCourseById(courseID);
    }
    

    static async deleteCourse(courseID) {
        const connection = await sql.connect(dbConfig);
        const transaction = new sql.Transaction(connection);
    
        try {
            // Start a transaction
            await transaction.begin();
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
    
            // Commit the transaction
            await transaction.commit();
    
            return true;
        } catch (error) {
            // If there's an error, rollback the transaction
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        } finally {
            connection.close();
        }
    }
    
    static async searchCourses(searchTerm) {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `
                SELECT CourseID,Title,Thumbnail,Description,Details,Caption,Category,TotalRate,Ratings FROM Courses
                WHERE Title LIKE '%${searchTerm}%'
                OR Description LIKE '%${searchTerm}%'
                OR Details LIKE '%${searchTerm}%'
                OR Caption LIKE '%${searchTerm}%'
                OR Category LIKE '%${searchTerm}%'
            `;
            const request = connection.request();
            const result = await request.query(sqlQuery);
            return result.recordset.map(
                (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings, row.Video)
            );
        } catch (error) {
            throw new Error("Error searching courses");
        } finally {
            await connection.close();
        }
    }
}

module.exports = Course;
