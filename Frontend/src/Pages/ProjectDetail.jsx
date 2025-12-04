import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Project from "../api/Project";
import Loader from "../Components/Loader";
import Toaster from "../Components/Toaster";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Project.getFullProjectDetails(projectId);
      const p = res.data.project;
      setProject(p);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch project details"
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const canEdit = () => {
    if (!project || !auth) return false;
    return (
      project.created_by.auth_id === auth.auth_id ||
      project.team_members.some(
        (m) => m.auth_id === auth.auth_id && m.role_in_team === "leader"
      )
    );
  };

  const canDelete = () => {
    if (!project || !auth) return false;
    // Only the original creator who is a student can delete
    return (
      project.created_by.auth_id === auth.auth_id && auth.role === "student"
    );
  };

  const handleLike = async () => {
    try {
      const res = await Project.likeProject(projectId);
      setProject((prev) => ({ ...prev, likes: res.data.likes }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to like project");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (!ok) return false;
    try {
      await Project.deleteProject(projectId);
      navigate("/projects");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
      return false;
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Project Not Found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                {project.type === "solo" ? "Solo Project" : "Team Project"}
              </span>
              <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                {project.category === "mini" ? "Mini Project" : "Full Project"}
              </span>
              <span className="px-2 py-1 rounded bg-gray-100 text-gray-800">
                {project.visibility === "public" ? "Public" : "Private"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
            >
              ❤️ {project.likes}
            </button>
            {canEdit() && (
              <button
                onClick={() => navigate(`/projects/${projectId}/edit`)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit Project
              </button>
            )}
            {/* header actions - deletion moved below Created By */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Guide */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
              Guide
            </h2>
            {project.guide ? (
              <div>
                <p className="font-medium">{project.guide.name}</p>
                <p className="text-gray-600">{project.guide.email}</p>
              </div>
            ) : (
              <p className="italic text-gray-500">No Guide Assigned</p>
            )}
          </div>

          {/* Abstract */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
              Abstract
            </h2>
            <p className="text-gray-700">{project.abstract}</p>
          </div>

          {/* Objective */}
          {project.objective && (
            <div className="bg-white  p-6 rounded-2xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                Objective
              </h2>
              <ul className="list-decimal list-inside space-y-2 text-gray-700">
                {project.objective
                  .split(".")
                  .map((item) => item.trim())
                  .filter((item) => item.length > 0)
                  .map((item, index) => (
                    <li key={index}>{item}.</li>
                  ))}
              </ul>
            </div>
          )}

          {/* Hosted Link */}
          {project.hosted_link && (
            <div className="bg-gradient-to-l from-blue-100 via-purple-100 to-pink-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Project Link</h2>
              <a
                href={project.hosted_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {project.hosted_link}
              </a>
            </div>
          )}

          {/* Paper Publications */}
          {project.ispublished && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                Paper Publications
              </h2>

              <div className="space-y-2 text-gray-700">
                {project.paper_link && (
                  <div>
                    <span className="font-medium mr-2">Paper Link:</span>
                    <a
                      href={project.paper_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {project.paper_link}
                    </a>
                  </div>
                )}

                {(project.conference_name ||
                  project.conference_year ||
                  project.conference_status) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {project.conference_name && (
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">
                        {project.conference_name}
                      </span>
                    )}
                    {project.conference_year && (
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm">
                        {project.conference_year}
                      </span>
                    )}
                    {project.conference_status && (
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          project.conference_status === "prize"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {project.conference_status === "prize"
                          ? "Prize"
                          : "Participation"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Reviews</h2>
              {canEdit() && (
                <span className="text-sm text-gray-500">Upload via Edit</span>
              )}
            </div>
            {project.reviews.length > 0 ? (
              <div className="flex flex-col gap-3">
                {project.reviews.map((r) => (
                  <div
                    key={r.review_number}
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">Review {r.review_number}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews uploaded yet</p>
            )}
          </div>
        </div>

        {/* Right/Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Project Info - Modern Vibrant UI */}
          <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Project Information
            </h2>

            {/* Status Row */}
            <div className="mb-6 flex items-center justify-start gap-3">
              <span className="font-medium text-gray-700 text-lg">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                  project.status === "pending"
                    ? "bg-yellow-400"
                    : project.status === "in-progress"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              >
                {project.status.replace("-", " ").toUpperCase()}
              </span>
            </div>

            {/* Other Fields */}
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Team Name:</span>
                <span className="text-gray-900 font-medium">
                  {project.team_name || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Department:</span>
                <span className="text-gray-900 font-medium">
                  {project.department || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Batch:</span>
                <span className="text-gray-900 font-medium">
                  {project.batch_name || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Created:</span>
                <span className="text-gray-900 font-medium">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Updated:</span>
                <span className="text-gray-900 font-medium">
                  {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          {project.type === "team" && project.team_members.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Team Members</h2>
              <div className="flex flex-col gap-3">
                {project.team_members.map((m) => (
                  <div
                    key={m.auth_id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-gray-500 text-sm">{m.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        m.role_in_team === "leader"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {m.role_in_team}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creator Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Created By</h2>
            <p className="font-medium">{project.created_by.name}</p>
            <p className="text-gray-500 text-sm">{project.created_by.email}</p>
            {canDelete() && (
              <div className="mt-3">
                <button
                  onClick={handleDelete}
                  className="text-sm text-red-600 hover:underline flex items-center gap-2"
                  title="Delete this project"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 6a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProjectDetail;
