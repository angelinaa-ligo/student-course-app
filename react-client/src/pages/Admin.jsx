import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    studentNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    program: "",
    favoriteTopic: "",
    strongestSkill: ""
  });

  const programs = [
    "Software Engineering",
    "Web Development",
    "AI & Data Science",
    "Cyber Security",
    "Game Development"
  ];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const studentsRes = await api.get("/students");
    const coursesRes = await api.get("/courses");
    setStudents(studentsRes.data);
    setCourses(coursesRes.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateStudentForm() {
    if (!form.studentNumber) return "Student Number is required";
    if (!/^\d{6,10}$/.test(form.studentNumber))
      return "Student Number must be 6–10 digits";

    if (!form.firstName.trim()) return "First Name is required";
    if (!form.lastName.trim()) return "Last Name is required";

    if (!form.email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Invalid email format";

    if (!editingId && !form.password)
      return "Password is required for new students";

    if (form.password && form.password.length < 6)
      return "Password must be at least 6 characters";

    if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber))
      return "Phone Number must be 10 digits";

    if (selectedCourse && !form.program)
      return "Student must have a program before being added to a course";

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validateStudentForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let student;

      if (editingId) {
        const res = await api.put(`/students/${editingId}`, form);
        student = res.data;
        alert("Student updated");
      } else {
        const res = await api.post("/students", form);
        student = res.data;
        alert("Student created");
      }

      if (selectedCourse && form.program) {
        await api.post(`/courses/${selectedCourse}/students/${student._id}`);
      }

      setForm({
        studentNumber: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        phoneNumber: "",
        email: "",
        program: "",
        favoriteTopic: "",
        strongestSkill: ""
      });

      setSelectedCourse("");
      setEditingId(null);
      loadData();

    } catch (err) {
      alert("Error saving student");
    }
  }

  async function deleteStudent(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    await api.delete(`/students/${id}`);
    alert("Student deleted");
    loadData();
  }

  function editStudent(student) {
    setForm({
      studentNumber: student.studentNumber,
      password: "",
      firstName: student.firstName,
      lastName: student.lastName,
      address: student.address || "",
      city: student.city || "",
      phoneNumber: student.phoneNumber || "",
      email: student.email,
      program: student.program || "",
      favoriteTopic: student.favoriteTopic || "",
      strongestSkill: student.strongestSkill || ""
    });

    setEditingId(student._id);
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Admin Panel</h1>

        <h3>{editingId ? "Edit Student" : "Add Student"}</h3>

        <form onSubmit={handleSubmit}>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <input name="studentNumber" placeholder="Student Number" value={form.studentNumber} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="favoriteTopic" placeholder="Favorite Topic" value={form.favoriteTopic} onChange={handleChange} />
          <input name="strongestSkill" placeholder="Strongest Skill" value={form.strongestSkill} onChange={handleChange} />

          <select name="program" value={form.program} onChange={handleChange}>
            <option value="">Select Program</option>
            {programs.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="">-- Select Course (Optional) --</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>

          <button type="submit">
            {editingId ? "Update Student" : "Create Student"}
          </button>
        </form>

        <hr />

        <h3>Students</h3>

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student #</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>City</th>
              <th>Phone</th>
              <th>Program</th>
              <th>Favorite Topic</th>
              <th>Strongest Skill</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.studentNumber}</td>
                <td>{s.firstName}</td>
                <td>{s.lastName}</td>
                <td>{s.email}</td>
                <td>{s.address || "-"}</td>
                <td>{s.city || "-"}</td>
                <td>{s.phoneNumber || "-"}</td>
                <td>{s.program || "-"}</td>
                <td>{s.favoriteTopic || "-"}</td>
                <td>{s.strongestSkill || "-"}</td>
                <td>
                  <button onClick={() => editStudent(s)}>Edit</button>
                  <button onClick={() => deleteStudent(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
