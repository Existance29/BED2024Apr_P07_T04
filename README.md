## Project Setup

### Installing node modules
1. cd into the src directory
2. run ``npm install``

### Database configuration

src/database/dbConfig.js <br />
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
You can change the details of the file or set up the sql server to match the settings here

### Seeding the database
run ``npm run seed`` <br />
You can also rerun this command to reset the database to its seeded form <br />
The sql to seed the database can be found in src/database/seedScript.js <br />

### Starting server
``npm start`` (for nodemon) <br />
or <br />
``node app.js``
