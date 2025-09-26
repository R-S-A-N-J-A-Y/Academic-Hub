const express = require("express");
const { getAllBatches } = require("../Controllers/batchController");
const router = express.Router();

// GET /batches - Fetch all batches
router.get("/", async (req, res) => {
  try {
    const batches = await getAllBatches();
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch batches" });
  }
});

module.exports = router;
