import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [course, setCourse] = useState(null);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      // load student info
      const studentRes = await api.get(`/students/${studentId}`);
      setStudent(studentRes.data);

      // load courses
      const coursesRes = await api.get("/courses");

      const enrolled = coursesRes.data.find(course =>
        course.students?.some(s => s._id === studentId)
      );

      setCourse(enrolled || null);

    } catch (err) {
      console.error(err);
    }
  }

  if (!student) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Dashboard</h1>

        <h2>Student Info</h2>
        <p><b>Name:</b> {student.firstName} {student.lastName}</p>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Student #:</b> {student.studentNumber}</p>
        <p><b>Favorite Topic:</b> {student.favoriteTopic}</p>
        <p><b>Strongest Skill:</b> {student.strongestSkill}</p>
        <p><b>Program:</b> {student.program || "Not Assigned"}</p>
        <hr />

        <h2>Enrollment</h2>

        {course ? (
          <>
            <p><b>Course:</b> {course.courseCode}</p>
            <p><b>Name:</b> {course.courseName}</p>
            <p><b>Section:</b> {course.section}</p>
            <p><b>Semester:</b> {course.semester}</p>
          </>
        ) : (
          <p>Not enrolled in any course</p>
        )}
      </div>
    </>
  );
}
