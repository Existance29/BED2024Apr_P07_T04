//import middlewares and controllers
const usersController = require("../controllers/userController")
const validateUser = require("../middlewares/validateUser")

//create routes
const userRoute = (app) =>{
    app.post("/users", validateUser.validateUser, usersController.createUser)
    app.get("/users", usersController.getAllUsers)
    app.get("/users/:id", usersController.getUserById)
    app.get("/users/complete/:id", usersController.getCompleteUserByID)
    app.get("/users/login/:email/:password", usersController.getUserByLogin)
    app.put("/users/update/pic/:id",usersController.updateProfilePic)
    app.put("/users/update", validateUser.validateUpdate,usersController.updateUser)
}

module.exports = userRoute