//import routes
const userRoute = require("./userRoute.js")

const route = (app) =>{
    userRoute(app)
}

module.exports = route