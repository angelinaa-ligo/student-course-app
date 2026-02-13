require("dotenv").config();

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
connectDB();


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
