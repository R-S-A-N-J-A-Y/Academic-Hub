import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import Projects from "./Projects";
import Project from "../api/Project";
import Loader from "../Components/Loader";

const StudentDashboard = () => {
  const { auth } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    inProgressProjects: 0,
    teamsParticipated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await Project.getStudentStats();
        if (res?.success) {
          setStats(res.data);
        } else {
          setError(res?.message || "Failed to load stats");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [auth?.id]);

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

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="flex justify-center items-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: "Total Projects",
                  value: stats.totalProjects,
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  label: "In Progress",
                  value: stats.inProgressProjects,
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  label: "Published",
                  value: stats.publishedProjects,
                  color: "bg-yellow-100 text-yellow-700",
                },
                {
                  label: "Teams",
                  value: stats.teamsParticipated,
                  color: "bg-indigo-100 text-indigo-700",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl shadow bg-white p-6 text-center hover:shadow-md transition flex flex-col justify-center"
                >
                  <div className={`text-sm font-medium ${stat.color}`}>
                    {stat.label}
                  </div>
                  <div className="text-3xl font-bold mt-2">{stat.value}</div>
                </div>
              ))}
            </div>

            <Projects showGuided={false} noGradient={true} />
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
