const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

class Course {
    constructor(courseID, title, thumbnail, description, details, caption, category, totalRate, ratings, video) {
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
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            INSERT INTO Courses (Title, Thumbnail, Description, Details, Caption, Category, TotalRate, Ratings, Video)
            VALUES (@title, @thumbnail, @description, @details, @caption, @category, @totalRate, @ratings, @video);
            SELECT SCOPE_IDENTITY() AS CourseID;
        `;
        const request = connection.request();
        request.input("title", newCourseData.title);
        request.input("thumbnail", newCourseData.thumbnail);
        request.input("description", newCourseData.description);
        request.input("details", newCourseData.details);
        request.input("caption", newCourseData.caption);
        request.input("category", newCourseData.category);
        request.input("totalRate", newCourseData.totalRate);
        request.input("ratings", newCourseData.ratings);
        request.input("video", newCourseData.video);

        const result = await request.query(sqlQuery);

        connection.close();

        return this.getCourseById(result.recordset[0].CourseID);
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
        request.input("courseID", courseID);
        const result = await request.query(sqlQuery);

        connection.close();
        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset.map(
            (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings, row.Video)
        )[0];
    }

    static async updateCourse(courseID, newCourseData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            UPDATE Courses SET
                Title = @title,
                Thumbnail = @thumbnail,
                Description = @description,
                Details = @details,
                Caption = @caption,
                Category = @category,
                TotalRate = @totalRate,
                Ratings = @ratings
            WHERE CourseID = @courseID;
        `;
        const request = connection.request();
        request.input("courseID", courseID);
        request.input("title", newCourseData.title || null);
        request.input("thumbnail", newCourseData.thumbnail || null);
        request.input("description", newCourseData.description || null);
        request.input("details", newCourseData.details || null);
        request.input("caption", newCourseData.caption || null);
        request.input("category", newCourseData.category || null);
        request.input("totalRate", newCourseData.totalRate || null);
        request.input("ratings", newCourseData.ratings || null);
        request.input("video", newCourseData.video || null);

        await request.query(sqlQuery);

        connection.close();

        return this.getCourseById(courseID);
    }

    static async deleteCourse(courseID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Courses WHERE CourseID = @courseID`;
        const request = connection.request();
        request.input("courseID", courseID);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0;
    }

    static async searchCourses(searchTerm) {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `
                SELECT * FROM Courses
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
