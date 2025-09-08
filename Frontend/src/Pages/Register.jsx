import { useState } from "react";
import DropDown from "../Components/DropDown";
import FloatingInput from "../Components/FloatingInput";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Select Role",
    batch: "Select batch",
  });

  const roleData = ["Student", "Guide", "Admin"];
  const batchData = ["2022", "2023", "2024"];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", formData);

    // Example API call
    // fetch("/api/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });
  };

  return (
    <section className="bg-green-200 h-dvh flex items-center justify-end p-25">
      <section className="flex items-center w-[32rem] border rounded-3xl p-6 bg-white shadow-lg">
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          {/* Inputs */}
          <FloatingInput
            id="name"
            type="text"
            label="Name"
            value={formData.name}
            onChange={handleChange}
          />

          <FloatingInput
            id="email"
            type="email"
            label="Email"
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

          {/* Dropdowns */}
          <div className="flex gap-5 items-center">
            <DropDown
              data={roleData}
              name={formData.role}
              setter={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            />
            <DropDown
              data={batchData}
              name={formData.batch}
              setter={(value) =>
                setFormData((prev) => ({ ...prev, batch: value }))
              }
            />
          </div>

          {/* Submit */}
          <button
            className="bg-amber-100 px-4 py-2 rounded-xl font-semibold hover:bg-amber-200 transition cursor-pointer"
            type="submit"
          >
            Create Account
          </button>
        </form>
      </section>
    </section>
  );
};

export default Register;
