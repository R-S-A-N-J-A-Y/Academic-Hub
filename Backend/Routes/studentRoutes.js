const express = require("express");
const authenticateToken = require("../Middlewares/authMiddleware");
const { searchStudentsByEmail } = require("../Handlers/StudentHandler");

const route = express.Router();

// All student routes require authentication
route.use(authenticateToken);

// GET /students/search?query=... - search students by email within same department as logged-in student
route.get("/search", searchStudentsByEmail);

module.exports = route;


