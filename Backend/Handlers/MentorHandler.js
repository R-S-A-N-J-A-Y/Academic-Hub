const mentorHandler = require("../Controllers/facultyController");

const getMentorStats = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await mentorHandler.getMentorStats(id);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching mentor stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getMentorStats };
