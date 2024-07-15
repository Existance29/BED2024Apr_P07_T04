const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'ITMastermindz API',
    description: 'API documentation for ITMastermindz, a platform for IT-related online courses'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['../routes/userRoute.js','../routes/courseRoute','../routes/lectureRoute'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);