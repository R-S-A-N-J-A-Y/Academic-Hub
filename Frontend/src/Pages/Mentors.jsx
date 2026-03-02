import { useEffect, useState } from "react";
import FacultyCard from "../Components/FacultyCard";
import { useNavigate } from "react-router-dom";
import Faculty from "../api/Faculty";
import { useAuth } from "../Context/AuthContext";
import Loader from "../Components/Loader";
import { Check, X } from "lucide-react";

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [mode, setMode] = useState(null); // "promote" or "cancel"
  const navigate = useNavigate();

  const isAdmin = auth.role === "coordinator";

  useEffect(() => {
    const fetchFaculties = async () => {
      setLoading(true);
      try {
        if (auth.dept_id) {
          const res = await Faculty.getAllFaculties(auth.dept_id);
          setFaculties(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, [auth.dept_id]);

  if (loading) return <Loader />;

  const toggleSelect = (id, checked) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const canSelect = (faculty) => {
    if (mode === "promote") {
      return !faculty.isguide; // Can only select non-mentors for promotion
    }
    if (mode === "cancel") {
      return faculty.isguide; // Can only select mentors for demotion
    }
    return false;
  };

  const applyBulk = async (isGuide) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    try {
      await Faculty.updateGuideStatus(ids, isGuide);
      // update UI locally
      setFaculties((prev) =>
        prev.map((f) => (ids.includes(f.id) ? { ...f, isguide: isGuide } : f)),
      );
      setSelected(new Set());
      setMode(null);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSingle = async (id, current) => {
    try {
      await Faculty.updateGuideStatus([id], !current);
      setFaculties((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isguide: !current } : f)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
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

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 mb-3">
              Faculty Directory
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and explore all faculty members in your department
            </p>
          </div>
          {isAdmin && (
            <div className="mb-8">
              {mode === null ? (
                <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                  <button
                    onClick={() => setMode("promote")}
                    className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <span className="text-lg">+</span> Promote to Mentor
                  </button>
                  <button
                    onClick={() => setMode("cancel")}
                    className="group relative px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <span className="text-lg">−</span> Cancel as Mentor
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-end bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="text-sm font-medium text-gray-700">
                    {mode === "promote"
                      ? `${selected.size} faculty selected for promotion`
                      : `${selected.size} mentor${selected.size !== 1 ? "s" : ""} selected for demotion`}
                  </span>
                  {selected.size > 0 && (
                    <>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <button
                        onClick={() =>
                          applyBulk(mode === "promote" ? true : false)
                        }
                        className={`inline-flex items-center gap-2 px-5 py-2 font-medium rounded-lg text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                          mode === "promote"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                            : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                        }`}
                      >
                        <Check size={18} />
                        <span>
                          {mode === "promote"
                            ? "Confirm Promotion"
                            : "Confirm Demotion"}
                        </span>
                      </button>
                    </>
                  )}
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button
                    onClick={() => {
                      setMode(null);
                      setSelected(new Set());
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2 font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Faculty Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {faculties.map((f, idx) => (
                <div
                  key={f.id}
                  onClick={() => {
                    if (mode === null) {
                      navigate(`/mentors/${f.user_id}`);
                    }
                  }}
                  className={`${mode === null ? "cursor-pointer" : ""} animate-in fade-in slide-in-from-bottom-4 duration-300`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <FacultyCard
                    name={f.name}
                    isGuide={f.isguide}
                    showCheckbox={isAdmin && mode !== null}
                    checked={selected.has(f.id)}
                    onCheckboxChange={(checked) => {
                      if (canSelect(f)) {
                        toggleSelect(f.id, checked);
                      }
                    }}
                    isDisabled={isAdmin && mode !== null && !canSelect(f)}
                    isAdmin={isAdmin && mode === null}
                    onToggleGuide={() => toggleSingle(f.id, !!f.isguide)}
                    inSelectionMode={isAdmin && mode !== null}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {faculties.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No faculties found
                </h3>
                <p className="text-gray-600">
                  There are currently no faculty members in this department.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faculties;
