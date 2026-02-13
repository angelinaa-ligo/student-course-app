import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../pagesCss/Dashboard.css";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);

  const studentId = localStorage.getItem("studentId");
  const role = localStorage.getItem("role"); 

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {

      
      if (role === "admin") {
        const coursesRes = await api.get("/courses");
        setCourses(coursesRes.data);
        return;
      }

      
      const studentRes = await api.get(`/students/${studentId}`);
      setStudent(studentRes.data);

      const coursesRes = await api.get("/courses");

      
      const enrolledCourses = coursesRes.data.filter(course =>
        course.students?.some(s => s._id === studentId)
      );

      setCourses(enrolledCourses);

    } catch (err) {
      console.error(err);
    }
  }

  if (role !== "admin" && !student) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* 🔹 STUDENT VIEW */}
        {role === "student" && student && (
          <>
  <h2 className="section-title">Student Profile</h2>

  <div className="dashboard-card">
    <div className="info-grid">
      <div className="info-item"><b>Student #:</b> {student.studentNumber}</div>
      <div className="info-item"><b>Name:</b> {student.firstName} {student.lastName}</div>
      <div className="info-item"><b>Email:</b> {student.email}</div>
      <div className="info-item"><b>Address:</b> {student.address || "Not Provided"}</div>
      <div className="info-item"><b>City:</b> {student.city || "Not Provided"}</div>
      <div className="info-item"><b>Phone:</b> {student.phoneNumber || "Not Provided"}</div>
      <div className="info-item"><b>Program:</b> {student.program || "Not Assigned"}</div>
      <div className="info-item"><b>Favorite Topic:</b> {student.favoriteTopic || "Not Provided"}</div>
      <div className="info-item"><b>Strongest Skill:</b> {student.strongestSkill || "Not Provided"}</div>
    </div>
  </div>

  <h2 className="section-title">Enrollment</h2>

  {courses.length > 0 ? (
    courses.map(course => (
      <div key={course._id} className="course-card">
        <p><b>{course.courseCode}</b> - {course.courseName}</p>
        <p>Section: {course.section}</p>
        <p>Semester: {course.semester}</p>
      </div>
    ))
  ) : (
    <div className="dashboard-card">
      Not enrolled in any course
    </div>
  )}
</>
        )}

        {/* 🔹 ADMIN VIEW */}
        {role === "admin" && (
          <>
  <h2 className="section-title">All Courses</h2>

  {courses.map(course => (
    <div key={course._id} className="dashboard-card">
      <h3>{course.courseCode} - Section {course.section}</h3>
      <p><b>Name:</b> {course.courseName}</p>
      <p><b>Semester:</b> {course.semester}</p>

      <b>Students:</b>
      <ul>
        {course.students?.length > 0 ? (
          course.students.map(s => (
            <li key={s._id}>
              {s.firstName} {s.lastName}
            </li>
          ))
        ) : (
          <li>No students enrolled</li>
        )}
      </ul>
    </div>
  ))}
</>
        )}
      </div>
    </>
  );
}
