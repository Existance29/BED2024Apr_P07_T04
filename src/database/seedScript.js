const sql = require("mssql");
const fs = require("fs");
const path = require("path");
const dbConfig = require("./dbConfig");

// SQL data for seeding the database
const seedSQL = `
declare @sql nvarchar(max) = (
    select 
        'alter table ' + quotename(schema_name(schema_id)) + '.' +
        quotename(object_name(parent_object_id)) +
        ' drop constraint '+quotename(name) + ';'
    from sys.foreign_keys
    for xml path('')
);
exec sp_executesql @sql;

-- Drop foreign key constraints
IF OBJECT_ID('FK_CourseLectures_CourseID', 'F') IS NOT NULL
  ALTER TABLE CourseLectures DROP CONSTRAINT FK_CourseLectures_CourseID;
IF OBJECT_ID('FK_CourseLectures_LectureID', 'F') IS NOT NULL
  ALTER TABLE CourseLectures DROP CONSTRAINT FK_CourseLectures_LectureID;
IF OBJECT_ID('FK_UserCourses_UserID', 'F') IS NOT NULL
  ALTER TABLE UserCourses DROP CONSTRAINT FK_UserCourses_UserID;
IF OBJECT_ID('FK_UserCourses_CourseID', 'F') IS NOT NULL
  ALTER TABLE UserCourses DROP CONSTRAINT FK_UserCourses_CourseID;
IF OBJECT_ID('FK_Profile_Pictures_UserID', 'F') IS NOT NULL
  ALTER TABLE Profile_Pictures DROP CONSTRAINT FK_Profile_Pictures_UserID;
IF OBJECT_ID('FK_SubLectures_LectureID', 'F') IS NOT NULL
  ALTER TABLE SubLectures DROP CONSTRAINT FK_SubLectures_LectureID;
IF OBJECT_ID('FK_Answers_QuizID', 'F') IS NOT NULL
  ALTER TABLE Answers DROP CONSTRAINT FK_Answers_QuizID;
IF OBJECT_ID('FK_Answers_QuestionID', 'F') IS NOT NULL
  ALTER TABLE Answers DROP CONSTRAINT FK_Answers_QuestionID;
IF OBJECT_ID('FK_Questions_QuizID', 'F') IS NOT NULL
  ALTER TABLE Questions DROP CONSTRAINT FK_Questions_QuizID;
IF OBJECT_ID('FK_Results_QuizID', 'F') IS NOT NULL
  ALTER TABLE Results DROP CONSTRAINT FK_Results_QuizID;
IF OBJECT_ID('FK_IncorrectQuestions_ResultID', 'F') IS NOT NULL
  ALTER TABLE IncorrectQuestions DROP CONSTRAINT FK_IncorrectQuestions_ResultID;
IF OBJECT_ID('FK_IncorrectQuestions_QuestionID', 'F') IS NOT NULL
  ALTER TABLE IncorrectQuestions DROP CONSTRAINT FK_IncorrectQuestions_QuestionID;
IF OBJECT_ID('FK_UserQuizAttempts_UserID', 'F') IS NOT NULL
  ALTER TABLE UserQuizAttempts DROP CONSTRAINT FK_UserQuizAttempts_UserID;
IF OBJECT_ID('FK_UserQuizAttempts_QuizID', 'F') IS NOT NULL
  ALTER TABLE UserQuizAttempts DROP CONSTRAINT FK_UserQuizAttempts_QuizID;
IF OBJECT_ID('FK_Results_UserID', 'F') IS NOT NULL
  ALTER TABLE Results DROP CONSTRAINT FK_Results_UserID;
IF OBJECT_ID('FK_User_Sub_Lectures_UserID', 'F') IS NOT NULL
  ALTER TABLE Results DROP CONSTRAINT FK_User_Sub_Lectures_UserID;
IF OBJECT_ID('FK_User_Sub_Lectures_SubLectureID', 'F') IS NOT NULL
  ALTER TABLE Results DROP CONSTRAINT FK_User_Sub_Lectures_SubLectureID;

-- Drop all tables if they exist
IF OBJECT_ID('UserCourses', 'U') IS NOT NULL DROP TABLE UserCourses;
IF OBJECT_ID('CourseLectures', 'U') IS NOT NULL DROP TABLE CourseLectures;
IF OBJECT_ID('SubLectures', 'U') IS NOT NULL DROP TABLE SubLectures;
IF OBJECT_ID('Lectures', 'U') IS NOT NULL DROP TABLE Lectures;
IF OBJECT_ID('Courses', 'U') IS NOT NULL DROP TABLE Courses;
IF OBJECT_ID('Profile_Pictures', 'U') IS NOT NULL DROP TABLE Profile_Pictures;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
IF OBJECT_ID('Answers', 'U') IS NOT NULL DROP TABLE Answers;
IF OBJECT_ID('Questions', 'U') IS NOT NULL DROP TABLE Questions;
IF OBJECT_ID('Results', 'U') IS NOT NULL DROP TABLE Results;
IF OBJECT_ID('IncorrectQuestions', 'U') IS NOT NULL DROP TABLE IncorrectQuestions;
IF OBJECT_ID('Quizzes', 'U') IS NOT NULL DROP TABLE Quizzes;
IF OBJECT_ID('Profile_Pictures', 'U') IS NOT NULL DROP TABLE Profile_Pictures;
IF OBJECT_ID('User_Sub_Lectures', 'U') IS NOT NULL DROP TABLE User_Sub_Lectures;
IF OBJECT_ID('UserQuizAttempts', 'U') IS NOT NULL DROP TABLE UserQuizAttempts;
IF OBJECT_ID('User_Completed_Courses', 'U') IS NOT NULL DROP TABLE User_Completed_Courses;
IF OBJECT_ID('Comments', 'U') IS NOT NULL DROP TABLE Comments;

-- Create tables


CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY,
  first_name VARCHAR(40) NOT NULL,
  last_name VARCHAR(40) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  about_me VARCHAR(250) NOT NULL,
  country VARCHAR(100) NOT NULL,
  join_date DATE NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  role VARCHAR(8) NOT NULL
);

CREATE TABLE Profile_Pictures (
    pic_id INT PRIMARY KEY IDENTITY,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    img VARCHAR(MAX) NOT NULL
);

CREATE TABLE Courses (
  CourseID INT PRIMARY KEY IDENTITY(1,1),
  Title NVARCHAR(255) NOT NULL,
  Thumbnail VARBINARY(MAX) NOT NULL,
  Description NVARCHAR(MAX) NOT NULL,
  Details NVARCHAR(MAX) NOT NULL,
  Caption NVARCHAR(MAX) NOT NULL,
  Category NVARCHAR(MAX) NOT NULL,
  TotalRate INT NOT NULL DEFAULT 0,
  Ratings INT NOT NULL DEFAULT 0,
  Video VARBINARY(MAX) NOT NULL
);

CREATE TABLE Lectures (
  LectureID INT PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(255) NOT NULL,
  Description NVARCHAR(MAX) NOT NULL,
  Category NVARCHAR(MAX) NOT NULL,
  Duration INT NOT NULL,
);

CREATE TABLE Comments (
  CommentID INT PRIMARY KEY IDENTITY(1,1),
  Message NVARCHAR(MAX) NOT NULL,
  Category NVARCHAR(MAX) NOT NULL,
  Duration INT NOT NULL,
);

CREATE TABLE SubLectures (
  SubLectureID INT PRIMARY KEY IDENTITY(1,1),
  LectureID INT,
  FOREIGN KEY (LectureID) REFERENCES Lectures(LectureID),
  Name NVARCHAR(255) NOT NULL,
  Description NVARCHAR(MAX) NOT NULL,
  Duration INT NOT NULL,
  Video VARBINARY(MAX) NOT NULL
);

CREATE TABLE User_Sub_Lectures (
  user_id INT NOT NULL,
  sub_lecture_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (sub_lecture_id) REFERENCES SubLectures(SubLectureID)
);

 CREATE TABLE User_Completed_Courses (
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  date_completed DATE,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (course_id) REFERENCES Courses(CourseID)
);

CREATE TABLE CourseLectures (
  id INT PRIMARY KEY IDENTITY(1,1),
  CourseID INT,
  LectureID INT,
  FOREIGN KEY (CourseID) REFERENCES Courses(CourseID),
  FOREIGN KEY (LectureID) REFERENCES Lectures(LectureID)
);

CREATE TABLE Quizzes (
  id INT PRIMARY KEY IDENTITY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  totalQuestions INT NOT NULL,
  totalMarks INT NOT NULL,
  duration INT NOT NULL,
  maxAttempts INT NOT NULL DEFAULT 2
);

CREATE TABLE Questions (
  id INT PRIMARY KEY IDENTITY,
  quizId INT NOT NULL,
  text VARCHAR(500) NOT NULL,
  options NVARCHAR(MAX) NOT NULL,
  correctAnswer INT NOT NULL,
  FOREIGN KEY (quizId) REFERENCES Quizzes(id)
);

CREATE TABLE Answers (
  id INT PRIMARY KEY IDENTITY,
  quizId INT NOT NULL,
  questionId INT NOT NULL,
  answer INT NOT NULL,
  FOREIGN KEY (quizId) REFERENCES Quizzes(id),
  FOREIGN KEY (questionId) REFERENCES Questions(id)
);

CREATE TABLE Results (
  id INT PRIMARY KEY IDENTITY,
  quizId INT NOT NULL,
  userId INT NOT NULL,
  score INT NOT NULL,
  totalQuestions INT NOT NULL,
  correctAnswers INT NOT NULL,
  timeTaken INT NOT NULL,
  totalMarks INT NOT NULL,
  grade VARCHAR(2) NOT NULL,
  FOREIGN KEY (quizId) REFERENCES Quizzes(id),
  FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE IncorrectQuestions (
  id INT PRIMARY KEY IDENTITY,
  resultId INT NOT NULL,
  text NVARCHAR(MAX),
  userAnswer INT,
  correctAnswer INT,
  questionId INT NOT NULL,
  FOREIGN KEY (resultId) REFERENCES Results(id),
  FOREIGN KEY (questionId) REFERENCES Questions(id)
);

CREATE TABLE UserQuizAttempts (
    id INT PRIMARY KEY IDENTITY,
    userId INT NOT NULL,
    quizId INT NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (quizId) REFERENCES Quizzes(id)
);

`;

// Course data with their respective lectures and sub-lectures
const systemData = [
  {
    course: {
      "title": "Angular JS",
      "thumbnail": "angular-js.png",
      "description": "A JavaScript-based open-source front-end web framework for developing single-page applications.",
      "details": "Learn the fundamentals of Angular JS, a powerful JavaScript-based open-source front-end web framework. This course will take you through the essentials of developing single-page applications using Angular's MVC architecture. You will understand the core concepts such as modules, controllers, services, and directives. The course provides a hands-on approach to mastering Angular JS, ensuring you can build dynamic and responsive web applications. \nJoin industry experts as they guide you through practical exercises and real-world scenarios to apply your knowledge. By the end of the course, you will have a solid foundation in Angular JS, enabling you to develop robust applications. Whether you are a beginner or looking to enhance your skills, this course is designed to cater to your needs.",
      "caption": "AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.",
      "category": "front-end,framework",
      "totalRate": 2000,
      "ratings": 500,
      "video": "ads_video.mp4"
    },
    lectures: [
      { 
        "name": "Introduction to Angular", 
        "description": "An introduction to the Angular framework.", 
        "category": "education", 
        "duration": 30, 
        "subLectures": [
          { "name": "Angular Basics", "description": "Learn the basics of Angular.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "Angular Setup", "description": "Setup your Angular environment.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "Angular First App", "description": "Build your first Angular app.", "duration": 10, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Components and Templates", 
        "description": "Learn about components and templates in Angular.", 
        "category": "education", 
        "duration": 45, 
        "subLectures": [
          { "name": "Component Basics", "description": "Understand the basics of components.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Template Syntax", "description": "Learn about template syntax.", "duration": 15, "video": "test.mp4" },
          { "name": "Component Interaction", "description": "Manage interaction between components.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Data Binding", 
        "description": "Understand data binding in Angular.", 
        "category": "education", 
        "duration": 40, 
        "subLectures": [
          { "name": "Binding Basics", "description": "Learn the basics of data binding.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Property Binding", "description": "Understand property binding.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Event Binding", "description": "Handle events with event binding.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Angular Services", 
        "description": "Dive into Angular services.", 
        "category": "education", 
        "duration": 35, 
        "subLectures": [
          { "name": "Service Basics", "description": "Learn the basics of services.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Dependency Injection", "description": "Understand dependency injection.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Using Services", "description": "Use services in your application.", "duration": 15, "video": "ads_video.mp4" }
        ]
      }
    ]
  },
  {
    course: {
      "title": "AWS",
      "thumbnail": "aws.png",
      "description": "AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.",
      "details": "AWS (Amazon Web Services) Coaching and Certification course is designed to help you build and validate your cloud skills. This comprehensive course covers the essentials of AWS, including computing, storage, database, and networking. You will learn how to deploy and manage applications on the AWS platform, ensuring they are scalable, secure, and cost-effective. \nThroughout the course, you will engage in hands-on labs and real-world projects that simulate the AWS environment. Our expert instructors will guide you through the best practices for using AWS services and tools. By the end of the course, you will be well-prepared for the AWS certification exams, enhancing your career prospects in the cloud computing domain.",
      "caption": "Master AWS with expert training.",
      "category": "cloud computing",
      "totalRate": 1200,
      "ratings": 500,
      "video": "ads_video.mp4"
    },
    lectures: [
      { 
        "name": "Introduction to AWS", 
        "description": "Learn the basics of AWS.", 
        "category": "cloud", 
        "duration": 30, 
        "subLectures": [
          { "name": "AWS Basics", "description": "Learn the basics of AWS.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "AWS Setup", "description": "Setup your AWS environment.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "AWS First App", "description": "Build your first AWS app.", "duration": 10, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "AWS EC2", 
        "description": "Understand AWS EC2 services.", 
        "category": "cloud", 
        "duration": 45, 
        "subLectures": [
          { "name": "EC2 Basics", "description": "Understand the basics of EC2.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "EC2 Setup", "description": "Setup your EC2 environment.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "EC2 Management", "description": "Manage EC2 instances.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "AWS S3", 
        "description": "Learn about AWS S3 storage.", 
        "category": "cloud", 
        "duration": 40, 
        "subLectures": [
          { "name": "S3 Basics", "description": "Learn the basics of S3.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "S3 Setup", "description": "Setup your S3 environment.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "S3 Management", "description": "Manage S3 buckets.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "AWS Lambda", 
        "description": "Introduction to AWS Lambda.", 
        "category": "cloud", 
        "duration": 35, 
        "subLectures": [
          { "name": "Lambda Basics", "description": "Learn the basics of Lambda.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Lambda Setup", "description": "Setup your Lambda environment.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Lambda Functions", "description": "Build your first Lambda function.", "duration": 15, "video": "ads_video.mp4" }
        ]
      }
    ]
  },
  {
    course: {
      "title": "Vue JS",
      "thumbnail": "vue-js.png",
      "description": "An open-source model-view–viewmodel front end JavaScript framework for building user interfaces & single-page applications.",
      "details": "This course offers an in-depth exploration of Vue JS, an open-source model-view–viewmodel front-end JavaScript framework. You will learn how to build user interfaces and single-page applications using Vue's declarative rendering, component system, and reactivity mechanisms. The course emphasizes practical application, guiding you through the creation of complex and dynamic web applications. \nGain insights from industry professionals on how to effectively use Vue's ecosystem, including Vue Router and Vuex for state management. By the end of this course, you will have a thorough understanding of Vue JS and the skills needed to create high-performance web applications.",
      "caption": "Get started with Vue JS.",
      "category": "front-end,framework",
      "totalRate": 1000,
      "ratings": 500,
      "video": "ads_video.mp4"
    },
    lectures: [
      { 
        "name": "Introduction to Vue", 
        "description": "An introduction to the Vue framework.", 
        "category": "education", 
        "duration": 30, 
        "subLectures": [
          { "name": "Vue Basics", "description": "Learn the basics of Vue.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "Vue Setup", "description": "Setup your Vue environment.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "Vue First App", "description": "Build your first Vue app.", "duration": 10, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Vue Components", 
        "description": "Learn about components in Vue.", 
        "category": "education", 
        "duration": 45, 
        "subLectures": [
          { "name": "Component Basics", "description": "Understand the basics of components.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Template Syntax", "description": "Learn about template syntax.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Component Interaction", "description": "Manage interaction between components.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Vue Directives", 
        "description": "Understand directives in Vue.", 
        "category": "education", 
        "duration": 40, 
        "subLectures": [
          { "name": "Directive Basics", "description": "Learn the basics of directives.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Custom Directives", "description": "Create custom directives.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Directive Usage", "description": "Use directives in your application.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Vue CLI", 
        "description": "Learn how to use Vue CLI.", 
        "category": "education", 
        "duration": 35, 
        "subLectures": [
          { "name": "CLI Basics", "description": "Learn the basics of Vue CLI.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "CLI Setup", "description": "Setup your Vue CLI environment.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "CLI Projects", "description": "Create projects with Vue CLI.", "duration": 15, "video": "ads_video.mp4" }
        ]
      }
    ]
  },
  {
    course: {
      "title": "Python",
      "thumbnail": "python.png",
      "description": "Python is an interpreted high-level general-purpose programming-language.",
      "details": "Python programming language is known for its simplicity and versatility. This course covers Python from the basics to advanced topics, providing a comprehensive understanding of the language. You will start with syntax and basic programming constructs, then move on to more complex topics such as object-oriented programming, data structures, and web development with Django and Flask. \nThe course includes numerous coding exercises and projects to reinforce your learning. By the end of the course, you will be proficient in Python, capable of developing various types of applications and scripts. This course is ideal for beginners as well as experienced programmers looking to enhance their Python skills.",
      "caption": "Python programming made easy.",
      "category": "programming language",
      "totalRate": 400,
      "ratings": 200,
      "video": "ads_video.mp4"
    },
    lectures: [
      { 
        "name": "Introduction to Python", 
        "description": "Learn the basics of Python.", 
        "category": "programming", 
        "duration": 30, 
        "subLectures": [
          { "name": "Python Basics", "description": "Learn the basics of Python.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "Python Setup", "description": "Setup your Python environment.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "Python First Script", "description": "Write your first Python script.", "duration": 10, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Python Data Types", 
        "description": "Understand data types in Python.", 
        "category": "programming", 
        "duration": 45, 
        "subLectures": [
          { "name": "Data Type Basics", "description": "Learn the basics of data types.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Complex Data Types", "description": "Understand complex data types.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Data Type Operations", "description": "Perform operations on data types.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Python Functions", 
        "description": "Learn about functions in Python.", 
        "category": "programming", 
        "duration": 40, 
        "subLectures": [
          { "name": "Function Basics", "description": "Learn the basics of functions.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Lambda Functions", "description": "Understand lambda functions.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Function Usage", "description": "Use functions in your scripts.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Python OOP", 
        "description": "Introduction to Object-Oriented Programming in Python.", 
        "category": "programming", 
        "duration": 35, 
        "subLectures": [
          { "name": "OOP Basics", "description": "Learn the basics of OOP.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Classes and Objects", "description": "Understand classes and objects.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "OOP Principles", "description": "Learn OOP principles.", "duration": 15, "video": "ads_video.mp4" }
        ]
      }
    ]
  },
  {
    course: {
      "title": "React JS",
      "thumbnail": "react-js.png",
      "description": "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components.",
      "details": "React JS is a popular JavaScript library for building user interfaces. This course will guide you through the process of developing dynamic web applications using React's component-based architecture. You will learn about JSX, state management, props, and the lifecycle methods of React components. \nThe course provides hands-on experience through projects that cover practical use cases. By the end of the course, you will be able to build and deploy complex React applications. This course is suitable for both beginners and those looking to deepen their knowledge of React.",
      "caption": "React JS for beginners.",
      "category": "front-end,framework",
      "totalRate": 3000,
      "ratings": 5000,
      "video": "ads_video.mp4"
    },
    lectures: [
      { 
        "name": "Introduction to React", 
        "description": "An introduction to React.", 
        "category": "education", 
        "duration": 30, 
        "subLectures": [
          { "name": "React Basics", "description": "Learn the basics of React.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "React Setup", "description": "Setup your React environment.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "React First App", "description": "Build your first React app.", "duration": 10, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "React Components", 
        "description": "Learn about components in React.", 
        "category": "education", 
        "duration": 45, 
        "subLectures": [
          { "name": "Component Basics", "description": "Understand the basics of components.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "JSX Syntax", "description": "Learn about JSX syntax.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Component Interaction", "description": "Manage interaction between components.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "React State and Props", 
        "description": "Understand state and props in React.", 
        "category": "education", 
        "duration": 40, 
        "subLectures": [
          { "name": "State Basics", "description": "Learn the basics of state.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Props Usage", "description": "Use props in components.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "State Management", "description": "Manage state in React.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "React Hooks", 
        "description": "Introduction to React Hooks.", 
        "category": "education", 
        "duration": 35, 
        "subLectures": [
          { "name": "Hooks Basics", "description": "Learn the basics of React Hooks.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Custom Hooks", "description": "Create custom hooks.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Using Hooks", "description": "Use hooks in your application.", "duration": 15, "video": "ads_video.mp4" }
        ]
      }
    ]
  },
  {
    course: {
      "title": "Software Testing",
      "thumbnail": "software-testing.png",
      "description": "The process of evaluating and verifying that a software product or application does what it is supposed to do.",
      "details": "Software testing is a crucial aspect of the development process. This course covers the fundamentals of software testing, including manual and automated testing techniques. You will learn how to design test cases, execute tests, and analyze results to ensure software quality. \nThe course includes practical exercises and real-world scenarios to help you understand different types of testing, such as unit testing, integration testing, system testing, and acceptance testing. By the end of the course, you will have the skills to effectively test software applications, ensuring they meet the required standards and specifications.",
      "caption": "Become an expert in software testing.",
      "category": "software development",
      "totalRate": 6000,
      "ratings": 2000,
      "video": "ads_video.mp4"
    },
    lectures: [
      { 
        "name": "Introduction to Software Testing", 
        "description": "Learn the basics of software testing.", 
        "category": "testing", 
        "duration": 30, 
        "subLectures": [
          { "name": "Testing Basics", "description": "Learn the basics of software testing.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "Testing Setup", "description": "Setup your testing environment.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "First Test Case", "description": "Write your first test case.", "duration": 10, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Manual Testing", 
        "description": "Understand manual testing techniques.", 
        "category": "testing", 
        "duration": 45, 
        "subLectures": [
          { "name": "Manual Testing Basics", "description": "Learn the basics of manual testing.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Writing Test Cases", "description": "Write effective test cases.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Executing Test Cases", "description": "Execute test cases.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Automated Testing", 
        "description": "Learn about automated testing.", 
        "category": "testing", 
        "duration": 40, 
        "subLectures": [
          { "name": "Automated Testing Basics", "description": "Learn the basics of automated testing.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Using Testing Tools", "description": "Use automated testing tools.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Creating Automated Tests", "description": "Create automated tests.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Testing Tools", 
        "description": "Introduction to various testing tools.", 
        "category": "testing", 
        "duration": 35, 
        "subLectures": [
          { "name": "Tool Basics", "description": "Learn the basics of testing tools.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Selecting Tools", "description": "Select the right tools for your needs.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Using Tools", "description": "Effectively use testing tools.", "duration": 15, "video": "ads_video.mp4" }
        ]
      }
    ]
  },
  {
    course: {
      "title": "Core UI",
      "thumbnail": "core-ui.png",
      "description": "Learn the fastest way to build a modern dashboard for any platforms, browser, or device.",
      "details": "Core UI course focuses on building modern dashboards and user interfaces for any platform, browser, or device. You will learn how to use Core UI components to create responsive and interactive dashboards. The course covers the use of Bootstrap and other frameworks to enhance your UI development skills. \nThroughout the course, you will work on projects that require you to apply your knowledge in real-world scenarios. By the end of the course, you will be proficient in developing modern user interfaces that are both functional and aesthetically pleasing.",
      "caption": "Core UI development.",
      "category": "front-end",
      "totalRate": 6000,
      "ratings": 3000,
      "video": "ads_video.mp4"
    },
    lectures: [
      { 
        "name": "Introduction to Core UI", 
        "description": "Learn the basics of Core UI.", 
        "category": "ui", 
        "duration": 30, 
        "subLectures": [
          { "name": "Core UI Basics", "description": "Learn the basics of Core UI.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "Core UI Setup", "description": "Setup your Core UI environment.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "First Core UI Project", "description": "Create your first Core UI project.", "duration": 10, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Core UI Components", 
        "description": "Understand Core UI components.", 
        "category": "ui", 
        "duration": 45, 
        "subLectures": [
          { "name": "Component Basics", "description": "Understand the basics of Core UI components.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Advanced Components", "description": "Learn about advanced Core UI components.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Component Integration", "description": "Integrate Core UI components into your project.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Building Dashboards", 
        "description": "Learn how to build dashboards with Core UI.", 
        "category": "ui", 
        "duration": 40, 
        "subLectures": [
          { "name": "Dashboard Basics", "description": "Learn the basics of building dashboards.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Dashboard Design", "description": "Design effective dashboards.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Advanced Dashboards", "description": "Create advanced dashboards.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Advanced Core UI", 
        "description": "Advanced topics in Core UI.", 
        "category": "ui", 
        "duration": 35, 
        "subLectures": [
          { "name": "Advanced UI Techniques", "description": "Learn advanced UI techniques.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Performance Optimization", "description": "Optimize the performance of your UI.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "UI Testing", "description": "Test your UI for functionality and performance.", "duration": 15, "video": "ads_video.mp4" }
        ]
      }
    ]
  },
  {
    course: {
      "title": "Power BI",
      "thumbnail": "power-bi.png",
      "description": "An interactive data visualization software developed by Microsoft with primary focus on business intelligence.",
      "details": "Power BI is an interactive data visualization software developed by Microsoft. This course covers the essentials of using Power BI for business intelligence. You will learn how to connect to various data sources, transform and clean data, and create interactive reports and dashboards. \nThe course includes hands-on labs and projects that simulate real-world data analysis scenarios. You will gain insights into best practices for data visualization and storytelling with data. By the end of the course, you will be able to leverage Power BI to make data-driven decisions and present data in a compelling way.",
      "caption": "Power BI for data visualization.",
      "category": "data,software",
      "totalRate": 8000,
      "ratings": 7000,
      "video": "ads_video.mp4"
    },
    lectures: [
      { 
        "name": "Introduction to Power BI", 
        "description": "Learn the basics of Power BI.", 
        "category": "data", 
        "duration": 30, 
        "subLectures": [
          { "name": "Power BI Basics", "description": "Learn the basics of Power BI.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "Power BI Setup", "description": "Setup your Power BI environment.", "duration": 10, "video": "ads_video.mp4" },
          { "name": "First Power BI Report", "description": "Create your first Power BI report.", "duration": 10, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Power BI Data Sources", 
        "description": "Understand various data sources in Power BI.", 
        "category": "data", 
        "duration": 45, 
        "subLectures": [
          { "name": "Data Source Basics", "description": "Understand the basics of data sources.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Connecting Data Sources", "description": "Connect to different data sources.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Managing Data Sources", "description": "Manage and transform data sources.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Creating Reports", 
        "description": "Learn how to create reports in Power BI.", 
        "category": "data", 
        "duration": 40, 
        "subLectures": [
          { "name": "Report Basics", "description": "Learn the basics of creating reports.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Advanced Reports", "description": "Create advanced reports.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Report Customization", "description": "Customize your reports.", "duration": 15, "video": "ads_video.mp4" }
        ]
      },
      { 
        "name": "Advanced Power BI", 
        "description": "Advanced topics in Power BI.", 
        "category": "data", 
        "duration": 35, 
        "subLectures": [
          { "name": "Advanced Data Visualization", "description": "Learn advanced data visualization techniques.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Data Analysis", "description": "Perform data analysis in Power BI.", "duration": 15, "video": "ads_video.mp4" },
          { "name": "Power BI Automation", "description": "Automate tasks in Power BI.", "duration": 15, "video": "ads_video.mp4" }
        ]
      }
    ]
  }
];

async function insertCoursesAndLectures(connection) {
  for (const data of systemData) {
    const course = data.course;
    const lectures = data.lectures;

    // Read the image file
    const imagePath = path.join(__dirname, '..', 'public', 'assets', 'courses', 'topic-thumbnail', course.thumbnail);
    const imageBuffer = fs.readFileSync(imagePath);

    // Read the video file
    const videoPath = path.join(__dirname, '..', 'public', 'assets', 'lectures', course.video);
    const videoBuffer = fs.readFileSync(videoPath);

    // Insert the course data into the database
    const result = await connection.request()
      .input('Title', sql.NVarChar, course.title)
      .input('Thumbnail', sql.VarBinary, imageBuffer)
      .input('Description', sql.NVarChar, course.description)
      .input('Details', sql.NVarChar, course.details)
      .input('Caption', sql.NVarChar, course.caption)
      .input('Category', sql.NVarChar, course.category)
      .input('TotalRate', sql.Int, course.totalRate)
      .input('Ratings', sql.Int, course.ratings)
      .input('Video', sql.VarBinary, videoBuffer)
      .query(`
        INSERT INTO Courses (Title, Thumbnail, Description, Details, Caption, Category, TotalRate, Ratings, Video)
        VALUES (@Title, @Thumbnail, @Description, @Details, @Caption, @Category, @TotalRate, @Ratings, @Video);
        SELECT SCOPE_IDENTITY() AS CourseID;
      `);

    const courseID = result.recordset[0].CourseID;

    // Insert lecture data for the course
    for (const lecture of lectures) {

      const lectureResult = await connection.request()
        .input('Name', sql.NVarChar, lecture.name)
        .input('Description', sql.NVarChar, lecture.description)
        .input('Category', sql.NVarChar, lecture.category)
        .input('Duration', sql.Int, lecture.duration)
        .query(`
          INSERT INTO Lectures (Name, Description, Category, Duration)
          VALUES (@Name, @Description, @Category, @Duration);
          SELECT SCOPE_IDENTITY() AS LectureID;
        `);

      const lectureID = lectureResult.recordset[0].LectureID;

      // Insert into CourseLectures junction table
      await connection.request()
        .input('CourseID', sql.Int, courseID)
        .input('LectureID', sql.Int, lectureID)
        .query(`
          INSERT INTO CourseLectures (CourseID, LectureID)
          VALUES (@CourseID, @LectureID);
        `);

      // Insert sub-lecture data for each lecture
      for (const subLecture of lecture.subLectures) {
        const subLectureVideoPath = path.join(__dirname, '..', 'public', 'assets', 'lectures', subLecture.video);
        const subLectureVideoBuffer = fs.readFileSync(subLectureVideoPath);

        await connection.request()
          .input('LectureID', sql.Int, lectureID)
          .input('Name', sql.NVarChar, subLecture.name)
          .input('Description', sql.NVarChar, subLecture.description)
          .input('Duration', sql.Int, subLecture.duration)
          .input('Video', sql.VarBinary, subLectureVideoBuffer)
          .query(`
            INSERT INTO SubLectures (LectureID, Name, Description, Duration, Video)
            VALUES (@LectureID, @Name, @Description, @Duration, @Video);
          `);
      }
    }
  }
}

async function insertQuizzes(connection) {
  const quizData = [
    {
      "title": "Angular JS Basics",
      "description": "Test your knowledge on the basics of Angular JS.",
      "totalQuestions": 5,
      "totalMarks": 50,
      "duration": 1,
      "maxAttempts": 2,
      "questions": [
        {
          "text": "What is Angular JS?",
          "options": JSON.stringify(["A framework", "A library", "A language", "An IDE"]),
          "correctAnswer": 0
        },
        {
          "text": "Which of the following is a feature of AngularJS?",
          "options": JSON.stringify(["Two-way data binding", "Server-side rendering", "Statically typed", "None of the above"]),
          "correctAnswer": 0
        },
        {
          "text": "What directive initializes an AngularJS application?",
          "options": JSON.stringify(["ng-app", "ng-init", "ng-model", "ng-controller"]),
          "correctAnswer": 0
        },
        {
          "text": "How do you define a module in AngularJS?",
          "options": JSON.stringify(["angular.module('myModule',[])", "angular.module[]", "angular.myModule('myModule',[])", "module.angular('myModule',[])"]),
          "correctAnswer": 0
        },
        {
          "text": "Which of the following is used to filter the data in AngularJS?",
          "options": JSON.stringify(["ng-filter", "filter", "ng-model", "ng-bind"]),
          "correctAnswer": 1
        }
      ]
    },
    {
      "title": "Vue JS Fundamentals",
      "description": "Test your knowledge on the basics of Vue JS.",
      "totalQuestions": 5,
      "totalMarks": 50,
      "duration": 30,
      "maxAttempts": 2,
      "questions": [
        {
          "text": "What is Vue JS primarily used for?",
          "options": JSON.stringify(["Backend development", "Database management", "User interfaces", "Server-side scripting"]),
          "correctAnswer": 2
        },
        {
          "text": "Which directive is used to bind data in Vue?",
          "options": JSON.stringify(["v-bind", "v-data", "v-model", "v-on"]),
          "correctAnswer": 0
        },
        {
          "text": "How do you create a new Vue instance?",
          "options": JSON.stringify(["new Vue()", "Vue.create()", "Vue.new()", "create Vue()"]),
          "correctAnswer": 0
        },
        {
          "text": "Which Vue directive is used for conditional rendering?",
          "options": JSON.stringify(["v-if", "v-for", "v-show", "v-bind"]),
          "correctAnswer": 0
        },
        {
          "text": "What is the purpose of Vue CLI?",
          "options": JSON.stringify(["To manage state", "To create Vue applications quickly", "To handle HTTP requests", "To render server-side content"]),
          "correctAnswer": 1
        }
      ]
    },
    {
      "title": "AWS Essentials",
      "description": "Test your knowledge on the basics of AWS.",
      "totalQuestions": 5,
      "totalMarks": 50,
      "duration": 30,
      "maxAttempts": 2,
      "questions": [
        {
          "text": "What does EC2 stand for?",
          "options": JSON.stringify(["Elastic Compute Cloud", "Elastic Communication Cloud", "Enhanced Compute Cloud", "Enterprise Compute Cloud"]),
          "correctAnswer": 0
        },
        {
          "text": "Which AWS service is used for object storage?",
          "options": JSON.stringify(["RDS", "S3", "EC2", "Lambda"]),
          "correctAnswer": 1
        },
        {
          "text": "What is AWS Lambda used for?",
          "options": JSON.stringify(["To run serverless applications", "To store data", "To host websites", "To manage DNS"]),
          "correctAnswer": 0
        },
        {
          "text": "What does S3 stand for?",
          "options": JSON.stringify(["Simple Storage Service", "Scalable Storage Service", "Secure Storage Service", "Standard Storage Service"]),
          "correctAnswer": 0
        },
        {
          "text": "Which AWS service is used to manage relational databases?",
          "options": JSON.stringify(["EC2", "RDS", "S3", "DynamoDB"]),
          "correctAnswer": 1
        }
      ]
    },
    {
      "title": "Python Programming",
      "description": "Test your knowledge on Python programming.",
      "totalQuestions": 5,
      "totalMarks": 50,
      "duration": 30,
      "maxAttempts": 2,
      "questions": [
        {
          "text": "What is the correct file extension for Python files?",
          "options": JSON.stringify([".python", ".pyth", ".py", ".pyt"]),
          "correctAnswer": 2
        },
        {
          "text": "Which keyword is used to create a function in Python?",
          "options": JSON.stringify(["function", "def", "fun", "define"]),
          "correctAnswer": 1
        },
        {
          "text": "How do you create a list in Python?",
          "options": JSON.stringify(["list = {}", "list = []", "list = ()", "list = ||"]),
          "correctAnswer": 1
        },
        {
          "text": "Which method is used to add an element to the end of a list in Python?",
          "options": JSON.stringify(["add()", "append()", "insert()", "push()"]),
          "correctAnswer": 1
        },
        {
          "text": "How do you start a for loop in Python?",
          "options": JSON.stringify(["for x in y:", "for(x in y)", "for x in y", "for x:y"]),
          "correctAnswer": 0
        }
      ]
    }
  ];

  for (const quiz of quizData) {
    const result = await connection.request()
      .input('title', sql.VarChar, quiz.title)
      .input('description', sql.VarChar, quiz.description)
      .input('totalQuestions', sql.Int, quiz.totalQuestions)
      .input('totalMarks', sql.Int, quiz.totalMarks)
      .input('duration', sql.Int, quiz.duration)
      .input('maxAttempts', sql.Int, quiz.maxAttempts)
      .query(`
        INSERT INTO Quizzes (title, description, totalQuestions, totalMarks, duration, maxAttempts)
        VALUES (@title, @description, @totalQuestions, @totalMarks, @duration, @maxAttempts);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    const quizId = result.recordset[0].id;

    for (const question of quiz.questions) {
      await connection.request()
        .input('quizId', sql.Int, quizId)
        .input('text', sql.VarChar, question.text)
        .input('options', sql.NVarChar, question.options)
        .input('correctAnswer', sql.Int, question.correctAnswer)
        .query(`
          INSERT INTO Questions (quizId, text, options, correctAnswer)
          VALUES (@quizId, @text, @options, @correctAnswer);
        `);
    }
  }
}

// Load the SQL and run the seed process
async function run() {
  const connection = await sql.connect(dbConfig);
  try {
    // Make sure that any items are correctly URL encoded in the connection string
    const request = connection.request();
    await request.query(seedSQL);
    console.log("Database reset and tables created");

    // Insert course and lecture data
    await insertCoursesAndLectures(connection);
    console.log("Courses and lectures inserted");

    // Insert quiz data
    await insertQuizzes(connection);
    console.log("Quizzes inserted");

    connection.close();
    console.log("Seeding completed");
  } catch (err) {
    console.log("Seeding error:", err);
    connection.close()
  }
}

run()