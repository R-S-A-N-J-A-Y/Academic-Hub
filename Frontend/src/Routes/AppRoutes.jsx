import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../Layout/AppLayout";

import Profile from "../Pages/Profile";
import Mentors from "../Pages/Mentors";
import Notifications from "../Pages/Notifications";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import ProjectDetail from "../Pages/ProjectDetail";
import MentorDetail from "../Pages/MentorDetail";
import ProtectedRoute from "./ProtectedRoutes";
import StudentDashboard from "../Pages/StudentDashboard";
import { useAuth } from "../Context/AuthContext";
import FacultyDashboard from "../Pages/FacultyDashboard";
import AdminDashboard from "../Pages/AdminDashboard";
import FacultyProjects from "../Pages/FacultyProjects";

const AppRoutes = () => {
  const { auth } = useAuth();

  let DashboardComponent;
  if (auth.role === "student") {
    DashboardComponent = StudentDashboard;
  } else if (auth.role === "faculty") {
    DashboardComponent = FacultyDashboard;
  } else if (auth.role === "admin") {
    DashboardComponent = AdminDashboard;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          {/* Role-based dashboard */}
          <Route index element={<DashboardComponent />} />

          <Route path="/mentors" element={<Mentors />} />
          <Route path="/mentors/:id" element={<MentorDetail />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<FacultyProjects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
