const usersController = require("../controllers/userController");
const validateUser = require("../middlewares/validateUser");
const authenticateToken = require("../middlewares/authenticateToken")

// Create routes
const userRoute = (app, upload) => {
    app.post("/users", validateUser.validateUser, usersController.createUser)
    app.post("/users/sublecture/:uid/:lid", usersController.addSubLecture)
    app.get("/users", usersController.getAllUsers)
    app.get("/users/private", authenticateToken, usersController.getPrivateUserById)
    app.get("/users/:id", usersController.getUserById)
    app.get("/users/pic/:id", usersController.getProfilePictureByID)
    app.get("/users/complete/:id", usersController.getCompleteUserByID)
    app.get("/users/login/:email/:password", usersController.loginUser)
    app.get("/users/courses/sublectures/:uid/:cid", usersController.getViewedSubLecturesByCourse)
    app.put("/users/pic/:id", upload.single('pic'), usersController.updateProfilePic) // using multer for uploading profile pictures
    app.put("/users", validateUser.validateUpdate, usersController.updateUser)
    app.put("/users/password/:id", validateUser.validateNewPassword, usersController.updatePassword)
};

module.exports = userRoute;
