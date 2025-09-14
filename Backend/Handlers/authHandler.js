const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  authenticateUser,
} = require("../Controllers/userController");
const { createStudent } = require("../Controllers/studentController");
const { createFaculty } = require("../Controllers/facultyController");
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
      if (!dept_id || !designation) {
        return res
          .status(400)
          .json({ error: "Department and designation required for faculty" });
      }
      await createFaculty({ user_id: user.user_id, dept_id, designation });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_KEY,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // use "none" if frontend/backend on diff domains with https
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
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

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
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

    return res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
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
