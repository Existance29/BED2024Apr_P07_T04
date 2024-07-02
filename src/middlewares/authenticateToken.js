const jwt = require("jsonwebtoken")
require("dotenv").config()

const authenticateToken = (req,res,next) => {
    //get token and check if its valid
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)
    //verify token
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if (err) return res.sendStatus(403)
        req.userId = user.userId
        req.userRole = user.userRole
        next()
    })
}

module.exports = authenticateToken