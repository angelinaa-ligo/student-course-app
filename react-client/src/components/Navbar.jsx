import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <nav className="navbar">
      <h2>Student System</h2>

      <div className="links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/admin">Admin</Link>

        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
