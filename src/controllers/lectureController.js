const fs = require('fs');
const path = require('path');
const Lecture = require("../models/lecture");

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
        const { name, description, category, duration, courseID } = req.body;

        if (!name || !description || !category || !duration || !courseID) {
            console.log("Missing fields:", { name, description, category, duration, courseID });
            return res.status(400).json({ message: "Missing required fields in main lecture" });
        }

        const newLectureData = {
            name,
            description,
            category,
            duration: parseInt(duration) // Ensure duration is an integer
        };

        const createdLecture = await Lecture.createLecture(newLectureData);

        // Link lecture to course
        const linkLectureToCourse = await Lecture.linkLectureToCourse(createdLecture.lectureID, courseID);

        res.status(201).json(createdLecture);
    } catch (error) {
        console.error("Error creating lecture:", error);
        res.status(500).json({ message: "Error creating lecture", error: error.message });
    }
};

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
        const { lectureID } = req.params;
        const { name, description, duration } = req.body;
        const videoPath = req.files['video'] ? req.files['video'][0].path : null;

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

        const createdSubLecture = await Lecture.createSubLecture(newSubLectureData);

        // Clean up uploaded video file
        if (videoPath) {
            fs.unlinkSync(videoPath);
        }

        res.status(201).json(createdSubLecture);
    } catch (error) {
        console.error("Error creating sub-lecture:", error);
        res.status(500).json({ message: "Error creating sub-lecture", error: error.message });
    }
};

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
        const lectures = await Lecture.getAllLectures();
        res.json(lectures);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving lectures");
    }
};

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
    const id = parseInt(req.params.id);
    try {
        const lecture = await Lecture.getLectureById(id);
        if (!lecture) {
            return res.status(404).send("Lecture not found");
        }
        res.json(lecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving lecture");
    }
};

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
    const id = parseInt(req.params.id);
    const { name, description, category, duration } = req.body;

    if (!name || !description || !category || !duration) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const updatedLecture = await Lecture.updateLecture(id, { name, description, category, duration });
        if (!updatedLecture) {
            return res.status(404).send("Lecture not found");
        }
        res.json(updatedLecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating lecture");
    }
};

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
    const lectureID = parseInt(req.params.id);
    try {
        const success = await Lecture.deleteLecture(lectureID);
        if (!success) {
            return res.status(404).send("Lecture not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting lecture");
    }
};

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
    const lectureID = parseInt(req.params.lectureID);
    const subLectureID = parseInt(req.params.subLectureID);
    try {
        const success = await Lecture.deleteSubLecture(lectureID, subLectureID);
        if (!success) {
            return res.status(404).send("Sub-lecture not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting sub-lecture");
    }
};

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
    const searchTerm = req.query.q;
    try {
        const lectures = await Lecture.searchLectures(searchTerm);
        res.json(lectures);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error searching lectures");
    }
};

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
    const courseId = req.params.courseID;
    try {
        const courseWithLecture = await Lecture.getCourseWithLecture(courseId);
        res.json(courseWithLecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving course with lecture");
    }
};

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
    const courseId = req.params.courseID;
    try {
        const courseWithLecture = await Lecture.getCourseWithLectureWithoutVideo(courseId);
        res.json(courseWithLecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving course with lecture");
    }
};

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
    const lectureID = parseInt(req.params.lectureID);
    const subLectureID = parseInt(req.params.subLectureID);
    try {
        const subLecture = await Lecture.getSubLectureById(lectureID, subLectureID);
        if (!subLecture) {
            return res.status(404).send("Sub-Lecture not found");
        }
        res.json(subLecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving sub-lecture");
    }
};

module.exports = {
    createLecture,
    createSubLecture,
    getAllLectures,
    getLectureById,
    updateLecture,
    deleteLecture,
    deleteSubLecture,
    searchLectures,
    getCourseWithLecture,
    getSubLectureById,
    getCourseWithLectureWithoutVideo,
};
