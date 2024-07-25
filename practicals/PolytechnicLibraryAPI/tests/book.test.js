// book.test.js
const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
        {
            "book_id": 1,
            "title": "The Adventures of Huckleberry Finn",
            "author": "Mark Twain",
            "availability": "N"
        },
        {
            "book_id": 2,
            "title": "The Scarlet Letter",
            "author": "Nathaniel Hawthorne",
            "availability": "Y"
        },
        {
            "book_id": 3,
            "title": "David Copperfield",
            "author": "\tCharles Dickens",
            "availability": "N"
        }
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(mockBooks.length);
    for (let i = 0; i < mockBooks.length; i++){
        expect(books[i]).toEqual(mockBooks[i])
    }
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Error in book.js Could not get all books";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

// book.test.js (continue in the same file)
describe("Book.updateBookAvailability", () => {
    // ... mock mssql and other necessary components
    beforeEach(() => {
        jest.clearAllMocks();
      });
    
  
    it("should update the availability of a book", async () => {
        const mockBooks = [
            {
                "book_id": 1,
                "title": "The Adventures of Huckleberry Finn",
                "author": "Mark Twain",
                "availability": "N"
            }
        ];
        jest
        //const spy = jest.spyOn(Book, 'getBookById');
        //spy.mockResolvedValue(mockBooks);

        const mockRequest = {
          query: jest.fn().mockResolvedValue({ rowsAffected: 1, recordset: mockBooks }),
          input: jest.fn().mockResolvedValue(undefined),
        };
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(undefined),
        };
    
        sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
        
        const book = await Book.updateBookAvailability(1, "Y");
    
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.close).toHaveBeenCalledTimes(2);
        expect(book.availability).toBe('N')
    });
  
    it("should return null if book with the given id does not exist", async () => {
        const mockBooks = []
        jest
        //const spy = jest.spyOn(Book, 'getBookById');
        //spy.mockResolvedValue(mockBooks);

        const mockRequest = {
          query: jest.fn().mockResolvedValue({ rowsAffected: 0, recordset: mockBooks }),
          input: jest.fn().mockResolvedValue(undefined),
        };
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(undefined),
        };
    
        sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
        
        const book = await Book.updateBookAvailability(1, "Y");
    
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.close).toHaveBeenCalledTimes(2);
        expect(book).toBe(null)
    });
  
    // Add more tests for error scenarios (e.g., database error)
    it("should handle errors when updating books", async () => {
        const errorMessage = "Error in book.js Could not update book availability";
        sql.connect.mockRejectedValue(new Error(errorMessage));
        await expect(Book.updateBookAvailability()).rejects.toThrow(errorMessage);
      });
  });