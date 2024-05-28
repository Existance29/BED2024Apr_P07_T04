//import 
const sql = require("mssql");
const dbConfig = require("./dbConfig");
//sql data
const seedSQL = 
`
-- remove all foreign keys
EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"

-- drop all tables
DECLARE @sql NVARCHAR(max)=''

SELECT @sql += ' Drop table ' + QUOTENAME(TABLE_SCHEMA) + '.'+ QUOTENAME(TABLE_NAME) + '; '
FROM   INFORMATION_SCHEMA.TABLES
WHERE  TABLE_TYPE = 'BASE TABLE'

Exec Sp_executesql @sql

-- start seeding the database
CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY,
  first_name VARCHAR(40) NOT NULL,
  last_name VARCHAR(40) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  about_me VARCHAR(250) NOT NULL,
  country VARCHAR(100) NOT NULL
)
`

//load the sql
async function run(){
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const connection = await sql.connect(dbConfig)
        const request = connection.request()
        const result = await request.query(seedSQL)
        console.log(result)
        connection.close()
    } catch (err) {
        console.log(err)
    }
}
run()
console.log("Seeding completed")
