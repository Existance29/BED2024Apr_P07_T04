const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const courseController = require('../controllers/courseController');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const courseRoute = (app) => {
    app.post("/courses", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), courseController.createCourse);
    app.get("/courses", courseController.getAllCourses);
    app.get("/courses/without-video", courseController.getAllCoursesWithoutVideo);
    app.get("/courses/:id", courseController.getCourseById);
    app.put("/courses/:id", courseController.updateCourse);
    app.delete("/courses/:id", courseController.deleteCourse);
    app.get("/courses/search", courseController.searchCourses);
};

module.exports = courseRoute;
