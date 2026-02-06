import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";


export default function Admin() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    studentNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    program: "",
    favoriteTopic: "",
    strongestSkill: ""
  });

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const res = await api.get("/students");
    setStudents(res.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  if (editingId) {
    await api.put(`/students/${editingId}`, form);
    alert("Student updated");
  } else {
    await api.post("/students", form);
    alert("Student created");
  }

  setForm({
    studentNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    program: "",
    favoriteTopic: "",
    strongestSkill: ""
  });

  setEditingId(null);
  loadStudents();
}

async function deleteStudent(id) {
  if (!window.confirm("Are you sure you want to delete this student?")) {
    return;
  }

  await api.delete(`/students/${id}`);
  alert("Student deleted");

  loadStudents();
}
function editStudent(student) {
  setForm({
    studentNumber: student.studentNumber,
    password: "", 
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    program: student.program,
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
          <input name="studentNumber" placeholder="Student Number" value={form.studentNumber} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="program" placeholder="Program" value={form.program} onChange={handleChange} />
          <input name="favoriteTopic" placeholder="Favorite Topic" value={form.favoriteTopic} onChange={handleChange} />
          <input name="strongestSkill" placeholder="Strongest Skill" value={form.strongestSkill} onChange={handleChange} />
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
      <th>Name</th>
      <th>Email</th>
      <th>Program</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {students.map((s) => (
      <tr key={s._id}>
        <td>{s.studentNumber}</td>
        <td>{s.firstName} {s.lastName}</td>
        <td>{s.email}</td>
        <td>{s.program}</td>
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
