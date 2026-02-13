import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

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

      <div style={{ padding: "20px" }}>
        <h1>Dashboard</h1>

        {/* 🔹 STUDENT VIEW */}
        {role === "student" && student && (
          <>
            <h2>Student Info</h2>

<p><b>Student #:</b> {student.studentNumber}</p>
<p><b>Name:</b> {student.firstName} {student.lastName}</p>
<p><b>Email:</b> {student.email}</p>

<p><b>Address:</b> {student.address || "Not Provided"}</p>
<p><b>City:</b> {student.city || "Not Provided"}</p>
<p><b>Phone:</b> {student.phoneNumber || "Not Provided"}</p>

<p><b>Program:</b> {student.program || "Not Assigned"}</p>

<p><b>Favorite Topic:</b> {student.favoriteTopic || "Not Provided"}</p>
<p><b>Strongest Skill:</b> {student.strongestSkill || "Not Provided"}</p>

<hr />


            <h2>Enrollment</h2>

            {courses.length > 0 ? (
              courses.map(course => (
                <div key={course._id} style={{ marginBottom: "15px" }}>
                  <p><b>Course:</b> {course.courseCode}</p>
                  <p><b>Name:</b> {course.courseName}</p>
                  <p><b>Section:</b> {course.section}</p>
                  <p><b>Semester:</b> {course.semester}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>Not enrolled in any course</p>
            )}
          </>
        )}

        {/* 🔹 ADMIN VIEW */}
        {role === "admin" && (
          <>
            <h2>All Courses</h2>

            {courses.map(course => (
              <div key={course._id} style={{ marginBottom: "20px" }}>
                <h3>
                  {course.courseCode} - {course.section}
                </h3>
                <p><b>Name:</b> {course.courseName}</p>
                <p><b>Semester:</b> {course.semester}</p>

                <b>Students:</b>
                <ul>
                  {course.students?.map(s => (
                    <li key={s._id}>
                      {s.firstName} {s.lastName}
                    </li>
                  ))}
                </ul>

                <hr />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
