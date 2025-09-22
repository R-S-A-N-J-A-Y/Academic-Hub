const express = require("express");
const { getMentorStats } = require("../Handlers/MentorHandler");
const route = express.Router();

// GET /mentors/:id/stats - Fetch mentor stats
route.get("/:id/stats", getMentorStats);

module.exports = route;


