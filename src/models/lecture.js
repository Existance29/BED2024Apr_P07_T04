const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

class Lecture {
    constructor(lectureID, name, description, category, duration) {
        this.lectureID = lectureID;
        this.name = name;
        this.description = description;
        this.category = category;
        this.duration = duration;
    }

    static async createLecture(newLectureData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            INSERT INTO Lectures (Name, Description, Category, Duration)
            VALUES (@name, @description, @category, @duration);
            SELECT SCOPE_IDENTITY() AS LectureID;
        `;

        const request = connection.request();
        request.input("name", sql.NVarChar, newLectureData.name);
        request.input("description", sql.NVarChar, newLectureData.description);
        request.input("category", sql.NVarChar, newLectureData.category);
        request.input("duration", sql.Int, newLectureData.duration);

        const result = await request.query(sqlQuery);
        connection.close();

        return this.getLectureById(result.recordset[0].LectureID);
    }

    static async createSubLecture(newSubLectureData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            INSERT INTO SubLectures (LectureID, Name, Description, Duration, Video)
            VALUES (@lectureID, @name, @description, @duration, @video);
            SELECT SCOPE_IDENTITY() AS SubLectureID;
        `;

        const request = connection.request();
        request.input("lectureID", sql.Int, newSubLectureData.lectureID);
        request.input("name", sql.NVarChar, newSubLectureData.name);
        request.input("description", sql.NVarChar, newSubLectureData.description);
        request.input("duration", sql.Int, newSubLectureData.duration);
        request.input("video", sql.VarBinary, newSubLectureData.video);

        const result = await request.query(sqlQuery);
        connection.close();

        return this.getSubLectureById(newSubLectureData.lectureID, result.recordset[0].SubLectureID);
    }

    static async linkLectureToCourse(lectureID, courseID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            INSERT INTO CourseLectures (CourseID, LectureID)
            VALUES (@courseID, @lectureID);
        `;

        const request = connection.request();
        request.input("courseID", sql.Int, courseID);
        request.input("lectureID", sql.Int, lectureID);

        await request.query(sqlQuery);
        connection.close();
    }

    static async getAllLectures() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Lectures`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();
        return result.recordset.map(
            (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration)
        );
    }

    static async getLectureById(lectureID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Lectures WHERE LectureID = @lectureID`;

        const request = connection.request();
        request.input("lectureID", sql.Int, lectureID);

        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset.map(
            (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration)
        )[0];
    }

    static async updateLecture(lectureID, newLectureData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            UPDATE Lectures SET
                Name = @name,
                Description = @description,
                Category = @category,
                Duration = @duration
            WHERE LectureID = @lectureID;
        `;

        const request = connection.request();
        request.input("lectureID", sql.Int, lectureID);
        request.input("name", sql.NVarChar, newLectureData.name || null);
        request.input("description", sql.NVarChar, newLectureData.description || null);
        request.input("category", sql.NVarChar, newLectureData.category || null);
        request.input("duration", sql.Int, newLectureData.duration || null);

        await request.query(sqlQuery);

        connection.close();
        return this.getLectureById(lectureID);
    }
    
    static async updateSubLecture(lectureID, subLectureID, newSubLectureData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            UPDATE SubLectures SET
                Name = @name,
                Description = @description,
                Duration = @duration
            WHERE LectureID = @lectureID AND SubLectureID = @subLectureID;
        `;
    
        const request = connection.request();
        request.input("lectureID", sql.Int, lectureID);
        request.input("subLectureID", sql.Int, subLectureID);
        request.input("name", sql.NVarChar, newSubLectureData.name || null);
        request.input("description", sql.NVarChar, newSubLectureData.description || null);
        request.input("duration", sql.Int, newSubLectureData.duration || null);
    
        await request.query(sqlQuery);
    
        connection.close();
        return this.getSubLectureById(lectureID, subLectureID);
    }
    

    static async deleteLecture(lectureID) {
        const connection = await sql.connect(dbConfig);
        const transaction = new sql.Transaction(connection);
        
        try {
            // Start a transaction
            await transaction.begin();
            const request = transaction.request();
        
            // Delete all references in the User_Sub_Lectures table
            await request.input("lectureID", sql.Int, lectureID);
            await request.query(`
                DELETE FROM User_Sub_Lectures 
                WHERE sub_lecture_id IN (
                    SELECT SubLectureID 
                    FROM SubLectures 
                    WHERE LectureID = @lectureID
                )
            `);
            
            // Delete all sub-lectures associated with this lecture
            await request.query(`DELETE FROM SubLectures WHERE LectureID = @lectureID`);
        
            // Delete all references in the CourseLectures table
            await request.query(`DELETE FROM CourseLectures WHERE LectureID = @lectureID`);
        
            // Finally, delete the lecture itself
            await request.query(`DELETE FROM Lectures WHERE LectureID = @lectureID`);
            
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
    

    static async deleteSubLecture(lectureID, subLectureID) {
        const connection = await sql.connect(dbConfig);
        const transaction = new sql.Transaction(connection);
        
        try {
            // Start a transaction
            await transaction.begin();
            const request = transaction.request();
        
            // Delete references in the User_Sub_Lectures table
            await request.input("subLectureID", sql.Int, subLectureID);
            await request.query(`DELETE FROM User_Sub_Lectures WHERE sub_lecture_id = @subLectureID`);
        
            // Now, delete the sub-lecture itself
            await request.input("lectureID", sql.Int, lectureID);
            await request.query(`DELETE FROM SubLectures WHERE LectureID = @lectureID AND SubLectureID = @subLectureID`);
            
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
                (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration)
            );
        } catch (error) {
            throw new Error("Error searching lectures");
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
                    l.Category AS LectureCategory, l.Duration AS LectureDuration,
                    sl.SubLectureID, sl.Name AS SubLectureName, sl.Description AS SubLectureDescription,
                    sl.Duration AS SubLectureDuration, sl.Video AS SubLectureVideo
                FROM Courses c
                INNER JOIN CourseLectures cl ON c.CourseID = cl.CourseID
                INNER JOIN Lectures l ON cl.LectureID = l.LectureID
                LEFT JOIN SubLectures sl ON l.LectureID = sl.LectureID
                WHERE c.CourseID = @courseID
                ORDER BY l.LectureID, sl.SubLectureID;
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
    

    static async getCourseWithLectureWithoutVideo(courseID) {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `
                SELECT 
                    c.CourseID, c.Title AS CourseTitle, c.Description AS CourseDescription, c.Video AS CourseVideo,
                    c.Details AS CourseDetails, c.Caption AS CourseCaption,
                    l.LectureID, l.Name AS LectureName, l.Description AS LectureDescription,
                    l.Category AS LectureCategory, l.Duration AS LectureDuration,
                    sl.SubLectureID, sl.Name AS SubLectureName, sl.Description AS SubLectureDescription,
                    sl.Duration AS SubLectureDuration
                FROM Courses c
                INNER JOIN CourseLectures cl ON c.CourseID = cl.CourseID
                INNER JOIN Lectures l ON cl.LectureID = l.LectureID
                LEFT JOIN SubLectures sl ON l.LectureID = sl.LectureID
                WHERE c.CourseID = @courseID
                ORDER BY l.LectureID, sl.SubLectureID;
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
                        subLectures: []
                    };
                }
    
                if (row.SubLectureID) {
                    coursesWithLectures[courseID].lectures[lectureID].subLectures.push({
                        subLectureID: row.SubLectureID,
                        name: row.SubLectureName,
                        description: row.SubLectureDescription,
                        duration: row.SubLectureDuration
                    });
                }
            }
    
            // Convert lectures object to array
            for (const courseID in coursesWithLectures) {
                coursesWithLectures[courseID].lectures = Object.values(coursesWithLectures[courseID].lectures);
            }
    
            return Object.values(coursesWithLectures);
        } catch (error) {
            throw new Error("Error fetching course with lectures without video");
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
