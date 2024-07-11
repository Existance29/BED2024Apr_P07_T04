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

const generateAccessToken = (user) => {
  //make a jsonwetoken containing the user's id and role
  const accessToken = jwt.sign({userId: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET)
  return {accessToken: accessToken}
}

const getAllUsers = async (req, res) => {
  // #swagger.description = 'Returns a list of all users information'
  /* #swagger.responses[200] = {
            description: 'Success, returns a list of user objects.',
            schema: {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                about_me: 'Hi! My name is John Doe',
                country: 'United States',
                join_date: "2022-06-04T00:00:00.000Z",
                job_title: 'UI/UX Designer',
                role: 'student'
            }
    } */
  try {
    const user = await User.getAllUsers()
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error retrieving users")
  }
}

const getUserById = async (req, res) => {
  // #swagger.description = 'Return the information of the user as specified in the id parameter'
  /* #swagger.responses[200] = {
            description: 'Success, returns a user object',
            schema: {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                about_me: 'Hi! My name is John Doe',
                country: 'United States',
                join_date: "2022-06-04T00:00:00.000Z",
                job_title: 'UI/UX Designer',
                role: 'student'
            }
    } */
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
  // #swagger.description = 'Verify that a user\'s login credentials are correct and generate a jwt'
  /* #swagger.responses[200] = {
            description: 'User successfully logged in, returns the user\'s jsonwebtoken.',
            schema: {
                accessToken: 'jwt here'
            }
    } */
  /* #swagger.responses[404] = {
            description: 'Incorrect login credentials',
    } */

  const email = req.body.email
  const password = req.body.password
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
    res.json(generateAccessToken(user));
  } catch (error) {
    console.error(error)
    res.status(500).send("Error logging in")
  }
}

const createUser = async (req, res) => {
  // #swagger.description = 'Create a new user on registration'
  /* #swagger.responses[201] = {
            description: 'User successfully created, returns the user\'s jsonwebtoken.',
            schema: {
                accessToken: 'jwt here'
            }
    } */
  const newUser = req.body;
  try {
    //hash the password and replace the password field with the new hashed password
    newUser.password = hashPassword(newUser.password)
    const createdUser = await User.createUser(newUser)
    //create user successful, display it as json
    res.status(201).json(generateAccessToken(createdUser));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user")
  }
}

const updateProfilePic = async (req, res) => {
  const file = req.file; //file obj from form data
  const id = parseInt(req.userId);
  //verify that a file has been added
  if (!file) {
      return res.status(400).send("No file uploaded");
  }

  try {
      //ensure that user exists
      const user = await User.getUserById(id);
      if (!user) {
          return res.status(404).send("User not found");
      }

      const imageBuffer = fs.readFileSync(file.path, { encoding: 'base64' }); //read the file and convert it to base64

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
  // #swagger.description = 'Update a user\'s data. User id is obtained from jwt'
  /*  #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Format: \'Bearer (jwt)\'',
    } */
  //update the data found in the user table
  const data = req.body
  const id = req.userId
  try {
    const updatedUser = await User.updateUser(id,data)
    res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user")
  }
}

const updatePassword = async (req, res) => {
  //update the user's password
  try {
    const updatedUser = await User.updatePassword(req.userId,hashPassword(req.body.new_password))
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
  // #swagger.description = 'Add a sublecture as viewed by the user. User id is obtained from jwt token'
  /*  #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Format: \'Bearer (jwt)\'',
    } */

  /*  #swagger.parameters['lid'] = {
            in: 'path',
            type: "integer",
            description: 'The id of the sublecture',
    } */
  /* #swagger.responses[201] = {
            description: 'Success, sublecture is marked as viewed.',
    } */
  
  
  try {
    const uid = req.userId
    const lid = parseInt(req.params.lid)
    const user = await User.getUserById(uid)
    //check if user exists
    if (!user) return res.status(404).send("User not found")
    //check if user already viewed lecture
    //we do not want duplicates of a table entry
    //still return status 201 anyways, its still a success
    if (await User.hasViewedSubLecture(uid, lid)) return res.status(201).send("user already viewed sub lecture")
    //user has not viewed lecture, add it
    User.addSubLecture(uid,lid)
    res.status(201).send("success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding viewed sub lecture")
  }
}

const verifyUserToken = async (req, res) => {
  res.status(200).send("token is valid")
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
    getViewedSubLecturesByCourse,
    verifyUserToken
};