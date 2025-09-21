import { useEffect, useState } from "react";
import FacultyCard from "../Components/FacultyCard";
import Faculty from "../api/Faculty";

const Mentors = () => {
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await Faculty.getFaculties(1);
        setFaculties(data.data);
      } catch (err) {
        console.log("Error", err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Meet Our Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {faculties.map((f) => (
          <FacultyCard key={f.id} name={f.name} image="/image.jpeg" />
        ))}
      </div>
    </div>
  );
};

export default Mentors;
