// courseController.test.js

const courseController = require("../controllers/courseController");
const Course = require("../models/course");

// Mock the course model
jest.mock("../models/course")

describe("courseController.getAllCourses", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all courses and return a JSON response", async () => {
    const mockCourses = [
        {
        courseID: 1,
        title: 'Angular JS',
        thumbnail: '<Buffer> object',
        description: 'A JavaScript-based open-source front-end web framework for developing single-page applications.',
        details: 'Learn the fundamentals of Angular JS',
        caption: 'AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.',
        category: 'front-end,framework',
        totalRate: 2000,
        ratings: 500,
        video: '<Buffer> object',
        
        }
]

    // Mock the Book.getAllBooks function to return the mock data
    Course.getAllCourses.mockResolvedValue(mockCourses);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
      status: jest.fn().mockReturnThis()
    };

    await courseController.getAllCourses(req, res);
    expect(Course.getAllCourses).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockCourses); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Course.getAllCourses.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await courseController.getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving courses");
  });
});

describe("courseController.createCourse", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });
  const req = {
    body: {
      title: 'Xcode',
      description: 'Learn how to use xcode with the swift programming language to develop IOS mobile apps',
      details: 'In this course, you will learn the basics of the swift programming language, make and design elements with xcode and launch an app',
      caption: 'Lead by industry professionals to master IOS app development',
      category: 'programming language,app development,sofware'
    },
    files: {
        
    }
  }

  it("should create a course and return status code 201", async () => {
    const mockCourse = {
        courseID: 9,
        title: 'Xcode',
        thumbnail: null,
        description: 'Learn how to use xcode with the swift programming language to develop IOS mobile apps',
        details: 'In this course, you will learn the basics of the swift programming language, make and design elements with xcode and launch an app',
        caption: 'Lead by industry professionals to master IOS app development',
        category: 'programming language,app development,sofware',
        totalRate: 0,
        ratings: 0,
        video: null,
    }
    Course.createCourse.mockResolvedValue(mockCourse) // update is successful

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await courseController.createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCourse);
  });


  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Course.createCourse.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await courseController.createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error creating course", error: errorMessage});
  });
});