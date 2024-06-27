const Joi = require("joi")
const User = require("../models/user")
const bcrypt = require('bcryptjs');

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

// Custom validation to make sure email is not taken, exclude the already existing email
const uniqueUpdateEmail = async (id,email, helper) =>{
  //search user from database that matches input email, but exclude the user
  const result = (await User.query("SELECT * FROM Users WHERE email = @email AND id != @id", {"email": email, "id":id})).recordset
  
  //if result exists, then email is taken
  if (result.length){
    return helper.message('this email is already taken') 
  }

  return email
}

const validateSchema = async (req,res,schema) =>{
  //validate 
  try{
    await schema.validateAsync(req.body, { abortEarly: false })
  }catch(err){
    console.log(err)
    //get the field and the error message
    const errors = err.details.map((error) => [error.path[0], error.message])
    res.status(400).json({ message: "Validation error", errors })
    return false
  }
  return true
}

const validateUser = async (req, res, next) => {
  //create schema to validate user object
  const schema = Joi.object({
    first_name: Joi.string().min(1).max(40).required(),
    last_name: Joi.string().min(1).max(40).required(),
    email: Joi.string().min(3).max(50).required().email().external(uniqueEmail),
    password: Joi.string().min(5).max(100).required(),
    about_me: Joi.string().max(250).required().allow(''),
    country: Joi.string().max(100).required()
  })
  //check if validation successful
  if (await validateSchema(req,res,schema)) next()
};

const validateUpdate = async (req,res,next) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    first_name: Joi.string().min(1).max(40).required(),
    last_name: Joi.string().min(1).max(40).required(),
    email: Joi.string().min(3).max(50).required().email().external((value,helper) => uniqueUpdateEmail(req.body.id,value,helper)),
    about_me: Joi.string().max(250).required().allow(''),
    country: Joi.string().max(100).required()
  })
   //check if validation successful
   if (await validateSchema(req,res,schema)) next()
}

const isPasswordCorrect = async (id,password,helper) => {
  const user = await User.getUserById(id)
  //if result exists, then password is valid
  if (user == null){
    return helper.message('could not find user') //this in theory should never trigger, but a fail safe is nice
  }
  if (!bcrypt.compareSync(password,user.password)){
    return helper.message("password is incorrect")
  }
  return password
}

const validateNewPassword = async (req,res,next) => {
  const schema = Joi.object({
    current_password: Joi.string().required().external((value,helper) => isPasswordCorrect(req.params.id,value,helper)),
    new_password: Joi.string().min(5).max(100).required(),
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