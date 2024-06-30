const quizController = require('../controllers/quizController');

const quizRoute = (app) => {
    app.get("/quizzes", quizController.getAllQuizzes);
    app.get("/quizzes/:quizId", quizController.getQuizById);
    app.get("/quizzes/:quizId/questions", quizController.getQuizQuestions);
    app.post("/quizzes/:quizId/submit", quizController.submitQuizAnswers);
    app.get("/quizzes/:quizId/results/:resultId", quizController.getQuizResult);
    app.get('/quizzes/attempt/:quizId/:userId', quizController.canAttemptQuiz);
    app.get('/user/:userId/results', quizController.getUserQuizResults); 
}

module.exports = quizRoute;
