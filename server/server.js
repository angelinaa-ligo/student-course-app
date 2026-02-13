require("dotenv").config();
const Student = require("./app/models/student");
const bcrypt = require("bcryptjs");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const createApp = require("./config/express");
const connectDB = require("./config/mongoose");
const { port } = require("./config/config");

const studentRoutes = require("./app/routes/studentRoutes");
const courseRoutes = require("./app/routes/courseRoutes");
const authRoutes = require("./app/routes/authRoutes");

const app = createApp();
connectDB().then(() => {
  createDefaultAdmin();
});

async function createDefaultAdmin() {
  try {
    const adminExists = await Student.findOne({ role: "admin" });

    if (!adminExists) {
      

      await Student.create({
        studentNumber: "0000",
        firstName: "System",
        lastName: "Admin",
        address: "N/A",
        city: "N/A",
        phoneNumber: "0000000000",
        email: "admin@admin.com",
        program: "Administration",
        password: "admin123",
        favoriteTopic: "System Control",
        strongestSkill: "Management",
        role: "admin"
      });

      console.log("Default admin created");
      const allStudents = await Student.find();
console.log("Students in DB:", allStudents.length);
    } else {
      console.log("Admin already exists");
      const allStudents = await Student.find();
console.log("Students in DB:", allStudents.length);
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
