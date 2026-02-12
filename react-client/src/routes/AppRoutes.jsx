import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Courses from "../pages/Courses";
import Admin from "../pages/Admin";
import Profile from "../pages/Profile";

import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
  path="/profile"
  element={
    <PrivateRoute role="student">
      <Profile />
    </PrivateRoute>
  }
/>

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <Courses />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
