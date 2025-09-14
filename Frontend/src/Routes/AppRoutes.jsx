import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../Layout/AppLayout";

import Dashboard from "../Pages/Dashboard";
import Profile from "../Pages/Profile";
import Mentors from "../Pages/Mentors";
import Notifications from "../Pages/Notifications";
import Register from "../Pages/Register";
import Login from "../Pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
