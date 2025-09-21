const express = require("express");
const authenticateToken = require("../Middlewares/authMiddleware");
const { getProfile, changeUserPassword } = require("../Handlers/UserHandler");
const route = express.Router();

// GET /user/me - Fetch logged-in user's profile
route.get("/me", authenticateToken, getProfile);

// PUT /user/change-password - Change user password
route.put("/change-password", authenticateToken, changeUserPassword);

module.exports = route;
