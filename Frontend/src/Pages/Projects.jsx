import { useEffect, useState } from "react";
import DropDown from "../Components/DropDown";
import ProjectCard from "../Components/ProjectCard";
import Batch from "../api/Batch";
import Department from "../api/Department";
import Project from "../api/Project";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";

const EmptyState = ({
  selectedBatch,
  selectedDepartment,
  selectedType,
  clearFilters,
}) => (
  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-lg">
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
      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow hover:shadow-md transition-all duration-200 hover:scale-105"
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
          ],
        );

        setAllProjects(allRes?.data || allRes || []);
        setMyProjects(myRes?.data || myRes || []);
        setGuidedProjects(guidedRes?.data || guidedRes || []);

        const batchList = (batchRes?.data || batchRes || []).map(
          (b) => b.batch_name,
        );
        const deptList = (deptRes?.data || deptRes || []).map(
          (d) => d.dept_name,
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
        noGradient
          ? ""
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
      }`}
    >
      {!noGradient && (
        <>
          {/* Animated background blobs borrowed from Faculty Directory */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          <style>{`
            @keyframes blob {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl py-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600">
                Projects
              </h1>
              <p className="text-gray-600 mt-2">
                Discover innovative projects and showcase your work
              </p>
            </div>
            <button
              onClick={() => navigate("/projects/create")}
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 hover:brightness-110 flex items-center gap-2"
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

        <div className="mb-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 relative z-40 overflow-visible">
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
          <nav className="flex space-x-2 bg-gradient-to-r from-blue-50 to-white p-1 rounded-full shadow-inner">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              All Projects ({allProjects.length})
            </button>
            <button
              onClick={() => setActiveTab("mine")}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                activeTab === "mine"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              My Projects ({myProjects.length})
            </button>
            {showGuided && (
              <button
                onClick={() => setActiveTab("guided")}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeTab === "guided"
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
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
              <div className="flex flex-col gap-6">
                {filtered.map((p) => (
                  <ProjectCard
                    key={p.project_id || p.id}
                    project={p}
                    navigate={navigate}
                  />
                ))}
              </div>
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
              <div className="flex flex-col gap-6">
                {filtered.map((p) => (
                  <ProjectCard
                    key={p.project_id || p.id}
                    project={p}
                    navigate={navigate}
                  />
                ))}
              </div>
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
              <div className="flex flex-col gap-6">
                {filtered.map((p) => (
                  <ProjectCard
                    key={p.project_id || p.id}
                    project={p}
                    navigate={navigate}
                  />
                ))}
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export default Projects;
