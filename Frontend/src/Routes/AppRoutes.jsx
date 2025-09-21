import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../Layout/AppLayout";

import Dashboard from "../Pages/Dashboard";
import Profile from "../Pages/Profile";
import Mentors from "../Pages/Mentors";
import Notifications from "../Pages/Notifications";
import StudentDashboard from "../Pages/StudentDashboard";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import ProtectedRoute from "./ProtectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
