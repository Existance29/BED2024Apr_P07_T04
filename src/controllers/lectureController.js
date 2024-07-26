const fs = require('fs');
const path = require('path');
const Lecture = require("../models/lecture");


// Controller function to create a new lecture
const createLecture = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Create a new lecture. Limited to lecturers only.'
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Sample body schema to create a new lecture',
        schema: {
            $name: 'Introduction to swift',
            $description: 'Learn the basics of swift',
            $category: 'education',
            $duration: 60,
            $courseID: 9
        }
    } */
    /*  #swagger.parameters['authorization'] = {
                in: 'header',
                description: 'Format: \'Bearer (jwt)\'',
        } */
    /* #swagger.responses[201] = {
                description: 'Success, return the newly created lecture.',
                schema: {
                    lectureID: 50,
                    name: 'Introduction to swift',
                    description: 'Learn the basics of swift',
                    category: 'education',
                    duration: 60
                    
                }
        } */
    /* #swagger.responses[400] = {
                description: 'Missing fields',
        } */
    try {
        // Extract lecture data from the request body
        const { name, description, category, duration, courseID } = req.body;

        // Check if all required fields are provided
        if (!name || !description || !category || !duration || !courseID) {
            console.log("Missing fields:", { name, description, category, duration, courseID });
            return res.status(400).json({ message: "Missing required fields in main lecture" });
        }

        // Create a new lecture data object
        const newLectureData = {
            name,
            description,
            category,
            duration: parseInt(duration) // Ensure duration is an integer
        };

        // Create the lecture in the database
        const createdLecture = await Lecture.createLecture(newLectureData);

        // Link lecture to course
        await Lecture.linkLectureToCourse(createdLecture.lectureID, courseID);

        res.status(201).json(createdLecture);  // Respond with the newly created lecture
    } catch (error) {
        console.error("Error creating lecture:", error);
        res.status(error.statusCode || 500).json({ message: error.message });  // Respond with an error message
    }
};

// Controller function to create a new sub-lecture
const createSubLecture = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Create a new sub-lecture under a lecture. Limited to lecturers only.'
    //#swagger.consumes = ['multipart/form-data']  
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Sample body schema to create a new sub-lecture',
        schema: {
            $name: 'Swift basics',
            $description: 'Learn about variables, conditionals, functions and loops',
            $duration: 600

        }
    } */
   /*#swagger.parameters['video'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'The file object of the sub-lecture video',
    } */
   /*  #swagger.parameters['lectureID'] = {
          in: 'path',
          type: "int",
          description: 'The id of the lecture',
    } */
    /*  #swagger.parameters['authorization'] = {
                in: 'header',
                description: 'Format: \'Bearer (jwt)\'',
        } */
    /* #swagger.responses[201] = {
                description: 'Success, return the newly created sub-lecture.',
                schema: {
                        subLectureID: 60,
                        lectureID: 90,
                        Name: 'Swift basics',
                        Description: 'Learn about variables, conditionals, functions and loops',
                        Duration: 600,
                        Video: '<Buffer> object',
                }
        } */
    /* #swagger.responses[400] = {
                description: 'Missing fields',
        } */
    try {
        // Extract sub-lecture data from the request parameters and body
        const { lectureID } = req.params;
        const { name, description, duration } = req.body;
        const videoPath = req.files['video'] ? req.files['video'][0].path : null;

        // Check if all required fields are provided
        if (!name || !description || !duration || !videoPath) {
            console.log("Missing fields:", { name, description, duration, videoPath });
            return res.status(400).json({ message: "Missing required fields in sub-lecture" });
        }

        const newSubLectureData = {
            lectureID: parseInt(lectureID),
            name,
            description,
            duration: parseInt(duration), // Ensure duration is an integer
            video: videoPath ? fs.readFileSync(videoPath) : null
        };

        // Create the sub-lecture in the database
        const createdSubLecture = await Lecture.createSubLecture(newSubLectureData);

        // Clean up uploaded video file
        if (videoPath) {
            fs.unlinkSync(videoPath);
        }

        res.status(201).json(createdSubLecture);  // Respond with the newly created sub-lecture
    } catch (error) {
        console.error("Error creating sub-lecture:", error);
        res.status(error.statusCode || 500).json({ message: error.message });  // Respond with an error message
    }
};
            
// Controller function to retrieve all lectures
const getAllLectures = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Get a list of all lectures'
    /* #swagger.responses[200] = {
                description: 'Success, returns a array of all lecture objects.',
                schema: [{
                        lectureID: 1,
                        name: "Introduction to Angular",
                        description: "An introduction to the Angular framework.",
                        category: "education",
                        duration: 30
                    }]
        } */
    try {
        const lectures = await Lecture.getAllLectures();  // Retrieve all lectures from the database
        res.json(lectures);  // Respond with the list of lectures
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error retrieving lectures");  // Respond with an error message
    }
};

// Controller function to retrieve a lecture by its ID
const getLectureById = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Get the lecture by its id'
    /*  #swagger.parameters['id'] = {
          in: 'path',
          type: "int",
          description: 'The id of the lecture',
    } */
   /* #swagger.responses[200] = {
                description: 'Returns the lecture object that matches the id',
                schema: {
                        lectureID: 1,
                        name: "Introduction to Angular",
                        description: "An introduction to the Angular framework.",
                        category: "education",
                        duration: 30
                }
        } */
    const id = parseInt(req.params.id);  // Extract the lecture ID from the request parameters
    try {
        const lecture = await Lecture.getLectureById(id);  // Retrieve the lecture by its ID from the database
        if (!lecture) {
            return res.status(404).send("Lecture not found");  // Respond with a 404 status if the lecture is not found
        }
        res.json(lecture);  // Respond with the found lecture
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error retrieving lecture");  // Respond with an error message
    }
};

// Controller function to update a lecture by its ID
const updateLecture = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Update an exisiting lecture. Limited to lecturers only.'
    /*  #swagger.parameters['id'] = {
          in: 'path',
          type: "int",
          description: 'The id of the lecture',
    } */
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Sample body schema to update lecture',
        schema: {
            $name: 'Introduction to swift',
            $description: 'Learn the basics of swift',
            $category: 'programming language',
            $duration: 60,
        }
    } */
    /*  #swagger.parameters['authorization'] = {
                in: 'header',
                description: 'Format: \'Bearer (jwt)\'',
        } */
    /* #swagger.responses[200] = {
                description: 'Success, return the newly updated lecture.',
                schema: {
                    lectureID: 50,
                    name: 'Introduction to swift',
                    description: 'Learn the basics of swift',
                    category: 'programming language',
                    duration: 60
                    
                }
        } */
    /* #swagger.responses[400] = {
                description: 'Missing fields',
        } */
    const id = parseInt(req.params.id);  // Extract the lecture ID from the request parameters
    const { name, description, category, duration } = req.body;  // Extract the updated data from the request body

    // Check if all required fields are provided
    if (!name || !description || !category || !duration) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const updatedLecture = await Lecture.updateLecture(id, { name, description, category, duration });  // Update the lecture in the database
        if (!updatedLecture) {
            return res.status(404).send("Lecture not found");  // Respond with a 404 status if the lecture is not found
        }
        res.json(updatedLecture);  // Respond with the updated lecture
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error updating lecture");  // Respond with an error message
    }
};
            
// Controller function to update a sub-lecture by its ID
const updateSubLecture = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Update an existing sub-lecture. Limited to lecturers only.'
    /*  #swagger.parameters['lectureID'] = {
          in: 'path',
          type: "int",
          description: 'The id of the lecture',
    } */
    /*  #swagger.parameters['subLectureID'] = {
          in: 'path',
          type: "int",
          description: 'The id of the sub-lecture',
    } */
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Sample body schema to update sub-lecture',
        schema: {
            $name: 'Swift basics',
            $description: 'Learn about variables, conditionals, functions and loops',
            $duration: 600
        }
    } */
    /*  #swagger.parameters['authorization'] = {
                in: 'header',
                description: 'Format: \'Bearer (jwt)\'',
        } */
    /* #swagger.responses[200] = {
                description: 'Success, return the newly updated sub-lecture.',
                schema: {
                    subLectureID: 60,
                    lectureID: 90,
                    name: 'Swift basics',
                    description: 'Learn about variables, conditionals, functions and loops',
                    duration: 600
                }
        } */
    /* #swagger.responses[400] = {
                description: 'Missing fields',
        } */
    const lectureID = parseInt(req.params.lectureID);  // Extract the lecture ID from the request parameters
    const subLectureID = parseInt(req.params.subLectureID);  // Extract the sub-lecture ID from the request parameters
    const { name, description, duration } = req.body;  // Extract the updated data from the request body

    // Check if all required fields are provided
    if (!name || !description || !duration) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const updatedSubLecture = await Lecture.updateSubLecture(lectureID, subLectureID, { name, description, duration });  // Update the sub-lecture in the database
        if (!updatedSubLecture) {
            return res.status(404).send("Sub-Lecture not found");  // Respond with a 404 status if the sub-lecture is not found
        }
        res.json(updatedSubLecture);  // Respond with the updated sub-lecture
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error updating sub-lecture");  // Respond with an error message
    }
};

// Controller function to delete a lecture by its ID
const deleteLecture = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Delete a lecture by its id. Limited to lecturers'
    /*  #swagger.parameters['id'] = {
          in: 'path',
          type: "int",
          description: 'The id of the lecture',
    } */
   /*  #swagger.parameters['authorization'] = {
                in: 'header',
                description: 'Format: \'Bearer (jwt)\'',
        } */
   /* #swagger.responses[204] = {
                description: 'Success, lecture deleted.',
        } */
    const lectureID = parseInt(req.params.id);  // Extract the lecture ID from the request parameters
    try {
        const success = await Lecture.deleteLecture(lectureID);  // Delete the lecture from the database
        if (!success) {
            return res.status(404).send("Lecture not found");  // Respond with a 404 status if the lecture is not found
        }
        res.status(204).send();  // Respond with a 204 status to indicate successful deletion
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error deleting lecture");  // Respond with an error message
    }
};

// Controller function to delete a sub-lecture by its ID
const deleteSubLecture = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Delete a sub-lecture under a lecture. Limited to lecturers'
    /*  #swagger.parameters['lectureID'] = {
          in: 'path',
          type: "int",
          description: 'The id of the lecture',
    } */
   /*  #swagger.parameters['subLectureID'] = {
          in: 'path',
          type: "int",
          description: 'The id of the sub-lecture',
    } */
   /*  #swagger.parameters['authorization'] = {
                in: 'header',
                description: 'Format: \'Bearer (jwt)\'',
        } */
   /* #swagger.responses[204] = {
                description: 'Success, lecture deleted.',
        } */
    const lectureID = parseInt(req.params.lectureID);  // Extract the lecture ID from the request parameters
    const subLectureID = parseInt(req.params.subLectureID);  // Extract the sub-lecture ID from the request parameters
    try {
        const success = await Lecture.deleteSubLecture(lectureID, subLectureID);  // Delete the sub-lecture from the database
        if (!success) {
            return res.status(404).send("Sub-lecture not found");  // Respond with a 404 status if the sub-lecture is not found
        }
        res.status(204).send();  // Respond with a 204 status to indicate successful deletion
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting sub-lecture");  // Respond with an error message
    }
};

// Controller function to search for lectures
const searchLectures = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Search for lectures. Possible matches include name and description'
    /*  #swagger.parameters['q'] = {
          in: 'query',
          type: "string",
          description: 'The search query',
    } */
   /* #swagger.responses[200] = {
                description: 'Returns an array of all lectures that match the query',
                schema: [{
                        lectureID: 1,
                        name: "Introduction to Angular",
                        description: "An introduction to the Angular framework.",
                        category: "education",
                        duration: 30
                }]
        } */
    const searchTerm = req.query.q;  // Extract the search term from the request query parameters
    try {
        const lectures = await Lecture.searchLectures(searchTerm);  // Search for lectures in the database
        res.json(lectures);  // Respond with the list of found lectures
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error searching lectures");  // Respond with an error message
    }
};

// Controller function to retrieve a course with its lectures and sub-lectures
const getCourseWithLecture = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Get all the sub-lectures and lectures under a course'
   /*  #swagger.parameters['courseID'] = {
          in: 'path',
          type: "int",
          description: 'The id of the course',
    } */
   /* #swagger.responses[200] = {
                description: 'Return an array containg the course as well as its respective lectures and sub-lectures',
                schema: [
                            {
                                courseID: 1,
                                title: "Angular JS",
                                description: "A JavaScript-based open-source front-end web framework for developing single-page applications.",
                                video: "<Buffer> object",
                                details: "Learn the fundamentals of Angular JS",
                                caption: "AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.",
                                lectures: [
                                    {
                                        lectureID: 1,
                                        name: "Introduction to Angular",
                                        description: "An introduction to the Angular framework.",
                                        category: "education",
                                        duration: 30,
                                        subLectures: [
                                            {
                                                subLectureID: 1,
                                                name: "Angular Basics",
                                                description: "Learn the basics of Angular.",
                                                duration: 10,
                                                video: "<Buffer> object"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
        } */
    const courseId = req.params.courseID;  // Extract the course ID from the request parameters
    try {
        const courseWithLecture = await Lecture.getCourseWithLecture(courseId);  // Retrieve the course with its lectures and sub-lectures from the database
        res.json(courseWithLecture);  // Respond with the course and its lectures and sub-lectures
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error retrieving course with lecture");  // Respond with an error message
    }
};

// Controller function to retrieve a course with its lectures and sub-lectures (without videos)
const getCourseWithLectureWithoutVideo = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Get all the sub-lectures and lectures under a course, excluding the sub-lecture videos'
   /*  #swagger.parameters['courseID'] = {
          in: 'path',
          type: "int",
          description: 'The id of the course',
    } */
   /* #swagger.responses[200] = {
                description: 'Return an array containg the course as well as its respective lectures and sub-lectures',
                schema: [
                            {
                                courseID: 1,
                                title: "Angular JS",
                                description: "A JavaScript-based open-source front-end web framework for developing single-page applications.",
                                video: "<Buffer> object",
                                details: "Learn the fundamentals of Angular JS",
                                caption: "AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.",
                                lectures: [
                                    {
                                        lectureID: 1,
                                        name: "Introduction to Angular",
                                        description: "An introduction to the Angular framework.",
                                        category: "education",
                                        duration: 30,
                                        subLectures: [
                                            {
                                                subLectureID: 1,
                                                name: "Angular Basics",
                                                description: "Learn the basics of Angular.",
                                                duration: 10
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
        } */
    const courseId = req.params.courseID;  // Extract the course ID from the request parameters
    try {
        const courseWithLecture = await Lecture.getCourseWithLectureWithoutVideo(courseId);  // Retrieve the course with its lectures and sub-lectures (without videos) from the database
        res.json(courseWithLecture);  // Respond with the course and its lectures and sub-lectures
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving course with lecture");  // Respond with an error message
    }
};

// Controller function to retrieve a sub-lecture by its ID
const getSubLectureById = async (req, res) => {
    // #swagger.tags = ['Lectures']
    // #swagger.description = 'Get the sub-lecture under a lecture'
    /*  #swagger.parameters['lectureID'] = {
          in: 'path',
          type: "int",
          description: 'The id of the lecture',
    } */
   /*  #swagger.parameters['subLectureID'] = {
          in: 'path',
          type: "int",
          description: 'The id of the sub-lecture',
    } */
   /* #swagger.responses[200] = {
                description: 'Return the sub-lecture under the lecture',
                schema: {
                        subLectureID: 1,
                        lectureID: 1,
                        Name: 'Angular Basics',
                        Description: 'Learn the basics of angular',
                        Duration: 10,
                        Video: '<Buffer> object',
                }
        } */
    const lectureID = parseInt(req.params.lectureID);  // Extract the lecture ID from the request parameters
    const subLectureID = parseInt(req.params.subLectureID);  // Extract the sub-lecture ID from the request parameters
    try {
        const subLecture = await Lecture.getSubLectureById(lectureID, subLectureID);  // Retrieve the sub-lecture by its ID from the database
        if (!subLecture) {
            return res.status(404).send("Sub-Lecture not found");  // Respond with a 404 status if the sub-lecture is not found
        }
        res.json(subLecture);  // Respond with the found sub-lecture
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error retrieving sub-lecture");  // Respond with an error message
    }
};

module.exports = {
    createLecture,
    createSubLecture,
    getAllLectures,
    getLectureById,
    updateLecture,
    updateSubLecture,
    deleteLecture,
    deleteSubLecture,
    searchLectures,
    getCourseWithLecture,
    getSubLectureById,
    getCourseWithLectureWithoutVideo,
};
