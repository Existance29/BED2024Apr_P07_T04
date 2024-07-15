const fs = require('fs');
const path = require('path');
const Course = require("../models/course");

const createCourse = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Create a new course. Limited to lecturers only.'
    //#swagger.consumes = ['multipart/form-data']  
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Sample body schema to create a new course',
        schema: {
            $title: 'Xcode',
            $description: 'Learn how to use xcode with the swift programming language to develop IOS mobile apps',
            $details: 'In this course, you will learn the basics of the swift programming language, make and design elements with xcode and launch an app',
            $caption: 'Lead by industry professionals to master IOS app development',
            $category: 'programming language,app development,sofware'
        }
    } */
   /*#swagger.parameters['thumbnail'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'The file object of the thumbnail of the course',
    } */
   /*#swagger.parameters['video'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'The file object of the video of the course',
    } */
    /*  #swagger.parameters['authorization'] = {
                in: 'header',
                description: 'Format: \'Bearer (jwt)\'',
        } */
    /* #swagger.responses[201] = {
                description: 'Success, return the newly created course.',
                schema: {
                    courseID: 5,
                    title: 'Xcode',
                    thumbnail: '<Buffer> object',
                    description: 'Learn how to use xcode with the swift programming language to develop IOS mobile apps',
                    details: 'In this course, you will learn the basics of the swift programming language, make and design elements with xcode and launch an app',
                    caption: 'Lead by industry professionals to master IOS app development',
                    category: 'programming language,app development,sofware',
                    totalRate: 0,
                    ratings: 0,
                    video: '<Buffer> object',
                    
                }
        } */
    try {
        const { title, description, details, caption, category } = req.body;
        const thumbnailPath = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;
        const videoPath = req.files['video'] ? req.files['video'][0].path : null;

        const newCourseData = {
            title,
            description,
            details,
            caption,
            category,
            thumbnail: thumbnailPath ? fs.readFileSync(thumbnailPath) : null,
            video: videoPath ? fs.readFileSync(videoPath) : null
        };

        const createdCourse = await Course.createCourse(newCourseData);

        // Clean up uploaded files
        thumbnailPath && fs.unlinkSync(thumbnailPath);
        videoPath && fs.unlinkSync(videoPath);

        // Delete the uploads folder and recreate it
        const uploadDir = path.join(__dirname, '../uploads');
        fs.rm(uploadDir, { recursive: true }, (err) => {
            if (err) {
                console.error("Error deleting uploads folder:", err);
            } else {
                console.log("Uploads folder deleted successfully.");
                // Recreate the uploads folder
                fs.mkdirSync(uploadDir, { recursive: true });
                console.log("Uploads folder recreated successfully.");
            }
        });

        res.status(201).json(createdCourse);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Error creating course", error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Get a list of all courses'
    /* #swagger.responses[200] = {
                description: 'Success, returns a list of course objects.',
                schema: [{
                    courseID: 1,
                    title: 'Angular JS',
                    thumbnail: '<Buffer> object',
                    description: 'A JavaScript-based open-source front-end web framework for developing single-page applications.',
                    details: 'Learn the fundamentals of Angular JS',
                    caption: 'AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.',
                    category: 'front-end,framework',
                    totalRate: 2000,
                    ratings: 500,
                    video: '<Buffer> object',
                    
                }]
        } */
    try {
        const courses = await Course.getAllCourses();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving courses");
    }
};

const getAllCoursesWithoutVideo = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Get a list of all courses without their video'
    /* #swagger.responses[200] = {
                description: 'Success, returns a list of course objects without their video.',
                schema: [{
                    courseID: 1,
                    title: 'Angular JS',
                    thumbnail: '<Buffer> object',
                    description: 'A JavaScript-based open-source front-end web framework for developing single-page applications.',
                    details: 'Learn the fundamentals of Angular JS',
                    caption: 'AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.',
                    category: 'front-end,framework',
                    totalRate: 2000,
                    ratings: 500,
                }]
        } */
    try {
        const courses = await Course.getAllCoursesWithoutVideo();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving courses");
    }
};

const getCourseById = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Get a course by its id'
    /*  #swagger.parameters['id'] = {
          in: 'path',
          type: "int",
          description: 'The id of the course',
    } */
    /* #swagger.responses[200] = {
                description: 'Success, returns the course objects.',
                schema: {
                    courseID: 1,
                    title: 'Angular JS',
                    thumbnail: '<Buffer> object',
                    description: 'A JavaScript-based open-source front-end web framework for developing single-page applications.',
                    details: 'Learn the fundamentals of Angular JS',
                    caption: 'AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.',
                    category: 'front-end,framework',
                    totalRate: 2000,
                    ratings: 500,
                    video: '<Buffer> object',
                    
                }
        } */
    const id = parseInt(req.params.id);
    try {
        const course = await Course.getCourseById(id);
        if (!course) {
            return res.status(404).send("Course not found");
        }
        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving course");
    }
};

const updateCourse = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Update a course's contents. Does not allow for updating thumbnail and video'
    /*  #swagger.parameters['id'] = {
          in: 'path',
          type: "int",
          description: 'The id of the course',
    } */
       /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Sample body schema to update a pre-existing course course',
        schema: {
            $title: 'Angular JS',
            $description: 'A JavaScript front-end web framework for single-page application development',
            $details: 'Learn Angular JS',
            $caption: 'Lead by industry professionals and gives an industry certification',
            $category: 'front-end,framework'
        }
    } */
   
    /* #swagger.responses[200] = {
                description: 'Success, returns the updated course object',
                schema: {
                    courseID: 1,
                    title: 'Angular JS',
                    thumbnail: '<Buffer> object',
                    description: 'A JavaScript front-end web framework for single-page application development',
                    details: 'Learn Angular JS',
                    caption: 'Lead by industry professionals and gives an industry certification',
                    category: 'front-end,framework',
                    totalRate: 2000,
                    ratings: 500,
                    video: '<Buffer> object',
                    
                }
        } */
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    try {
        const updatedCourse = await Course.updateCourse(id, updatedData);
        if (!updatedCourse) {
            return res.status(404).send("Course not found");
        }
        res.json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating course");
    }
};

const deleteCourse = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Delete a course by its id. Limited to lecturers'
    /*  #swagger.parameters['id'] = {
          in: 'path',
          type: "int",
          description: 'The id of the course',
    } */
   /*  #swagger.parameters['authorization'] = {
                in: 'header',
                description: 'Format: \'Bearer (jwt)\'',
        } */
   /* #swagger.responses[204] = {
                description: 'Success, course deleted. Returns an empty json',
                schema: {
                }
        } */
    const id = parseInt(req.params.id);
    try {
        const success = await Course.deleteCourse(id);
        if (!success) {
            return res.status(404).send("Course not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting course");
    }
};

const searchCourses = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Search for courses. Possible matches include title, description, details, caption, category'
    /*  #swagger.parameters['q'] = {
          in: 'query',
          type: "string",
          description: 'The search query',
    } */
   /* #swagger.responses[200] = {
                description: 'Returns a list of all courses that match the query',
                schema: [{
                    courseID: 1,
                    title: 'Angular JS',
                    thumbnail: '<Buffer> object',
                    description: 'A JavaScript front-end web framework for single-page application development',
                    details: 'Learn Angular JS',
                    caption: 'Lead by industry professionals and gives an industry certification',
                    category: 'front-end,framework',
                    totalRate: 2000,
                    ratings: 500,
                    video: '<Buffer> object',
                    
                }]
        } */
    const searchTerm = req.query.q;
    try {
        const courses = await Course.searchCourses(searchTerm);
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error searching courses");
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getAllCoursesWithoutVideo,
    getCourseById,
    updateCourse,
    deleteCourse,
    searchCourses,
};
