import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import Auth from "../api/Auth";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const location = useLocation();
  const { auth, clearAuthData } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Mentors", path: "/mentors" },
    ...(auth?.role === "faculty" ? [{ name: "Projects", path: "/projects" }] : []),
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
  ];

  const HandleLogout = () => {
    Auth.Logout();
    clearAuthData();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <GraduationCap color="blue" />
        <span className="text-lg font-bold text-gray-900">AcademicHub</span>
      </div>

      <nav className="flex items-center space-x-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative text-sm font-medium py-2 px-3 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
              }`}
            >
              {item.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-600 rounded"></span>
              )}
            </Link>
          );
        })}
        <button
          onClick={HandleLogout}
          className="cursor-pointer p-2 rounded-lg text-sm bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
