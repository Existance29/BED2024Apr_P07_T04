//import routes
const courseRoute = require("./courseRoute.js")
const userRoute = require("./userRoute.js")

const route = (app) =>{
    userRoute(app);
    courseRoute(app);
}

module.exports = route