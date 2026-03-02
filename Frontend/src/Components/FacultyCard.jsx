import React from "react";
import { CircleUser } from "lucide-react";

const FacultyCard = ({
  name,
  isGuide = false,
  showCheckbox = false,
  checked = false,
  onCheckboxChange = () => {},
  isAdmin = false,
  onToggleGuide = null,
  isDisabled = false,
  inSelectionMode = false,
}) => {
  return (
    <div
      className={`group relative h-full rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
        inSelectionMode
          ? "bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm"
          : isGuide
            ? "bg-gradient-to-br from-white to-blue-50/50 hover:from-blue-50 hover:to-blue-100 border border-blue-100/50 hover:border-blue-200 shadow-md hover:shadow-2xl hover:-translate-y-2"
            : "bg-white/70 backdrop-blur-md hover:bg-white border border-white/60 hover:border-white shadow-lg hover:shadow-2xl hover:-translate-y-2"
      } ${
        isDisabled
          ? "opacity-40 cursor-not-allowed pointer-events-none"
          : inSelectionMode
            ? ""
            : "hover:scale-105"
      }`}
    >
      {/* Gradient overlay for mentor cards */}
      {isGuide && !inSelectionMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      )}
      {/* Checkbox (top-left) */}
      {showCheckbox && (
        <label
          className={`absolute left-3 top-3 z-10 cursor-pointer transition-all duration-200 ${
            checked
              ? "bg-blue-500 rounded-md"
              : "bg-white border border-gray-300 rounded-md hover:border-blue-400"
          }`}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckboxChange(e.target.checked)}
            disabled={isDisabled}
            className="h-4 w-4 cursor-pointer appearance-none"
          />
        </label>
      )}

      {/* Mentor badge (floating top-right) */}
      {isGuide && (
        <div className="absolute right-3 top-3 z-10 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 animate-pulse">
          ⭐ Mentor
        </div>
      )}

      {/* Centered Icon Section (instead of image) */}
      <div className="flex items-center justify-center w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Background accent circles */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl"></div>
        </div>
        <CircleUser size={80} className="text-gray-500" />
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col gap-4 flex-1 relative z-10">
        <div>
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {name}
          </h3>
          {isGuide && (
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Academic Mentor
            </p>
          )}
        </div>

        <div className="flex gap-2 items-center mt-auto">
          {isAdmin && onToggleGuide && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleGuide();
              }}
              className="w-full px-3 py-2 text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isGuide ? "Remove Role" : "+ Promote"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
