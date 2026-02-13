import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

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

    try {
      await api.put(`/students/${studentId}`, form);
      alert("Profile updated!");
    } catch {
      alert("Update failed");
    }
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Edit Profile</h1>

        <form onSubmit={handleSubmit}>
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" />

          <input name="favoriteTopic" value={form.favoriteTopic} onChange={handleChange} placeholder="Favorite Topic" />
          <input name="strongestSkill" value={form.strongestSkill} onChange={handleChange} placeholder="Strongest Skill" />

          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New Password" />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </>
  );
}
