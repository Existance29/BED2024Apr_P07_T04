// user.test.js
const User = require("../models/user");
const fs = require('fs')
//mock fs
jest.mock("fs")

describe("User.getAllUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all users from the database", async () => {
    const mockData = [
        {
          "id": 1,
          "first_name": "John",
          "last_name": "Doe",
          "about_me": "Hi! My name is John Doe",
          "country": "United States",
          "join_date": "2022-06-04T00:00:00.000Z",
          "job_title": "UI/UX Designer",
          "role": "student"
        },
        {
            "id": 2,
            "first_name": "Sig",
            "last_name": "Ma",
            "about_me": "Grindset",
            "country": "New Zealand",
            "join_date": "2024-01-04T00:00:00.000Z",
            "job_title": "",
            "role": "student"
          }
      ]

    //mock the query to return the mssql results
    User.exceptSelectQuery = jest.fn().mockResolvedValue({recordset: mockData})

    const result = await User.getAllUsers() //get the output from the test function

    //check the results
    expect(result).toHaveLength(2)
    expect(User.exceptSelectQuery).toHaveBeenCalled()
    expect(result[0]).toEqual(mockData[0])
    expect(result[1]).toEqual(mockData[1])
  })

  it("should return null when there are no users", async () => {
    const mockData = []

    //mock the query to return the mssql results
    User.exceptSelectQuery = jest.fn().mockResolvedValue({recordset: mockData})

    const results = await User.getAllUsers() //get the output from the test function

    //check the results
    expect(User.exceptSelectQuery).toHaveBeenCalled()
    expect(results).toBeNull()
  });
})

describe("User.getUserById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve a user from the database", async () => {
      const mockData = [
          {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "about_me": "Hi! My name is John Doe",
            "country": "United States",
            "join_date": "2022-06-04T00:00:00.000Z",
            "job_title": "UI/UX Designer",
            "role": "student"
          },
          {
              "id": 2,
              "first_name": "Sig",
              "last_name": "Ma",
              "about_me": "Grindset",
              "country": "New Zealand",
              "join_date": "2024-01-04T00:00:00.000Z",
              "job_title": "",
              "role": "student"
            }
        ]
  
      //mock the query to return the mssql results
      User.exceptSelectQuery = jest.fn().mockResolvedValue({recordset: mockData})
  
      const result = await User.getUserById(1) //get the output from the test function
  
      //check the results
      expect(User.exceptSelectQuery).toHaveBeenCalled()
      expect(result).toEqual(mockData[0])
    })
  
    it("should return null when user is not found", async () => {
      const mockData = []
  
      //mock the query to return the mssql results
      User.exceptSelectQuery = jest.fn().mockResolvedValue({recordset: mockData})
  
      const result = await User.getUserById(1) //get the output from the test function
  
      //check the results
      expect(User.exceptSelectQuery).toHaveBeenCalled()
      expect(result).toBeNull()
    });
})

describe("User.getPrivateUserById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve a user from the database", async () => {
      const mockData = [
          {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "about_me": "Hi! My name is John Doe",
            "country": "United States",
            "join_date": "2022-06-04T00:00:00.000Z",
            "job_title": "UI/UX Designer",
            "role": "student",
            "email": "johndoe@gmail.com"
          },
          {
              "id": 2,
              "first_name": "Sig",
              "last_name": "Ma",
              "about_me": "Grindset",
              "country": "New Zealand",
              "join_date": "2024-01-04T00:00:00.000Z",
              "job_title": "",
              "role": "student",
              "email": "sig@gmail.com"
            }
        ]
  
      //mock the query to return the mssql results
      User.exceptSelectQuery = jest.fn().mockResolvedValue({recordset: mockData})
  
      const result = await User.getPrivateUserById(1) //get the output from the test function
  
      //check the results
      expect(User.exceptSelectQuery).toHaveBeenCalled()
      expect(result).toEqual(mockData[0])
    })
  
    it("should return null when user is not found", async () => {
      const mockData = []
  
      //mock the query to return the mssql results
      User.exceptSelectQuery = jest.fn().mockResolvedValue({recordset: mockData})
  
      const result = await User.getPrivateUserById(1) //get the output from the test function
  
      //check the results
      expect(User.exceptSelectQuery).toHaveBeenCalled()
      expect(result).toBeNull()
    });
})

describe("User.getCompleteUserByID", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve a user from the database", async () => {
        const outputMock = {
            "id": 1,
            "first_name": "Toby",
            "last_name": "Dean",
            "about_me": "Maxing out mastermindz",
            "country": "United States",
            "join_date": "2022-06-04T00:00:00.000Z",
            "job_title": "University Student",
            "role": "student",
            "pic_id": 1,
            "img": "base64-string",
            "quiz_accuracy": 1,
            "questions_completed": 20,
            "completed_courses": [
              {
                "course_id": 8,
                "date_completed": "2023-10-08T00:00:00.000Z"
              }
            ]
          }
        const mockData1 = [
            {
            "id": 1,
            "first_name": "Toby",
            "last_name": "Dean",
            "about_me": "Maxing out mastermindz",
            "country": "United States",
            "join_date": "2022-06-04T00:00:00.000Z",
            "job_title": "University Student",
            "role": "student",
            "pic_id": 1,
            "img": "base64-string"
            }
        ]
  
        //mock the query to return the mssql results
        User.exceptSelectQuery = jest.fn().mockResolvedValue({recordset: mockData1})
        User.getQuizOverall = jest.fn().mockResolvedValue({"quiz_accuracy": 1,"questions_completed": 20})
        User.getCompletedCourses = jest.fn().mockResolvedValue([
            {
              "course_id": 8,
              "date_completed": "2023-10-08T00:00:00.000Z"
            }
          ])
        const result = await User.getCompleteUserByID(1) //get the output from the test function
        
        //check the results
        expect(User.exceptSelectQuery).toHaveBeenCalled()
        expect(result).toEqual(outputMock)
    })
  
    it("should return null when user does not exist", async () => {
      const mockData = []
  
      //mock the query to return the mssql results
      User.exceptSelectQuery = jest.fn().mockResolvedValue({recordset: mockData})
  
      const result = await User.getCompleteUserByID(1) //get the output from the test function
  
      //check the results
      expect(User.exceptSelectQuery).toHaveBeenCalled()
      expect(result).toBeNull()
    });
})

describe("User.getUserByEmail", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve a user from the database", async () => {
      const mockData = [
          {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "about_me": "Hi! My name is John Doe",
            "country": "United States",
            "join_date": "2022-06-04T00:00:00.000Z",
            "job_title": "UI/UX Designer",
            "role": "student",
            "email": "johndoe@gmail.com",
            "password": "hash-password-1"
          },
          {
            "id": 2,
            "first_name": "Sig",
            "last_name": "Ma",
            "about_me": "Grindset",
            "country": "New Zealand",
            "join_date": "2024-01-04T00:00:00.000Z",
            "job_title": "",
            "role": "student",
            "email": "johndoe@gmail.com",
            "password": "hash-password-1"
            }
        ]
  
      //mock the query to return the mssql results
      User.query = jest.fn().mockResolvedValue({recordset: mockData})
  
      const result = await User.getUserByEmail("email") //get the output from the test function
  
      //check the results
      expect(User.query).toHaveBeenCalled()
      expect(result).toEqual(mockData[0])
    })
  
    it("should return null when user is not found", async () => {
      const mockData = []
  
      //mock the query to return the mssql results
      User.query = jest.fn().mockResolvedValue({recordset: mockData})
  
      const result = await User.getUserByEmail("email") //get the output from the test function
  
      //check the results
      expect(User.query).toHaveBeenCalled()
      expect(result).toBeNull()
    });
})

describe("User.createUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should create a user into the database", async () => {
      const mockData = {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "about_me": "Hi! My name is John Doe",
            "country": "United States",
            "join_date": "2022-06-04T00:00:00.000Z",
            "job_title": "UI/UX Designer",
            "role": "student",
            "email": "johndoe@gmail.com",
            "password": "hash-password-1"
          }
  
      //mock the query to return the mssql results
      User.query = jest.fn().mockResolvedValue({recordset: [{id:mockData.id}]})
      fs.readFileSync.mockResolvedValue("base-64-img")
      User.getUserById = jest.fn().mockResolvedValue(mockData)
    
      const result = await User.createUser(mockData) //get the output from the test function
  
      //check the results
      expect(User.query).toHaveBeenCalled()
      expect(result).toEqual(mockData)
    })
  
    it("should return null when user is not found", async () => {
      const mockData = []
  
      //mock the query to return the mssql results
      User.query = jest.fn().mockResolvedValue({recordset: mockData})
  
      const result = await User.getUserByEmail("email") //get the output from the test function
  
      //check the results
      expect(User.query).toHaveBeenCalled()
      expect(result).toBeNull()
    });
})