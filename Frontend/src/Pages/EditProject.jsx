import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Project from "../api/Project";
import Loader from "../Components/Loader";
import { useAuth } from "../Context/AuthContext";

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    abstract: "",
    objective: "",
    category: "mini",
    type: "solo",
    status: "pending",
    hosted_link: "",
    visibility: "public",
    ispublished: false,
    paper_link: "",
    conference_name: "",
    conference_year: "",
    conference_status: "participation",
  });

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Project.getFullProjectDetails(projectId);
      const p = res.data.project;
      setProject(p);

      setForm({
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

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch project details"
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      await Project.updateProjectFull(projectId, form);
      // For now, team member modifications are UI-only; backend team edit API is not defined.

      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md w-full shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-2xl shadow-lg px-8 py-10 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Project not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const isTeam = form.type === "team";
  const hasGuide = !!project.guide; // project.guide is set when a guide is assigned

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div>
              <p className="text-md uppercase tracking-[0.2em] text-gray-500">
                Edit Project
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {project.title}
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {auth?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-6 lg:grid-cols-[2fr,1.1fr]">
        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-7"
        >
          {/* Title & type */}
          <div className="grid gap-5 md:grid-cols-[2fr,1fr] items-start">
            <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Project title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Type
              </label>
              <input
                type="text"
                value={form.type === "team" ? "Team" : "Solo"}
                readOnly
                className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-sm text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Status & category */}
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Status
              </label>
              {hasGuide ? (
                <input
                  type="text"
                  value={
                    form.status === "in-progress"
                      ? "In Progress"
                      : form.status.charAt(0).toUpperCase() +
                        form.status.slice(1).replace("-", " ")
                  }
                  readOnly
                  className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-sm text-gray-700 cursor-not-allowed"
                />
              ) : (
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition"
              >
                <option value="mini">Mini</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Visibility
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("visibility", "public")}
                  className={`flex-1 px-3 py-2 rounded-lg border text-md font-medium transition ${
                    form.visibility === "public"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("visibility", "private")}
                  className={`flex-1 px-3 py-2 rounded-lg border text-md font-medium transition ${
                    form.visibility === "private"
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Private
                </button>
              </div>
            </div>
          </div>

          {/* Abstract & Objective */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Abstract
              </label>
              <textarea
                rows={5}
                value={form.abstract}
                onChange={(e) => handleChange("abstract", e.target.value)}
                className="w-full rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Objectives
              </label>
              <textarea
                rows={5}
                value={form.objective}
                onChange={(e) => handleChange("objective", e.target.value)}
                className="w-full rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition resize-none"
                placeholder="List your main objectives..."
              />
            </div>
          </div>

          {/* Hosted link */}
          <div>
            <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
              Hosted link
            </label>
            <input
              type="url"
              value={form.hosted_link}
              onChange={(e) => handleChange("hosted_link", e.target.value)}
              placeholder="https://your-project-link.com"
              className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
            />
          </div>

          {/* Publication section */}
          <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-md font-semibold uppercase tracking-wide text-gray-500">
                  Publications
                </p>
                <p className="text-md text-gray-500">
                  Optional details about papers and conferences
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-md">
                <input
                  type="checkbox"
                  checked={!!form.ispublished}
                  onChange={(e) => handleChange("ispublished", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Published</span>
              </label>
            </div>

            {form.ispublished && (
              <div className="grid gap-4 md:grid-cols-2 mt-2">
                <div>
                  <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                    Paper link
                  </label>
                  <input
                    type="url"
                    value={form.paper_link}
                    onChange={(e) => handleChange("paper_link", e.target.value)}
                    placeholder="https://journal.com/your-paper"
                    className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                    Conference name
                  </label>
                  <input
                    type="text"
                    value={form.conference_name}
                    onChange={(e) =>
                      handleChange("conference_name", e.target.value)
                    }
                    className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                    Conference year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.conference_year}
                    onChange={(e) =>
                      handleChange(
                        "conference_year",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                    Conference status
                  </label>
                  <select
                    value={form.conference_status}
                    onChange={(e) =>
                      handleChange("conference_status", e.target.value)
                    }
                    className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition"
                  >
                    <option value="participation">Participation</option>
                    <option value="prize">Prize</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Team section (read-only) */}
          {isTeam && (
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-md font-semibold uppercase tracking-wide text-gray-500">
                    Team members
                  </p>
                  <p className="text-md text-gray-500">
                    Team information is managed separately and cannot be edited
                    here.
                  </p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Leader: {project.created_by.name}
                </span>
              </div>

              {project.team_members && project.team_members.length > 0 && (
                <div className="space-y-2">
                  <p className="text-md font-semibold uppercase tracking-wide text-gray-500">
                    Selected members
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.team_members.map((m) => (
                      <span
                        key={m.user_id || m.email}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-md text-gray-800 border border-gray-200"
                      >
                        {m.name} ({m.email})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-gray-500">
                Note: Team membership and roles are fixed for this project here
                and must be managed by an administrator or a dedicated team
                management screen.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}`)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>

        {/* Side info card */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-md font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
              Project snapshot
            </p>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              {project.title}
            </h2>
            <div className="space-y-2 text-md text-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Department</span>
                <span>{project.department || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Batch</span>
                <span>{project.batch_name || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Created</span>
                <span>
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Updated</span>
                <span>
                  {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-md text-gray-700 shadow-sm">
            <p className="font-semibold mb-2 text-gray-900">
              Tips for a great project
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep your abstract concise but detailed.</li>
              <li>Use objectives to clearly list your problem goals.</li>
              <li>
                If you have a live demo, always keep the hosted link updated.
              </li>
              <li>Update status as your project progresses.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;


