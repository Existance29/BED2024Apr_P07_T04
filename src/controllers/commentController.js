const Comment = require("../models/comment");

const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.getAllComments();
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving comments");
    }
}

const createComment = async (req, res) => {
    const newComment = req.body;
    console.log(newComment)
    try {
        const createdComment = await Comment.createComment(newComment);
        res.status(201).json(createdComment);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating comment");
    }
}

const editComment = async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    try {
        const editedComment = await Comment.updateComment(id, updatedData);
        if (!editedComment) {
            return res.status(404).send("Comment not found");
        }
        res.json(editedComment);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error editing comment");
    }
}

module.exports = {
    createComment,
    getAllComments,
    editComment,
};