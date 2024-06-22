const quizController = require('../controllers/quizController');

const quizRoute = (app) => {
    app.get("/quizzes", quizController.getAllQuizzes);
    app.get("/quizzes/:quizId", quizController.getQuizById);
    app.get("/quizzes/:quizId/questions", quizController.getQuizQuestions);
    app.post("/quizzes/:quizId/submit", quizController.submitQuizAnswers);
}

module.exports = quizRoute;