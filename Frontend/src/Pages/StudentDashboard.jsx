import React, { useState, useEffect } from "react";
import Project from "../api/Project";
import { useAuth } from "../Context/AuthContext";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("all-projects");
  const [allProjects, setAllProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {auth} = useAuth()

  // Form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    abstract: "",
    projectType: "solo",
    teamName: "",
    teamMembers: [],
    guideId: "",
  });

  const [teamMemberEmail, setTeamMemberEmail] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allProjectsRes, myProjectsRes, guidesRes] = await Promise.all([
        Project.getAllProjects(),
        Project.getMyProjects(),
        Project.getAvailableGuides({ dept_id: auth.dept_id }),
      ]);

      setAllProjects(allProjectsRes.data);
      setMyProjects(myProjectsRes.data);
      setGuides(guidesRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTeamMember = () => {
    if (teamMemberEmail && !projectForm.teamMembers.includes(teamMemberEmail)) {
      setProjectForm((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, teamMemberEmail],
      }));
      setTeamMemberEmail("");
    }
  };

  const removeTeamMember = (email) => {
    setProjectForm((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((member) => member !== email),
    }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        title: projectForm.title,
        abstract: projectForm.abstract,
        projectType: projectForm.projectType,
        teamName:
          projectForm.projectType === "team" ? projectForm.teamName : null,
        teamMembers:
          projectForm.projectType === "team" ? projectForm.teamMembers : [],
        guideId: projectForm.guideId || null,
      };

      await Project.createProject(projectData);
      setShowCreateModal(false);
      resetForm();
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await Project.deleteProject(projectId);
      fetchData(); // Refresh projects list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  const resetForm = () => {
    setProjectForm({
      title: "",
      abstract: "",
      projectType: "solo",
      teamName: "",
      teamMembers: [],
      guideId: "",
    });
    setTeamMemberEmail("");
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status?.replace("-", " ").toUpperCase()}
      </span>
    );
  };

  const ProjectTable = ({ projects, title }) => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guide
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.project_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {project.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {project.abstract}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {project.created_by_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.created_by_email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {project.team_name || "Solo"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {project.department || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(project.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {project.guide_name || "Not Assigned"}
                  </div>
                  {project.guide_status && (
                    <div className="text-xs text-gray-500">
                      {project.guide_status}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(project.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteProject(project.project_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your projects and view all available projects
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Project
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("all-projects")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all-projects"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Projects ({allProjects.length})
            </button>
            <button
              onClick={() => setActiveTab("my-projects")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "my-projects"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Projects ({myProjects.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === "all-projects" && (
          <ProjectTable projects={allProjects} title="All Projects" />
        )}
        {activeTab === "my-projects" && (
          <ProjectTable projects={myProjects} title="My Projects" />
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Create New Project
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-4">
                  {/* Project Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="projectType"
                          value="solo"
                          checked={projectForm.projectType === "solo"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Solo Project
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="projectType"
                          value="team"
                          checked={projectForm.projectType === "team"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Team Project
                      </label>
                    </div>
                  </div>

                  {/* Basic Project Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={projectForm.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Abstract *
                    </label>
                    <textarea
                      name="abstract"
                      value={projectForm.abstract}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Describe your project in detail..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Team-specific fields */}
                  {projectForm.projectType === "team" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team Name *
                        </label>
                        <input
                          type="text"
                          name="teamName"
                          value={projectForm.teamName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team Members (2-4 members)
                        </label>
                        <div className="flex space-x-2 mb-2">
                          <input
                            type="email"
                            value={teamMemberEmail}
                            onChange={(e) => setTeamMemberEmail(e.target.value)}
                            placeholder="Enter team member email"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={addTeamMember}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-1">
                          {projectForm.teamMembers.map((email, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                            >
                              <span className="text-sm">{email}</span>
                              <button
                                type="button"
                                onClick={() => removeTeamMember(email)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Guide Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Guide (Optional)
                    </label>
                    <select
                      name="guideId"
                      value={projectForm.guideId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a guide</option>
                      {guides.map((guide) => (
                        <option key={guide.user_id} value={guide.user_id}>
                          {guide.name} - {guide.designation} ({guide.department}
                          )
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
