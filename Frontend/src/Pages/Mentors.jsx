import { useEffect, useState } from "react";
import FacultyCard from "../Components/FacultyCard";
import Faculty from "../api/Faculty";
import { useAuth } from "../Context/AuthContext";

const Mentors = () => {
  const [faculties, setFaculties] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.dept_id) {
      Faculty.getFaculties(auth.dept_id).then((data) => {
        setFaculties(data.data);
      });
    }
  }, [auth.dept_id]);

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
