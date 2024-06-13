const dbConfig = require("../database/dbConfig");
const sql = require("mssql");

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

        //close connection
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

    static async updateLecture(lectureID) {
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

    static async searchLecture(searchTerm) {
        const connection = await sql.connect(dbConfig);
        try{
            const sqlQuery = `
                SELECT * FROM Lectures
                WHERE Name LIKE %${searchTerm}%
                OR Description LIKE %${searchTerm}%
            `;

            const request = connection.request();
            const result = await request.query(sqlQuery);
            return result.recordset.map(
                (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration, row.Video)
            );
        } catch (error) {
            throw new Error("Error searching courses");
        } finally{
            await connection.close();
        }
    }

    static async getCourseWithLecture() {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `
                SELECT c.CourseID, c.Title AS CourseTitle, c.Description AS CourseDescription, c.Video AS CourseVideo,
                       l.LectureID, l.Name AS LectureName, l.Description AS LectureDescription,
                       l.Category AS LectureCategory, l.Duration AS LectureDuration, l.Video AS LectureVideo
                FROM Courses c
                INNER JOIN CourseLectures cl ON c.CourseID = cl.CourseID
                INNER JOIN Lectures l ON cl.LectureID = l.LectureID
                ORDER BY c.Title;
            `;
    
            const request = connection.request();
            const result = await request.query(sqlQuery);
    
            // Group courses and their lectures
            const coursesWithLectures = {};
            for (const row of result.recordset) {
                const courseID = row.CourseID;
                if (!coursesWithLectures[courseID]) {
                    coursesWithLectures[courseID] = {
                        courseID: courseID,
                        title: row.CourseTitle,
                        description: row.CourseDescription,
                        video: row.CourseVideo,
                        lectures: [],
                    };
                }
                coursesWithLectures[courseID].lectures.push({
                    lectureID: row.LectureID,
                    name: row.LectureName,
                    description: row.LectureDescription,
                    category: row.LectureCategory,
                    duration: row.LectureDuration,
                    video: row.LectureVideo,
                });
            }
    
            return Object.values(coursesWithLectures);
        } catch (error) {
            throw new Error("Error fetching course with lectures");
        } finally {
            await connection.close();
        }
    }
    
}

module.exports = Lecture;