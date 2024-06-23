const Quiz = require("../models/quiz");

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.getAllQuizzes();
        res.json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving quizzes");
    }
}

const getQuizById = async (req, res) => {
    const id = parseInt(req.params.quizId);
    try {
        const quiz = await Quiz.getQuizById(id);
        if (!quiz) {
            return res.status(404).send("Quiz not found");
        }
        res.json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving quiz");
    }
}

const getQuizQuestions = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    try {
        const questions = await Quiz.getQuizQuestions(quizId);
        if (!questions) {
            return res.status(404).send("No questions found for this quiz");
        }
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving questions");
    }
}

const submitQuizAnswers = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    const answers = req.body.answers;
    try {
        const result = await Quiz.submitQuizAnswers(quizId, answers);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting quiz answers");
    }
}

module.exports = {
    getAllQuizzes,
    getQuizById,
    getQuizQuestions,
    submitQuizAnswers
};
