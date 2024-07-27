const Joi = require("joi")
const User = require("../models/user")
const bcrypt = require('bcryptjs');

//this is used for input validation

// Custom validation to make sure email is not taken
const uniqueEmail = async (email, helper) =>{
  //search user from database that matches email
  const result = await User.getUserByEmail(email)
  //if result exists, then email is taken
  if (result){
    return helper.message('this email is already taken') 
  }

  return email
}

// Custom validation to make sure email is not taken
//unlike uniqueEmail, it excludes the already existing email 
const uniqueUpdateEmail = async (id,email, helper) =>{
  //search user from database that matches input email, but exclude the user's
  const result = (await User.query("SELECT * FROM Users WHERE email = @email AND id != @id", {"email": email, "id":id})).recordset
  
  //if result exists, then email is taken
  if (result.length){
    return helper.message('this email is already taken') 
  }

  return email
}

//function to validate the schema. Return error code 400 and false if fails, else true
const validateSchema = async (req,res,schema) =>{
  //validate 
  //abort early set to false since we want to get all validation errors
  try{
    await schema.validateAsync(req.body, { abortEarly: false })
  }catch(err){
    //get the field and the error message
    const errors = err.details.map((error) => [error.path[0], error.message])
    res.status(400).json({ message: "Validation error", errors }) //add the validation errors to the json
    return false
  }
  return true
}

//validate the user input when creating account
const validateUser = async (req, res, next) => {
  //create schema to validate user object

  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Sample schema to add new user',
            schema: {
                $first_name: 'John',
                $last_name: 'Doe',
                $email: 'JohnDoe@hotmail.com',
                $password: 'password123',
                about_me: '',
                $country: 'United States',
                $job_title: 'UI/UX Designer',
                $role: 'student'
            }
    } */

  const schema = Joi.object({
    first_name: Joi.string().min(1).max(40).required(), //no blanks, max 40 chars
    last_name: Joi.string().min(1).max(40).required(), //no blanks, max 40 chars
    email: Joi.string().min(3).max(50).required().email().external(uniqueEmail), //must be valid email + not taken
    password: Joi.string().min(5).max(100).required(), //min 5 chars, max 100
    about_me: Joi.string().max(250).required().allow(''), //can be blank, max 250 chars
    country: Joi.string().max(100).required(),
    job_title: Joi.string().max(100).required().allow(''), //max 100 chars, can be blank
    role: Joi.string().required().valid("student","lecturer") //either student or lecturer
  })
  //check if validation successful
  if (await validateSchema(req,res,schema)) next()
};

//validate the user's update data. Similar to validateUser, but dont validate password and also slightly different unqiue email validation
const validateUpdate = async (req,res,next) => {
  
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Sample schema to update user',
            schema: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'John@gmail.com',
                about_me: 'Maxing out mastermindz',
                country: 'United States',
                job_title: 'UI/UX Designer'
            }
    } */


  const schema = Joi.object({
    first_name: Joi.string().min(1).max(40).required(),
    last_name: Joi.string().min(1).max(40).required(),
    email: Joi.string().min(3).max(50).required().email().external((value,helper) => uniqueUpdateEmail(req.user.userId,value,helper)),
    about_me: Joi.string().max(250).required().allow(''),
    country: Joi.string().max(100).required(),
    job_title: Joi.string().max(100).required().allow('')
  })
   //check if validation successful
   if (await validateSchema(req,res,schema)) next()
}

//validate if the current password entered by the user matches their password in the database
const isPasswordCorrect = async (id,password,helper) => {
  const user = await User.getUserById(id)
  //if result exists, then password is valid
  if (user == null){
    return helper.message('could not find user') //this in theory should never trigger, but a fail safe is nice
  }
  //check if password is valid
  if (!bcrypt.compareSync(password,user.password)){
    return helper.message("password is incorrect")
  }
  return password
}

const validateNewPassword = async (req,res,next) => {

  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Sample schema to update user password',
            schema: {
                $current_password: 'password123',
                $new_password: 'moreSecurePass11a%^',
                $repeat_new_password: 'thisPassDoesntMatch',
            }
    } */

  const schema = Joi.object({
    current_password: Joi.string().required().external((value,helper) => isPasswordCorrect(req.params.id,value,helper)), //make sure current password is correct
    new_password: Joi.string().min(5).max(100).required(), //ensure new password matches the basic password req (min 5 chars)
    //check that repeat new password matches with the new password
    repeat_new_password: Joi.string().required().external((value,helper) => (req.body.new_password == value)? value : helper.message('password does not match the new password')),
  })
   //check if validation successful
   if (await validateSchema(req,res,schema)) next()
}

module.exports = {
  validateUser,
  validateUpdate,
  validateNewPassword
}