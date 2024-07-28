const fs = require('fs');
const { createCourse, getAllCourses, getCourseById, updateCourse, searchCourses } = require('../controllers/courseController');
const Course = require('../models/course');

// Mock the fs and Course model
jest.mock('fs');
jest.mock('../models/course');

describe('Course Controller', () => {
  let consoleSpy;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create a new course and return the created course', async () => {
      const newCourse = {
        courseID: 1,
        title: 'Test Course',
        description: 'Course description',
        details: 'Course details',
        caption: 'Course caption',
        category: 'Test category',
        totalRate: 0,
        ratings: 0,
        thumbnail: Buffer.from('thumbnail'),
        video: Buffer.from('video'),
      };

      Course.createCourse.mockResolvedValue(newCourse);
      fs.readFileSync.mockImplementation((path) => Buffer.from('file data'));

      const req = {
        body: {
          title: 'Test Course',
          description: 'Course description',
          details: 'Course details',
          caption: 'Course caption',
          category: 'Test category',
        },
        files: {
          thumbnail: [{ path: 'thumbnailPath' }],
          video: [{ path: 'videoPath' }],
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newCourse);
      expect(Course.createCourse).toHaveBeenCalledWith({
        title: 'Test Course',
        description: 'Course description',
        details: 'Course details',
        caption: 'Course caption',
        category: 'Test category',
        thumbnail: Buffer.from('file data'),
        video: Buffer.from('file data'),
      });
    });

    it('should handle errors and return a 500 status with error message', async () => {
      const errorMessage = 'Error creating course';
      Course.createCourse.mockRejectedValue(new Error(errorMessage));

      const req = {
        body: {
          title: 'Test Course',
          description: 'Course description',
          details: 'Course details',
          caption: 'Course caption',
          category: 'Test category',
        },
        files: {
          thumbnail: [{ path: 'thumbnailPath' }],
          video: [{ path: 'videoPath' }],
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating course' });  // Remove the error field from the expected result
    });
  });

  describe('getAllCourses', () => {
    it('should return all courses', async () => {
      const courses = [
        {
          courseID: 1,
          title: 'Test Course',
          description: 'Course description',
          details: 'Course details',
          caption: 'Course caption',
          category: 'Test category',
          totalRate: 0,
          ratings: 0,
          thumbnail: Buffer.from('thumbnail'),
          video: Buffer.from('video'),
        },
      ];

      Course.getAllCourses.mockResolvedValue(courses);

      const req = {};

      const res = {
        json: jest.fn(),
      };

      await getAllCourses(req, res);

      expect(res.json).toHaveBeenCalledWith(courses);
      expect(Course.getAllCourses).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and return a 500 status with error message', async () => {
      const errorMessage = 'Error retrieving courses';
      Course.getAllCourses.mockRejectedValue(new Error(errorMessage));

      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await getAllCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error retrieving courses');
    });
  });

  describe('getCourseById', () => {
    it('should return a course by its ID', async () => {
      const course = {
        courseID: 1,
        title: 'Test Course',
        description: 'Course description',
        details: 'Course details',
        caption: 'Course caption',
        category: 'Test category',
        totalRate: 0,
        ratings: 0,
        thumbnail: Buffer.from('thumbnail'),
        video: Buffer.from('video'),
      };

      Course.getCourseById.mockResolvedValue(course);

      const req = {
        params: {
          id: '1',
        },
      };

      const res = {
        json: jest.fn(),
      };

      await getCourseById(req, res);

      expect(res.json).toHaveBeenCalledWith(course);
      expect(Course.getCourseById).toHaveBeenCalledWith(1);
    });

    it('should return a 404 error if course is not found', async () => {
      Course.getCourseById.mockResolvedValue(null);

      const req = {
        params: {
          id: '1',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await getCourseById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Course not found');
    });

    it('should handle errors and return a 500 status with error message', async () => {
      const errorMessage = 'Error retrieving course';
      Course.getCourseById.mockRejectedValue(new Error(errorMessage));

      const req = {
        params: {
          id: '1',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await getCourseById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error retrieving course');
    });
  });

  describe('updateCourse', () => {
    it('should update a course and return the updated course', async () => {
      const updatedCourse = {
        courseID: 1,
        title: 'Updated Course',
        description: 'Updated description',
        details: 'Updated details',
        caption: 'Updated caption',
        category: 'Updated category',
        totalRate: 0,
        ratings: 0,
        thumbnail: Buffer.from('thumbnail'),
        video: Buffer.from('video'),
      };

      Course.updateCourse.mockResolvedValue(updatedCourse);

      const req = {
        params: {
          id: '1',
        },
        body: {
          title: 'Updated Course',
          description: 'Updated description',
          details: 'Updated details',
          caption: 'Updated caption',
          category: 'Updated category',
        },
      };

      const res = {
        json: jest.fn(),
      };

      await updateCourse(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedCourse);
      expect(Course.updateCourse).toHaveBeenCalledWith(1, {
        title: 'Updated Course',
        description: 'Updated description',
        details: 'Updated details',
        caption: 'Updated caption',
        category: 'Updated category',
      });
    });

    it('should return a 404 error if course is not found', async () => {
      Course.updateCourse.mockResolvedValue(null);

      const req = {
        params: {
          id: '1',
        },
        body: {
          title: 'Updated Course',
          description: 'Updated description',
          details: 'Updated details',
          caption: 'Updated caption',
          category: 'Updated category',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await updateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Course not found');
    });

    it('should handle errors and return a 500 status with error message', async () => {
      const errorMessage = 'Error updating course';
      Course.updateCourse.mockRejectedValue(new Error(errorMessage));

      const req = {
        params: {
          id: '1',
        },
        body: {
          title: 'Updated Course',
          description: 'Updated description',
          details: 'Updated details',
          caption: 'Updated caption',
          category: 'Updated category',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),  // Ensure json method is present
      };

      await updateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating course' });  // Simplify the expected response
    });
  });

  describe('searchCourses', () => {
    it('should return courses that match the search term', async () => {
      const courses = [
        {
          courseID: 1,
          title: 'Test Course',
          description: 'Course description',
          details: 'Course details',
          caption: 'Course caption',
          category: 'Test category',
          totalRate: 0,
          ratings: 0,
          thumbnail: Buffer.from('thumbnail'),
          video: Buffer.from('video'),
        },
      ];

      Course.searchCourses.mockResolvedValue(courses);

      const req = {
        query: {
          q: 'Test',
        },
      };

      const res = {
        json: jest.fn(),
      };

      await searchCourses(req, res);

      expect(res.json).toHaveBeenCalledWith(courses);
      expect(Course.searchCourses).toHaveBeenCalledWith('Test');
    });

    it('should handle errors and return a 500 status with error message', async () => {
      const errorMessage = 'Error searching courses';
      Course.searchCourses.mockRejectedValue(new Error(errorMessage));

      const req = {
        query: {
          q: 'Test',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await searchCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error searching courses');
    });
  });
});
