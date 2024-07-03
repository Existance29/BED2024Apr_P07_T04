const express = require("express");
const app = express()
const port = process.env.PORT || 3000
const dbConfig = require("./dbConfig")
const sql = require("mssql")
const bodyParser = require("body-parser")
const validateSchema = require("./middlewares/validateSchema")
const authenticateToken = require("./middlewares/authenticateToken")
const userController = require("./controllers/userController")
const bookController = require("./controllers/bookController")

//use parse middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//routes
app.post("/register",validateSchema.validateRegistration, userController.registerUser)
app.post("/login",validateSchema.validateLogin, userController.loginUser)
app.get("/books", authenticateToken, bookController.getAllBooks)
app.put("/books/:bookId/availability", authenticateToken, bookController.updateBookAvailability)

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