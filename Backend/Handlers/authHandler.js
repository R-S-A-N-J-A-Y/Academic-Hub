const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  authenticateUser,
} = require("../Controllers/userController");
const {
  createStudent,
  getStudentDetails,
} = require("../Controllers/studentController");
const {
  createFaculty,
  getFacultyDetails,
} = require("../Controllers/facultyController");
const { getBatchId } = require("../Controllers/batchController");
const { getDeptId } = require("../Controllers/departmentController");

const JWT_KEY = process.env.JWT_KEY;

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
    const dept_id = await getDeptId(department);

    // Role-specific insert
    if (role === "student") {
      const batch_id = await getBatchId(batch_name);
      if (!batch_id || !enrollment_no || !dept_id) {
        return res.status(400).json({
          error: "Batch and enrollment_no and Department required for students",
        });
      }
      await createStudent({
        user_id: user.user_id,
        batch_id,
        enrollment_no,
        dept_id,
      });
    }

    if (role === "faculty") {
      if (!dept_id || !designation) {
        return res
          .status(400)
          .json({ error: "Department and designation required for faculty" });
      }
      await createFaculty({ user_id: user.user_id, dept_id, designation });
    }

    // Get role-specific extra details for response
    let extraData = {};
    if (role === "faculty") {
      extraData = await getFacultyDetails(user.user_id);
    } else if (role === "student") {
      extraData = await getStudentDetails(user.user_id);
    }

    // Generate JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        name: user.name,
        email: user.email,
        ...extraData,
      },
      JWT_KEY,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.user_id,
        role: user.role,
        name: user.name,
        email: user.email,
        ...extraData,
      },
    });
  } catch (error) {
    console.error("Error in Register:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------- LOGIN ----------------

const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // get role-specific details
    let extraData = {};
    if (user.role === "faculty") {
      extraData = await getFacultyDetails(user.user_id);
    } else if (user.role === "student") {
      extraData = await getStudentDetails(user.user_id);
    }

    // generate JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        name: user.name,
        email: user.email,
        ...extraData,
      },
      JWT_KEY,
      { expiresIn: "1d" }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
        role: user.role,
        name: user.name,
        email: user.email,
        ...extraData,
      },
    });
  } catch (error) {
    console.error("Error in Login:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const Logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { Register, Login, Logout };
