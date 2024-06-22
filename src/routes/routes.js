//import routes
const courseRoute = require("./courseRoute.js");
const lectureRoute = require("./lectureRoute.js");
const userRoute = require("./userRoute.js");
const quizRoute = require("./quizRoute.js");

const route = (app) =>{
    userRoute(app);
    courseRoute(app);
    lectureRoute(app);
    quizRoute(app);
}

module.exports = route