// Import controllers
const commentController = require("../controllers/commentController");

// Create routes
const commentRoute = (app) => {
    app.post("/comments", commentController.createComment);
    app.get("/comments", commentController.getAllComments);
    app.put("/comments/:id", commentController.editComment);
};

module.exports = commentRoute;
