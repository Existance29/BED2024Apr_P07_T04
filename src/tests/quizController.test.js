// quizController.test.js

const quizController = require("../controllers/quizController");
const Quiz = require("../models/quiz");

// Mock the quiz model
jest.mock("../models/quiz")

describe("quizController.getAllQuizzes", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all quizzes and return a JSON response", async () => {
    const mockQuizzes = [
      {
        "id": 1,
        "title": "Angular JS Basics",
        "description": "Test your knowledge on the basics of Angular JS.",
        "totalQuestions": 5,
        "totalMarks": 50,
        "duration": 1,
        "maxAttempts": 2
      }
    ]

    // Mock the quiz.getAllQuizzes function to return the mock data
    Quiz.getAllQuizzes.mockResolvedValue(mockQuizzes);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.getAllQuizzes(req, res);
    expect(Quiz.getAllQuizzes).toHaveBeenCalledTimes(1); // Check if getAllQuizzes was called
    expect(res.json).toHaveBeenCalledWith(mockQuizzes); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.getAllQuizzes.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    await quizController.getAllQuizzes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving quizzes");
  })
})

describe("quizController.getQuizQuestions", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all questions of a quiz and return a JSON response", async () => {
    const mockQuestions = [
      {
        "id": 1,
        "quizId": 1,
        "text": "What is Angular JS?",
        "options": [
          "A framework",
          "A library",
          "A language",
          "An IDE"
        ],
        "correctAnswer": 0
      }
    ]

    // Mock the quiz.getAllQuizzes function to return the mock data
    Quiz.getQuizQuestions.mockResolvedValue(mockQuestions);

    //mock the reqs
    const req = {
      params: {quizId: 1}
    };
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.getQuizQuestions(req, res);
    expect(Quiz.getQuizQuestions).toHaveBeenCalledTimes(1); // Check if getAllQuizzes was called
    expect(res.json).toHaveBeenCalledWith(mockQuestions); // Check the response body
  });


  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.getQuizQuestions.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    //mock the reqs
    const req = {
      params: {quizId: 1}
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    await quizController.getQuizQuestions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error fetching quiz questions");
  })
})

describe("quizController.getQuizById", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch a quiz by its id and return a JSON response", async () => {
    const mockQuiz = {
        "id": 1,
        "title": "Angular JS Basics",
        "description": "Test your knowledge on the basics of Angular JS.",
        "totalQuestions": 5,
        "totalMarks": 50,
        "duration": 1,
        "maxAttempts": 2
      }

    // Mock the quiz.getAllQuizzes function to return the mock data
    Quiz.getQuizById.mockResolvedValue(mockQuiz);

    //mock the reqs
    const req = {
      params: {quizId: 1}
    };
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.getQuizById(req, res);
    expect(Quiz.getQuizById).toHaveBeenCalledTimes(1); // Check if getAllQuizzes was called
    expect(res.json).toHaveBeenCalledWith(mockQuiz); // Check the response body
  });

  it("should handle cases where quiz does not exist and return a 404 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.getQuizById.mockResolvedValue(null); // Simulate a quiz not found

    //mock the reqs
    const req = {
      params: {quizId: 0}
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    await quizController.getQuizById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Quiz not found");
  })

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.getQuizById.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    //mock the reqs
    const req = {
      params: {quizId: 1}
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    await quizController.getQuizById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving quiz");
  })
})


describe("quizController.submitQuizAnswers", () => {
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

    await(await courseController.createCourse(req, res))

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