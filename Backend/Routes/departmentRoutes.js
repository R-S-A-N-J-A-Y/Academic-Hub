const express = require("express");
const pool = require("../db/dbConfig");
const router = express.Router();

// GET /departments - Fetch all departments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM department;");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});

module.exports = router;
