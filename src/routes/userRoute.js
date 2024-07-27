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
    app.get("/users/decodejwt", authenticateToken, usersController.decodeJWT) //this route is for decoding the jwt
    app.get("/users/pic", authenticateToken, usersController.getProfilePictureByJWT) //get the user's own profile picture
    app.get("/users/pic/:id", usersController.getProfilePictureByID) //get the user's profile picture, publicly available
    app.get("/users/complete/:id", usersController.getCompleteUserByID) //get the overall stats for a user. Besides the usual user table, get their quiz stats and courses completed
    app.get("/users/courses/sublectures/:cid", authenticateToken,usersController.getViewedSubLecturesByCourse) //the user's viewed sublectures of a specific course
    app.get("/users/search",usersController.searchUsers) //search for users
    app.get("/users/:id", usersController.getUserById) //get the user's data. Publicly available. No sensitive data like password or email
    app.put("/users/pic", authenticateToken, upload.single('pic'), usersController.updateProfilePic) // Update profile picture. using multer for uploading profile pictures
    app.put("/users", authenticateToken, validateUser.validateUpdate, usersController.updateUser) //update data in the user table
    app.put("/users/password", authenticateToken, validateUser.validateNewPassword, usersController.updatePassword) //update passwords
};

module.exports = userRoute;
