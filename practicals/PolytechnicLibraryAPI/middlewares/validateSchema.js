const Joi = require("joi")

//function to validate the schema. Return error code 400 and false if fails, else true
const validateSchema = async (req,res,schema) =>{
  //validate 
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
const validateRegistration = async (req, res, next) => {
  //create schema to validate user object
  const schema = Joi.object({
    username: Joi.string().max(255).required(), //required, max 255 chars
    password: Joi.string().max(100).required(), //required, max 100 chars
    role: Joi.string().required().valid("member","librarian") //required, must be student/librarian
  })
  //check if validation successful
  if (await validateSchema(req,res,schema)) next()
};


//validate the user input when creating account
const validateLogin = async (req, res, next) => {
  //create schema to validate user object
  const schema = Joi.object({
    username: Joi.string().max(255).required(), //required, max 255 chars
    password: Joi.string().max(100).required(), //required, max 100 chars
  })
  //check if validation successful
  if (await validateSchema(req,res,schema)) next()
};

module.exports = {
  validateRegistration,
  validateLogin,
}