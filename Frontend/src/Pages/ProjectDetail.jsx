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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    abstract: "",
    objective: "",
    category: "",
    type: "",
    status: "",
    hosted_link: "",
    visibility: "public",
    ispublished: false,
    paper_link: "",
    conference_name: "",
    conference_year: "",
    conference_status: "participation",
  });
  const [reviewFile, setReviewFile] = useState(null);
  const [uploadingReview, setUploadingReview] = useState(false);

  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Project.getFullProjectDetails(projectId);
      const p = res.data.project;
      setProject(p);
      setEditForm({
        title: p.title,
        abstract: p.abstract || "",
        objective: p.objective || "",
        category: p.category || "mini",
        type: p.type || "solo",
        status: p.status || "pending",
        hosted_link: p.hosted_link || "",
        visibility: p.visibility || "public",
        ispublished: p.ispublished ?? false,
        paper_link: p.paper_link || "",
        conference_name: p.conference_name || "",
        conference_year: p.conference_year ?? "",
        conference_status: p.conference_status || "participation",
      });
      console.log(p);
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await Project.updateProjectFull(projectId, editForm);
      await fetchProjectDetails();
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
    }
  };

  const handleReviewUpload = async () => {
    if (!reviewFile) {
      setError("Please select a file to upload");
      return;
    }
    try {
      setUploadingReview(true);
      const fileUrl = `https://example.com/reviews/${reviewFile.name}`;
      await Project.uploadReview(projectId, fileUrl);
      await fetchProjectDetails();
      setReviewFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload review");
    } finally {
      setUploadingReview(false);
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
                onClick={() => setShowEditModal(true)}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 p-4">
          <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-gray-200">
            {/* Header */}
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
              Edit Project
            </h2>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-6">
              {/* Title & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Type
                  </label>
                  <select
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
                  >
                    <option value="solo">Solo</option>
                    <option value="team">Team</option>
                  </select>
                </div>
              </div>

              {/* Status & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
                  >
                    <option value="mini">Mini</option>
                    <option value="full">Full</option>
                  </select>
                </div>
              </div>

              {/* Abstract & Objective */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Abstract
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.abstract}
                    onChange={(e) =>
                      setEditForm({ ...editForm, abstract: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Objective
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.objective}
                    onChange={(e) =>
                      setEditForm({ ...editForm, objective: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
                  />
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Visibility
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="public"
                      checked={editForm.visibility === "public"}
                      onChange={(e) =>
                        setEditForm({ ...editForm, visibility: e.target.value })
                      }
                      className="accent-purple-500"
                    />
                    Public
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="private"
                      checked={editForm.visibility === "private"}
                      onChange={(e) =>
                        setEditForm({ ...editForm, visibility: e.target.value })
                      }
                      className="accent-purple-500"
                    />
                    Private
                  </label>
                </div>
              </div>

              {/* Hosted Link */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Hosted Link
                </label>
                <input
                  type="url"
                  value={editForm.hosted_link}
                  onChange={(e) =>
                    setEditForm({ ...editForm, hosted_link: e.target.value })
                  }
                  placeholder="https://your-project-link.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
                />
              </div>

              {/* Published */}
              <div className="flex items-center gap-3">
                <input
                  id="ispublished"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={!!editForm.ispublished}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      ispublished: e.target.checked,
                    }))
                  }
                />
                <label htmlFor="ispublished" className="text-sm text-gray-700">
                  Published
                </label>
              </div>

              {editForm.ispublished ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Paper Link */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="paper_link"
                      className="text-sm text-gray-700 mb-1"
                    >
                      Paper Link
                    </label>
                    <input
                      id="paper_link"
                      type="url"
                      placeholder="https://your-paper-link.com"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      value={editForm.paper_link ?? ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          paper_link: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Conference Name */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="conference_name"
                      className="text-sm text-gray-700 mb-1"
                    >
                      Conference Name
                    </label>
                    <input
                      id="conference_name"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      value={editForm.conference_name ?? ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          conference_name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Conference Year */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="conference_year"
                      className="text-sm text-gray-700 mb-1"
                    >
                      Conference Year
                    </label>
                    <input
                      id="conference_year"
                      type="number"
                      min="1900"
                      max="2100"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      value={editForm.conference_year ?? ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          conference_year:
                            e.target.value === "" ? "" : Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  {/* Conference Status */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="conference_status"
                      className="text-sm text-gray-700 mb-1"
                    >
                      Conference Status
                    </label>
                    <select
                      id="conference_status"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      value={editForm.conference_status ?? "participation"}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          conference_status: e.target.value,
                        }))
                      }
                    >
                      <option value="participation">Participation</option>
                      <option value="prize">Prize</option>
                    </select>
                  </div>
                </div>
              ) : null}

              {/* Review Upload */}
              <div className="pt-5 border-t flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  Upload Review
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setReviewFile(e.target.files[0])}
                    className="text-sm text-gray-500"
                  />
                  {reviewFile && (
                    <button
                      type="button"
                      onClick={handleReviewUpload}
                      disabled={uploadingReview}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                      {uploadingReview ? "Uploading..." : "Upload"}
                    </button>
                  )}
                </div>
                {reviewFile && (
                  <p className="text-sm text-gray-500">
                    Selected: {reviewFile.name}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 border rounded-xl text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
