const express = require("express");
const {
  getFaculties,
  getAllFaculties,
  updateIsGuide,
} = require("../Handlers/FacultyHandler");
const { getMentorStats } = require("../Handlers/MentorHandler");
const authenticateToken = require("../Middlewares/authMiddleware");
const route = express.Router();

// NOTE: specific routes first to avoid param collisions
// GET /mentors/:id/stats - Fetch mentor stats
route.get("/mentors/:id/stats", getMentorStats);

// GET /faculty/all/:id - Fetch all faculties for a department
route.get("/all/:id", getAllFaculties);

// GET /faculty/:id - Fetch guide faculties for a department (used by Mentors page)
route.get("/:id", getFaculties);

// PATCH /faculty/isguide - Update isGuide flag for one or more faculty IDs (admin only)
route.patch("/isguide", authenticateToken, updateIsGuide);

module.exports = route;
