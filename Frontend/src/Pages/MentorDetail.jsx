import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Faculty from "../api/Faculty";
import Loader from "../Components/Loader";
import { Mail, Linkedin, Github } from "lucide-react"; // icons

const MentorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    mentor: { name: "Unknown", dept: "N/A", email: "N/A" },
    personal_projects: [],
    guided_projects: [],
    stats: { completed: 0, in_progress: 0, rejected: 0, published: 0 },
  });
  const [guidedFilter, setGuidedFilter] = useState("all"); // all | mini | full

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const stats = await Faculty.getMentorStats(id);
        setData(stats);
      } catch (e) {
        setError("Failed to load mentor details");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const renderProjectItem = (p) => {
    // const published = p.ispublished === true || p.ispublished === "true";
    return (
      <div
        key={p.project_id}
        onClick={() => navigate(`/projects/${p.project_id}`)}
        className="relative flex flex-col justify-center items-center p-5 bg-white rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-[1.03] cursor-pointer min-h-[180px]"
      >
        {/* Project type badge in top-right */}
        {p.project_type && (
          <span
            className={`absolute top-3 right-2 text-xs px-2 py-0.5 rounded-full ${
              p.project_type === "full"
                ? "bg-purple-100 text-purple-700"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            {p.project_type === "full" ? "Full Project" : "Mini Project"}
          </span>
        )}

        {/* Centered content */}
        <div className="text-center">
          <h4 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h4>

          <p className="text-xs text-gray-500 mt-1">
            Status:{" "}
            <span
              className={`px-2 py-0.5 rounded-full text-white text-xs ${
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
            <div className="mt-3 text-sm text-gray-700">
              {p.paper_link ? (
                <a
                  href={p.paper_link}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600 font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  📄 View Paper
                </a>
              ) : (
                <span className="italic">
                  {p.conference_name ?? "Conference"}{" "}
                  {p.conference_year ? `(${p.conference_year})` : ""}{" "}
                  {p.conference_status === "prize" && (
                    <span className="ml-2 text-green-600 font-semibold">
                      🏆 Prize Winner
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
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 underline mb-4 text-sm"
        >
          Back
        </button>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen py-6 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-grow">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 underline mb-6 text-sm"
        >
          ← Back to Mentors
        </button>

        {/* Mentor Profile Header */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700">
              {data.mentor?.name?.charAt(0) ?? "M"}
            </div>
            {/* Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {data.mentor?.name}
              </h2>
              <p className="text-sm text-gray-600">{data.mentor?.dept}</p>
              <p className="text-sm text-gray-500">{data.mentor?.email}</p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="text-gray-500 hover:text-blue-600">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <Github size={20} />
            </a>
            <a
              href={`mailto:${data.mentor?.email}`}
              className="text-gray-500 hover:text-red-600"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Mentor Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Completed",
              value: data.stats.completed,
              color: "bg-green-100 text-green-700",
            },
            {
              label: "In Progress",
              value: data.stats.in_progress,
              color: "bg-blue-100 text-blue-700",
            },
            {
              label: "Rejected",
              value: data.stats.rejected,
              color: "bg-red-100 text-red-700",
            },
            {
              label: "Published",
              value: data.stats.published,
              color: "bg-yellow-100 text-yellow-700",
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

        {/* Personal Projects */}
        <div className="mb-12 flex-grow">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            📌 Personal Projects
          </h3>
          {data.personal_projects.length === 0 ? (
            <div className="flex justify-center items-center h-32 bg-white rounded-xl shadow">
              <p className="text-sm text-gray-500">No projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.personal_projects.map(renderProjectItem)}
            </div>
          )}
        </div>

        {/* Guided Projects */}
        {/* Guided Projects */}
        <div className="flex-grow mb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-gray-900">
                🎓 Guided Projects
              </h3>
              <select
                value={guidedFilter}
                onChange={(e) => setGuidedFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              >
                <option value="all">All Projects</option>
                <option value="mini">Mini Projects</option>
                <option value="full">Full Projects</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {data.guided_projects.length} project
              {data.guided_projects.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6"></div>

          {(() => {
            const filteredProjects = data.guided_projects.filter((p) =>
              guidedFilter === "all" ? true : p.project_type === guidedFilter
            );

            if (filteredProjects.length === 0) {
              return (
                <div className="flex justify-center items-center h-40 bg-white rounded-xl shadow-md">
                  <p className="text-sm text-gray-500">
                    No projects found for this filter.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProjects.map((p) => (
                  <div
                    key={p.project_id}
                    onClick={() => navigate(`/projects/${p.project_id}`)}
                    className="relative flex flex-col justify-center items-center p-5 bg-white rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-[1.03] cursor-pointer min-h-[180px]"
                  >
                    {/* Project type badge in top-right */}
                    {p.project_type && (
                      <span
                        className={`absolute top-3 right-2 text-xs px-2 py-0.5 rounded-full ${
                          p.project_type === "full"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {p.project_type === "full"
                          ? "Full Project"
                          : "Mini Project"}
                      </span>
                    )}

                    {/* Centered content */}
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">
                        {p.title}
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        Status:{" "}
                        <span
                          className={`px-2 py-0.5 rounded-full text-white text-xs ${
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
                        <div className="mt-3 text-sm text-gray-700">
                          {p.paper_link ? (
                            <a
                              href={p.paper_link}
                              target="_blank"
                              rel="noreferrer"
                              className="underline text-blue-600 font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              📄 View Paper
                            </a>
                          ) : (
                            <span className="italic">
                              {p.conference_name ?? "Conference"}{" "}
                              {p.conference_year
                                ? `(${p.conference_year})`
                                : ""}{" "}
                              {p.conference_status === "prize" && (
                                <span className="ml-2 text-green-600 font-semibold">
                                  🏆 Prize Winner
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default MentorDetail;
