const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/', courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

//add a student
router.post('/:courseId/students/:studentId', courseController.addStudentToCourse);
//remove a student
router.delete('/:courseId/students/:studentId', courseController.removeStudentFromCourse);
module.exports = router;
