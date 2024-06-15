// Import necessary modules
const sql = require("mssql");
const fs = require("fs");
const path = require("path");
const dbConfig = require("./dbConfig");

// SQL data for seeding the database
const seedSQL = 
`
-- remove all foreign keys
declare @sqlf nvarchar(max) = (
    select 
        'alter table ' + quotename(schema_name(schema_id)) + '.' +
        quotename(object_name(parent_object_id)) +
        ' drop constraint '+quotename(name) + ';'
    from sys.foreign_keys
    for xml path('')
);
exec sp_executesql @sqlf;

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
  country VARCHAR(100) NOT NULL,
);

CREATE TABLE Profile_Pictures (
    id INT PRIMARY KEY IDENTITY,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    img VARBINARY(MAX) NOT NULL
);

CREATE TABLE Courses (
    CourseID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Thumbnail VARBINARY(MAX) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(MAX) NOT NULL,
    TotalRate INT NOT NULL,
    Ratings INT NOT NULL
);
`;

const systemData = [
    {
        "title": "Angular JS",
        "thumbnail": "angular-js.png",
        "description": "A JavaScript-based open-source front-end web framework for developing single-page applications.",
        "category": "commercial, office, shop, educate, acedemy, single family home, studio, university",
        "totalRate": 2000,
        "ratings": 500,
    },
    {
        "title": "AWS",
        "thumbnail": "aws.png",
        "description": "AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.",
        "category": "commercial, office, shop, educate, acedemy, single family home, studio, university",
        "totalRate": 1200,
        "ratings": 500,
    },
    {
        "title": "Vue JS",
        "thumbnail": "vue-js.png",
        "description": "An open-source model-view–viewmodel front end JavaScript framework for building user interfaces & single-page applications.",
        "category": "commercial, office, shop, educate, acedemy, single family home, studio, university",
        "totalRate": 1000,
        "ratings": 500,
    },
    {
        "title": "Python",
        "thumbnail": "python.png",
        "description": "Python is an interpreted high-level general-purpose programming language.",
        "category": "commercial, office, shop, educate, acedemy, single family home, studio, university",
        "totalRate": 400,
        "ratings": 200,
    },
    {
        "title": "React JS",
        "thumbnail": "react-js.png",
        "description": "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components.",
        "category": "commercial, office, shop, educate, acedemy, single family home, studio, university",
        "totalRate": 3000,
        "ratings": 5000,
    },
    {
        "title": "Software Testing",
        "thumbnail": "software-testing.png",
        "description": "The process of evaluating and verifying that a software product or application does what it is supposed to do.",
        "category": "commercial, office, shop, educate, acedemy, single family home, studio, university",
        "totalRate": 6000,
        "ratings": 2000,
    },
    {
        "title": "Core UI",
        "thumbnail": "core-ui.png",
        "description": "Learn the fastest way to build a modern dashboard for any platforms, browser, or device.",
        "category": "commercial, office, shop, educate, acedemy, single family home, studio, university",
        "totalRate": 6000,
        "ratings": 3000,
    },
    {
        "title": "Power BI",
        "thumbnail": "power-bi.png",
        "description": "An interactive data visualization software developed by Microsoft with primary focus on business intelligence.",
        "category": "commercial, office, shop, educate, acedemy, single family home, studio, university",
        "totalRate": 8000,
        "ratings": 7000,
    },
];

async function insertCourses(connection) {
    for (const course of systemData) {
        // Read the image file
        const imagePath = path.join(__dirname, '..', 'public', 'assets', 'courses', 'topic-thumbnail', course.thumbnail);
        const imageBuffer = fs.readFileSync(imagePath);

        // Insert the course data into the database
        await connection.request()
            .input('Title', sql.NVarChar, course.title)
            .input('Thumbnail', sql.VarBinary, imageBuffer)
            .input('Description', sql.NVarChar, course.description)
            .input('Category', sql.NVarChar, course.category)
            .input('TotalRate', sql.Int, course.totalRate)
            .input('Ratings', sql.Int, course.ratings)
            .query(`
                INSERT INTO Courses (Title, Thumbnail, Description, Category, TotalRate, Ratings)
                VALUES (@Title, @Thumbnail, @Description, @Category, @TotalRate, @Ratings)
            `);
    }
}

// Load the SQL and run the seed process
async function run() {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const connection = await sql.connect(dbConfig);
        const request = connection.request();
        const result = await request.query(seedSQL);
        console.log(result);

        // Insert course data
        await insertCourses(connection);

        connection.close();
    } catch (err) {
        console.log(err);
    }
}

run();
console.log("Seeding completed");
