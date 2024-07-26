const quizController = require("../controllers/quizController");
const Quiz = require("../models/quiz");

// Mock the quiz model
jest.mock("../models/quiz");

describe("quizController.getAllQuizzes", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  it("should fetch all quizzes and return a JSON response", async () => {
    const mockQuizzes = [
      {
        id: 1,
        title: "Angular JS Basics",
        description: "Test your knowledge on the basics of Angular JS.",
        totalQuestions: 5,
        totalMarks: 50,
        duration: 1,
        maxAttempts: 2,
      },
    ];

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

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.getAllQuizzes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving quizzes");
  });
});

describe("quizController.getQuizQuestions", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  it("should fetch all questions of a quiz and return a JSON response", async () => {
    const mockQuestions = [
      {
        id: 1,
        quizId: 1,
        text: "What is Angular JS?",
        options: [
          "A framework",
          "A library",
          "A language",
          "An IDE",
        ],
        correctAnswer: 0,
      },
    ];

    // Mock the model function to return the mock data
    Quiz.getQuizQuestions.mockResolvedValue(mockQuestions);

    // mock the reqs
    const req = {
      params: { quizId: 1 },
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

    // mock the reqs
    const req = {
      params: { quizId: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.getQuizQuestions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error fetching quiz questions");
  });
});

describe("quizController.getQuizById", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  it("should fetch a quiz by its id and return a JSON response", async () => {
    const mockQuiz = {
      id: 1,
      title: "Angular JS Basics",
      description: "Test your knowledge on the basics of Angular JS.",
      totalQuestions: 5,
      totalMarks: 50,
      duration: 1,
      maxAttempts: 2,
    };

    // Mock the quiz.getAllQuizzes function to return the mock data
    Quiz.getQuizById.mockResolvedValue(mockQuiz);

    // mock the reqs
    const req = {
      params: { quizId: 1 },
    };
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.getQuizById(req, res);
    expect(Quiz.getQuizById).toHaveBeenCalledTimes(1); // Check if model function was called
    expect(res.json).toHaveBeenCalledWith(mockQuiz); // Check the response body
  });

  it("should handle cases where quiz does not exist and return a 404 status with error message", async () => {
    Quiz.getQuizById.mockResolvedValue(null); // Simulate a quiz not found

    // mock the reqs
    const req = {
      params: { quizId: 0 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.getQuizById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Quiz not found");
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.getQuizById.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    // mock the reqs
    const req = {
      params: { quizId: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.getQuizById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving quiz");
  });
});

describe("quizController.submitQuizAnswers", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  // mock request body
  const req = {
    params: { quizId: 1 },
    user: { userId: 1 },
    body: {
      answers: [
        {
          questionId: 1,
          answer: 0,
        },
        {
          questionId: 2,
          answer: 0,
        },
        {
          questionId: 3,
          answer: 0,
        },
        {
          questionId: 4,
          answer: 0,
        },
        {
          questionId: 5,
          answer: 1,
        },
      ],
      duration: 10,
    },
  };

  it("should create a new result for the user and return the json object", async () => {
    const mockResult = {
      score: 50,
      totalQuestions: 5,
      correctAnswers: 5,
      incorrectQuestions: [],
      resultId: 9,
      grade: "A+",
    };

    Quiz.submitQuizAnswers.mockResolvedValue(mockResult); // Mock quiz results

    const res = {
      json: jest.fn(),
    };

    await quizController.submitQuizAnswers(req, res);

    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.submitQuizAnswers.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.submitQuizAnswers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error submitting quiz answers");
  });
});

describe("quizController.canAttemptQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  // mock the req
  const req = {
    params: { quizId: 1 },
    user: { userId: 5 },
  };

  it("should fetch the attempt data of a user for a quiz and return a json response", async () => {
    const mockAttempt = {
      canAttempt: true,
      attempts: 0,
      maxAttempts: 2,
    };

    // Mock the quiz.canAttemptQuiz function to return the mock data
    Quiz.canAttemptQuiz.mockResolvedValue(mockAttempt);

    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.canAttemptQuiz(req, res);
    expect(Quiz.canAttemptQuiz).toHaveBeenCalledTimes(1); // Check if model function was called
    expect(res.json).toHaveBeenCalledWith(mockAttempt); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.canAttemptQuiz.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.canAttemptQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error checking quiz attempt eligibility");
  });
});

describe("quizController.getQuizResult", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  // mock the req
  const req = {
    params: { quizId: 1, resultId: 11 },
    user: { userId: 5 },
  };

  it("should fetch a quiz result by the user and quiz id and return a JSON response", async () => {
    const mockResult = {
      id: 11,
      quizId: 4,
      userId: 5,
      score: 40,
      totalQuestions: 5,
      correctAnswers: 4,
      timeTaken: 7,
      totalMarks: 50,
      grade: "A",
      incorrectQuestions: [
        {
          id: 5,
          resultId: 11,
          text: "How do you create a list in Python?",
          userAnswer: 2,
          correctAnswer: 1,
          questionId: 18,
          options: ["list = {}", "list = []", "list = ()", "list = ||"],
        },
      ],
      attempts: 1,
      maxAttempts: 2,
    };

    // Mock the quiz.getQuizResult function to return the mock data
    Quiz.getQuizResult.mockResolvedValue(mockResult);

    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.getQuizResult(req, res);
    expect(Quiz.getQuizResult).toHaveBeenCalledTimes(1); // Check if model function was called
    expect(res.json).toHaveBeenCalledWith(mockResult); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.getQuizResult.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.getQuizResult(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error fetching quiz result");
  });
});

describe("quizController.getUserQuizResults", () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  // mock the req
  const req = {
    user: { userId: 5 },
  };

  it("should fetch all quiz results of the user and return a JSON response", async () => {
    const mockResults = [
      {
        title: "Angular JS Basics",
        score: 50,
        totalMarks: 50,
        grade: "A",
        timeTaken: 10,
        quizId: 1,
        id: 1,
      },
    ];

    // Mock the quiz.getUserQuizResults function to return the mock data
    Quiz.getUserQuizResults.mockResolvedValue(mockResults);

    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await quizController.getUserQuizResults(req, res);
    expect(Quiz.getUserQuizResults).toHaveBeenCalledTimes(1); // Check if model function was called
    expect(res.json).toHaveBeenCalledWith(mockResults); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.getUserQuizResults.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.getUserQuizResults(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error fetching user quiz results");
  });
});

describe("quizController.createQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  const req = {
    body: {
      title: "New Quiz",
      description: "Description of New Quiz",
      totalQuestions: 5,
      totalMarks: 50,
      duration: 30,
      maxAttempts: 3,
    },
  };

  it("should create a new quiz and return the created quiz", async () => {
    const mockQuiz = {
      id: 1,
      title: "New Quiz",
      description: "Description of New Quiz",
      totalQuestions: 5,
      totalMarks: 50,
      duration: 30,
      maxAttempts: 3,
    };

    Quiz.createQuiz.mockResolvedValue(mockQuiz);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.createQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockQuiz);
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.createQuiz.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.createQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error creating quiz", error: errorMessage });
  });
});

describe("quizController.createQuizQuestion", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  const req = {
    params: { quizId: 1 },
    body: {
      questions: [
        {
          text: "New Question",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: 1,
        },
      ],
    },
  };

  it("should create new questions for a quiz and return the created questions", async () => {
    const mockQuestion = {
      id: 1,
      quizId: 1,
      text: "New Question",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: 1,
    };

    Quiz.createQuizQuestion.mockResolvedValue([mockQuestion]);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.createQuizQuestion(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ questions: [mockQuestion] });
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.createQuizQuestion.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.createQuizQuestion(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error creating quiz questions", error: errorMessage });
  });
});

describe("quizController.updateQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  const req = {
    params: { quizId: 1 },
    body: {
      title: "Updated Quiz",
      description: "Updated Description",
      totalQuestions: 5,
      totalMarks: 50,
      duration: 30,
      maxAttempts: 3,
    },
  };

  it("should update a quiz and return the updated quiz", async () => {
    const mockQuiz = {
      id: 1,
      title: "Updated Quiz",
      description: "Updated Description",
      totalQuestions: 5,
      totalMarks: 50,
      duration: 30,
      maxAttempts: 3,
    };

    Quiz.updateQuiz.mockResolvedValue(mockQuiz);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.updateQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockQuiz);
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.updateQuiz.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.updateQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error updating quiz", error: errorMessage });
  });
});

describe("quizController.updateQuizQuestions", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  const req = {
    params: { quizId: 1 },
    body: {
      questions: [
        {
          text: "Updated Question",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: 1,
        },
      ],
    },
  };

  it("should update quiz questions and return a success message", async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.updateQuizQuestions(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Questions updated successfully" });
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.updateQuizQuestions.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.updateQuizQuestions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error updating quiz questions", error: errorMessage });
  });
});

describe("quizController.deleteQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  const req = {
    params: { id: 1 },
  };

  it("should delete a quiz and return no content", async () => {
    Quiz.deleteQuiz.mockResolvedValue(true);

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.deleteQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Quiz.deleteQuiz.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.deleteQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error deleting quiz");
  });
});

describe("quizController.getQuizzesAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  it("should fetch quiz data from OpenAI API and return a JSON response", async () => {
    const mockQuizData = {
      title: "Python Quiz",
      description: "Test your knowledge on Python",
      totalQuestions: 5,
      totalMarks: 50,
      duration: 30,
      maxAttempts: 3,
      questions: [
        {
          text: "What is Python?",
          options: ["A snake", "A programming language", "A car", "A drink"],
          correctAnswer: 1,
        },
      ],
    };

    const OpenAI = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockQuizData) } }],
          }),
        },
      },
    };

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.getQuizzesAPI(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockQuizData);
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "API error";
    const OpenAI = {
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error(errorMessage)),
        },
      },
    };

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.getQuizzesAPI(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error creating quiz via OpenAI", error: errorMessage });
  });
});

describe("quizController.submitRandomQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  const req = {
    body: {
      answers: [
        { questionId: 1, answer: 0 },
        { questionId: 2, answer: 1 },
      ],
      duration: 120,
      questions: [
        {
          text: "What is Python?",
          options: ["A snake", "A programming language", "A car", "A drink"],
          correctAnswer: 1,
        },
        {
          text: "What is JavaScript?",
          options: ["A script", "A programming language", "A car", "A drink"],
          correctAnswer: 1,
        },
      ],
    },
    session: {},
  };

  it("should submit a random quiz and return the result", async () => {
    const mockResult = {
      score: 10,
      totalQuestions: 2,
      correctAnswers: 1,
      incorrectQuestions: [
        {
          questionId: 0,
          text: "What is Python?",
          userAnswer: 0,
          correctAnswer: 1,
          options: ["A snake", "A programming language", "A car", "A drink"],
        },
      ],
      duration: 120,
      totalMarks: 20,
      grade: "F",
    };

    Quiz.submitQuizAnswers = jest.fn().mockResolvedValue(mockResult);

    const res = {
      json: jest.fn(),
    };

    await quizController.submitRandomQuiz(req, res);

    expect(res.json).toHaveBeenCalledWith(mockResult);
    expect(req.session.randomQuizResult).toEqual(mockResult);
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Error";
    Quiz.submitQuizAnswers = jest.fn().mockRejectedValue(new Error(errorMessage));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await quizController.submitRandomQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error submitting random quiz", error: errorMessage });
  });
});

describe("quizController.getRandomQuizResult", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Silence console error
  });

  it("should return the random quiz result from the session", async () => {
    const req = {
      session: {
        randomQuizResult: { score: 10, grade: "A" },
      },
    };

    const res = {
      json: jest.fn(),
    };

    await quizController.getRandomQuizResult(req, res);

    expect(res.json).toHaveBeenCalledWith({ score: 10, grade: "A" });
  });

  it("should return 404 if no random quiz result found", async () => {
    const req = {
      session: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await quizController.getRandomQuizResult(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("No quiz result found");
  });
});
