const lectureController = require("../controllers/lectureController");

const lectureRoute = (app) => {
    app.get("/lectures", lectureController.getAllLectures);
    app.get("/lectures/course-with-lecture", lectureController.getCourseWithLecture);
    app.get("/lectures/search", lectureController.searchLectures);
    app.get("/lectures/:id", lectureController.getLectureById);
    app.post("/lectures", lectureController.createLecture);
    app.put("/lectures/:id", lectureController.updateLecture);
    app.delete("/lectures/:id", lectureController.deleteLecture);

    app.get("/courses/:courseID/lectures", lectureController.getCourseWithLecture);

};

module.exports = lectureRoute;