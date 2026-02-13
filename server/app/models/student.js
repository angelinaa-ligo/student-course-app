const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  studentNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: String,
  lastName: String,
  address: String,
  city: String,
  phoneNumber: String,
  email: { type: String, unique: true },
  program: String,
  favoriteTopic: String,
  strongestSkill: String,

  role: { type: String, enum: ['student', 'admin'], default: 'student' }
});


studentSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});


studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
