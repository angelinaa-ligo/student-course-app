import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
const [editingId, setEditingId] = useState(null);

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
    const coursesRes = await api.get("/courses");
    const studentsRes = await api.get("/students");

    setCourses(coursesRes.data);
    setStudents(studentsRes.data);
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


  async function addStudent(courseId) {
    const studentId = selectedStudent[courseId];
    if (!studentId) {
      alert("Select a student first");
      return;
    }

    await api.post(`/courses/${courseId}/students/${studentId}`);
    alert("Student added to course");

    loadData();
  }
function editCourse(course) {
  setForm({
    courseCode: course.courseCode,
    courseName: course.courseName,
    section: course.section,
    semester: course.semester
  });

  setEditingId(course._id);
}
async function deleteCourse(courseId) {
  if (!window.confirm("Are you sure you want to delete this course?")) {
    return;
  }

  await api.delete(`/courses/${courseId}`);
  alert("Course deleted");

  loadData();
}
async function dropCourse(courseId, studentId) {
  if (!window.confirm("Drop this course?")) return;

  await api.delete(`/courses/${courseId}/students/${studentId}`);
  alert("Course dropped");

  loadData();
}

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Courses</h1>

        {/* ADD COURSE */}
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

        {/* COURSES LIST */}
        {courses.map((course) => (
          <div
            key={course._id}
            style={{
              border: "1px solid black",
              marginBottom: "20px",
              padding: "10px",
            }}
          >
            <h3>
              {course.courseCode} - {course.courseName}
            </h3>
              <button onClick={() => editCourse(course)}>Edit</button>
              <button onClick={() => deleteCourse(course._id)}>Delete</button>
            <p>
              Section: {course.section} | Semester: {course.semester}
            </p>

            <p>Students enrolled:</p>
<ul>
  {course.students.map((s) => (
    <li key={s._id}>
      {s.firstName} {s.lastName}
      <button
        style={{ marginLeft: "10px" }}
        onClick={() => dropCourse(course._id, s._id)}
      >
        Drop
      </button>
    </li>
  ))}
</ul>
            {/* ADD STUDENT TO COURSE */}
            <select
              onChange={(e) =>
                setSelectedStudent({
                  ...selectedStudent,
                  [course._id]: e.target.value,
                })
              }
            >
              <option value="">-- Select Student --</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>

            <button onClick={() => addStudent(course._id)}>
              Add Student
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
