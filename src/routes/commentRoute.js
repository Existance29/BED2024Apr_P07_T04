// Import controllers
const commentController = require("../controllers/commentController");

// Create routes
const commentRoute = (app) => {
    app.get("/comments", commentController.getAllComments);
    app.get("/comments/:id", commentController.getCommentByID);
    app.post("/comments", commentController.createComment);
    app.put("/comments/:id", commentController.editComment);
    //app.delete("/comments/:id", commentController.deleteComment);
};

module.exports = commentRoute;
