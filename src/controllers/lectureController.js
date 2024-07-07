const fs = require('fs');
const path = require('path');
const Lecture = require("../models/lecture");

const createLecture = async (req, res) => {
    try {
        const { name, description, category, duration, courseID } = req.body;

        if (!name || !description || !category || !duration || !courseID) {
            console.log("Missing fields:", { name, description, category, duration, courseID });
            return res.status(400).json({ message: "Missing required fields in main lecture" });
        }

        const newLectureData = {
            name,
            description,
            category,
            duration: parseInt(duration) // Ensure duration is an integer
        };

        const createdLecture = await Lecture.createLecture(newLectureData);

        // Link lecture to course
        const linkLectureToCourse = await Lecture.linkLectureToCourse(createdLecture.lectureID, courseID);

        res.status(201).json(createdLecture);
    } catch (error) {
        console.error("Error creating lecture:", error);
        res.status(500).json({ message: "Error creating lecture", error: error.message });
    }
};

const createSubLecture = async (req, res) => {
    try {
        const { lectureID } = req.params;
        const { name, description, duration } = req.body;
        const videoPath = req.files['video'] ? req.files['video'][0].path : null;

        if (!name || !description || !duration || !videoPath) {
            console.log("Missing fields:", { name, description, duration, videoPath });
            return res.status(400).json({ message: "Missing required fields in sub-lecture" });
        }

        const newSubLectureData = {
            lectureID: parseInt(lectureID),
            name,
            description,
            duration: parseInt(duration), // Ensure duration is an integer
            video: videoPath ? fs.readFileSync(videoPath) : null
        };

        const createdSubLecture = await Lecture.createSubLecture(newSubLectureData);

        // Clean up uploaded video file
        if (videoPath) {
            fs.unlinkSync(videoPath);
        }

        res.status(201).json(createdSubLecture);
    } catch (error) {
        console.error("Error creating sub-lecture:", error);
        res.status(500).json({ message: "Error creating sub-lecture", error: error.message });
    }
};

const getAllLectures = async (req, res) => {
    try {
        const lectures = await Lecture.getAllLectures();
        res.json(lectures);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving lectures");
    }
};

const getLectureById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const lecture = await Lecture.getLectureById(id);
        if (!lecture) {
            return res.status(404).send("Lecture not found");
        }
        res.json(lecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving lecture");
    }
};

const updateLecture = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, category, duration } = req.body;

    if (!name || !description || !category || !duration) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const updatedLecture = await Lecture.updateLecture(id, { name, description, category, duration });
        if (!updatedLecture) {
            return res.status(404).send("Lecture not found");
        }
        res.json(updatedLecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating lecture");
    }
};

const deleteLecture = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const success = await Lecture.deleteLecture(id);
        if (!success) {
            return res.status(404).send("Lecture not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting lecture");
    }
};

const searchLectures = async (req, res) => {
    const searchTerm = req.query.q;
    try {
        const lectures = await Lecture.searchLectures(searchTerm);
        res.json(lectures);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error searching lectures");
    }
};

const getCourseWithLecture = async (req, res) => {
    const courseId = req.params.courseID;
    try {
        const courseWithLecture = await Lecture.getCourseWithLecture(courseId);
        res.json(courseWithLecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving course with lecture");
    }
};

const getCourseWithLectureWithoutVideo = async (req, res) => {
    const courseId = req.params.courseID;
    try {
        const courseWithLecture = await Lecture.getCourseWithLectureWithoutVideo(courseId);
        res.json(courseWithLecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving course with lecture");
    }
};

const getSubLectureById = async (req, res) => {
    const lectureID = parseInt(req.params.lectureID);
    const subLectureID = parseInt(req.params.subLectureID);
    try {
        const subLecture = await Lecture.getSubLectureById(lectureID, subLectureID);
        if (!subLecture) {
            return res.status(404).send("Sub-Lecture not found");
        }
        res.json(subLecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving sub-lecture");
    }
};

module.exports = {
    createLecture,
    createSubLecture,
    getAllLectures,
    getLectureById,
    updateLecture,
    deleteLecture,
    searchLectures,
    getCourseWithLecture,
    getSubLectureById,
    getCourseWithLectureWithoutVideo,
};
