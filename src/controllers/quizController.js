const Quiz = require("../models/quiz");

const getAllQuizzes = async (req, res) => {
    // #swagger.tags = ['Quizzes']
    // #swagger.description = 'Get a list of all quizzes'
    /* #swagger.responses[200] = {
                description: 'Success, returns an array of all quiz objects.',
                schema: [{
                    id: 1,
                    title: "Angular JS Basics",
                    description: "Test your knowledge on the basics of Angular JS.",
                    totalQuestions: 5,
                    totalMarks: 50,
                    duration: 1,
                    maxAttempts: 2
                }]
        } */
    try {
        const quizzes = await Quiz.getAllQuizzes();
        res.json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving quizzes");
    }
}

const getQuizById = async (req, res) => {
    // #swagger.tags = ['Quizzes']
    // #swagger.description = 'Get a quiz by its id'
    /*  #swagger.parameters['quizId'] = {
          in: 'path',
          type: "int",
          description: 'The id of the quiz',
    } */
   /* #swagger.responses[200] = {
                description: 'Success, returns the quiz object',
                schema: {
                    id: 1,
                    title: "Angular JS Basics",
                    description: "Test your knowledge on the basics of Angular JS.",
                    totalQuestions: 5,
                    totalMarks: 50,
                    duration: 1,
                    maxAttempts: 2
                }
        } */
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
    // #swagger.tags = ['Quizzes']
    // #swagger.description = 'Get a list of all questions associated to a quiz'
    /*  #swagger.parameters['quizId'] = {
          in: 'path',
          type: "int",
          description: 'The id of the quiz',
    } */
    /* #swagger.responses[200] = {
                description: 'Success, returns an array of all quiz questions.',
                schema: [{
                    id: 1,
                    quizId: 1,
                    text: "What is Angular JS?",
                    options: [
                        "A framework",
                        "A library",
                        "A language",
                        "An IDE"
                    ],
                    correctAnswer: 0
                }]
        } */
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
