import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Faculty from "../api/Faculty";
import Loader from "../Components/Loader";
import {
  Mail,
  Linkedin,
  Github,
  CheckCircle,
  RotateCw,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";

const StatCard = ({ label, value, Icon }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col items-start transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
    {Icon && <Icon className="h-6 w-6 text-blue-500 mb-3" />}
    <span className="text-sm text-gray-500 mb-1">{label}</span>
    <span className="text-4xl font-bold text-gray-900">{value}</span>
  </div>
);

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    mentor: { name: "Unknown", dept: "N/A", email: "N/A" },
    personal_projects: [],
    guided_projects: [],
    stats: { completed: 0, in_progress: 0, rejected: 0, published: 0 },
  });
  const [guidedFilter, setGuidedFilter] = useState("all");

  useEffect(() => {
    const fetchAll = async () => {
      if (!auth?.id) return;
      setLoading(true);
      setError("");
      try {
        const stats = await Faculty.getMentorStats(auth.id);
        setData(stats);
      } catch (e) {
        setError("Failed to load faculty dashboard");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [auth?.id]);

  const renderProjectItem = (p) => {
    return (
      <div
        key={p.project_id}
        onClick={() => navigate(`/projects/${p.project_id}`)}
        className="relative flex flex-col justify-center items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-[1.03] cursor-pointer min-h-[200px]"
      >
        {p.project_type && (
          <span
            className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium ${
              p.project_type === "full"
                ? "bg-purple-100 text-purple-700"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            {p.project_type === "full" ? "Full Project" : "Mini Project"}
          </span>
        )}

        <div className="text-center w-full">
          <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
            {p.title}
          </h4>

          <p className="text-xs text-gray-500 mb-2">
            Status:{" "}
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-white text-xs font-medium ${
                p.status === "completed"
                  ? "bg-green-600"
                  : p.status === "in-progress"
                    ? "bg-blue-500"
                    : p.status === "rejected"
                      ? "bg-red-500"
                      : "bg-gray-400"
              }`}
            >
              {p.status}
            </span>
          </p>

          {p.ispublished && (
            <div className="mt-4 text-sm">
              {p.paper_link ? (
                <a
                  href={p.paper_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Paper
                </a>
              ) : (
                <span className="text-gray-600 text-xs">
                  {p.conference_name ?? "Conference"}{" "}
                  {p.conference_year ? `(${p.conference_year})` : ""}
                  {p.conference_status === "prize" && (
                    <span className="ml-2 text-green-600 font-semibold">
                      Prize Winner
                    </span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      <style>{`@keyframes blob {0%,100%{transform:translate(0,0)scale(1);}33%{transform:translate(30px,-50px)scale(1.1);}66%{transform:translate(-20px,20px)scale(0.9);}}.animate-blob{animation:blob 7s infinite;}.animation-delay-2000{animation-delay:2s;}.animation-delay-4000{animation-delay:4s;}`}</style>

      <div className="relative z-10 flex flex-col min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-grow">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {data.mentor?.name?.charAt(0) ?? "F"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {data.mentor?.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {data.mentor?.dept}
                </p>
                <p className="text-sm text-gray-500">{data.mentor?.email}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6 sm:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href={`mailto:${data.mentor?.email}`}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <StatCard
              Icon={CheckCircle}
              label="Completed"
              value={data.stats.completed}
            />
            <StatCard
              Icon={RotateCw}
              label="In Progress"
              value={data.stats.in_progress}
            />
            <StatCard
              Icon={XCircle}
              label="Rejected"
              value={data.stats.rejected}
            />
            <StatCard
              Icon={TrendingUp}
              label="Published"
              value={data.stats.published}
            />
          </div>

          <div className="mb-12 flex-grow">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Personal Projects
            </h3>
            {data.personal_projects.length === 0 ? (
              <div className="flex justify-center items-center h-40 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <p className="text-gray-500">No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.personal_projects.map(renderProjectItem)}
              </div>
            )}
          </div>

          <div className="flex-grow mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <h3 className="text-2xl font-bold text-gray-900">
                Guided Projects
              </h3>
              <div className="flex items-center gap-3">
                <select
                  value={guidedFilter}
                  onChange={(e) => setGuidedFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all">All Projects</option>
                  <option value="mini">Mini Projects</option>
                  <option value="full">Full Projects</option>
                </select>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {data.guided_projects.length} project
                  {data.guided_projects.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-6"></div>

            {(() => {
              const filteredProjects = data.guided_projects.filter((p) =>
                guidedFilter === "all" ? true : p.project_type === guidedFilter,
              );

              if (filteredProjects.length === 0) {
                return (
                  <div className="flex justify-center items-center h-40 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <p className="text-gray-500">
                      No projects found for this filter.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProjects.map((p) => renderProjectItem(p))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
