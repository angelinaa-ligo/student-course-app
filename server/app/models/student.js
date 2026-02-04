const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
  studentNumber: { 
    type: String, 
    required: true, 
    unique: true },
  password: { 
    type: String, 
    required: true },
  firstName: String,
  lastName: String,
  address: String,
  city: String,
  phone: String,
  email: String,
  program: String,
  favoriteTopic: String,
  strongestSkill: String,


  role: { type: String, enum: ['student', 'admin'], default: 'student' } //for authentication 
});

module.exports = mongoose.model('student', StudentSchema);
