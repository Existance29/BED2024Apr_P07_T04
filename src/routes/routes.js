const userRoute = require("./userRoute.js");
const courseRoute = require("./courseRoute.js");
const lectureRoute = require("./lectureRoute.js");
const quizRoute = require("./quizRoute.js");

const route = (app, upload) => {
    userRoute(app, upload);
    courseRoute(app, upload);
    lectureRoute(app, upload);
    quizRoute(app, upload);
};

module.exports = route;
