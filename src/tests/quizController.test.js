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

    // Mock the model function to return the mock data
    Quiz.getQuizQuestions.mockResolvedValue(mockQuestions);

    //mock the reqs
    const req = {
      params: {quizId: 1}
    };
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.getQuizQuestions(req, res);
    expect(Quiz.getQuizQuestions).toHaveBeenCalledTimes(1); // Check if model function was called
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
    expect(Quiz.getQuizById).toHaveBeenCalledTimes(1); // Check if model function was called
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

  //mock request body
  const req = {
    params: {quizId: 1},
    user: {userId: 1},
    body: {
      "answers": [
        {
          "questionId": 1,
          "answer": 0
        },
        {
          "questionId": 2,
          "answer": 0
        },
        {
          "questionId": 3,
          "answer": 0
        },
        {
          "questionId": 4,
          "answer": 0
        },
        {
          "questionId": 5,
          "answer": 1
        }
      ],
      "duration": 10
    }
  }

  it("should create a new result for the user and return the json object", async () => {
    
    const mockResult = {
      "score": 50,
      "totalQuestions": 5,
      "correctAnswers": 5,
      "incorrectQuestions": [],
      "resultId": 9,
      "grade": "A+"
    }

    Quiz.submitQuizAnswers.mockResolvedValue(mockResult) //mock quiz results

    const res = {
      json: jest.fn()
    };

    await quizController.submitQuizAnswers(req, res)

    expect(res.json).toHaveBeenCalledWith(mockResult);
  });


  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.submitQuizAnswers.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await quizController.submitQuizAnswers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error submitting quiz answers");
  })
})

describe("quizController.canAttemptQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  //mock the req
  const req = {
    params: {quizId: 1},
    user: {userId: 5}
  };

  it("should fetch the attempt data of a user for a quiz and return a json response", async () => {
    const mockAttempt = {
      "canAttempt": true,
      "attempts": 0,
      "maxAttempts": 2
    }

    // Mock the quiz.canAttemptQuiz function to return the mock data
    Quiz.canAttemptQuiz.mockResolvedValue(mockAttempt)

    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.canAttemptQuiz(req, res);
    expect(Quiz.canAttemptQuiz).toHaveBeenCalledTimes(1); // Check if model function was called
    expect(res.json).toHaveBeenCalledWith(mockAttempt); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error"
    Quiz.canAttemptQuiz.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    await quizController.canAttemptQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error checking quiz attempt eligibility")
  })
})

describe("quizController.getQuizResult", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  //mock the req
  const req = {
    params: {quizId: 1, resultId: 11},
    user: {userId: 5}
  };

  it("should fetch a quiz result by the user and quiz id and return a JSON response", async () => {
    const mockResult = {
      "id": 11,
      "quizId": 4,
      "userId": 5,
      "score": 40,
      "totalQuestions": 5,
      "correctAnswers": 4,
      "timeTaken": 7,
      "totalMarks": 50,
      "grade": "A",
      "incorrectQuestions": [
        {
          "id": 5,
          "resultId": 11,
          "text": "How do you create a list in Python?",
          "userAnswer": 2,
          "correctAnswer": 1,
          "questionId": 18,
          "options": "[\"list = {}\",\"list = []\",\"list = ()\",\"list = ||\"]"
        }
      ],
      "attempts": 1,
      "maxAttempts": 2
    }

    // Mock the quiz.getQuizResult function to return the mock data
    Quiz.getQuizResult.mockResolvedValue(mockResult);

    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.getQuizResult(req, res)
    expect(Quiz.getQuizResult).toHaveBeenCalledTimes(1) // Check if model function was called
    expect(res.json).toHaveBeenCalledWith(mockResult) // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error"
    Quiz.getQuizResult.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    await quizController.getQuizResult(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith("Error fetching quiz result")
  })
})

describe("quizController.getUserQuizResult", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  //mock the req
  const req = {
    user: {userId: 5}
  };

  it("should fetch all quiz results of the user and return a JSON response", async () => {
    const mockResults = [
      {
        "title": "Angular JS Basics",
        "score": 50,
        "totalMarks": 50,
        "grade": "A",
        "timeTaken": 10,
        "quizId": 1,
        "id": 1
      }
    ]

    // Mock the quiz.getUserQuizResults function to return the mock data
    Quiz.getUserQuizResults.mockResolvedValue(mockResults);

    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.getUserQuizResults(req, res)
    expect(Quiz.getUserQuizResults).toHaveBeenCalledTimes(1) // Check if model function was called
    expect(res.json).toHaveBeenCalledWith(mockResults) // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error"
    Quiz.getUserQuizResults.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    await quizController.getUserQuizResults(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith("Error fetching user quiz results")
  })
})