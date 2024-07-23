const lectureController = require("../controllers/lectureController");
const authenticateToken = require('../middlewares/authenticateToken');


const lectureRoute = (app, upload) => {
    app.get("/lectures", lectureController.getAllLectures);
    //app.get("/lectures/course-with-lecture/", lectureController.getCourseWithLecture);
    app.get("/lectures/search", lectureController.searchLectures);
    app.get("/lectures/:id", lectureController.getLectureById);
    app.get("/lectures/:lectureID/sublectures/:subLectureID", lectureController.getSubLectureById);
    app.post("/lectures", upload.none(), authenticateToken, lectureController.createLecture); // Handle main lecture creation without files
    app.post("/lectures/:lectureID/sublectures", upload.fields([{ name: 'video', maxCount: 1 }]), authenticateToken, lectureController.createSubLecture); // Handle sub-lecture creation with video upload
    app.put("/lectures/:id", authenticateToken, lectureController.updateLecture); // HAVENT IMPLEMENT IN FRONT END!!
    app.put("/lectures/:lectureID/sublectures/:subLectureID", authenticateToken, lectureController.updateSubLecture);
    app.delete("/lectures/:id", authenticateToken, lectureController.deleteLecture); //HAVENT IMPLEMENT IN FRONT END!!
    app.delete("/lectures/:lectureID/sublectures/:subLectureID", authenticateToken, lectureController.deleteSubLecture);

    app.get("/courses/:courseID/lectures", lectureController.getCourseWithLecture);
    app.get("/courses/:courseID/lectures/without-video", lectureController.getCourseWithLectureWithoutVideo);
};

module.exports = lectureRoute;
