const jwt = require("jsonwebtoken")
require("dotenv").config()

const authenticateToken = (req,res,next) => {
    //the token is passed via a header in this format:
    //key: authorization
    //value: Bearer {token-here}

    //get token and check if its valid
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    //check if token exists
    if (token == null) return res.sendStatus(401) //unauthorised
    //verify token
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if (err) return res.sendStatus(403) //forbidden
        //success, pass the info to the req
        req.role = user.role
        req.id = user.id
        next()
    })
}

module.exports = authenticateToken