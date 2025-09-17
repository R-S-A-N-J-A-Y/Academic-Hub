import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Auth from "../api/Auth";
import FloatingInput from "../Components/FloatingInput";
import { useAuth } from "../Context/AuthContext";
import Toaster from "../Components/Toaster";

const Login = () => {
  const navigate = useNavigate();
  const { storeAuthData } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [toastVisible, setToastVisible] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setToastVisible(true);

    try {
      const res = await Auth.Login({
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200) {
        const user = res.data.user;

        const userData = {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        };

        storeAuthData(userData);
        setTimeout(() => setToastVisible(false), 3500);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <section className="relative h-screen w-full flex bg-gradient-to-b from-purple-500 to-blue-800">
      <Toaster message="Authentication in backend" visible={toastVisible} />
      {/* Left section (Form now on the left) */}
      <div className="flex flex-col justify-center rounded-r-[5rem] items-center w-full md:w-2/3 bg-white p-12 shadow-xl">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

          {/* Social login */}
          <div className="flex gap-4 mb-6 justify-center">
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              <img src="/google.png" alt="Google" className="w-5 h-5" />
              Log In with Google
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

            {/* Submit */}
            <button
              className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-600 transition"
              type="submit"
            >
              Log In
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>

      {/* Right section (Text content) */}
      <div className="hidden md:flex w-1/3 bg-gradient-to-b from-purple-500 to-blue-800 text-white p-8">
        <div className="max-w-sm mt-15">
          <h1 className="p-5 text-4xl text-center font-bold">
            Welcome Back to Innovation
          </h1>

          <h5 className="p-3 text-xl text-gray-200">
            Log in to continue your journey and explore your projects.
          </h5>
        </div>
      </div>

      {/* Illustration */}
      <img
        src="/login.png"
        alt="illustration"
        className="
          h-100
          hidden xl:block absolute
          top-68 right-50  
          2xl:top-78 2xl:right-80
        "
      />
    </section>
  );
};

export default Login;
