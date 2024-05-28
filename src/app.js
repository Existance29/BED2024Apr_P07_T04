//import
const express = require("express");
const app = express()
const port = process.env.PORT || 3000
const dbConfig = require("./database/dbConfig")
const sql = require("mssql")
const route = require("./routes/routes")
const bodyParser = require("body-parser")

//load frontend
const staticMiddleware = express.static("public")
app.use(staticMiddleware)

//use bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//setup routes
route(app)

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