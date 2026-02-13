import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

 async function handleSubmit(e) {
  e.preventDefault();

  try {
    await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );

    
    const me = await api.get("/auth/me", {
      withCredentials: true,
    });

    localStorage.setItem("studentId", me.data.id);
localStorage.setItem("role", me.data.role);
    if (me.data.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    alert("Invalid email or password");
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
