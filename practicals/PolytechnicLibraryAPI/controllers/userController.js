const User = require("../models/user")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
require("dotenv").config()

const generateAccessToken = (user) => {
    //make a jsonwetoken containing the user's id and role
    const accessToken = jwt.sign({userId: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET)
    return {accessToken: accessToken}
}

const registerUser = async (req, res) => {
    const {username, password, role} = req.body
    try {
        //check if user with the username exists
        //return the error message in the same format as the one in validateSchema
        if (await User.getUserByUsername(username)) return res.status(400).send({message: "Validation error", "errors": [["username","\"username\" is taken"]]})
      //hash the password and replace the password field with the new hashed password
      const salt = bcrypt.genSaltSync(10)
      const hashPassword = bcrypt.hashSync(password,salt)
      //user obj to register
      const newUser = {
        username: username,
        passwordHash: hashPassword,
        role: role
      }
      await User.createUser(newUser)

      return res.status(201).json({message: "User successfully registered"})
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" })
    }
  }

const loginUser = async (req, res) => {
    const {username, password} = req.body
    //error message in the same format as the one in validateSchema
    const invalidMessage = {message: "Validation error", "errors": [["username","Username or password is incorrect"],["password","Username or password is incorrect"]]}
    try {
        //check if user with the username exists and get the user
        const user  = await User.getUserByUsername(username)
        if (!user) return res.status(400).json(invalidMessage)
        //verify password
        if (!bcrypt.compareSync(password,user.passwordHash)) return res.status(400).json(invalidMessage)
        
        //vertification successfully, generate jwt token
        
        const accessToken = jwt.sign({id: user.user_id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600s" })
    
        return res.status(201).json({accessToken: accessToken})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
  }

module.exports = {registerUser,loginUser}
