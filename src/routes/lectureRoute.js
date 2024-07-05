const express = require('express');
const lectureController = require("../controllers/lectureController");

const lectureRoute = (app, upload) => {
    app.get("/lectures", lectureController.getAllLectures);
    app.get("/lectures/course-with-lecture", lectureController.getCourseWithLecture);
    app.get("/lectures/search", lectureController.searchLectures);
    app.get("/lectures/:id", lectureController.getLectureById);
    app.get("/lectures/:lectureID/sublectures/:subLectureID", lectureController.getSubLectureById);
    app.post("/lectures", upload.none(), lectureController.createLecture); // Handle main lecture creation without files
    app.post("/lectures/:lectureID/sublectures", upload.fields([{ name: 'video', maxCount: 1 }]), lectureController.createSubLecture); // Handle sub-lecture creation with video upload
    app.put("/lectures/:id", lectureController.updateLecture);
    app.delete("/lectures/:id", lectureController.deleteLecture);

    app.get("/courses/:courseID/lectures", lectureController.getCourseWithLecture);
    app.get("/courses/:courseID/lectures/without-video", lectureController.getCourseWithLectureWithoutVideo);
};

module.exports = lectureRoute;
