const express = require("express");
const { getFaculties } = require("../Handlers/FacultyHandler");
const { getMentorStats } = require("../Handlers/MentorHandler");
const route = express.Router();

// GET /faculty - Fetch all faculties with name and email
route.get("/:id", getFaculties);

// GET /mentors/:id/stats - Fetch mentor stats
route.get("/mentors/:id/stats", getMentorStats);

module.exports = route;
