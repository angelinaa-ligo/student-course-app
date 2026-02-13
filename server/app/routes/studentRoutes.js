const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');


router.use(protect);
router.post('/', protect, adminOnly, studentController.createStudent);



router.get('/', protect, adminOnly, studentController.getStudents);


router.get('/:id', protect, studentController.getStudentById);


router.put('/:id', protect, studentController.updateStudent);

router.delete('/:id', protect, adminOnly, studentController.deleteStudent);

module.exports = router;
