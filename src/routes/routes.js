//import routes
const courseRoute = require("./courseRoute.js");
const lectureRoute = require("./lectureRoute.js");
const userRoute = require("./userRoute.js")

const route = (app) =>{
    userRoute(app);
    courseRoute(app);
    lectureRoute(app);
}

module.exports = route