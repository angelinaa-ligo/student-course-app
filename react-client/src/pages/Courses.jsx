import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [selectedSection, setSelectedSection] = useState({});

  const sections = ["001", "002", "003", "004", "005"];

  const semesters = [
    "Winter 2026",
    "Summer 2026",
    "Fall 2026",
    "Winter 2027",
    "Summer 2027",
    "Fall 2027"
  ];

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

    const duplicatedCourse = courses.some(
      c =>
        c.courseCode === form.courseCode &&
        c.section === form.section &&
        c.semester === form.semester &&
        c._id !== editingId
    );

    if (duplicatedCourse) {
      alert("This course with the same section and semester already exists.");
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
    await api.post(`/courses/${courseId}/students/${loggedStudentId}`);
    alert("Student added");
    loadData();
  }

  async function changeSection(oldCourseId, newCourseId, studentId) {
    await api.delete(`/courses/${oldCourseId}/students/${studentId}`);
    await api.post(`/courses/${newCourseId}/students/${studentId}`);

    alert("Section changed");
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

  /* ---------------- GROUP COURSES ---------------- */

  const groupedCourses = Object.values(
    courses.reduce((acc, course) => {
      const key = `${course.courseCode}-${course.semester}`;

      if (!acc[key]) {
        acc[key] = {
          courseCode: course.courseCode,
          courseName: course.courseName,
          semester: course.semester,
          sections: []
        };
      }

      acc[key].sections.push(course);
      return acc;
    }, {})
  );

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Courses</h1>

        {/* ADMIN CREATE */}
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

              <select
                name="section"
                value={form.section}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Section --</option>
                {sections.map(sec => (
                  <option key={sec}>{sec}</option>
                ))}
              </select>

              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Semester --</option>
                {semesters.map(sem => (
                  <option key={sem}>{sem}</option>
                ))}
              </select>

              <button type="submit">
                {editingId ? "Update Course" : "Create Course"}
              </button>
            </form>

            <hr />
          </>
        )}

        {/* COURSES */}
        {groupedCourses.map(group => {
          const activeCourse =
            group.sections.find(
              s => s._id === selectedSection[group.courseCode]
            ) || group.sections[0];

          // ✅ student enrolled section
          const enrolledSection = group.sections.find(section =>
            section.students?.some(s => s._id === loggedStudentId)
          );

          return (
            <div
              key={group.courseCode + group.semester}
              style={{
                border: "1px solid black",
                marginBottom: "20px",
                padding: "10px"
              }}
            >
              <h3>
                {group.courseCode} - {group.courseName}
              </h3>

              <p>Semester: {group.semester}</p>

              {/* SECTION SELECT */}
              <select
                value={activeCourse._id}
                onChange={e =>
                  setSelectedSection({
                    ...selectedSection,
                    [group.courseCode]: e.target.value
                  })
                }
              >
                {group.sections.map(sec => (
                  <option key={sec._id} value={sec._id}>
                    Section {sec.section}
                  </option>
                ))}
              </select>

              {/* CHANGE SECTION */}
              {role === "student" &&
                enrolledSection &&
                enrolledSection._id !== activeCourse._id && (
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() =>
                      changeSection(
                        enrolledSection._id,
                        activeCourse._id,
                        loggedStudentId
                      )
                    }
                  >
                    Change to this section
                  </button>
                )}

              {/* ADMIN ACTIONS */}
              {role === "admin" && (
  <>
    <button onClick={() => handleEdit(activeCourse)}>
      Edit
    </button>

    <button onClick={() => deleteCourse(activeCourse._id)}>
      Delete
    </button>

    {/* ADD STUDENT (ADMIN) */}
    <div style={{ marginTop: "10px" }}>
      <select
        value={selectedStudent[activeCourse._id] || ""}
        onChange={(e) =>
          setSelectedStudent({
            ...selectedStudent,
            [activeCourse._id]: e.target.value,
          })
        }
      >
        <option value="">-- Select Student --</option>
        {students
          .filter(
            (student) =>
              !activeCourse.students?.some(
                (s) => s._id === student._id
              )
          )
          .map((student) => (
            <option key={student._id} value={student._id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
      </select>

      <button
  onClick={async () => {
    const studentId = selectedStudent[activeCourse._id];
    if (!studentId) return alert("Select a student");

    // 🔎 Find selected student
    const student = students.find(s => s._id === studentId);

    // 🚨 Check if student has program
    if (!student?.program || student.program.trim() === "") {
      alert("Student has no program and cannot be added.");
      return;
    }

    // 🔎 Check if student already in another section
    const alreadyEnrolled = group.sections.some(section =>
      section.students?.some(s => s._id === studentId)
    );

    if (alreadyEnrolled) {
      alert("Student is already enrolled in another section of this course.");
      return;
    }

    await api.post(
      `/courses/${activeCourse._id}/students/${studentId}`
    );

    alert("Student added");
    loadData();
  }}
  style={{ marginLeft: "5px" }}
>
  Add Student
</button>


    </div>
  </>
)}


              <p>Students:</p>

              <ul>
  {activeCourse.students?.map(s => (
    <li key={s._id}>
      {s.firstName} {s.lastName}

      {/* ADMIN can drop anyone */}
      {role === "admin" && (
        <button
          onClick={() =>
            dropCourse(activeCourse._id, s._id)
          }
        >
          Drop
        </button>
      )}

      {/* STUDENT can drop only himself */}
      {role === "student" && s._id === loggedStudentId && (
        <button
          onClick={() =>
            dropCourse(activeCourse._id, s._id)
          }
        >
          Drop
        </button>
      )}
    </li>
  ))}
</ul>


              {/* ENROLL */}
              {role === "student" && !enrolledSection && (
                <button onClick={() => addStudent(activeCourse._id)}>
                  Enroll in this course
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
