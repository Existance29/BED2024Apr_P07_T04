## Project Setup

### Installing node modules
1. cd into the src directory
2. run ``npm install``

### Database configuration

src/database/dbConfig.js
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
create a database named "bed-assg-1"
You can change the user and password fields to your own login info

### Seeding the database
run ``npm run seed``
You can also rerun this command to reset the database to its seeded form
The sql to seed the database can be found in src/database/seedScript.js

### Starting server
``npm start`` (for nodemon)
or
``node app.js``
