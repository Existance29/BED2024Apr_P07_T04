const fs = require('fs');
const path = require('path');
const Course = require("../models/course");
require('dotenv').config(); // Load environment variables

// Controller function to create a new course
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
            courseID: 9,
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
        // Extract course data from the request body and files
        const { title, description, details, caption, category } = req.body;
        const thumbnailPath = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;
        const videoPath = req.files['video'] ? req.files['video'][0].path : null;

        // Create a new course data object
        const newCourseData = {
            title,
            description,
            details,
            caption,
            category,
            thumbnail: thumbnailPath ? fs.readFileSync(thumbnailPath) : null,
            video: videoPath ? fs.readFileSync(videoPath) : null
        };

        // Create the course in the database
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
                fs.mkdirSync(uploadDir, { recursive: true });
            }
        });

        res.status(201).json(createdCourse);  // Respond with the newly created course
    } catch (error) {
        console.error("Error creating course:", error);  // Log any errors
        res.status(error.statusCode || 500).json({ message: error.message });  // Respond with an error message and the correct status code
    }
};

// Controller function to retrieve all courses
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
        const courses = await Course.getAllCourses();  // Retrieve all courses from the database
        res.json(courses);  // Respond with the list of courses
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error retrieving courses");  // Respond with an error message
    }
};

// Controller function to retrieve all courses without their videos
const getAllCoursesWithoutVideo = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Get a list of all courses without their introductory video'
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
        const courses = await Course.getAllCoursesWithoutVideo();  // Retrieve all courses without videos from the database
        res.json(courses);  // Respond with the list of courses
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error retrieving courses");  // Respond with an error message
    }
};

// Controller function to retrieve a course by its ID
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
    const id = parseInt(req.params.id);  // Extract the course ID from the request parameters
    try {
        const course = await Course.getCourseById(id);  // Retrieve the course by its ID from the database
        if (!course) {
            return res.status(404).send("Course not found");  // Respond with a 404 status if the course is not found
        }
        res.json(course);  // Respond with the found course
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error retrieving course");  // Respond with an error message
    }
};

// Controller function to retrieve a course by its ID without its video
const getCourseByIdWithoutVideo = async (req, res) => {
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
        }
    } */
    const id = parseInt(req.params.id);  // Extract the course ID from the request parameters
    try {
        const course = await Course.getCourseByIdWithoutVideo(id);  // Retrieve the course by its ID without its video from the database
        if (!course) {
            return res.status(404).send("Course not found");  // Respond with a 404 status if the course is not found
        }
        res.json(course);  // Respond with the found course
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error retrieving course");  // Respond with an error message
    }
}

// Controller function to update a course by its ID
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
    const id = parseInt(req.params.id);  // Extract the course ID from the request parameters
    const updatedData = req.body;  // Extract the updated data from the request body
    try {
        const updatedCourse = await Course.updateCourse(id, updatedData);  // Update the course in the database
        if (!updatedCourse) {
            return res.status(404).send("Course not found");  // Respond with a 404 status if the course is not found
        }
        res.json(updatedCourse);  // Respond with the updated course
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(error.statusCode || 500).json({ message: error.message });  // Respond with an error message
    }
};

// Controller function to delete a course by its ID
const deleteCourse = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Delete a course by its id. Limited to lecturers'
    /*  #swagger.parameters['id'] = {
        in: 'path',
        type: "int",
        description: 'The id of the course',
    } */
    /* #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Format: \'Bearer (jwt)\'',
    } */
    /* #swagger.responses[204] = {
        description: 'Success, course deleted. Returns an empty json',
        schema: {}
    } */
    const courseID = parseInt(req.params.id);  // Extract the course ID from the request parameters
    try {
        const success = await Course.deleteCourse(courseID);  // Delete the course from the database
        if (!success) {
            return res.status(404).send("Course not found");  // Respond with a 404 status if the course is not found
        }
        res.status(204).send();  // Respond with a 204 status to indicate successful deletion
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting course");  // Respond with an error message
    }
};

// Controller function to search for courses
const searchCourses = async (req, res) => {
    // #swagger.tags = ['Courses']
    // #swagger.description = 'Search for courses. Possible matches include title, description, details, caption, category'
    /*  #swagger.parameters['q'] = {
        in: 'query',
        type: "string",
        description: 'The search query',
    } */
    /* #swagger.responses[200] = {
        description: 'Returns a list of all courses that match the query. Does not include the video',
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
        }]
    } */
    const searchTerm = req.query.q;  // Extract the search term from the request query parameters
    try {
        const courses = await Course.searchCourses(searchTerm);  // Search for courses in the database
        res.json(courses);  // Respond with the list of found courses
    } catch (error) {
        console.error(error);  // Log any errors
        res.status(500).send("Error searching courses");  // Respond with an error message
    }
};

// Controller function to search YouTube videos based on a query
const searchYouTubeVideos = async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;  // Dynamically import the node-fetch module
        const query = encodeURIComponent(req.params.query);  // Extract and encode the query from the request parameters
        const apiKey = process.env.YOUTUBE_API_KEY;  // Retrieve the YouTube API key from environment variables
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}+summary&type=video&maxResults=5&key=${apiKey}`;

        const response = await fetch(url);  // Fetch data from the YouTube API
        const data = await response.json();

        if (data.items) {
            const videos = data.items.map(item => ({
                videoId: item.id.videoId,
                thumbnail: item.snippet.thumbnails.default.url,
                title: item.snippet.title
            }));  // Map the data to an array of video objects
            res.json(videos);  // Respond with the list of videos
        } else {
            res.status(404).json({ message: 'No results found' });  // Respond with a 404 status if no results are found
        }
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);  // Log any errors
        res.status(500).json({ message: 'Error fetching YouTube videos', error: error.message });  // Respond with an error message
    }
};

// Export the controller functions to be used in other modules
module.exports = {
    createCourse,
    getAllCourses,
    getAllCoursesWithoutVideo,
    getCourseById,
    getCourseByIdWithoutVideo,
    updateCourse,
    deleteCourse,
    searchCourses,
    searchYouTubeVideos,
};
