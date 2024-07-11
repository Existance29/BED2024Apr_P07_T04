const swaggerAutogen = require("swagger-autogen")();
<<<<<<< HEAD

=======
>>>>>>> c02ef7e5f23e1d3848eed0ef8052aa7b947b545f
const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
<<<<<<< HEAD

    
  info: {
    title: "My API",
    description: "Description of your API",
=======
  info: {
    title: "Polytechnic Library API",
    description: "API for the polytechnic's library system",
>>>>>>> c02ef7e5f23e1d3848eed0ef8052aa7b947b545f
  },
  host: "localhost:3000", // Replace with your actual host if needed
};

<<<<<<< HEAD
swaggerAutogen(outputFile, routes, doc);
=======
swaggerAutogen(outputFile, routes, doc);
>>>>>>> c02ef7e5f23e1d3848eed0ef8052aa7b947b545f
