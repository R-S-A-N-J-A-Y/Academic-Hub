import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import Auth from "../api/Auth";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const location = useLocation();
  const { auth, clearAuthData } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Mentors", path: "/mentors" },
    ...(auth?.role === "faculty" || auth?.role === "coordinator" ? [{ name: "Projects", path: "/projects" }] : []),
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
  ];

  const HandleLogout = () => {
    Auth.Logout();
    clearAuthData();
    navigate("/login");
  };

  return (
    <header className="relative flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <GraduationCap color="blue" />
        <span className="text-lg font-bold text-gray-900">AcademicHub</span>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center space-x-5">
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

      {/* Mobile hamburger */}
      <button
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsMobileMenuOpen((v) => !v)}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full inset-x-0 z-50 md:hidden bg-white border-t shadow-lg">
          <div className="flex flex-col py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-5 py-3 text-sm font-medium transition-colors ${
                    isActive ? "text-blue-600 bg-blue-50" : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="px-5 py-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  HandleLogout();
                }}
                className="w-full cursor-pointer p-2 rounded-lg text-sm bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
