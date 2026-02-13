import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [editingId, setEditingId] = useState(null);

  const role = localStorage.getItem("role");
  const loggedStudentId = localStorage.getItem("studentId");

  const [form, setForm] = useState({
    courseCode: "",
    courseName: "",
    section: "",
    semester: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const coursesRes = await api.get("/courses");
      setCourses(coursesRes.data);

      if (role === "admin") {
        const studentsRes = await api.get("/students");
        setStudents(studentsRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { courseCode, courseName, section, semester } = form;

    
    if (!courseCode || !courseName || !section || !semester) {
      alert("All fields are required");
      return;
    }

    if (!/^[A-Za-z]{2,4}\d{3}$/.test(courseCode)) {
      alert("Course code must look like COMP123 or MATH101");
      return;
    }

    if (isNaN(section)) {
      alert("Section must be a number");
      return;
    }

   const semesterRegex = /^(winter|summer|fall|spring) 20\d{2}$/i;

if (!semesterRegex.test(semester)) {
  alert("Semester must be Winter, Summer, Fall, or Spring followed by a year (e.g., Summer 2025)");
  return;
}


    const duplicate = courses.some(
      c =>
        c.courseCode === courseCode &&
        c.section === section &&
        c.semester === semester &&
        c._id !== editingId
    );

    if (duplicate) {
      alert("This course already exists");
      return;
    }

    
    if (editingId) {
      await api.put(`/courses/${editingId}`, form);
      alert("Course updated");
    } else {
      await api.post("/courses", form);
      alert("Course created");
    }

    setForm({
      courseCode: "",
      courseName: "",
      section: "",
      semester: ""
    });

    setEditingId(null);
    loadData();
  }

  async function deleteCourse(courseId) {
    if (!window.confirm("Are you sure?")) return;
    await api.delete(`/courses/${courseId}`);
    loadData();
  }

  async function dropCourse(courseId, studentId) {
    if (!window.confirm("Drop this course?")) return;
    await api.delete(`/courses/${courseId}/students/${studentId}`);
    alert("Course dropped");
    loadData();
  }

  async function addStudent(courseId) {
    let studentId;

    if (role === "admin") {
      studentId = selectedStudent[courseId];
      if (!studentId) {
        alert("Select a student first");
        return;
      }
    } else {
      studentId = loggedStudentId;
    }

    let student;

    if (role === "admin") {
      student = students.find(s => s._id === studentId);
    } else {
      const res = await api.get("/auth/me", { withCredentials: true });
      student = res.data;
    }

    if (!student) {
      alert("Student not found");
      return;
    }

    if (!student.program) {
      alert("Student must be assigned to a program before enrolling");
      return;
    }

    const courseToEnroll = courses.find(c => c._id === courseId);

    const alreadyEnrolledSameCode = courses.some(c =>
      c.courseCode === courseToEnroll.courseCode &&
      c.students?.some(s => s._id === studentId)
    );

    if (alreadyEnrolledSameCode) {
      alert("Student is already enrolled in this course code");
      return;
    }

    await api.post(`/courses/${courseId}/students/${studentId}`);
    alert("Student added");
    loadData();
  }

  function handleEdit(course) {
    setEditingId(course._id);
    setForm({
      courseCode: course.courseCode || "",
      courseName: course.courseName || "",
      section: course.section || "",
      semester: course.semester || ""
    });
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Courses</h1>

        {role === "admin" && (
          <>
            <h3>{editingId ? "Edit Course" : "Add Course"}</h3>

            <form onSubmit={handleSubmit}>
              <input name="courseCode" placeholder="Course Code" value={form.courseCode} onChange={handleChange} />
              <input name="courseName" placeholder="Course Name" value={form.courseName} onChange={handleChange} />
              <input name="section" placeholder="Section" value={form.section} onChange={handleChange} />
              <input name="semester" placeholder="Semester" value={form.semester} onChange={handleChange} />
              <button type="submit">{editingId ? "Update Course" : "Create Course"}</button>
            </form>

            <hr />
          </>
        )}

        {courses.map(course => (
          <div key={course._id} style={{ border: "1px solid black", marginBottom: "20px", padding: "10px" }}>
            <h3>{course.courseCode} - {course.courseName}</h3>
            <p>Section: {course.section} | Semester: {course.semester}</p>

            {role === "admin" && (
              <>
                <button onClick={() => handleEdit(course)}>Edit</button>
                <button onClick={() => deleteCourse(course._id)}>Delete</button>
              </>
            )}

            <p>Students:</p>
            <ul>
              {course.students?.map(s => (
                <li key={s._id}>
                  {s.firstName} {s.lastName}
                  <button style={{ marginLeft: "10px" }} onClick={() => dropCourse(course._id, s._id)}>
                    Drop
                  </button>
                </li>
              ))}
            </ul>

            {role === "student" &&
              !course.students?.some(s => s._id === loggedStudentId) && (
                <button onClick={() => addStudent(course._id)}>Enroll in this course</button>
              )}

            {role === "admin" && (
              <>
                <select
                  onChange={e =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [course._id]: e.target.value
                    })
                  }
                >
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>

                <button onClick={() => addStudent(course._id)}>Add Student</button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
