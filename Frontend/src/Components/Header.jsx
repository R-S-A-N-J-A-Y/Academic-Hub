import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./logo.png";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Mentors", path: "/mentors" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="h-7 w-7" />
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
                isActive
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              {item.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-600 rounded"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
