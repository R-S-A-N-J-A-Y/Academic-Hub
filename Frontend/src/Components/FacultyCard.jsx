import React from "react";
import { CircleUser } from "lucide-react";

const FacultyCard = ({ name }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col h-full">
      {/* Centered Icon Section (instead of image) */}
      <div className="flex items-center justify-center w-full h-48 bg-gray-100">
        <CircleUser size={80} className="text-gray-500" />
      </div>

      {/* Info Section */}
      <div className="p-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-800">{name}</h3>
        <div className="flex gap-4 text-gray-500">
          <button className="hover:text-blue-600 transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5A4.25 4.25 0 0020.5 16.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.75-.88a1.12 1.12 0 110 2.25 1.12 1.12 0 010-2.25z" />
            </svg>
          </button>
          <button className="hover:text-blue-600 transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.34 4.03a1 1 0 01-.21 1.05L8.16 11.58a11.042 11.042 0 005.25 5.25l1.12-1.12a1 1 0 011.05-.21l4.03 1.34a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
