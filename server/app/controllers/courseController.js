const Course = require('../models/course');

// create
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('students');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get by id
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add students
exports.addStudentToCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
