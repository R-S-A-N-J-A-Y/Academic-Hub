const express = require("express");
const authenticateToken = require("../Middlewares/authMiddleware");
const {
  getAllProjects,
  getMyProjects,
  getGuidedProjects,
  createProject,
  updateProject,
  getProjectDetails,
  getAvailableGuides,
  assignGuideToTeam,
  deleteProject,
  getFullProjectDetails,
  updateProjectFull,
  uploadProjectReview,
  likeProject,
  getStudentStats,
} = require("../Handlers/ProjectHandler");

const route = express.Router();

// All routes require authentication
route.use(authenticateToken);

// GET /projects
route.get("/", getAllProjects);

// GET /projects/my
route.get("/my", getMyProjects);

// GET /projects/guided/my
route.get("/guided/my", getGuidedProjects);

// GET /projects/guides
route.get("/guides/:dept_id", getAvailableGuides);

// GET /projects/my/stats
route.get("/my/stats", getStudentStats);

// GET /projects/:projectId
route.get("/:projectId", getProjectDetails);

// GET /projects/:projectId/details
route.get("/:projectId/details", getFullProjectDetails);

// POST /projects
route.post("/", createProject);

// PUT /projects/:projectId
route.put("/:projectId", updateProject);

// PUT /projects/:projectId/full
route.put("/:projectId/full", updateProjectFull);

// DELETE /projects/:projectId
route.delete("/:projectId", deleteProject);

// POST /projects/:projectId/reviews
route.post("/:projectId/reviews", uploadProjectReview);

// POST /projects/:projectId/like
route.post("/:projectId/like", likeProject);

// POST /projects/teams/:teamId/assign-guide
route.post("/teams/:teamId/assign-guide", assignGuideToTeam);

module.exports = route;
