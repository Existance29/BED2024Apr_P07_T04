const Course = require("../models/course");

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.getAllCourses();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving courses");
    }
}

const getAllCoursesWithoutVideo = async (req, res) => {
    try {
        const courses = await Course.getAllCoursesWithoutVideo();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving courses");
    }
}

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
}

const createCourse = async (req, res) => {
    const newCourse = req.body;
    try {
        const createdCourse = await Course.createCourse(newCourse);
        res.status(201).json(createdCourse);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating course");
    }
}

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
}

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
}

const searchCourses = async (req, res) => {
    const searchTerm = req.query.q;
    try {
        const courses = await Course.searchCourses(searchTerm);
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error searching courses");
    }
}

module.exports = {
    getAllCourses,
    getAllCoursesWithoutVideo,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    searchCourses,
};
