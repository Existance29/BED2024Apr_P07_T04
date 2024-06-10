// Import controllers
const courseController = require("../controllers/courseController");

// Create routes
const courseRoute = (app) => {
    app.post("/courses", courseController.createCourse);
    app.get("/courses", courseController.getAllCourses);
    app.get("/courses/:id", courseController.getCourseById);
    app.put("/courses/:id", courseController.updateCourse);
    app.delete("/courses/:id", courseController.deleteCourse);
    app.get("/courses/search", courseController.searchCourses);
};

module.exports = courseRoute;
