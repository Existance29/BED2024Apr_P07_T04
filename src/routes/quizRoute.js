const quizController = require('../controllers/quizController');
const authenticateToken = require('../middlewares/authenticateToken');

const quizRoute = (app) => {
    app.post("/quizzes", authenticateToken, quizController.createQuiz);
    app.post("/quizzes/:quizId/questions", authenticateToken, quizController.createQuizQuestion);
    app.get("/quizzes", quizController.getAllQuizzes);
    app.get("/quizzes/:quizId", quizController.getQuizById);
    app.get("/quizzes/:quizId/questions", quizController.getQuizQuestions);
    app.post("/quizzes/:quizId/submit", authenticateToken, quizController.submitQuizAnswers);
    app.get("/quizzes/:quizId/results/:resultId", authenticateToken, quizController.getQuizResult);
    app.get('/quizzes/attempt/:quizId', authenticateToken, quizController.canAttemptQuiz);
    app.get('/user/results', authenticateToken, quizController.getUserQuizResults);
    app.delete("/quizzes/:id", authenticateToken, quizController.deleteQuiz);
}

module.exports = quizRoute;
