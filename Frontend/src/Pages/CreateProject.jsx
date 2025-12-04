import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Project from "../api/Project";
import Student from "../api/Student";
import Loader from "../Components/Loader";
import { useAuth } from "../Context/AuthContext";

const CreateProject = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    abstract: "",
    objective: "",
    category: "mini",
    projectType: "solo",
    hosted_link: "",
    visibility: "public",
    teamName: "",
  });

  // Guides (mentors) list for team projects
  const [availableGuides, setAvailableGuides] = useState([]);
  const [guideId, setGuideId] = useState("");
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [guideError, setGuideError] = useState("");

  // Team member email search state
  const [teamSearch, setTeamSearch] = useState("");
  const [teamSearchResults, setTeamSearchResults] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]); // { user_id, name, email }

  const isTeam = form.projectType === "team";

  useEffect(() => {
    const fetchGuides = async () => {
      if (!isTeam || !auth?.dept_id) return;
      try {
        setLoadingGuides(true);
        setGuideError("");
        const res = await Project.getAvailableGuides({ dept_id: auth.dept_id });
        const guides = res?.data || res || [];
        setAvailableGuides(guides);
      } catch (e) {
        setGuideError(
          e.response?.data?.message ||
            "Failed to load mentors for your department"
        );
      } finally {
        setLoadingGuides(false);
      }
    };

    fetchGuides();
  }, [isTeam, auth?.dept_id]);

  // Debounced search for team members
  useEffect(() => {
    if (!isTeam) {
      setTeamSearchResults([]);
      return;
    }

    if (!teamSearch || teamSearch.length < 2) {
      setTeamSearchResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setTeamLoading(true);
        setTeamError("");
        const res = await Student.searchByEmail(teamSearch);
        const list = res?.data || res || [];
        const selectedIds = new Set(selectedMembers.map((m) => m.user_id));
        setTeamSearchResults(list.filter((s) => !selectedIds.has(s.user_id)));
      } catch (e) {
        setTeamError(
          e.response?.data?.message || "Failed to search team members"
        );
        setTeamSearchResults([]);
      } finally {
        setTeamLoading(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [teamSearch, selectedMembers, isTeam]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title,
        abstract: form.abstract,
        projectType: form.projectType,
        teamName: isTeam ? form.teamName : null,
        teamMembers: isTeam
          ? selectedMembers.map((m) => m.email)
          : [],
        guideId: isTeam && guideId ? guideId : null,
        objective: form.objective || null,
        category: form.category || "mini",
        hosted_link: form.hosted_link || null,
        visibility: form.visibility || "public",
      };

      const res = await Project.createProject(payload);
      const createdProject =
        res?.data?.project || res?.project || res?.data || res;

      const newId =
        createdProject?.project_id || createdProject?.id || null;

      if (newId) {
        navigate(`/projects/${newId}`);
      } else {
        navigate("/projects");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div>
              <p className="text-md uppercase tracking-[0.2em] text-gray-500">
                Create Project
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Start a new project
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
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 grid gap-6 lg:grid-cols-[2fr,1.1fr]">
        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-7"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-md text-red-700">
              {error}
            </div>
          )}

          {/* Title & type */}
          <div className="grid gap-5 md:grid-cols-[2fr,1fr] items-start">
            <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Project title <span className="text-red-500">*</span>

              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                placeholder="Enter a clear, descriptive title"
                required
              />
            </div>
            
          </div>

          {/* Status & category & visibility (status is handled by backend as new/pending) */}
          <div className="grid gap-5 md:grid-cols-3">
          <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Type<span className="text-red-500">*</span>
              </label>
              <select
                value={form.projectType}
                onChange={(e) => handleChange("projectType", e.target.value)}
                className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition"
              >
                <option value="solo">Solo</option>
                <option value="team">Team</option>
              </select>
            </div>
            <div>
              <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                Category<span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition"
              >
                <option value="mini">Mini Project</option>
                <option value="full">Full Project</option>
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
                Abstract<span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={form.abstract}
                onChange={(e) => handleChange("abstract", e.target.value)}
                className="w-full rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition resize-none"
                placeholder="Summarize the problem, approach and outcome..."
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

          {/* Team section (name, mentor, email search) */}
          {isTeam && (
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-md font-extrabold uppercase tracking-wide text-gray-400">
                    Team setup
                  </p>
                  <p className="text-md text-gray-600">
                    Define your team name, mentor and members
                  </p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Leader: {auth?.name}
                </span>
              </div>

              {/* Team name */}
              <div>
                <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                  Team name / No<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.teamName}
                  onChange={(e) => handleChange("teamName", e.target.value)}
                  className="w-full rounded-lg bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                  placeholder="e.g. Quantum Coders"
                  required
                />
              </div>

              {/* Mentor / guide */}
              <div>
                <label className="block text-md font-semibold tracking-wide uppercase text-gray-500 mb-2">
                  Mentor / guide (optional)
                </label>
                <select
                  value={guideId}
                  onChange={(e) => setGuideId(e.target.value)}
                  className="w-full rounded-lg bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition"
                >
                  <option value="">
                    {loadingGuides
                      ? "Loading mentors..."
                      : "Select a mentor (optional)"}
                  </option>
                  {availableGuides.map((g) => (
                    <option key={g.user_id} value={g.user_id}>
                      {g.name} ({g.email})
                    </option>
                  ))}
                </select>
                {guideError && (
                  <p className="mt-1 text-md text-red-500">{guideError}</p>
                )}
              </div>

              {/* Team members real-time email search */}
              <div className="space-y-3">
                <div>
                  <label className="block text-md font-semibold tracking-wide uppercase text-slate-400 mb-2">
                    Team members<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Type email to search within your department..."
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                    />
                    {teamLoading && (
                      <span className="absolute right-3 top-2.5 text-md text-gray-400">
                        Searching...
                      </span>
                    )}
                  </div>
                  {teamError && (
                    <p className="mt-1 text-md text-red-500">{teamError}</p>
                  )}

                  {teamSearchResults.length > 0 && (
                    <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                      {teamSearchResults.map((s) => (
                        <button
                          key={s.user_id}
                          type="button"
                          onClick={() => {
                            setSelectedMembers((prev) => [...prev, s]);
                            setTeamSearch("");
                            setTeamSearchResults([]);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-900"
                        >
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-md text-gray-500">{s.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedMembers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-md font-semibold uppercase tracking-wide text-gray-500">
                      Selected members
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMembers.map((m) => (
                        <span
                          key={m.user_id}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-md text-gray-800 border border-gray-200"
                        >
                          {m.email}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedMembers((prev) =>
                                prev.filter((x) => x.user_id !== m.user_id)
                              )
                            }
                          className="ml-1 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-gray-500">
                  Your team must contain members from the same batch and
                  department; invalid combinations will be rejected by the
                  server.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>

        {/* Side info card */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-md font-semibold uppercase tracking-[0.1em] text-gray-500 mb-2">
              Getting started
            </p>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              Design a strong project
            </h2>
            <div className="space-y-2 text-md text-gray-700">
              <p>• Use a short, descriptive title.</p>
              <p>• Make the abstract precise but complete.</p>
              <p>• Clearly list measurable objectives.</p>
              <p>• If you have a demo, add the hosted link.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-md text-gray-700 shadow-sm">
            <p className="font-semibold mb-2 text-gray-900">Team & mentor tips</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Choose teammates you can collaborate with regularly.</li>
              <li>Select a mentor whose expertise matches your domain.</li>
              <li>Keep all members’ emails accurate for communication.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;


