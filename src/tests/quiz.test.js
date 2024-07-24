// book.test.js
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
    Quiz.query.mockResolvedValue({recordset: mockQuizzes})

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

    const quiz = await Quiz.getQuizById() //get the output from the test function

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

    const result = await Quiz.getQuizQuestions(0) //get the output from the test function

    //check the results
    expect(Quiz.query).toHaveBeenCalled()
    expect(result).toHaveLength(0)
    expect(result).toEqual([])
  });
})

describe("Quiz.submitQuizAnswers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submit the quiz answers to the database", async () => {
    const mockResult = {
      "score": 50,
      "totalQuestions": 5,
      "correctAnswers": 5,
      "incorrectQuestions": [],
      "resultId": 9,
      "grade": "A+"
    }

    //mock the query to return the mssql results
    Quiz.query = jest.fn().mockResolvedValue({recordset: mockData})
    JSON.parse = jest.fn().mockImplementationOnce(() => mockData[0].options) //also mock json.parse
    const result = await Quiz.getQuizQuestions(1); //get the output from the test function

    //check the results
    expect(Quiz.query).toHaveBeenCalled()
    expect(result[0]).toEqual(mockData[0])
  })
})