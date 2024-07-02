const usersController = require("../controllers/userController");
const validateUser = require("../middlewares/validateUser");
const authenticateToken = require("../middlewares/authenticateToken")

// Create routes
const userRoute = (app, upload) => {
    //for routes using authenticateToken middleware, they are meant to only be accessed by the user
    //the user id will be extracted from the authenticate middleware, no need for params
    app.post("/users", validateUser.validateUser, usersController.createUser) //register/sign up user
    app.post("/users/sublecture/:lid", authenticateToken,usersController.addSubLecture) //user has viewed sublecture
    app.post("/users/login", usersController.loginUser) //login
    app.get("/users", usersController.getAllUsers) //get all users. Mostly useful for testing
    app.get("/users/private", authenticateToken, usersController.getPrivateUserById) //get the user's data by id but also includes email
    app.get("/users/verifyjwt", authenticateToken, usersController.verifyUserToken) //this route is for verifying that the jwt token is valid
    app.get("/users/:id", usersController.getUserById) //get the user's data. Publicly available. No sensitive data like password or email
    app.get("/users/pic/:id", usersController.getProfilePictureByID) //get the user's profile picture, publicly available
    app.get("/users/complete/:id", usersController.getCompleteUserByID) //get the overall stats for a user. Besides the usual user table, get their quiz stats and courses completed
    app.get("/users/courses/sublectures/:uid/:cid", usersController.getViewedSubLecturesByCourse) //the user's viewed sublectures of a specific course. Public
    app.put("/users/pic", authenticateToken, upload.single('pic'), usersController.updateProfilePic) // Update profile picture. using multer for uploading profile pictures
    app.put("/users", validateUser.validateUpdate,  authenticateToken, usersController.updateUser) //update data in the user table
    app.put("/users/password", validateUser.validateNewPassword, authenticateToken, usersController.updatePassword) //update passwords
};

module.exports = userRoute;
