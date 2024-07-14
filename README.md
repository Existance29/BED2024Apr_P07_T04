## Project Setup

### Installing node modules
1. cd into the src directory
2. run ``npm install``

### Database configuration

Create src/database/dbConfig.js with the following content: <br />
```js
module.exports = {
    user: "sa", 
    password: "sa", 
    server: "localhost",
    database: "bed-assg-1",
    trustServerCertificate: true,
    options: {
      port: 1433, 
      connectionTimeout: 60000, 
    },
  }
```
You can change the content of the file to match your settings or set up the sql server to match its content

### Database setup
run ``npm run seed`` <br />
You can also rerun this command to reset the database to its seeded form <br />
The sql to seed the database can be found in src/database/seedScript.js <br />

### Starting server
``npm start`` (for nodemon) <br />
or <br />
``node app.js``

## Documentation
The API Documentation can be found at /api-docs
