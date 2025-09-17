import { useState } from "react";
import DropDown from "../Components/DropDown";
import FloatingInput from "../Components/FloatingInput";
import Auth from "../api/Auth";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Select Role",
    batch: "Select batch",
    enrollment_no: "",
    department: "",
    designation: "",
  });
  const navigate = useNavigate();
  const { storeAuthData } = useAuth();

  const roleData = ["Student", "Faculty", "Admin"];
  const batchData = ["2022", "2023", "2024"];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase(),
      };

      if (formData.role === "Student") {
        payload.batch_name = formData.batch;
        payload.enrollment_no = formData.enrollment_no.toLowerCase();
      } else if (formData.role === "Faculty") {
        payload.department = formData.department.toLowerCase();
        payload.designation = formData.designation.toLowerCase();
      }

      const res = await Auth.register(payload);

      alert(res.data.message);
      console.log("Server response:", res.data);
      const user = res.data.user;

      const userData = {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      };

      storeAuthData(userData);
      navigate("/");
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <section className="relative h-screen w-full flex bg-gradient-to-b from-purple-500 to-blue-800">
      {/* Left section */}
      <div className="hidden md:flex w-1/3 bg-gradient-to-b from-purple-500 to-blue-800 text-white p-8">
        <div className="max-w-sm mt-20">
          <h1 className="p-5 text-4xl text-center font-bold">
            Your Next Big Idea Starts Here
          </h1>

          <h5 className="p-3 text-xl text-gray-200">
            Join a community of innovators. Register to bring your project to
            life
          </h5>
        </div>
      </div>

      {/* Right section */}
      <div className="flex flex-col justify-center rounded-l-[5rem] items-center w-full md:w-2/3 bg-white p-12 shadow-xl">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>

          {/* Social login */}
          <div className="flex gap-4 mb-6 justify-center">
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              <img src="/google.png" alt="Google" className="w-5 h-5" />
              Sign Up with Google
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-400 text-sm">- OR -</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <FloatingInput
              id="name"
              type="text"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <FloatingInput
              id="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <FloatingInput
              id="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
            />

            {/* Role */}
            <DropDown
              data={roleData}
              name={formData.role}
              setter={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            />

            {/* Student Fields */}
            {formData.role === "Student" && (
              <>
                <DropDown
                  data={batchData}
                  name={formData.batch}
                  setter={(value) =>
                    setFormData((prev) => ({ ...prev, batch: value }))
                  }
                />
                <FloatingInput
                  id="enrollment_no"
                  type="text"
                  label="Enrollment No"
                  value={formData.enrollment_no}
                  onChange={handleChange}
                />
              </>
            )}

            {/* Faculty Fields */}
            {formData.role === "Faculty" && (
              <>
                <FloatingInput
                  id="department"
                  type="text"
                  label="Department"
                  value={formData.department}
                  onChange={handleChange}
                />
                <FloatingInput
                  id="designation"
                  type="text"
                  label="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </>
            )}

            {/* Submit */}
            <button
              className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-600 transition"
              type="submit"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Log In
            </a>
          </p>
        </div>
      </div>

      <img
        src="/register.png"
        alt="illustration"
        className="
          hidden xl:block absolute
          top-68 xl:left-32  
          2xl:top-68 2xl:left-55
        "
      />
    </section>
  );
};

export default Register;
