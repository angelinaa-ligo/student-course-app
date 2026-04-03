const bcrypt = require("bcryptjs");
const Student = require("../models/student");

// create
exports.createStudent = async (req, res) => {
  try {
    const { password, ...otherFields } = req.body;

    //  Validation
    if (!password || password.trim().length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      ...otherFields,
      password: hashedPassword
    });

    res.status(201).json(student);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get by id
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update
exports.updateStudent = async (req, res) => {
  try {
    const { password, ...otherFields } = req.body;

    const updateData = { ...otherFields };

    
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(student);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
