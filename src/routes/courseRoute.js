const express = require('express');

const courseController = require('../controllers/courseController');



const courseRoute = (app, upload) => {
    app.post("/courses", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), courseController.createCourse);
    app.get("/courses", courseController.getAllCourses);
    app.get("/courses/without-video", courseController.getAllCoursesWithoutVideo);
    app.get("/courses/:id", courseController.getCourseById);
    app.put("/courses/:id", courseController.updateCourse);
    app.delete("/courses/:id", courseController.deleteCourse);
    app.get("/courses/search", courseController.searchCourses);
};

module.exports = courseRoute;
