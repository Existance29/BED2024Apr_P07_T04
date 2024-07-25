const courseController = require('../controllers/courseController');
const authenticateToken = require('../middlewares/authenticateToken');

// Define course routes
const courseRoute = (app, upload) => {
    // Route for creating a new course
    app.post("/courses", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), authenticateToken, courseController.createCourse);
    
    // Route for retrieving all courses
    app.get("/courses", courseController.getAllCourses);
    
    // Route for retrieving all courses without their videos
    app.get("/courses/without-video", courseController.getAllCoursesWithoutVideo);
    
    // Route for searching courses
    app.get("/courses/search", courseController.searchCourses);
    
    // Route for retrieving a course by its ID
    app.get("/courses/:id", courseController.getCourseById);
    
    // Route for retrieving a course by its ID without its video
    app.get("/courses/:id/without-video", courseController.getCourseByIdWithoutVideo);
    
    // Route for updating a course by its ID
    app.put("/courses/:id", authenticateToken, courseController.updateCourse);
    
    // Route for deleting a course by its ID
    app.delete("/courses/:id", authenticateToken, courseController.deleteCourse);
    
    // Route for searching YouTube videos based on a query
    app.get('/courses/youtube-search/:query', courseController.searchYouTubeVideos);
};

// Export the course routes
module.exports = courseRoute;
