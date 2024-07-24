const sql = require('mssql');
const Course = require('../models/course');
const dbConfig = require('../database/dbConfig');

jest.mock('mssql');

describe('Course Model', () => {
  let request;
  let connection;

  beforeEach(() => {
    request = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn()
    };

    connection = {
      request: jest.fn().mockReturnValue(request),
      close: jest.fn()
    };

    sql.connect = jest.fn().mockResolvedValue(connection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create a new course and return the created course', async () => {
      const newCourseData = {
        title: 'Test Course',
        thumbnail: Buffer.from('thumbnail'),
        description: 'Course description',
        details: 'Course details',
        caption: 'Course caption',
        category: 'Test category',
        video: Buffer.from('video')
      };

      const mockResult = {
        recordset: [{ CourseID: 1 }]
      };

      request.query.mockResolvedValue(mockResult);

      const createdCourse = await Course.createCourse(newCourseData);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(request.input).toHaveBeenCalledWith('title', sql.NVarChar, newCourseData.title);
      expect(request.input).toHaveBeenCalledWith('thumbnail', sql.VarBinary, newCourseData.thumbnail);
      expect(request.input).toHaveBeenCalledWith('description', sql.NVarChar, newCourseData.description);
      expect(request.input).toHaveBeenCalledWith('details', sql.NVarChar, newCourseData.details);
      expect(request.input).toHaveBeenCalledWith('caption', sql.NVarChar, newCourseData.caption);
      expect(request.input).toHaveBeenCalledWith('category', sql.NVarChar, newCourseData.category);
      expect(request.input).toHaveBeenCalledWith('video', sql.VarBinary, newCourseData.video);
      expect(request.query).toHaveBeenCalled();
      expect(createdCourse).toBeInstanceOf(Course);
      expect(createdCourse.courseID).toBe(1);
    });
  });

  describe('getCourseById', () => {
    it('should return a course by its ID', async () => {
      const mockResult = {
        recordset: [
          {
            CourseID: 1,
            Title: 'Test Course',
            Thumbnail: Buffer.from('thumbnail'),
            Description: 'Course description',
            Details: 'Course details',
            Caption: 'Course caption',
            Category: 'Test category',
            TotalRate: 0,
            Ratings: 0,
            Video: Buffer.from('video')
          }
        ]
      };

      request.query.mockResolvedValue(mockResult);

      const course = await Course.getCourseById(1);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(request.input).toHaveBeenCalledWith('courseID', sql.Int, 1);
      expect(request.query).toHaveBeenCalled();
      expect(course).toBeInstanceOf(Course);
      expect(course.courseID).toBe(1);
    });

    it('should return null if course not found', async () => {
      const mockResult = {
        recordset: []
      };

      request.query.mockResolvedValue(mockResult);

      const course = await Course.getCourseById(1);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(request.input).toHaveBeenCalledWith('courseID', sql.Int, 1);
      expect(request.query).toHaveBeenCalled();
      expect(course).toBeNull();
    });
  });

  describe('getAllCourses', () => {
    it('should return all courses', async () => {
      const mockResult = {
        recordset: [
          {
            CourseID: 1,
            Title: 'Test Course',
            Thumbnail: Buffer.from('thumbnail'),
            Description: 'Course description',
            Details: 'Course details',
            Caption: 'Course caption',
            Category: 'Test category',
            TotalRate: 0,
            Ratings: 0,
            Video: Buffer.from('video')
          }
        ]
      };

      request.query.mockResolvedValue(mockResult);

      const courses = await Course.getAllCourses();

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(request.query).toHaveBeenCalled();
      expect(courses).toHaveLength(1);
      expect(courses[0]).toBeInstanceOf(Course);
      expect(courses[0].courseID).toBe(1);
    });
  });

  describe('updateCourse', () => {
    it('should update a course and return the updated course', async () => {
      const courseID = 1;
      const updatedData = {
        title: 'Updated Course',
        description: 'Updated description'
      };

      const mockResult = {
        recordset: [
          {
            CourseID: courseID,
            Title: updatedData.title,
            Thumbnail: Buffer.from('thumbnail'),
            Description: updatedData.description,
            Details: 'Course details',
            Caption: 'Course caption',
            Category: 'Test category',
            TotalRate: 0,
            Ratings: 0,
            Video: Buffer.from('video')
          }
        ]
      };

      request.query.mockResolvedValue(mockResult);

      const updatedCourse = await Course.updateCourse(courseID, updatedData);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(request.input).toHaveBeenCalledWith('title', sql.NVarChar, updatedData.title);
      expect(request.input).toHaveBeenCalledWith('description', sql.NVarChar, updatedData.description);
      expect(request.input).toHaveBeenCalledWith('courseID', sql.Int, courseID);
      expect(request.query).toHaveBeenCalled();
      expect(updatedCourse).toBeInstanceOf(Course);
      expect(updatedCourse.courseID).toBe(courseID);
      expect(updatedCourse.title).toBe(updatedData.title);
      expect(updatedCourse.description).toBe(updatedData.description);
    });
  });

  describe('searchCourses', () => {
    it('should return courses that match the search term', async () => {
      const searchTerm = 'Test';
      const mockResult = {
        recordset: [
          {
            CourseID: 1,
            Title: 'Test Course',
            Thumbnail: Buffer.from('thumbnail'),
            Description: 'Course description',
            Details: 'Course details',
            Caption: 'Course caption',
            Category: 'Test category',
            TotalRate: 0,
            Ratings: 0,
            Video: Buffer.from('video')
          }
        ]
      };

      request.query.mockResolvedValue(mockResult);

      const courses = await Course.searchCourses(searchTerm);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(request.query).toHaveBeenCalled();
      expect(courses).toHaveLength(1);
      expect(courses[0]).toBeInstanceOf(Course);
      expect(courses[0].courseID).toBe(1);
    });
  });
});
