const express = require("express");
const route = express.Router();

const authenticateToken = require("../Middlewares/authMiddleware");
const authHandler = require("../Handlers/authHandler");

route.post("/register", authHandler.Register);
route.post("/login", authHandler.Login);
route.post("/logout", authHandler.Logout);

route.get("/validate-token", authenticateToken, (req, res) => {
  return res.status(200).json({
    valid: true,
    user: req.user,
  });
});

module.exports = route;
