import React from "react";
import { useAuth } from "../Context/AuthContext";
import Projects from "./Projects";

const StudentDashboard = () => {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {auth.role.charAt(0).toUpperCase() + auth.role.slice(1)}{" "}
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your projects and view all available projects
              </p>
            </div>
          </div>
        </div>

        <Projects showGuided={false} noGradient={true} />
      </div>
    </div>
  );
};

export default StudentDashboard;
