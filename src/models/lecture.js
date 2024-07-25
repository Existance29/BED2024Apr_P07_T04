const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

// Define the Lecture class to manage lecture-related data
class Lecture {
    // Constructor to initialize a new Lecture instance
    constructor(lectureID, name, description, category, duration) {
        this.lectureID = lectureID;      // ID of the lecture
        this.name = name;                // Name of the lecture
        this.description = description;  // Description of the lecture
        this.category = category;        // Category of the lecture
        this.duration = duration;        // Duration of the lecture in minutes
    }

    // Method to create a new lecture in the database
    static async createLecture(newLectureData) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `
            INSERT INTO Lectures (Name, Description, Category, Duration)
            VALUES (@name, @description, @category, @duration);
            SELECT SCOPE_IDENTITY() AS LectureID;
        `;  // SQL query to insert a new lecture and return the new lecture ID

        const request = connection.request();
        request.input("name", sql.NVarChar, newLectureData.name);  // Set name input parameter
        request.input("description", sql.NVarChar, newLectureData.description);  // Set description input parameter
        request.input("category", sql.NVarChar, newLectureData.category);  // Set category input parameter
        request.input("duration", sql.Int, newLectureData.duration);  // Set duration input parameter

        const result = await request.query(sqlQuery);  // Execute the SQL query
        connection.close();  // Close the database connection

        return this.getLectureById(result.recordset[0].LectureID);  // Retrieve and return the newly created lecture by its ID
    }

    // Method to create a new sub-lecture in the database
    static async createSubLecture(newSubLectureData) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `
            INSERT INTO SubLectures (LectureID, Name, Description, Duration, Video)
            VALUES (@lectureID, @name, @description, @duration, @video);
            SELECT SCOPE_IDENTITY() AS SubLectureID;
        `;  // SQL query to insert a new sub-lecture and return the new sub-lecture ID

        const request = connection.request();
        request.input("lectureID", sql.Int, newSubLectureData.lectureID);  // Set lectureID input parameter
        request.input("name", sql.NVarChar, newSubLectureData.name);  // Set name input parameter
        request.input("description", sql.NVarChar, newSubLectureData.description);  // Set description input parameter
        request.input("duration", sql.Int, newSubLectureData.duration);  // Set duration input parameter
        request.input("video", sql.VarBinary, newSubLectureData.video);  // Set video input parameter

        const result = await request.query(sqlQuery);  // Execute the SQL query
        connection.close();  // Close the database connection

        return this.getSubLectureById(newSubLectureData.lectureID, result.recordset[0].SubLectureID);  // Retrieve and return the newly created sub-lecture by its ID
    }

    // Method to link a lecture to a course in the database
    static async linkLectureToCourse(lectureID, courseID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `
            INSERT INTO CourseLectures (CourseID, LectureID)
            VALUES (@courseID, @lectureID);
        `;  // SQL query to link a lecture to a course

        const request = connection.request();
        request.input("courseID", sql.Int, courseID);  // Set courseID input parameter
        request.input("lectureID", sql.Int, lectureID);  // Set lectureID input parameter

        await request.query(sqlQuery);  // Execute the SQL query
        connection.close();  // Close the database connection
    }

    // Method to retrieve all lectures from the database
    static async getAllLectures() {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `SELECT * FROM Lectures`;  // SQL query to select all lectures

        const request = connection.request();
        const result = await request.query(sqlQuery);  // Execute the SQL query

        connection.close();  // Close the database connection
        return result.recordset.map(
            (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration)
        );  // Map each row to a new Lecture instance and return the array of lectures
    }

    // Method to retrieve a lecture by its ID from the database
    static async getLectureById(lectureID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `SELECT * FROM Lectures WHERE LectureID = @lectureID`;  // SQL query to select a lecture by its ID

        const request = connection.request();
        request.input("lectureID", sql.Int, lectureID);  // Set lectureID input parameter

        const result = await request.query(sqlQuery);  // Execute the SQL query

        connection.close();  // Close the database connection

        if (result.recordset.length === 0) {  // Check if the lecture was found
            return null;  // Return null if no lecture was found
        }
        return result.recordset.map(
            (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration)
        )[0];  // Return the found lecture as a new Lecture instance
    }

    // Method to update a lecture in the database
    static async updateLecture(lectureID, newLectureData) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `
            UPDATE Lectures SET
                Name = @name,
                Description = @description,
                Category = @category,
                Duration = @duration
            WHERE LectureID = @lectureID;
        `;  // SQL query to update the lecture with the specified fields

        const request = connection.request();
        request.input("lectureID", sql.Int, lectureID);  // Set lectureID input parameter
        request.input("name", sql.NVarChar, newLectureData.name || null);  // Set name input parameter
        request.input("description", sql.NVarChar, newLectureData.description || null);  // Set description input parameter
        request.input("category", sql.NVarChar, newLectureData.category || null);  // Set category input parameter
        request.input("duration", sql.Int, newLectureData.duration || null);  // Set duration input parameter

        await request.query(sqlQuery);  // Execute the SQL query

        connection.close();  // Close the database connection
        return this.getLectureById(lectureID);  // Retrieve and return the updated lecture by its ID
    }

    // Method to update a sub-lecture in the database
    static async updateSubLecture(lectureID, subLectureID, newSubLectureData) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `
            UPDATE SubLectures SET
                Name = @name,
                Description = @description,
                Duration = @duration
            WHERE LectureID = @lectureID AND SubLectureID = @subLectureID;
        `;  // SQL query to update the sub-lecture with the specified fields
    
        const request = connection.request();
        request.input("lectureID", sql.Int, lectureID);  // Set lectureID input parameter
        request.input("subLectureID", sql.Int, subLectureID);  // Set subLectureID input parameter
        request.input("name", sql.NVarChar, newSubLectureData.name || null);  // Set name input parameter
        request.input("description", sql.NVarChar, newSubLectureData.description || null);  // Set description input parameter
        request.input("duration", sql.Int, newSubLectureData.duration || null);  // Set duration input parameter
    
        await request.query(sqlQuery);  // Execute the SQL query
    
        connection.close();  // Close the database connection
        return this.getSubLectureById(lectureID, subLectureID);  // Retrieve and return the updated sub-lecture by its ID
    }

    // Method to delete a lecture from the database
    static async deleteLecture(lectureID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const transaction = new sql.Transaction(connection);  // Begin a new transaction
        
        try {
            await transaction.begin();  // Start the transaction
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

    // Method to delete a sub-lecture from the database
    static async deleteSubLecture(lectureID, subLectureID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const transaction = new sql.Transaction(connection);  // Begin a new transaction
        
        try {
            await transaction.begin();  // Start the transaction
            const request = transaction.request();
        
            // Delete references in the User_Sub_Lectures table
            await request.input("subLectureID", sql.Int, subLectureID);
            await request.query(`DELETE FROM User_Sub_Lectures WHERE sub_lecture_id = @subLectureID`);
        
            // Now, delete the sub-lecture itself
            await request.input("lectureID", sql.Int, lectureID);
            await request.query(`DELETE FROM SubLectures WHERE LectureID = @lectureID AND SubLectureID = @subLectureID`);
            
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

    // Method to search for lectures in the database
    static async searchLectures(searchTerm) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        try {
            const sqlQuery = `
                SELECT * FROM Lectures
                WHERE Name LIKE '%${searchTerm}%'
                OR Description LIKE '%${searchTerm}%'
            `;  // SQL query to search for lectures based on the search term

            const request = connection.request();
            const result = await request.query(sqlQuery);  // Execute the SQL query
            return result.recordset.map(
                (row) => new Lecture(row.LectureID, row.Name, row.Description, row.Category, row.Duration)
            );  // Map each row to a new Lecture instance and return the array of lectures
        } catch (error) {
            throw new Error("Error searching lectures");  // Throw an error if the search operation fails
        } finally {
            await connection.close();  // Close the database connection
        }
    }

    // Method to retrieve a course with its lectures and sub-lectures from the database
    static async getCourseWithLecture(courseID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
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
            `;  // SQL query to retrieve a course with its lectures and sub-lectures
    
            const request = connection.request();
            request.input("courseID", sql.Int, courseID);  // Set courseID input parameter
            const result = await request.query(sqlQuery);  // Execute the SQL query
    
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
    
            return Object.values(coursesWithLectures);  // Return the grouped courses with lectures and sub-lectures
        } catch (error) {
            throw new Error("Error fetching course with lectures");  // Throw an error if the fetch operation fails
        } finally {
            await connection.close();  // Close the database connection
        }
    }

    // Method to retrieve a course with its lectures and sub-lectures (without videos) from the database
    static async getCourseWithLectureWithoutVideo(courseID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
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
            `;  // SQL query to retrieve a course with its lectures and sub-lectures without videos
    
            const request = connection.request();
            request.input("courseID", sql.Int, courseID);  // Set courseID input parameter
            const result = await request.query(sqlQuery);  // Execute the SQL query
    
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
    
            return Object.values(coursesWithLectures);  // Return the grouped courses with lectures and sub-lectures without videos
        } catch (error) {
            throw new Error("Error fetching course with lectures without video");  // Throw an error if the fetch operation fails
        } finally {
            await connection.close();  // Close the database connection
        }
    }

    // Method to retrieve a sub-lecture by its ID from the database
    static async getSubLectureById(lectureID, subLectureID) {
        const connection = await sql.connect(dbConfig);  // Connect to the database
        const sqlQuery = `SELECT * FROM SubLectures WHERE LectureID = @lectureID AND SubLectureID = @subLectureID`;  // SQL query to select a sub-lecture by its ID

        const request = connection.request();
        request.input("lectureID", sql.Int, lectureID);  // Set lectureID input parameter
        request.input("subLectureID", sql.Int, subLectureID);  // Set subLectureID input parameter

        const result = await request.query(sqlQuery);  // Execute the SQL query

        connection.close();  // Close the database connection

        if (result.recordset.length === 0) {  // Check if the sub-lecture was found
            return null;  // Return null if no sub-lecture was found
        }
        return result.recordset[0];  // Return the found sub-lecture
    }
}

// Export the Lecture class to be used in other modules
module.exports = Lecture;
