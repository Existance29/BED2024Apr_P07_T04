// userController.test.js

const userController = require("../controllers/userController");
const User = require("../models/user");
const bcrypt = require('bcryptjs')
const fs = require('fs')

// Mock the user model
jest.mock("../models/user")
//mock bcrypt
jest.mock("bcryptjs")
//mock fs
jest.mock("fs")

describe("userController.getAllUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(jest.fn())
  });

  it("should fetch all users and return a JSON response", async () => {
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

    // Mock the model function to return the mock data
    User.getAllUsers.mockResolvedValue(mockData)

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await userController.getAllUsers(req, res);
    expect(User.getAllUsers).toHaveBeenCalledTimes(1); // Check if model was called
    expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    User.getAllUsers.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    //call function
    await userController.getAllUsers(req, res);
    //compare status and error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving users");
  })
})

describe("userController.getUserById", () => {
    const req = {
        params: {id: 1}
    }
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should fetch a user and return a JSON response", async () => {
      const mockData = 
          {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "about_me": "Hi! My name is John Doe",
            "country": "United States",
            "join_date": "2022-06-04T00:00:00.000Z",
            "job_title": "UI/UX Designer",
            "role": "student"
          }
  
      // Mock the model function to return the mock data
      User.getUserById.mockResolvedValue(mockData)
  
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await userController.getUserById(req, res);
      expect(User.getUserById).toHaveBeenCalledTimes(1); // Check if model was called
      expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
    });

    it("should handle cases where user does not exist and return a 404 status with a error message", async () => {
        // Mock the model function to be null
        User.getUserById.mockResolvedValue(null)
    
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        //call function
        await userController.getUserById(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("User not found");
      });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      User.getUserById.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.getUserById(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving users");
    })
})

describe("userController.getPrivateUserById", () => {
    const req = {
        user: {userId: 1}
    }
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should fetch a user and return a JSON response", async () => {
      const mockData = {
        id: 1,
        email: 'johndoe@email.com',
        first_name: 'John',
        last_name: 'Doe',
        about_me: 'Hi! My name is John Doe',
        country: 'United States',
        join_date: "2022-06-04T00:00:00.000Z",
        job_title: 'UI/UX Designer',
        role: 'student'
    }
  
      // Mock the model function to return the mock data
      User.getPrivateUserById.mockResolvedValue(mockData)
  
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await userController.getPrivateUserById(req, res);
      expect(User.getPrivateUserById).toHaveBeenCalledTimes(1); // Check if model was called
      expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
    });

    it("should handle cases where user does not exist and return a 404 status with a error message", async () => {
        // Mock the model function to be null
        User.getPrivateUserById.mockResolvedValue(null)
    
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        //call function
        await userController.getPrivateUserById(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("User not found");
      });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      User.getPrivateUserById.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.getPrivateUserById(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving users");
    })
})

describe("userController.getCompleteUserByID", () => {
    const req = {
        params: {id: 1}
    }
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should fetch a user and return a JSON response", async () => {
      const mockData = {
        id: 1,
        first_name: "Toby",
        last_name: "Dean",
        about_me: "Maxing out mastermindz",
        country: "United States",
        join_date: "2022-06-04T00:00:00.000Z",
        job_title: "University Student",
        role: "student",
        pic_id: 1,
        img: "base64-string",
        quiz_accuracy: 1,
        questions_completed: 20,
        completed_courses: [
            {
                "course_id": 2,
                "date_completed": "2024-07-04T00:00:00.000Z"
            },
            {
                "course_id": 8,
                "date_completed": "2023-10-08T00:00:00.000Z"
            }
        ]

    }
      // Mock the model function to return the mock data
      User.getCompleteUserByID.mockResolvedValue(mockData)
  
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await userController.getCompleteUserByID(req, res);
      expect(User.getCompleteUserByID).toHaveBeenCalledTimes(1); // Check if model was called
      expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
    });

    it("should handle cases where user does not exist and return a 404 status with a error message", async () => {
        // Mock the model function to be null
        User.getCompleteUserByID.mockResolvedValue(null)
    
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        //call function
        await userController.getCompleteUserByID(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("User not found");
      });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      User.getCompleteUserByID.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.getCompleteUserByID(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving users");
    })
})

describe("userController.getProfilePictureByID", () => {
    const req = {
        params: {id: 1}
    }
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should fetch a user's profile picture and return a JSON response", async () => {
      const mockData = {
        "pic_id": 1,
        "user_id": 1,
        "img": "base64-string-here"
      }
      // Mock the model function to return the mock data
      User.getProfilePic.mockResolvedValue(mockData)
  
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await userController.getProfilePictureByID(req, res);
      expect(User.getProfilePic).toHaveBeenCalledTimes(1); // Check if model was called
      expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
    });

    it("should handle cases where user does not exist and return a 404 status with a error message", async () => {
        // Mock the model function to be null
        User.getProfilePic.mockResolvedValue(null)
    
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        //call function
        await userController.getProfilePictureByID(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("User not found");
      });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      User.getProfilePic.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.getProfilePictureByID(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving profile picture of user");
    })
})

describe("userController.getProfilePictureByJWT", () => {
    const req = {
        user: {userId: 1}
    }
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should fetch a user's profile picture and return a JSON response", async () => {
      const mockData = {
        "pic_id": 1,
        "user_id": 1,
        "img": "base64-string-here"
      }
      // Mock the model function to return the mock data
      User.getProfilePic.mockResolvedValue(mockData)
  
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await userController.getProfilePictureByJWT(req, res);
      expect(User.getProfilePic).toHaveBeenCalledTimes(1); // Check if model was called
      expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
    });

    it("should handle cases where user does not exist and return a 404 status with a error message", async () => {
        // Mock the model function to be null
        User.getProfilePic.mockResolvedValue(null)
    
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        //call function
        await userController.getProfilePictureByJWT(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("User not found");
      });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      User.getProfilePic.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.getProfilePictureByJWT(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving profile picture of user");
    })
})

describe("userController.loginUser", () => {
    const req = {
        body: {
            email: "test@gmail.com",
            password: "testa"
        }
    }

    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should log in the user and return a JSON response", async () => {
      const mockData = {
        "accessToken": "jwt here",
        "role": "role"
      }
      //mock bcrypt to return true
      bcrypt.compareSync.mockResolvedValue(true)
      // Mock the model function to return the mock data. Complete data is not required
      User.getUserByEmail.mockResolvedValue({id: 1})
      
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await userController.loginUser(req, res, null, jest.fn().mockReturnValue(mockData))
      expect(User.getUserByEmail).toHaveBeenCalledTimes(1); // Check if model was called
      expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
    })

    it("should handle cases where email is incorrect and return a 404 status with a error message", async () => {
        // Mock the model function to be null, email incorrect
        User.getUserByEmail.mockResolvedValue(null)
    
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        //call function
        await userController.loginUser(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Incorrect login details");
      });
    
    it("should handle cases where password is incorrect and return a 404 status with a error message", async () => {
    // Mock the bycrypt function to be false, password incorrect
    bcrypt.compareSync.mockResolvedValue(false)

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }
    //call function
    await userController.loginUser(req, res);
    //compare status and error message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Incorrect login details");
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      User.getUserByEmail.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.loginUser(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error logging in");
    })
})

describe("userController.createUser", () => {
    const req = {
        body: {
            "first_name": "John",
            "last_name": "Doe",
            "email": "JohnDoe@hotmail.com",
            "password": "password123",
            "about_me": "",
            "country": "United States",
            "job_title": "UI/UX Designer",
            "role": "student"
          }
    }

    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should register the user and return a JSON response with status 201", async () => {
      const mockData = {
        "accessToken": "jwt here",
        "role": "role"
      }
      //mock bcrypt to return hashed password
      bcrypt.hashSync.mockResolvedValue("hashedpassword")
      // Mock the model function (null)
      User.createUser.mockResolvedValue(null)
      
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis()
      };
      
      const mockGenerateAccessToken = jest.fn().mockReturnValue(mockData)
      await userController.createUser(req, res, null, mockGenerateAccessToken)

      expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
      expect(res.status).toHaveBeenCalledWith(201)
    })
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      User.createUser.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.createUser(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error creating user");
    })
})

describe("userController.updateProfilePic", () => {
    const req = {
        user: {userId: 1},
        file: {path: "/path/img.png"}

    }

    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should update the user's profile picture and return a success message with status 201", async () => {
      //mock User.getUserById
      User.getUserById.mockResolvedValue(true)
      // Mock the model function (null)
      User.updateProfilePic.mockResolvedValue(null)
      
      //Mock fs
      fs.readFileSync.mockResolvedValue(null)
      fs.unlinkSync.mockResolvedValue(null)

      const res = {
        send: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis()
      };
      
      await userController.updateProfilePic(req, res)

      expect(res.send).toHaveBeenCalledWith("Profile picture updated successfully"); // Check the response body
      expect(res.status).toHaveBeenCalledWith(201)
    })

    it("should handle case where no file is uploaded and return a error message with status 400", async () => {
        const reqNoFile = {
            user: {userId: 1},
    
        }
  
        const res = {
          send: jest.fn(), // Mock the res.json function
          status: jest.fn().mockReturnThis()
        };
        
        await userController.updateProfilePic(reqNoFile, res)
  
        expect(res.send).toHaveBeenCalledWith("No file uploaded"); // Check the response body
        expect(res.status).toHaveBeenCalledWith(400)
    })

    it("should handle case where user is not found and return a error message with status 404", async () => {
        //mock User.getUserbyId to return null (no user)
        User.getUserById.mockResolvedValue(null)
        const res = {
          send: jest.fn(), // Mock the res.json function
          status: jest.fn().mockReturnThis()
        };
        
        await userController.updateProfilePic(req, res)
  
        expect(res.send).toHaveBeenCalledWith("User not found"); // Check the response body
        expect(res.status).toHaveBeenCalledWith(404)
    })
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      //mock User.getUserbyId to return true (theres a user)
      User.getUserById.mockResolvedValue(true)
      User.updateProfilePic.mockRejectedValue(new Error(errorMessage)); // Simulate an error
        
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.updateProfilePic(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating profile picture");
    })
})

describe("userController.updateUser", () => {
    const req = {
        user: {userId: 1},
    }

    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should update the user's account info and return a json with status 201", async () => {
        mockData = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "John@gmail.com",
            "about_me": "Maxing out mastermindz",
            "country": "United States",
            "job_title": "UI/UX Designer"
        }
        // Mock the model function (null)
        User.updateUser.mockResolvedValue(mockData)

        const res = {
            json: jest.fn(), // Mock the res.json function
            status: jest.fn().mockReturnThis()
        };
        
        await userController.updateUser(req, res)

        expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
        expect(res.status).toHaveBeenCalledWith(201)
    })
  
    it("should handle errors and return a 500 status with error message", async () => {
        const errorMessage = "Database error";
        User.updateUser.mockRejectedValue(new Error(errorMessage)); // Simulate an error
        
        const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
        }

        //call function
        await userController.updateUser(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error updating user");
    })
})

describe("userController.updatePassword", () => {
    const req = {
        user: {userId: 1},
        body: {
            "current_password": "password123",
            "new_password": "moreSecurePass11a%^",
            "repeat_new_password": "thisPassDoesntMatch"
          }
    }

    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should update the user's password and return a json with status 201", async () => {
        mockData = {
            password: "hashed-new-password"
        }
        // Mock the model function (null)
        User.updatePassword.mockResolvedValue(mockData)

        const res = {
            json: jest.fn(), // Mock the res.json function
            status: jest.fn().mockReturnThis()
        };
        
        await userController.updatePassword(req, res)

        expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
        expect(res.status).toHaveBeenCalledWith(201)
    })
  
    it("should handle errors and return a 500 status with error message", async () => {
        const errorMessage = "Database error";
        User.updatePassword.mockRejectedValue(new Error(errorMessage)); // Simulate an error
        
        const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
        }

        //call function
        await userController.updatePassword(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error updating user password");
    })
})

describe("userController.getViewedSubLecturesByCourse", () => {
    const req = {
        params: {cid: 1},
        user: {userId: 1}
    }
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should fetch a user's viewed sublectures and return a JSON response", async () => {
        const mockData = [1,2,3,4,5]
            
        //Mock user found
        User.getViewedSubLecturesByCourse.mockResolvedValue(true)
        // Mock the model function to return the mock data
        User.getViewedSubLecturesByCourse.mockResolvedValue(mockData)

        const res = {
        json: jest.fn(), // Mock the res.json function
        };

        await userController.getViewedSubLecturesByCourse(req, res);
        expect(User.getViewedSubLecturesByCourse).toHaveBeenCalledTimes(1); // Check if model was called
        expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
    });

    it("should handle cases where user does not exist and return a 404 status with a error message", async () => {
        // Mock the model function to be null
        User.getUserById.mockResolvedValue(null)
    
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        //call function
        await userController.getViewedSubLecturesByCourse(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("User not found");
      });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error"
      User.getViewedSubLecturesByCourse.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      // Mock the model function to be true (user found)
      User.getUserById.mockResolvedValue(true)
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.getViewedSubLecturesByCourse(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error getting viewed sub lectures");
    })
})

describe("userController.addSubLecture", () => {
    const req = {
        params: {lid: 1},
        user: {userId: 1}
    }
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should mark a sublecture as viewed and return a sucess message with status 201", async () => {
            
        //Mock user has not viewed sublecture
        User.hasViewedSubLecture.mockResolvedValue(false)
        // Mock the add sublecture model function (returns null)
        User.addSubLecture(null)

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn() // Mock the res.json function
        };

        await userController.addSubLecture(req, res);
        expect(User.hasViewedSubLecture).toHaveBeenCalledTimes(1); // Check if model was called
        expect(User.addSubLecture).toHaveBeenCalledTimes(2); // Check if model was called
        expect(res.send).toHaveBeenCalledWith("success"); // Check the response body
    });

    it("should handle cases where user does not exist and return a 404 status with a error message", async () => {
        // Mock the model function to be null
        User.getUserById.mockResolvedValue(null)
    
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        //call function
        await userController.addSubLecture(req, res);
        //compare status and error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("User not found");
      });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error"
      User.getUserById.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      //call function
      await userController.addSubLecture(req, res);
      //compare status and error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error adding viewed sub-lecture");
    })
})

describe("userController.decodeJWT", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
      jest.spyOn(console, 'error').mockImplementation(jest.fn())
    });
  
    it("should return a json response with status 200", async () => {
        const mockData = {userId: 1, role: "student"}
        const req = {
            user: mockData
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn() // Mock the res.json function
        };

        await userController.decodeJWT(req, res);
        expect(res.status).toHaveBeenCalledWith(200); // Check the status
        expect(res.json).toHaveBeenCalledWith(mockData); // Check the response body
    });
})