const User = require("../models/user")
const bcrypt = require('bcryptjs')

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

module.exports = {registerUser,loginUser}
