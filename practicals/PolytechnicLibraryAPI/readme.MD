## Project Setup

### Installing node modules
1. cd into practicals/PolyTechnicLibraryAPI
2. run ``npm install``

### Database setup
1. navigate to practicals/PolyTechnicLibraryAPI/seed.sql
2. run the contents of the sql file 

### Database configuration

Create practicals/PolyTechnicLibraryAPI/dbConfig.js with the following content: <br />
```js
module.exports = {
    user: "sa", //your username here
    password: "sa", //your password
    server: "localhost",
    database: "bed-assg-1", //your database name
    trustServerCertificate: true,
    options: {
      port: 1433, 
      connectionTimeout: 60000, 
    },
  }
```
You can change the content of the file to match your settings or set up the sql server to match its content


### Starting server
``npm start`` (for nodemon) <br />
or <br />
``node app.js``
