const express = require("express");
const app = express()
const port = process.env.PORT || 3000

const staticMiddleware = express.static("public")

app.use(staticMiddleware)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })