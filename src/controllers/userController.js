const User = require("../models/user")

const getAllUsers = async (req, res) => {
  try {
    const user = await User.getAllUsers()
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error retrieving users")
  }
}

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await User.getUserById(id)
    if (!user) {
      return res.status(404).send("User not found")
    }
    res.json(user);
  } catch (error) {
    console.error(error)
    res.status(500).send("Error retrieving users")
  }
}

const getUserByLogin = async (req, res) => {
  const email = req.params.email
  const password = req.params.password
  try {
    const user = await User.getUserByLogin(email, password)
    if (!user) {
      return res.status(404).send("Incorrect login details")
    }
    res.json(user);
  } catch (error) {
    console.error(error)
    res.status(500).send("Error logging in")
  }
}

const createUser = async (req, res) => {
  const newUser = req.body;
  try {
    const createdUser = await User.createUser(newUser)
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user")
  }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByLogin,
    createUser,

};