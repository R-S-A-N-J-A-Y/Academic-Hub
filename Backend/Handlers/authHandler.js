const bcrypt = require("bcryptjs");
const { createUser } = require("../Controllers/userController");
const { createStudent } = require("../Controllers/studentController");
const { createFaculty } = require("../Controllers/facultyController");
const { getBatchId } = require("../Controllers/batchController");
const { getDeptId } = require("../Controllers/departmentController");

const Register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      batch_name,
      enrollment_no,
      department,
      designation,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create base user
    const user = await createUser({ name, email, password_hash, role });

    // Role-specific insert
    if (role === "student") {
      const batch_id = await getBatchId(batch_name);
      if (!batch_id || !enrollment_no) {
        return res
          .status(400)
          .json({ error: "Batch and enrollment_no required for students" });
      }
      await createStudent({ user_id: user.user_id, batch_id, enrollment_no });
    }

    if (role === "faculty") {
      const dept_id = await getDeptId(department);
      console.log(dept_id, department);
      if (!dept_id || !designation) {
        return res
          .status(400)
          .json({ error: "Department and designation required for faculty" });
      }
      await createFaculty({ user_id: user.user_id, dept_id, designation });
    }

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error in Register:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { Register };
