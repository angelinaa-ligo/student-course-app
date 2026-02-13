import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../pagesCss/Profile.css";
export default function Profile() {
  const studentId = localStorage.getItem("studentId");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    favoriteTopic: "",
    strongestSkill: "",
    password: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await api.get(`/students/${studentId}`);
      setForm({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        address: res.data.address || "",
        city: res.data.city || "",
        phoneNumber: res.data.phoneNumber || "",
        email: res.data.email,
        favoriteTopic: res.data.favoriteTopic || "",
        strongestSkill: res.data.strongestSkill || "",
        password: ""
      });
    } catch {
      alert("Error loading profile");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password
    } = form;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert("First name, last name, and email are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format");
      return;
    }

    if (phoneNumber && !/^\d{10,15}$/.test(phoneNumber)) {
      alert("Phone number must be 10–15 digits");
      return;
    }

    if (password && password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const payload = { ...form };
    if (!password) {
      delete payload.password;
    }

    try {
      await api.put(`/students/${studentId}`, payload);
      alert("Profile updated!");
      setForm({ ...form, password: "" });
    } catch {
      alert("Update failed");
    }
  }

  return (
    <>
      <Navbar />

      <div className="profile-container">
  <h1 className="profile-title">Edit Profile</h1>

  <form onSubmit={handleSubmit} className="profile-form">
    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
    <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
    <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
    <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" />

    <input name="favoriteTopic" value={form.favoriteTopic} onChange={handleChange} placeholder="Favorite Topic" />
    <input name="strongestSkill" value={form.strongestSkill} onChange={handleChange} placeholder="Strongest Skill" />

    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New Password" />

    <button type="submit" className="profile-button">
      Save Changes
    </button>
  </form> 
</div>
    </>
  );
}
