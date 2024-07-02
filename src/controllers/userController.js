const User = require("../models/user")
const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require("jsonwebtoken")
require("dotenv").config()


//use bcrypt to hash a password and return it
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password,salt)
}

const generateAccessToken = (userID) => {
  const accessToken = jwt.sign({userId: userID}, process.env.ACCESS_TOKEN_SECRET)
  return {accessToken: accessToken}
}

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

const getPrivateUserById = async (req, res) => {
  const id = parseInt(req.userId);
  try {
    const user = await User.getPrivateUserById(id)
    if (!user) {
      return res.status(404).send("User not found")
    }
    res.json(user);
  } catch (error) {
    console.error(error)
    res.status(500).send("Error retrieving users")
  }
}

const getCompleteUserByID = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await User.getCompleteUserByID(id)
    if (!user) {
      return res.status(404).send("User not found")
    }
    res.json(user);
  } catch (error) {
    console.error(error)
    res.status(500).send("Error retrieving users")
  }
}

const getProfilePictureByID = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const pic = await User.getProfilePic(id)
    if (!pic) {
      return res.status(404).send("User not found")
    }
    res.json(pic);
  } catch (error) {
    console.error(error)
    res.status(500).send("Error retrieving profile picture of user")
  }
}

const loginUser = async (req, res) => {
  const email = req.params.email
  const password = req.params.password
  try {
    //check if email exists
    const user = await User.getUserByEmail(email)
    if (!user) {
      return res.status(404).send("Incorrect login details")
    }
    //verify password
    if (!bcrypt.compareSync(password,user.password)){
      return res.status(404).send("Incorrect login details")
    }
    
    //generate jwt token
    res.json(generateAccessToken(user.id));
  } catch (error) {
    console.error(error)
    res.status(500).send("Error logging in")
  }
}

const createUser = async (req, res) => {
  const newUser = req.body;
  try {
    //hash the password and replace the password field with the new hashed password
    newUser.password = hashPassword(newUser.password)
    const createdUser = await User.createUser(newUser)
    //create user successful, display it as json
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user")
  }
}

const updateProfilePic = async (req, res) => {
  const file = req.file;
  const id = parseInt(req.params.id);

  if (!file) {
      return res.status(400).send("No file uploaded");
  }

  try {
      const user = await User.getUserById(id);
      if (!user) {
          return res.status(404).send("User not found");
      }

      const imageBuffer = fs.readFileSync(file.path, { encoding: 'base64' });

      await User.updateProfilePic(id, imageBuffer);

      // Clean up uploaded file
      fs.unlinkSync(file.path);

      res.status(201).send("Profile picture updated successfully");
  } catch (error) {
      console.error(error);
      res.status(500).send("Error updating profile picture");
  }
};

const updateUser = async (req, res) => {
  const data = req.body;
  try {
    const updatedUser = await User.updateUser(data)
    res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user")
  }
}

const updatePassword = async (req, res) => {
  try {
    
    const updatedUser = await User.updatePassword(req.params.id,hashPassword(req.body.new_password))
    res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user password")
  }
}

const getViewedSubLecturesByCourse = async (req,res) => {
  //retrieved all viewed sublectures by a user under a course
  try {
    const uid = parseInt(req.params.uid)
    const cid = parseInt(req.params.cid)
    const user = await User.getUserById(uid)
    //check if user exists
    if (!user) return res.status(404).send("User not found")
    const result = User.getViewedSubLecturesByCourse(uid,cid)
    res.status(201).json(await User.getViewedSubLecturesByCourse(uid,cid))
  } catch (error) {
    console.error(error);
    res.status(500).send("Error checking if viewed sub lecture")
  }
}

const addSubLecture = async (req,res) => {
  try {
    const uid = parseInt(req.params.uid)
    const lid = parseInt(req.params.lid)
    const user = await User.getUserById(uid)
    //check if user exists
    if (!user) return res.status(404).send("User not found")
    //check if user already viewed lecture
    if (await User.hasViewedSubLecture(uid, lid)) return res.status(201).send("user already viewed sub lecture")
    User.addSubLecture(uid,lid)
    res.status(201).send("success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding viewed sub lecture")
  }
}

module.exports = {
    getAllUsers,
    getUserById,
    getPrivateUserById,
    loginUser,
    createUser,
    updateProfilePic,
    getCompleteUserByID,
    updateUser,
    updatePassword,
    getProfilePictureByID,
    hashPassword,
    addSubLecture,
    getViewedSubLecturesByCourse
};