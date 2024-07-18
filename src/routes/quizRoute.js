const quizController = require('../controllers/quizController');
const authenticateToken = require('../middlewares/authenticateToken');

const quizRoute = (app) => {
    app.get("/quizzes", quizController.getAllQuizzes);
    app.get("/quizzes/:quizId", quizController.getQuizById);
    app.get("/quizzes/:quizId/questions", quizController.getQuizQuestions);
    app.post("/quizzes/:quizId/submit", authenticateToken, quizController.submitQuizAnswers);
    app.get("/quizzes/:quizId/results/:resultId", authenticateToken, quizController.getQuizResult);
    app.get('/quizzes/attempt/:quizId', authenticateToken, quizController.canAttemptQuiz);
    app.get('/user/results', authenticateToken, quizController.getUserQuizResults);
}

module.exports = quizRoute;
