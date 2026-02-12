import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

 async function handleSubmit(e) {
  e.preventDefault();

  // ADMIN TEMP
  if (email === "admin@test.com" && password === "1234") {
    localStorage.setItem("role", "admin");
    navigate("/admin");
    return;
  }

  try {
    
    const res = await api.get("/students");
    const student = res.data.find(s => s.email === email);

    if (!student) {
      alert("Student not found");
      return;
    }

    localStorage.setItem("role", "student");
    localStorage.setItem("studentId", student._id);

    navigate("/dashboard");
  } catch (err) {
    alert("Login failed");
  }
}




  return (
    <div style={container}>
      <form onSubmit={handleSubmit} style={form}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
// Tempoary css
const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f1f5f9",
};

const form = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};
