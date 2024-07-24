// book.test.js
const Quiz = require("../models/quiz");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

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

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockQuizzes }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    //sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const quizzes = await Quiz.getAllQuizzes();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(0);
    expect(quizzes).toHaveLength(2);
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Error in book.js Could not get all books";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  })
})