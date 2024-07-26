const quizController = require('../controllers/quizController');
const authenticateToken = require('../middlewares/authenticateToken');

const quizRoute = (app) => {
    app.post("/quizzes", authenticateToken, quizController.createQuiz);
    app.put("/quizzes/:quizId", authenticateToken, quizController.updateQuiz);
    app.put("/quizzes/:quizId/questions", authenticateToken, quizController.updateQuizQuestions);
    app.post("/quizzes/:quizId/questions", authenticateToken, quizController.createQuizQuestion);
    app.get("/quizzes", quizController.getAllQuizzes);
    app.get("/quizzes/:quizId", quizController.getQuizById);
    app.get("/quizzes/:quizId/questions", quizController.getQuizQuestions);
    app.post("/quizzes/:quizId/submit", authenticateToken, quizController.submitQuizAnswers);
    app.get("/quizzes/:quizId/results/:resultId", authenticateToken, quizController.getQuizResult);
    app.get('/quizzes/attempt/:quizId', authenticateToken, quizController.canAttemptQuiz);
    app.get("/quizzes/:quizId/checkAttempts", authenticateToken, quizController.checkQuizAttempts);
    app.get('/user/results', authenticateToken, quizController.getUserQuizResults);
    app.delete("/quizzes/:id", authenticateToken, quizController.deleteQuiz);
    app.get("/api/questions", quizController.getQuizzesAPI);
    app.post("/random-quizzes/submit", authenticateToken, quizController.submitRandomQuiz);
    app.get("/random-quizzes/results", authenticateToken, quizController.getRandomQuizResult);
};

module.exports = quizRoute;
