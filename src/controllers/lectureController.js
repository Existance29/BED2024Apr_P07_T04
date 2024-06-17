const Lecture = require("../models/lecture");

const getAllLectures = async (req, res) => {
    try{
        const lectures = await Lecture.getAllLectures();
        res.json(lectures);
    } catch(error){
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

const createLecture = async (req, res) => {
    const newLecture = req.body;
    try {
        const createdLecture = await Lecture.createLecture(newLecture);
        res.status(201).json(createdLecture);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating lecture");
    }
};

const updateLecture = async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    try {
        const updatedLecture = await Lecture.updateLecture(id, updatedData);
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
    try{
        const courseId = req.params.courseID;
        const courseWithLecture = await Lecture.getCourseWithLecture();
        res.json(courseWithLecture);
    } catch(error){
        console.error(error);
        res.status(500).send("Error retrieving course with lecture");
    }
}

module.exports = {
    getAllLectures,
    getLectureById,
    createLecture,
    updateLecture,
    deleteLecture,
    searchLectures,
    getCourseWithLecture,
};
