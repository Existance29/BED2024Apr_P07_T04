const fs = require('fs');
const path = require('path');
const Course = require("../models/course");

const createCourse = async (req, res) => {
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
    try {
        const courses = await Course.getAllCourses();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving courses");
    }
};

const getAllCoursesWithoutVideo = async (req, res) => {
    try {
        const courses = await Course.getAllCoursesWithoutVideo();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving courses");
    }
};

const getCourseById = async (req, res) => {
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
