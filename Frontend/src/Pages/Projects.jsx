import { useEffect, useState } from "react";
import DropDown from "../Components/DropDown";
import Batch from "../api/Batch";
import Department from "../api/Department";
import Project from "../api/Project";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

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
              onClick={() => navigate("/projects/create")}
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

      </div>
    </div>
  );
};

export default Projects;
