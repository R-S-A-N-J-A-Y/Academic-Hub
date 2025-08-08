import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../Layout/AppLayout";
import Dashboard from "../Pages/Dashboard";
import Profile from "../Pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
