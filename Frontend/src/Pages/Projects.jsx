import { useEffect, useState } from "react";
import DropDown from "../Components/DropDown";
import Batch from "../api/Batch";
import Department from "../api/Department";
import Project from "../api/Project";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";

// small utility for status badges
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {String(status || "")
        .replace(/[-\s]+/g, " ")
        .toUpperCase()}
    </span>
  );
};

const ProjectTable = ({ projects, navigate }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-white">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Project
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Team
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Department
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Guide
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr
                key={project.project_id || project.id}
                className="hover:bg-blue-50/50 transition-colors"
              >
                <td className="px-3 py-2 whitespace-normal break-words">
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/projects/${project.project_id || project.id}`
                          )
                        }
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {project.title}
                      </button>
                      {project.visibility === "private" && (
                        <span
                          title="Private project"
                          aria-label="Private project"
                          className="text-gray-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd" // <-- Problematic attribute
                              d="M5 8a3 3 0 116 0v1h1a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2h1V8zm3-1a1 1 0 112 0v1H8V7z"
                              clipRule="evenodd" // <-- Problematic attribute
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {project.abstract}
                    </div>
                  </div>
                </td>

                <td className="px-3 py-2 whitespace-normal break-words">
                  <div className="text-sm text-gray-900">
                    {project.created_by_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.created_by_email}
                  </div>
                </td>

                <td className="px-3 py-2 whitespace-normal break-words">
                  <div className="text-sm text-gray-900">
                    {project.team_name || "Solo"}
                  </div>
                </td>

                <td className="px-3 py-2 whitespace-normal break-words">
                  <div className="text-sm text-gray-900">
                    {project.category === "mini"
                      ? "Mini"
                      : project.category === "full"
                      ? "Full"
                      : project.category || "-"}
                  </div>
                </td>

                <td className="px-3 py-2 whitespace-normal break-words">
                  <div className="text-sm text-gray-900">
                    {project.department || "-"}
                  </div>
                </td>

                <td className="px-3 py-2 whitespace-normal break-words">
                  {getStatusBadge(project.status)}
                </td>

                <td className="px-3 py-2 whitespace-normal break-words">
                  <div className="text-sm text-gray-900">
                    {project.guide_name || "Not Assigned"}
                  </div>
                </td>

                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {project.created_at
                    ? new Date(project.created_at).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmptyState = ({
  selectedBatch,
  selectedDepartment,
  selectedType,
  clearFilters,
}) => (
  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow">
    <div className="w-48 h-48 mb-8">
      <img
        src="https://illustrations.popsy.co/amber/taking-notes.svg"
        alt="No projects"
        className="w-full h-full"
      />
    </div>
    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
      No Projects Found
    </h3>
    <p className="text-gray-600 text-center max-w-sm mb-6">
      {selectedBatch !== "All Batches" ||
      selectedDepartment !== "All Departments" ||
      selectedType !== "All Types"
        ? "Try adjusting your filters to see more projects"
        : "There are no projects available at the moment"}
    </p>
    <button
      onClick={clearFilters}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Clear Filters
    </button>
  </div>
);

const Projects = ({ showGuided = true, noGradient = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [batches, setBatches] = useState(["All Batches"]);
  const [departments, setDepartments] = useState(["All Departments"]);
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedType, setSelectedType] = useState("All Types");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [guidedProjects, setGuidedProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    abstract: "",
    projectType: "solo",
    teamName: "",
    teamMembers: [],
    guideId: "",
    objective: "",
    category: "mini",
    hosted_link: "",
    visibility: "public",
  });
  const [teamMemberEmail, setTeamMemberEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allRes, myRes, guidedRes, batchRes, deptRes] = await Promise.all(
          [
            Project.getAllProjects(),
            Project.getMyProjects(),
            Project.getMyGuidedProjects(),
            Batch.getAllBatches(),
            Department.getAllDepartments(),
          ]
        );

        setAllProjects(allRes?.data || allRes || []);
        setMyProjects(myRes?.data || myRes || []);
        setGuidedProjects(guidedRes?.data || guidedRes || []);

        const batchList = (batchRes?.data || batchRes || []).map(
          (b) => b.batch_name
        );
        const deptList = (deptRes?.data || deptRes || []).map(
          (d) => d.dept_name
        );
        setBatches(["All Batches", ...batchList]);
        setDepartments(["All Departments", ...deptList]);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
        console.log(allProjects);
      }
    };
    fetchData();
  }, []);

  const filterProjects = (projects) => {
    return projects.filter((project) => {
      const batchMatch =
        selectedBatch === "All Batches" || project.batch_name === selectedBatch;
      const deptMatch =
        selectedDepartment === "All Departments" ||
        project.department === selectedDepartment;
      let typeMatch = true;
      if (selectedType === "Mini Project")
        typeMatch = project.category === "mini";
      else if (selectedType === "Full Project")
        typeMatch = project.category === "full";
      return batchMatch && deptMatch && typeMatch;
    });
  };

  const clearFilters = () => {
    setSelectedBatch("All Batches");
    setSelectedDepartment("All Departments");
    setSelectedType("All Types");
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg py-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${
        noGradient ? "" : "bg-gradient-to-b from-blue-50 to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl py-2 font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-600 to-gray-900">
                Projects
              </h1>
              <p className="text-gray-600 mt-2">
                Discover innovative projects and showcase your work
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create Project
            </button>
          </div>
        </div>

        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
          <DropDown
            data={batches}
            name={selectedBatch}
            setter={setSelectedBatch}
          />
          <DropDown
            data={departments}
            name={selectedDepartment}
            setter={setSelectedDepartment}
          />
          <DropDown
            data={["All Types", "Mini Project", "Full Project"]}
            name={selectedType}
            setter={setSelectedType}
          />
          <nav className="flex space-x-4 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              All Projects ({allProjects.length})
            </button>
            <button
              onClick={() => setActiveTab("mine")}
              className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === "mine"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              My Projects ({myProjects.length})
            </button>
            {showGuided && (
              <button
                onClick={() => setActiveTab("guided")}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "guided"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Guided Projects ({guidedProjects.length})
              </button>
            )}
          </nav>
        </div>

        {activeTab === "all" &&
          (() => {
            const filtered = filterProjects(allProjects);
            return filtered.length === 0 ? (
              <EmptyState
                selectedBatch={selectedBatch}
                selectedDepartment={selectedDepartment}
                selectedType={selectedType}
                clearFilters={clearFilters}
              />
            ) : (
              <ProjectTable projects={filtered} navigate={navigate} />
            );
          })()}

        {activeTab === "mine" &&
          (() => {
            const filtered = filterProjects(myProjects);
            return filtered.length === 0 ? (
              <EmptyState
                selectedBatch={selectedBatch}
                selectedDepartment={selectedDepartment}
                selectedType={selectedType}
                clearFilters={clearFilters}
              />
            ) : (
              <ProjectTable projects={filtered} navigate={navigate} />
            );
          })()}

        {showGuided &&
          activeTab === "guided" &&
          (() => {
            const filtered = filterProjects(guidedProjects);
            return filtered.length === 0 ? (
              <EmptyState
                selectedBatch={selectedBatch}
                selectedDepartment={selectedDepartment}
                selectedType={selectedType}
                clearFilters={clearFilters}
              />
            ) : (
              <ProjectTable projects={filtered} navigate={navigate} />
            );
          })()}

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

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const projectData = {
                        title: projectForm.title,
                        abstract: projectForm.abstract,
                        projectType: projectForm.projectType,
                        teamName:
                          projectForm.projectType === "team"
                            ? projectForm.teamName
                            : null,
                        teamMembers:
                          projectForm.projectType === "team"
                            ? projectForm.teamMembers
                            : [],
                        guideId: projectForm.guideId || null,
                        objective: projectForm.objective || null,
                        category: projectForm.category || "mini",
                        hosted_link: projectForm.hosted_link || null,
                        visibility: projectForm.visibility || "public",
                      };
                      await Project.createProject(projectData);
                      setShowCreateModal(false);
                      // reset
                      setProjectForm({
                        title: "",
                        abstract: "",
                        projectType: "solo",
                        teamName: "",
                        teamMembers: [],
                        guideId: "",
                        objective: "",
                        category: "mini",
                        hosted_link: "",
                        visibility: "public",
                      });
                      setTeamMemberEmail("");
                      // refresh
                      const [allRes, myRes, guidedRes] = await Promise.all([
                        Project.getAllProjects(),
                        Project.getMyProjects(),
                        Project.getMyGuidedProjects(),
                      ]);
                      setAllProjects(allRes?.data || allRes || []);
                      setMyProjects(myRes?.data || myRes || []);
                      setGuidedProjects(guidedRes?.data || guidedRes || []);
                    } catch (err) {
                      alert(
                        err.response?.data?.message ||
                          "Failed to create project"
                      );
                    }
                  }}
                  className="space-y-4"
                >
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
                          onChange={(e) =>
                            setProjectForm((p) => ({
                              ...p,
                              projectType: e.target.value,
                            }))
                          }
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
                          onChange={(e) =>
                            setProjectForm((p) => ({
                              ...p,
                              projectType: e.target.value,
                            }))
                          }
                          className="mr-2"
                        />
                        Team Project
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm((p) => ({ ...p, title: e.target.value }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Abstract *
                    </label>
                    <textarea
                      value={projectForm.abstract}
                      onChange={(e) =>
                        setProjectForm((p) => ({
                          ...p,
                          abstract: e.target.value,
                        }))
                      }
                      required
                      rows={4}
                      placeholder="Describe your project in detail..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objective
                    </label>
                    <textarea
                      value={projectForm.objective}
                      onChange={(e) =>
                        setProjectForm((p) => ({
                          ...p,
                          objective: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="What are the main objectives of your project?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={projectForm.category}
                      onChange={(e) =>
                        setProjectForm((p) => ({
                          ...p,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="mini">Mini Project</option>
                      <option value="full">Full Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hosted Link
                    </label>
                    <input
                      type="url"
                      value={projectForm.hosted_link}
                      onChange={(e) =>
                        setProjectForm((p) => ({
                          ...p,
                          hosted_link: e.target.value,
                        }))
                      }
                      placeholder="https://your-project-link.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="visibility"
                          value="public"
                          checked={projectForm.visibility === "public"}
                          onChange={(e) =>
                            setProjectForm((p) => ({
                              ...p,
                              visibility: e.target.value,
                            }))
                          }
                          className="mr-2"
                        />
                        Public
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="visibility"
                          value="private"
                          checked={projectForm.visibility === "private"}
                          onChange={(e) =>
                            setProjectForm((p) => ({
                              ...p,
                              visibility: e.target.value,
                            }))
                          }
                          className="mr-2"
                        />
                        Private
                      </label>
                    </div>
                  </div>

                  {projectForm.projectType === "team" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team Name *
                        </label>
                        <input
                          type="text"
                          value={projectForm.teamName}
                          onChange={(e) =>
                            setProjectForm((p) => ({
                              ...p,
                              teamName: e.target.value,
                            }))
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team Members (Emails)
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
                            onClick={() => {
                              if (
                                teamMemberEmail &&
                                !projectForm.teamMembers.includes(
                                  teamMemberEmail
                                )
                              ) {
                                setProjectForm((p) => ({
                                  ...p,
                                  teamMembers: [
                                    ...p.teamMembers,
                                    teamMemberEmail,
                                  ],
                                }));
                                setTeamMemberEmail("");
                              }
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-1">
                          {projectForm.teamMembers.map((email, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                            >
                              <span className="text-sm">{email}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setProjectForm((p) => ({
                                    ...p,
                                    teamMembers: p.teamMembers.filter(
                                      (em) => em !== email
                                    ),
                                  }))
                                }
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

export default Projects;
