const Joi = require("joi")
const User = require("../models/user")

// Custom validation to make sure email is not taken
const uniqueEmail = async (email, helper) =>{
  //search user from database that matches email
  const result = (await User.query("SELECT * FROM Users WHERE email = @email", {"email": email})).recordset
  //if result exists, then email is taken
  if (result.length){
    return helper.message('this email is already taken') 
  }

  return email
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
  });

  //validate 
  try{
    await schema.validateAsync(req.body, { abortEarly: false })
  }catch(err){
    //get the field and the error message
    const errors = err.details.map((error) => [error.path[0], error.message])
    res.status(400).json({ message: "Validation error", errors })
    return
  }

  //validation successful
  next()
};

module.exports = validateUser