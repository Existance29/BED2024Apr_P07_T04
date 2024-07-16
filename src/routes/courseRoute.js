const express = require('express');
const courseController = require('../controllers/courseController');
const authenticateToken = require('../middlewares/authenticateToken');


const courseRoute = (app, upload) => {
    app.post("/courses", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), authenticateToken, courseController.createCourse);
    app.get("/courses", courseController.getAllCourses);
    app.get("/courses/without-video", courseController.getAllCoursesWithoutVideo);
    app.get("/courses/search", courseController.searchCourses);
    app.get("/courses/:id", courseController.getCourseById);
    app.put("/courses/:id", authenticateToken, courseController.updateCourse); //HAVENT IMPLEMENT IN FRONT END!!
    app.delete("/courses/:id",authenticateToken, courseController.deleteCourse);
};

module.exports = courseRoute;
