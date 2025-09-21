const express = require("express");
const authenticateToken = require("../Middlewares/authMiddleware");
const {
  getAllProjects,
  getMyProjects,
  createProject,
  updateProject,
  getProjectDetails,
  getAvailableGuides,
  assignGuideToTeam,
  deleteProject, // <-- import new handler
} = require("../Handlers/ProjectHandler");

const route = express.Router();

// All routes require authentication
route.use(authenticateToken);

// GET /projects
route.get("/", getAllProjects);

// GET /projects/my
route.get("/my", getMyProjects);

// GET /projects/guides
route.get("/guides/:dept_id", getAvailableGuides);

// GET /projects/:projectId
route.get("/:projectId", getProjectDetails);

// POST /projects
route.post("/", createProject);

// PUT /projects/:projectId
route.put("/:projectId", updateProject);

// DELETE /projects/:projectId
route.delete("/:projectId", deleteProject);

// POST /projects/teams/:teamId/assign-guide
route.post("/teams/:teamId/assign-guide", assignGuideToTeam);

module.exports = route;
