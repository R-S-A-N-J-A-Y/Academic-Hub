import React from "react";
import FacultyCard from "./FacultyCard";

const Mentors = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8">Meet Our Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <FacultyCard name="Faculty 1" image="/image.jpeg" />
        <FacultyCard name="Faculty 2" image="/image.jpeg" />
        <FacultyCard name="Faculty 3" image="/image.jpeg" />
        <FacultyCard name="Faculty 4" image="/image.jpeg" />
        <FacultyCard name="Faculty 5" image="/image.jpeg" />
        <FacultyCard name="Faculty 6" image="/image.jpeg" />
        <FacultyCard name="Faculty 7" image="/image.jpeg" />
        <FacultyCard name="Faculty 8" image="/image.jpeg" />
      </div>
    </div>
  );
};

export default Mentors;
