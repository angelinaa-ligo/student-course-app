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
  const courseToEnroll = courses.find(c => c._id === courseId);

  
  if (!student?.program) {
    alert("Student must be assigned to a program before enrolling in a course.");
    return;
  }

  
  const alreadyInSameCourseCode = courses.some(course =>
    course.courseCode === courseToEnroll.courseCode &&
    course.students?.some(s => s._id === studentId)
  );

  if (alreadyInSameCourseCode) {
    alert("Student is already enrolled in this course (different section not allowed).");
    return;
  }

  await api.post(`/courses/${courseId}/students/${studentId}`);
  alert("Student added");
  loadData();
}


let visibleCourses = courses;

 
 if (role === "student") {
  visibleCourses = courses;
}


console.log(courses);
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

        {/* ADMIN ONLY - CREATE COURSE */}
        {role === "admin" && (
          <>
            <h3>{editingId ? "Edit Course" : "Add Course"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                name="courseCode"
                placeholder="Course Code"
                value={form.courseCode}
                onChange={handleChange}
              />
              <input
                name="courseName"
                placeholder="Course Name"
                value={form.courseName}
                onChange={handleChange}
              />
              <input
                name="section"
                placeholder="Section"
                value={form.section}
                onChange={handleChange}
              />
              <input
                name="semester"
                placeholder="Semester"
                value={form.semester}
                onChange={handleChange}
              />
              <button type="submit">
                {editingId ? "Update Course" : "Create Course"}
              </button>
            </form>

            <hr />
          </>
        )}

        {/* COURSES LIST */}
        {visibleCourses.map(course => (
          <div
            key={course._id}
            style={{
              border: "1px solid black",
              marginBottom: "20px",
              padding: "10px"
            }}
          >
            <h3>
              {course.courseCode} - {course.courseName}
            </h3>

            <p>
              Section: {course.section} | Semester: {course.semester}
            </p>

            {/* ADMIN ACTIONS */}
            {role === "admin" && (
              <>
                <button onClick={() => handleEdit(course)}>
  Edit
</button>

                <button onClick={() => deleteCourse(course._id)}>
                  Delete
                </button>
              </>
            )}

            <p>Students:</p>

            <ul>
  {course.students?.map(s => (
    <li key={s._id}>
      {s.firstName} {s.lastName}

      {/* STUDENT DROP */}
      {role === "student" && s._id === loggedStudentId && (
        <button
          style={{ marginLeft: "10px" }}
          onClick={() => dropCourse(course._id, s._id)}
        >
          Drop
        </button>
      )}

      {/* ADMIN DROP */}
      {role === "admin" && (
        <button
          style={{ marginLeft: "10px" }}
          onClick={() => dropCourse(course._id, s._id)}
        >
          Drop
        </button>
      )}
    </li>
  ))}
</ul>

{/* STUDENT ENROLL BUTTON — FORA DO MAP */}
{role === "student" &&
  !course.students?.some(s => s._id === loggedStudentId) && (
    <button onClick={() => addStudent(course._id)}>
      Enroll in this course
    </button>
)}


            {/* ADMIN ADD STUDENT */}
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

                <button onClick={() => addStudent(course._id)}>
                  Add Student
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
