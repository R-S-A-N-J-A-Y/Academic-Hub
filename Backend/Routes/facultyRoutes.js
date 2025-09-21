const express = require("express");
const { getFaculties } = require("../Handlers/FacultyHandler");
const route = express.Router();

// GET /faculty - Fetch all faculties with name and email
route.get("/:id", getFaculties);

module.exports = route;
