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
  return {accessToken: accessToken, role: user.role}
}

const getAllUsers = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Get a list of all users information'
  /* #swagger.responses[200] = {
            description: 'Success, returns a list of user objects.',
            schema: [{
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                about_me: 'Hi! My name is John Doe',
                country: 'United States',
                join_date: "2022-06-04T00:00:00.000Z",
                job_title: 'UI/UX Designer',
                role: 'student'
              }]
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
  // #swagger.tags = ['Users']
  // #swagger.description = 'Get the information of the user as specified in the id parameter'
  /*  #swagger.parameters['id'] = {
          in: 'path',
          type: "int",
          description: 'The id of the user',
  } */
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
  // #swagger.tags = ['Users']
  // #swagger.description = 'Retrieve a user\'s information, but contains more sensetive data (such as email). User id obtained from jwt'
  /*  #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Format: \'Bearer (jwt)\'',
    } */
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
  //update the data found in the user table
  const id = parseInt(req.user.userId);
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
  // #swagger.tags = ['Users']
  // #swagger.description = 'Retrieve a user\'s profile information (regular info, profile pic, overall quiz data, completed courses). User id obtained from parameter'
  /*  #swagger.parameters['id'] = {
          in: 'path',
          type: "int",
          description: 'The id of the user',
  } */
  /* #swagger.responses[200] = {
            description: 'Success, returns user data',
            schema: {
                    id: 1,
                    first_name: "Toby",
                    last_name: "Dean",
                    about_me: "Maxing out mastermindz",
                    country: "United States",
                    join_date: "2022-06-04T00:00:00.000Z",
                    job_title: "University Student",
                    role: "student",
                    pic_id: 1,
                    img: "base64-string",
                    quiz_accuracy: 1,
                    questions_completed: 20,
                    completed_courses: [
                        {
                            "course_id": 2,
                            "date_completed": "2024-07-04T00:00:00.000Z"
                        },
                        {
                            "course_id": 8,
                            "date_completed": "2023-10-08T00:00:00.000Z"
                        }
                    ]
  
            }
    } */
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

//to be used by getProfilePictureByID and getProfilePictureByJWT
//accepts a id parameter which is used to get the profile picture
const getProfilePicture = async (req,res,id) => {
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

const searchUsers = async (req,res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Retrieve a list of users that match the query by name or job title'
  /*  #swagger.parameters['q'] = {
          in: 'query',
          type: "int",
          description: 'The search query',
  } */
 /* #swagger.responses[200] = {
            description: 'Success, returns an array of users that match the query',
            schema: [{
                    id: 1,
                    first_name: "Toby",
                    last_name: "Dean",
                    about_me: "Maxing out mastermindz",
                    country: "United States",
                    join_date: "2022-06-04T00:00:00.000Z",
                    job_title: "University Student",
                    role: "student",
                    pic_id: 1,
                    img: "base64-string",
  
                }]
    } */
  const searchTerm = req.query.q
  
    try {    
      //get the users that match the query and return it
      const users = await User.searchUsers(searchTerm);
      res.json(users)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Error searching users" })
    }
}

const getProfilePictureByID = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Get the base64 encoded image of the profile picture of the user as specified in the id parameter'
  /*  #swagger.parameters['id'] = {
          in: 'path',
          type: "int",
          description: 'The id of the user',
  } */
  /* #swagger.responses[200] = {
            description: 'Success, returns the id of the profile picture, the user\'s id and the base64 encoded picture',
            schema: {
                pic_id: 1,
                user_id: 1,
                "img": "base64-string-here"
            }
    } 
      #swagger.responses[404] = {
        description: 'User not found'
        }
    #swagger.responses[500] = {
          description: 'Internal server error'
          }        
    
    */
  const id = parseInt(req.params.id);
  await getProfilePicture(req,res,id)

}

const getProfilePictureByJWT = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Get the base64 encoded image of the profile picture of the user based on the jwt'
  /*  #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Format: \'Bearer (jwt)\'',
    } */
  /* #swagger.responses[200] = {
            description: 'Success, returns the id of the profile picture, the user\'s id and the base64 encoded picture',
            schema: {
                pic_id: 1,
                user_id: 1,
                "img": "base64-string-here"
            }
    } 
    #swagger.responses[404] = {
          description: 'User not found'
    }
    #swagger.responses[500] = {
          description: 'Internal server error'
    }        
    */
  const id = parseInt(req.user.userId);
  await getProfilePicture(req,res,id)
}

//use dependency injection for code testing
const loginUser = async (req, res, next, _generateAccessToken = generateAccessToken) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Verify that a user\'s login credentials are correct and generate a jwt'
  /* #swagger.responses[200] = {
            description: 'User successfully logged in, returns the user\'s jsonwebtoken and role.',
            schema: {
                accessToken: 'jwt here',
                role: 'role'
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
    res.json(_generateAccessToken(user));
  } catch (error) {
    console.error(error)
    res.status(500).send("Error logging in")
  }
}
//use dependency injection for code testing
const createUser = async (req, res, next, _generateAccessToken = generateAccessToken) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Create a new user on registration'
  /* #swagger.responses[201] = {
            description: 'User successfully created, returns the user\'s jsonwebtoken and role.',
            schema: {
                accessToken: 'jwt here',
                role: 'role'
            }
    } */
  const newUser = req.body;
  try {
    //hash the password and replace the password field with the new hashed password
    newUser.password = hashPassword(newUser.password)
    const createdUser = await User.createUser(newUser)
    //create user successful, display it as json
    res.status(201).json(_generateAccessToken(createdUser));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user")
  }
}

const updateProfilePic = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Update a user\'s profile picture. User id is obtained from jwt'
  /* #swagger.responses[400] = {
            description: 'No file uploaded'
    } */
  /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['pic'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'The file object of the profile picture to update',
    } */
  const file = req.file; //file obj from form data
  const id = parseInt(req.user.userId);
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
      //add it to the database
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
  // #swagger.tags = ['Users']
  // #swagger.description = 'Update a user\'s account data. User id is obtained from jwt'
  /*  #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Format: \'Bearer (jwt)\'',
    } */
  //update the data found in the user table
  const data = req.body
  const id = req.user.userId
  try {
    const updatedUser = await User.updateUser(id,data)
    res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user")
  }
}

const updatePassword = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Update a user\'s account data. User id is obtained from jwt'
  /*  #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Format: \'Bearer (jwt)\'',
    } */
  //update the user's password
  try {
    const updatedUser = await User.updatePassword(req.user.userId,hashPassword(req.body.new_password))
    res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user password")
  }
}

const getViewedSubLecturesByCourse = async (req,res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Get all viewed sublectures by a user under a course. User is obtained from jwt'
  
  /*  #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Format: \'Bearer (jwt)\'',
    } */

  /*  #swagger.parameters['cid'] = {
          in: 'path',
          type: "int",
          description: 'The id of the course',
  } */
  /* #swagger.responses[200] = {
            description: 'Success, returns a list of sublecture ids',
    } */
  //retrieve all viewed sublectures by a user under a course
  try {
    const uid = req.user.userId
    const cid = parseInt(req.params.cid)
    const user = await User.getUserById(uid)
    //check if user exists
    if (!user) return res.status(404).send("User not found")
    res.json(await User.getViewedSubLecturesByCourse(uid,cid))
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting viewed sub lectures")
  }
}

const addSubLecture = async (req,res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Add a sublecture as viewed by the user. User id is obtained from jwt token'
  /*  #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Format: \'Bearer (jwt)\'',
    } */

  /*  #swagger.parameters['lid'] = {
            in: 'path',
            type: "int",
            description: 'The id of the sublecture',
    } */
  /* #swagger.responses[201] = {
            description: 'Success, sublecture is marked as viewed.',
    } */
  
  
  try {
    const uid = req.user.userId
    const lid = parseInt(req.params.lid)
    const user = await User.getUserById(uid)
    //check if user exists
    if (!user) return res.status(404).send("User not found")
    //check if user already viewed lecture
    //we do not want duplicates of a table entry
    //still return status 201 anyways, its still a success
    if (await User.hasViewedSubLecture(uid, lid)) return res.status(201).send("user already viewed sub lecture")
    //user has not viewed lecture, add it
    await User.addSubLecture(uid,lid)
    res.status(201).send("success");
  } catch (error) {
    console.error("Error adding viewed sub-lecture:", error);
    res.status(500).send("Error adding viewed sub-lecture");
  }
}


const decodeJWT = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Decode the jwt. Returns the decoded payload if successful'
  /*  #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Format: \'Bearer (jwt)\'',
    } */
  /* #swagger.responses[200] = {
            description: 'Success, token is valid. Returns the payload',
            schema: {
                userId: 1,
                role: 'student'
            }
    } */
  /* #swagger.responses[401] = {
            description: 'Token is not provided',
    } */
  
  /* #swagger.responses[403] = {
            description: 'Token is invalid',
    } */
  console.log(req.user)
  res.status(200).json(req.user)
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
    getProfilePictureByJWT,
    hashPassword,
    addSubLecture,
    getViewedSubLecturesByCourse,
    decodeJWT,
    searchUsers
}