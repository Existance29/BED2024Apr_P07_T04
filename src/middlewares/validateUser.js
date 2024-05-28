const Joi = require("joi")

const validateUser = (req, res, next) => {
  //create schema to validate user object
  const schema = Joi.object({
    firstName: Joi.string().min(1).max(40).required(),
    lastName: Joi.string().min(1).max(40).required(),
    email: Joi.string().min(3).max(50).required().email(),
    password: Joi.string().min(5).max(100).required(),
    aboutMe: Joi.string().min(5).max(250).required(),
    country: Joi.string().max(100).required()
  });

  //validate 
  const validation = schema.validate(req.body, { abortEarly: false })

  //detect errors and send it in the response body
  if (validation.error) {
    //get the field and the error message
    const errors = validation.error.details.map((error) => [error.path[0], error.message])
    res.status(400).json({ message: "Validation error", errors })
    return
  }

  //validation successful
  next()
};

module.exports = validateUser