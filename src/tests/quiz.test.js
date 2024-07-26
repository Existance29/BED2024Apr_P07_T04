// tests/quiz.test.js

const Quiz = require("../models/quiz");

describe("Quiz.getAllQuizzes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all quizzes from the database", async () => {
    const mockQuizzes = [
      {
        "id": 1,
        "title": "Angular JS Basics",
        "description": "Test your knowledge on the basics of Angular JS.",
        "totalQuestions": 5,
        "totalMarks": 50,
        "duration": 1,
        "maxAttempts": 2
      },
      {
        "id": 2,
        "title": "Python Basics",
        "description": "Test your knowledge on the fundamentals of Python.",
        "totalQuestions": 5,
        "totalMarks": 50,
        "duration": 100,
        "maxAttempts": 2
      }
    ]

    //mock the query to return the mssql results
    Quiz.query = jest.fn()
    Quiz.query.mockResolvedValue({recordset: mockQuizzes})

    const quizzes = await Quiz.getAllQuizzes(); //get the output from the test function

    //check the results
    expect(quizzes).toHaveLength(2)
    expect(Quiz.query).toHaveBeenCalled()
    expect(quizzes[0]).toEqual(mockQuizzes[0])
    expect(quizzes[1]).toEqual(mockQuizzes[1])
  });

  it("should return an empty array when there are no quizzes", async () => {
    const mockQuizzes = []

    //mock the query to return the mssql results
    Quiz.query = jest.fn()
    Quiz.query.mockResolvedValue({recordset: mockQuizzes})

    const quizzes = await Quiz.getAllQuizzes() //get the output from the test function

    //check the results
    expect(Quiz.query).toHaveBeenCalled()
    expect(quizzes).toHaveLength(0)
    expect(quizzes).toEqual([])
  });
})

describe("Quiz.getQuizById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve the quiz from the database", async () => {
    const mockQuizzes = [
      {
        "id": 1,
        "title": "Angular JS Basics",
        "description": "Test your knowledge on the basics of Angular JS.",
        "totalQuestions": 5,
        "totalMarks": 50,
        "duration": 1,
        "maxAttempts": 2
      },
      {
        "id": 2,
        "title": "Python Basics",
        "description": "Test your knowledge on the fundamentals of Python.",
        "totalQuestions": 5,
        "totalMarks": 50,
        "duration": 100,
        "maxAttempts": 2
      }
    ]

    //mock the query to return the mssql results
    Quiz.query = jest.fn()
    Quiz.query.mockResolvedValue({recordset: [mockQuizzes[0]]})

    const quiz = await Quiz.getQuizById(1); //get the output from the test function

    //check the results
    expect(Quiz.query).toHaveBeenCalled()
    expect(quiz).toEqual(mockQuizzes[0])
  });

  it("should return null when quiz id does not exist", async () => {
    const mockQuizzes = []

    //mock the query to return the mssql results
    Quiz.query = jest.fn()
    Quiz.query.mockResolvedValue({recordset: mockQuizzes})

    const quiz = await Quiz.getQuizById(1) //get the output from the test function

    //check the results
    expect(Quiz.query).toHaveBeenCalled()
    expect(quiz).toBeNull()
  });
})

describe("Quiz.getQuizQuestions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve the questions of a quiz from the database", async () => {
    const mockData = [
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

    //mock the query to return the mssql results
    Quiz.query = jest.fn().mockResolvedValue({recordset: mockData})
    JSON.parse = jest.fn().mockImplementationOnce(() => mockData[0].options) //also mock json.parse
    const result = await Quiz.getQuizQuestions(1); //get the output from the test function

    //check the results
    expect(Quiz.query).toHaveBeenCalled()
    expect(result[0]).toEqual(mockData[0])
  });

  it("should return an empty array when quiz id does not exist", async () => {
    const mockData = []

    //mock the query to return the mssql results
    Quiz.query = jest.fn().mockResolvedValue({recordset: mockData})

    const result = await Quiz.getQuizQuestions(1) //get the output from the test function

    //check the results
    expect(Quiz.query).toHaveBeenCalled()
    expect(result).toHaveLength(0)
    expect(result).toEqual([])
  });
})

describe("Quiz.createQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new quiz in the database", async () => {
    const newQuizData = {
      title: "New Quiz",
      description: "New Quiz Description",
      totalQuestions: 5,
      totalMarks: 50,
      duration: 30,
      maxAttempts: 3
    };

    const mockQuiz = {
      id: 1,
      ...newQuizData
    };

    Quiz.query = jest.fn()
      .mockResolvedValueOnce({ recordset: [{ id: 1 }] })
      .mockResolvedValueOnce({ recordset: [mockQuiz] });

    const quiz = await Quiz.createQuiz(newQuizData);

    expect(Quiz.query).toHaveBeenCalledTimes(2);
    expect(quiz).toEqual(mockQuiz);
  });
});

describe("Quiz.createQuizQuestion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new question for a quiz in the database", async () => {
    const newQuizQuestionData = {
      quizId: 1,
      text: "New Question",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: 1
    };

    const mockQuestion = {
      id: 1,
      ...newQuizQuestionData
    };

    Quiz.query = jest.fn()
      .mockResolvedValueOnce({ recordset: [{ id: 1 }] })
      .mockResolvedValueOnce({ recordset: [mockQuestion] });

    const question = await Quiz.createQuizQuestion(newQuizQuestionData);

    expect(Quiz.query).toHaveBeenCalledTimes(2);
    expect(question).toEqual(mockQuestion);
  });
});

describe("Quiz.updateQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a quiz in the database", async () => {
    const updatedQuizData = {
      title: "Updated Quiz",
      description: "Updated Description",
      totalQuestions: 5,
      totalMarks: 50,
      duration: 30,
      maxAttempts: 3
    };

    const mockQuiz = {
      id: 1,
      ...updatedQuizData
    };

    Quiz.query = jest.fn()
      .mockResolvedValueOnce({ recordset: [{ id: 1 }] })
      .mockResolvedValueOnce({ recordset: [mockQuiz] });

    const quiz = await Quiz.updateQuiz(1, updatedQuizData);

    expect(Quiz.query).toHaveBeenCalledTimes(2);
    expect(quiz).toEqual(mockQuiz);
  });
});

describe("Quiz.updateQuizQuestions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update questions of a quiz in the database", async () => {
    const updatedQuestions = [
      {
        quizId: 1,
        text: "Updated Question",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 1
      }
    ];

    Quiz.query = jest.fn().mockResolvedValue({});

    await Quiz.updateQuizQuestions(1, updatedQuestions);

    expect(Quiz.query).toHaveBeenCalledTimes(updatedQuestions.length + 1); // 1 delete + 1 insert per question
  });
});

describe("Quiz.deleteQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a quiz and associated data from the database", async () => {
    Quiz.query = jest.fn().mockResolvedValue({});

    const result = await Quiz.deleteQuiz(1);

    expect(Quiz.query).toHaveBeenCalledTimes(6); // Check for all delete operations
    expect(result).toBe(true);
  });
});

describe("Quiz.submitQuizAnswers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should submit the quiz answers to the database", async () => {
    const quizId = 1;
    const userId = 1;
    const answers = [
      { questionId: 1, answer: 0 },
      { questionId: 2, answer: 1 }
    ];
    const duration = 120;

    const mockQuestion = {
      id: 1,
      quizId: 1,
      text: "Question 1",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: 0
    };

    const mockResult = {
      id: 1,
      quizId: 1,
      userId: 1,
      score: 20,
      totalQuestions: 2,
      correctAnswers: 2,
      incorrectQuestions: [],
      resultId: 1,
      grade: "A+"
    };

    Quiz.query = jest.fn()
      .mockResolvedValueOnce({ recordset: [mockQuestion] })
      .mockResolvedValueOnce({ recordset: [mockQuestion] })
      .mockResolvedValueOnce({ recordset: [{ id: 1 }] })
      .mockResolvedValueOnce({ recordset: [mockResult] })
      .mockResolvedValueOnce({ recordset: [] });

    const result = await Quiz.submitQuizAnswers(quizId, userId, answers, duration);

    expect(Quiz.query).toHaveBeenCalledTimes(5); // 2 question selects + 1 result insert + 1 incorrect insert + 1 user attempt select/update
    expect(result).toEqual(mockResult);
  });
});

describe("Quiz.getQuizResult", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve the quiz result from the database", async () => {
    const quizId = 1;
    const resultId = 1;
    const userId = 1;

    const mockResult = {
      id: 1,
      quizId: 1,
      userId: 1,
      score: 20,
      totalQuestions: 2,
      correctAnswers: 2,
      grade: "A+"
    };

    const mockQuiz = {
      id: 1,
      totalMarks: 20
    };

    const mockIncorrectQuestions = [
      {
        id: 1,
        resultId: 1,
        text: "Question 1",
        userAnswer: 1,
        correctAnswer: 0,
        options: ["Option 1", "Option 2", "Option 3", "Option 4"]
      }
    ];

    const mockUserAttempts = {
      userId: 1,
      quizId: 1,
      attempts: 1
    };

    Quiz.query = jest.fn()
      .mockResolvedValueOnce({ recordset: [mockResult] })
      .mockResolvedValueOnce({ recordset: [mockQuiz] })
      .mockResolvedValueOnce({ recordset: mockIncorrectQuestions })
      .mockResolvedValueOnce({ recordset: [mockUserAttempts] });

    const result = await Quiz.getQuizResult(quizId, resultId, userId);

    expect(Quiz.query).toHaveBeenCalledTimes(4); // 1 result select + 1 quiz select + 1 incorrect questions select + 1 user attempts select
    expect(result).toEqual({
      ...mockResult,
      incorrectQuestions: mockIncorrectQuestions,
      totalMarks: mockQuiz.totalMarks,
      grade: "A+",
      attempts: 1,
      maxAttempts: 3
    });
  });
});

describe("Quiz.canAttemptQuiz", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if the user can attempt the quiz", async () => {
    const quizId = 1;
    const userId = 1;

    const mockQuiz = {
      maxAttempts: 3
    };

    const mockUserAttempts = {
      attempts: 1
    };

    Quiz.query = jest.fn()
      .mockResolvedValueOnce({ recordset: [mockQuiz] })
      .mockResolvedValueOnce({ recordset: [mockUserAttempts] });

    const result = await Quiz.canAttemptQuiz(quizId, userId);

    expect(Quiz.query).toHaveBeenCalledTimes(2); // 1 quiz select + 1 user attempts select
    expect(result).toEqual({ canAttempt: true, attempts: 1, maxAttempts: 3 });
  });

  it("should return false if the user cannot attempt the quiz", async () => {
    const quizId = 1;
    const userId = 1;

    const mockQuiz = {
      maxAttempts: 1
    };

    const mockUserAttempts = {
      attempts: 1
    };

    Quiz.query = jest.fn()
      .mockResolvedValueOnce({ recordset: [mockQuiz] })
      .mockResolvedValueOnce({ recordset: [mockUserAttempts] });

    const result = await Quiz.canAttemptQuiz(quizId, userId);

    expect(Quiz.query).toHaveBeenCalledTimes(2); // 1 quiz select + 1 user attempts select
    expect(result).toEqual({ canAttempt: false, attempts: 1, maxAttempts: 1 });
  });
});

describe("Quiz.getUserQuizResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve the user's quiz results from the database", async () => {
    const userId = 1;

    const mockResults = [
      {
        title: "Quiz 1",
        score: 20,
        totalMarks: 20,
        grade: "A+",
        timeTaken: 120,
        quizId: 1,
        id: 1
      }
    ];

    Quiz.query = jest.fn()
      .mockResolvedValueOnce({ recordset: mockResults });

    const results = await Quiz.getUserQuizResults(userId);

    expect(Quiz.query).toHaveBeenCalledTimes(1); // 1 user results select
    expect(results).toEqual(mockResults);
  });
});
