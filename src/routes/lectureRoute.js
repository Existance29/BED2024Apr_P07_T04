const lectureController = require("../controllers/lectureController");
const authenticateToken = require('../middlewares/authenticateToken');

// Define the lectureRoute function to set up lecture-related routes
const lectureRoute = (app, upload) => {
    // Route to get all lectures
    app.get("/lectures", lectureController.getAllLectures);

    // Route to search for lectures based on a query parameter
    app.get("/lectures/search", lectureController.searchLectures);

    // Route to get a specific lecture by its ID
    app.get("/lectures/:id", lectureController.getLectureById);

    // Route to get a specific sub-lecture by its lecture ID and sub-lecture ID
    app.get("/lectures/:lectureID/sublectures/:subLectureID", lectureController.getSubLectureById);

    // Route to create a new lecture (without file upload) and requires authentication
    app.post("/lectures", upload.none(), authenticateToken, lectureController.createLecture); 

    // Route to create a new sub-lecture (with video upload) and requires authentication
    app.post("/lectures/:lectureID/sublectures", upload.fields([{ name: 'video', maxCount: 1 }]), authenticateToken, lectureController.createSubLecture); 

    // Route to update an existing lecture by its ID and requires authentication
    app.put("/lectures/:id", authenticateToken, lectureController.updateLecture);

    // Route to update an existing sub-lecture by its lecture ID and sub-lecture ID and requires authentication
    app.put("/lectures/:lectureID/sublectures/:subLectureID", authenticateToken, lectureController.updateSubLecture);

    // Route to delete a lecture by its ID and requires authentication
    app.delete("/lectures/:id", authenticateToken, lectureController.deleteLecture);

    // Route to delete a sub-lecture by its lecture ID and sub-lecture ID and requires authentication
    app.delete("/lectures/:lectureID/sublectures/:subLectureID", authenticateToken, lectureController.deleteSubLecture);

    // Route to get all lectures and sub-lectures under a specific course by course ID
    app.get("/courses/:courseID/lectures", lectureController.getCourseWithLecture);

    // Route to get all lectures and sub-lectures (excluding videos) under a specific course by course ID
    app.get("/courses/:courseID/lectures/without-video", lectureController.getCourseWithLectureWithoutVideo);
};

// Export the lectureRoute function to be used in other modules
module.exports = lectureRoute;
