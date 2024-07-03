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

        //check if the user's role matches up with the endpoint
        const role  = user.role
        const route = req.url
        const authorizedRoles = {
            "/books": ["member","librarian"],
            "/books/[0-9]+/availability": ["librarian"]
        }
        //use regex to match route with the key in authorizedRoles and check if the role is valid

        //iterate through authorizedRoles
        for (const [k, v] of Object.entries(authorizedRoles)) {
            const regex = new RegExp(`^${k}$`) //create a regex
            //regex matches with route but role is not authorized - reject
            if (regex.test(route) && !v.includes(role)) return res.sendStatus(403)
        }

        //success
        next()
    })
}

module.exports = authenticateToken