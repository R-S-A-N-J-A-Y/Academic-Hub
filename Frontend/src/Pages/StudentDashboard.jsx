import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import Projects from "./Projects";
import Project from "../api/Project";
import Loader from "../Components/Loader";
import { ClipboardList, RotateCw, CheckCircle, Users } from "lucide-react";

const StatCard = ({ label, value, Icon }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col items-start transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
    {Icon && <Icon className="h-6 w-6 text-blue-500 mb-3" />}
    <span className="text-sm text-gray-500 mb-1">{label}</span>
    <span className="text-4xl font-bold text-gray-900">{value}</span>
  </div>
);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* animated background blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>
      <style>{`@keyframes blob {0%,100%{transform:translate(0,0)scale(1);}33%{transform:translate(30px,-50px)scale(1.1);}66%{transform:translate(-20px,20px)scale(0.9);}}.animate-blob{animation:blob 7s infinite;}.animation-delay-2000{animation-delay:2s;}.animation-delay-4000{animation-delay:4s;}`}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 mb-2">
            {auth.role.charAt(0).toUpperCase() + auth.role.slice(1)} Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your projects and view all available projects
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="flex justify-center items-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <StatCard
                Icon={ClipboardList}
                label="Total Projects"
                value={stats.totalProjects}
              />
              <StatCard
                Icon={RotateCw}
                label="In Progress"
                value={stats.inProgressProjects}
              />
              <StatCard
                Icon={CheckCircle}
                label="Published"
                value={stats.publishedProjects}
              />
              <StatCard
                Icon={Users}
                label="Teams"
                value={stats.teamsParticipated}
              />
            </div>

            <Projects showGuided={false} noGradient={true} />
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
