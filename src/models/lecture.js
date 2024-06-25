const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

class Lecture {
    constructor(lectureID, name, description, category, duration, video) {
        this.lectureID = lectureID;
        this.name = name;
        this.description = description;
        this.category = category;
        this.duration = duration;
        this.video = video;
    }

    static async createLecture(newLectureData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            INSERT INTO Lectures (Name, Description, Category, Duration, Video)
            VALUES (@name, @description, @category, @duration, @video);
            SELECT SCOPE_IDENTITY() AS LectureID;
        `;

        const request = connection.request();
        request.input("name", newLectureData.name);
        request.input("description", newLectureData.description);
        request.input("category", newLectureData.category);
        request.input("duration", newLectureData.duration);
        request.input("video", newLectureData.video);

        const result = await request.query(sqlQuery);

        connection.close();
        return this.getLectureById(result.recordset[0].LectureID);
    } 

    static async getAllLectures() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Lectures`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();
        return result.recordset.map(
            (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration, row.Video)
        );
    }

    static async getLectureById(lectureID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Lectures WHERE LectureID = @lectureID`;

        const request = connection.request();
        request.input("lectureID", lectureID);

        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset.map(
            (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration, row.Video)
        )[0];
    }

    static async updateLecture(lectureID, newLectureData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            UPDATE Lectures SET
                Name = @name,
                Description = @description,
                Category = @category,
                Duration = @duration,
                Video = @video
            WHERE LectureID = @lectureID;
        `;

        const request = connection.request();
        request.input("lectureID", lectureID);
        request.input("name", newLectureData.name || null);
        request.input("description", newLectureData.description || null);
        request.input("category", newLectureData.category || null);
        request.input("duration", newLectureData.duration || null);
        request.input("video", newLectureData.video || null);

        await request.query(sqlQuery);

        connection.close();
        return this.getLectureById(lectureID);
    }

    static async deleteLecture(lectureID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Lectures WHERE LectureID = @lectureID`;
        const request = connection.request();
        request.input("lectureID", lectureID);

        const result = await request.query(sqlQuery);   

        connection.close(); 
        return result.rowsAffected > 0;
    }

    static async searchLectures(searchTerm) {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `
                SELECT * FROM Lectures
                WHERE Name LIKE '%${searchTerm}%'
                OR Description LIKE '%${searchTerm}%'
            `;

            const request = connection.request();
            const result = await request.query(sqlQuery);
            return result.recordset.map(
                (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration, row.Video)
            );
        } catch (error) {
            throw new Error("Error searching courses");
        } finally {
            await connection.close();
        }
    }

    static async getCourseWithLecture(courseID) {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `
                SELECT 
                    c.CourseID, c.Title AS CourseTitle, c.Description AS CourseDescription, c.Video AS CourseVideo, 
                    c.Details AS CourseDetails, c.Caption AS CourseCaption,
                    l.LectureID, l.Name AS LectureName, l.Description AS LectureDescription,
                    l.Category AS LectureCategory, l.Duration AS LectureDuration, l.Video AS LectureVideo,
                    sl.SubLectureID, sl.Name AS SubLectureName, sl.Description AS SubLectureDescription,
                    sl.Duration AS SubLectureDuration, sl.Video AS SubLectureVideo
                FROM Courses c
                INNER JOIN CourseLectures cl ON c.CourseID = cl.CourseID
                INNER JOIN Lectures l ON cl.LectureID = l.LectureID
                LEFT JOIN SubLectures sl ON l.LectureID = sl.LectureID
                WHERE c.CourseID = @courseID
                ORDER BY c.Title, l.Name, sl.Name;
            `;
    
            const request = connection.request();
            request.input("courseID", sql.Int, courseID);
            const result = await request.query(sqlQuery);
    
            // Group courses, lectures, and sub-lectures
            const coursesWithLectures = {};
            for (const row of result.recordset) {
                const courseID = row.CourseID;
                if (!coursesWithLectures[courseID]) {
                    coursesWithLectures[courseID] = {
                        courseID: courseID,
                        title: row.CourseTitle,
                        description: row.CourseDescription,
                        video: row.CourseVideo,
                        details: row.CourseDetails,
                        caption: row.CourseCaption,
                        lectures: {},
                    };
                }

                const lectureID = row.LectureID;
                if (!coursesWithLectures[courseID].lectures[lectureID]) {
                    coursesWithLectures[courseID].lectures[lectureID] = {
                        lectureID: lectureID,
                        name: row.LectureName,
                        description: row.LectureDescription,
                        category: row.LectureCategory,
                        duration: row.LectureDuration,
                        video: row.LectureVideo,
                        subLectures: []
                    };
                }

                if (row.SubLectureID) {
                    coursesWithLectures[courseID].lectures[lectureID].subLectures.push({
                        subLectureID: row.SubLectureID,
                        name: row.SubLectureName,
                        description: row.SubLectureDescription,
                        duration: row.SubLectureDuration,
                        video: row.SubLectureVideo
                    });
                }
            }
    
            // Convert lectures object to array
            for (const courseID in coursesWithLectures) {
                coursesWithLectures[courseID].lectures = Object.values(coursesWithLectures[courseID].lectures);
            }
    
            return Object.values(coursesWithLectures);
        } catch (error) {
            throw new Error("Error fetching course with lectures");
        } finally {
            await connection.close();
        }
    }
    static async getSubLectureById(lectureID, subLectureID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM SubLectures WHERE LectureID = @lectureID AND SubLectureID = @subLectureID`;
    
        const request = connection.request();
        request.input("lectureID", sql.Int, lectureID);
        request.input("subLectureID", sql.Int, subLectureID);
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset[0];
    }
}

module.exports = Lecture;
