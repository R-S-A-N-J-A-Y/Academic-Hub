import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../Layout/AppLayout";

import Profile from "../Pages/Profile";
import Mentors from "../Pages/Mentors";
import Notifications from "../Pages/Notifications";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import ProjectDetail from "../Pages/ProjectDetail";
import EditProject from "../Pages/EditProject";
import CreateProject from "../Pages/CreateProject";
import MentorDetail from "../Pages/MentorDetail";
import ProtectedRoute from "./ProtectedRoutes";
import StudentDashboard from "../Pages/StudentDashboard";
import { useAuth } from "../Context/AuthContext";
import FacultyDashboard from "../Pages/FacultyDashboard";
import AdminDashboard from "../Pages/AdminDashboard";
import Projects from "../Pages/Projects";

const AppRoutes = () => {
  const { auth } = useAuth();

  let DashboardComponent;
  if (auth.role === "student") {
    DashboardComponent = StudentDashboard;
  } else if (auth.role === "faculty") {
    DashboardComponent = FacultyDashboard;
  } else if (auth.role === "coordinator") {
    DashboardComponent = AdminDashboard;
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
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/projects/:projectId/edit" element={<EditProject />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
