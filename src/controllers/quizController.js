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
    const quizId = req.params.quizId;
    try {
        const questions = await Quiz.getQuizQuestions(quizId);
        res.json(questions);
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        res.status(500).send("Error fetching quiz questions");
    }
};

const submitQuizAnswers = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    const { userId, answers, duration } = req.body;  // Ensure userId is included in the request body
    try {
        const result = await Quiz.submitQuizAnswers(quizId, userId, answers, duration);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting quiz answers");
    }
}


const getQuizResult = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    const resultId = parseInt(req.params.resultId);
    const userId = parseInt(req.query.userId);  // Assuming userId is passed as a query parameter

    try {
        const result = await Quiz.getQuizResult(quizId, resultId, userId);
        res.json(result);
    } catch (error) {
        console.error(`Error fetching quiz result for quizId ${quizId} and resultId ${resultId}:`, error);
        res.status(500).send("Error fetching quiz result");
    }
}



const canAttemptQuiz = async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    const userId = parseInt(req.params.userId);

    try {
        const { canAttempt, attempts, maxAttempts } = await Quiz.canAttemptQuiz(quizId, userId);
        res.json({ canAttempt, attempts, maxAttempts });
    } catch (error) {
        console.error('Error checking quiz attempt eligibility:', error);
        res.status(500).send("Error checking quiz attempt eligibility");
    }
};


const getUserQuizResults = async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
        const results = await Quiz.getUserQuizResults(userId);
        res.json(results);
    } catch (error) {
        console.error('Error fetching user quiz results:', error);
        res.status(500).send("Error fetching user quiz results");
    }
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    getQuizQuestions,
    submitQuizAnswers,
    getQuizResult,
    canAttemptQuiz,
    getUserQuizResults 
};
