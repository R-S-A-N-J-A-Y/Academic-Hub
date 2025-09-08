const express = require("express");
const route = express.Router();

const authHandler = require("../Handlers/authHandler");

route.post("/register", authHandler.Register);

module.exports = route;
