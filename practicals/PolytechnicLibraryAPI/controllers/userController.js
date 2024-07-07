const User = require("../models/user")
const bcrypt = require('bcryptjs')
require("dotenv").config()
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
  const {username, password, role} = req.body
  try {
    //check if user with the username exists
    //return the error message in the same format as the one in validateSchema
    if (await User.getUserByUsername(username)) return res.status(400).send({message: "Validation error", "errors": [["username","\"username\" is taken"]]})
    //hash the password and replace the password field with the new hashed password
    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)
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
  const { username, password } = req.body;

  try {
    // Validate user credentials
    
    if (!await getUserByUsername(username)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    if (!await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600s" }); // Expires in 1 hour

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {registerUser,loginUser}
