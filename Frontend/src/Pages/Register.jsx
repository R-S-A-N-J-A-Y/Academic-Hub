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
    enrollment_no: "",
    department: "",
    designation: "",
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
    <section className="bg-green-200 h-dvh p-25 bg-[url('/register.png')]">
      <section className="absolute end-10 top-40 flex items-center w-[32rem] border rounded-3xl p-6 bg-white shadow-lg">
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          {/* Common Inputs */}
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
  
          {/* Role Dropdown */}
          <DropDown
            data={roleData}
            name={formData.role}
            setter={(value) =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
          />

          {/* Dynamic Fields */}
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

          {formData.role === "Guide" && (
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

          {/* Admin has no extra fields */}

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
