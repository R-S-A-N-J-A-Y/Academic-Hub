import React from "react";
import { User, Users, Building, Tag, UserCheck, Calendar } from "lucide-react";

// reusing status badge helper from Projects page may require duplication or import
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
};

const getStatusBadge = (status) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {String(status || "")
        .replace(/[-\s]+/g, " ")
        .toUpperCase()}
    </span>
  );
};

const ProjectCard = ({ project, navigate }) => {
  const id = project.project_id || project.id;
  const handleClick = () => {
    navigate(`/projects/${id}`);
  };

  const categoryLabel =
    project.category === "mini"
      ? "Mini"
      : project.category === "full"
        ? "Full"
        : project.category || "-";

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl shadow-lg"
    >
      {/* Header with title and status badge */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {project.title}
          </h3>
          {project.visibility === "private" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 8a3 3 0 116 0v1h1a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2h1V8zm3-1a1 1 0 112 0v1H8V7z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="flex-shrink-0">{getStatusBadge(project.status)}</div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-600 line-clamp-3">
        {project.abstract}
      </p>

      {/* Info grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-600">
            {project.created_by_name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-600">
            {project.team_name || "Solo"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-600">
            {project.department || "-"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-600">{categoryLabel}</span>
        </div>
        <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
          <UserCheck className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-600">
            {project.guide_name || "Not Assigned"}
          </span>
        </div>
      </div>

      {/* Footer with date */}
      <div className="mt-5 text-right text-xs text-gray-500">
        {project.created_at ? (
          <>
            <Calendar className="inline-block h-4 w-4 mr-1" />
            {new Date(project.created_at).toLocaleDateString()}
          </>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
