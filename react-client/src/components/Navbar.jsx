import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <h2>Student System</h2>

      <div className="links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/courses">Courses</Link>

        {/* ADMIN */}
        {role === "admin" && <Link to="/admin">Admin</Link>}

        {/* STUDENT */}
        {role === "student" && <Link to="/profile">Edit Profile</Link>}

        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
