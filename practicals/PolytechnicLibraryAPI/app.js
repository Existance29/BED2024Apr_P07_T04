const express = require("express");
const app = express()
const port = process.env.PORT || 3000
const dbConfig = require("./dbConfig")
const sql = require("mssql")
const bodyParser = require("body-parser")
const validateSchema = require("./middlewares/validateSchema")
const userController = require("./controllers/userController")
const jwtAuthorization = require('./middleware/authMiddleware');


//use parse middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//routes
app.post("/register",validateSchema.validateRegistration, userController.registerUser);

// librarian
app.put('/books/:bookdId/availability', jwtAuthorization, bookController.updateBookAvailability);

// get all books for both member and librarian
app.get('/books', jwtAuthorization, bookController.getAllBooks);

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig)
    console.log("Connected to database successfully")
  } catch (err) {
    console.error("Database connection error:", err)
    // Terminate app
    process.exit(1)
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is shutting down")
  await sql.close()
  console.log("Database connection closed")
  process.exit(0) 
});