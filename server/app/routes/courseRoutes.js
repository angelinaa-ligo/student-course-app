const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.use(protect);
router.post('/', protect, adminOnly, courseController.createCourse);


router.get('/', protect, courseController.getCourses);
router.get('/:id', protect, courseController.getCourseById);

router.put('/:id', protect, adminOnly, courseController.updateCourse);
router.delete('/:id', protect, adminOnly, courseController.deleteCourse);


router.post(
  '/:courseId/students/:studentId',
  protect,
  courseController.addStudentToCourse
);

router.delete(
  '/:courseId/students/:studentId',
  protect,
  courseController.removeStudentFromCourse
);

module.exports = router;
