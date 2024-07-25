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

describe("User.getProfilePic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve a user's profile picture from the database", async () => {
    const mockData = [
      {
        "pic_id": 1,
        "user_id": 1,
        "img": "base64-string-here"
      },
      {
        "pic_id": 2,
        "user_id": 2,
        "img": "base64-string-here"
      }
      ]

    //mock the query to return the mssql results
    User.query = jest.fn().mockResolvedValue({recordset: mockData})

    const result = await User.getProfilePic(1) //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
    expect(result).toEqual(mockData[0])
  })

  it("should return null when user is not found", async () => {
    const mockData = []

    //mock the query to return the mssql results
    User.query = jest.fn().mockResolvedValue({recordset: mockData})

    const result = await User.getProfilePic(1) //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
    expect(result).toBeNull()
  });
})

describe("User.updateProfilePic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the profile picture in the database", async () => {

    //mock the query to return the mssql results (null)
    User.query = jest.fn().mockResolvedValue(null)
  
    await User.updateProfilePic(1,"base-64-string") //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
  })
})

describe("User.updateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the user's info in the database", async () => {

    const sampleData = {
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane@janemail.com",
      "about_me": "my name is jane and i love dough",
      "country": "New Zealand",
      "job_title": "job",
  }
    //mock the query to return the mssql results (null)
    User.query = jest.fn().mockResolvedValue(null)
  
    await User.updateUser(1,sampleData) //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
  })
})

describe("User.updatePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the user's password in the database", async () => {

    const sampleData = {
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane@janemail.com",
      "about_me": "my name is jane and i love dough",
      "country": "New Zealand",
      "job_title": "job",
  }
    //mock the query to return the mssql results (null)
    User.query = jest.fn().mockResolvedValue(null)
  
    await User.updatePassword(1,sampleData) //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
  })
})

describe("User.addSubLecture", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add the sub-lecture to the user in the database", async () => {

    //mock the query to return the mssql results (null)
    User.query = jest.fn().mockResolvedValue({recordset:["test"]})
  
    await User.addSubLecture(1,1) //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
  })
})

describe("User.getCompletedCourses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve a user's completed courses from the database", async () => {
    const mockData = [
      {
        "course_id": 1,
        "date_completed": "2023-10-08T00:00:00.000Z"
      }
    ]

    //mock the query to return the mssql results
    User.query = jest.fn().mockResolvedValue({recordset: mockData})

    const result = await User.getCompletedCourses(1) //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
    expect(result).toEqual(mockData)
  })

  it("should return null when user is not found/no courses completed", async () => {
    const mockData = []

    //mock the query to return the mssql results
    User.query = jest.fn().mockResolvedValue({recordset: mockData})

    const result = await User.getCompletedCourses(1) //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
    expect(result).toBeNull()
  });
})

describe("User.getQuizOverall", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve a user's quiz stats from the database", async () => {
    const mockData = [
      {
        score: 0.5,
        questions: 5
      }
    ]

    const expectedResult = {
      quiz_accuracy: 0.5,
      questions_completed: 5
    }

    //mock the query to return the mssql results
    User.query = jest.fn().mockResolvedValue({recordset: mockData})

    const result = await User.getQuizOverall(1) //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
    expect(result).toEqual(expectedResult)
  })

  it("should handle cases where there are no quiz stats", async () => {
    const mockData = [
      {
        
      }
    ]

    const expectedResult = {
      quiz_accuracy: 0,
      questions_completed: 0
    }

    //mock the query to return the mssql results
    User.query = jest.fn().mockResolvedValue({recordset: mockData})

    const result = await User.getQuizOverall(1) //get the output from the test function

    //check the results
    expect(User.query).toHaveBeenCalled()
    expect(result).toEqual(expectedResult)
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