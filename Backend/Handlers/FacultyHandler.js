const facultyController = require("../Controllers/facultyController");

const getFaculties = async (req, res) => {
  try {
    const deptId = req.params.id; // get department id from route params
    const faculties = await facultyController.fetchFaculties(deptId);

    res.status(200).json({
      success: true,
      data: faculties,
      message: "Faculties fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllFaculties = async (req, res) => {
  try {
    const deptId = req.params.id;
    const faculties = await facultyController.fetchAllFaculties(deptId);

    res.status(200).json({
      success: true,
      data: faculties,
      message: "All faculties fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching all faculties:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// new endpoint for counting guides/mentors
const getGuideCount = async (req, res) => {
  try {
    const deptId = req.params.id;
    const count = await facultyController.fetchGuideCount(deptId);
    res
      .status(200)
      .json({ success: true, data: { count }, message: "Guide count fetched" });
  } catch (error) {
    console.error("Error fetching guide count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateIsGuide = async (req, res) => {
  try {
    // ensure only admin can perform this action
    const requester = req.user;
    if (!requester || requester.role !== "coordinator") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { ids, isGuide } = req.body;
    if (!Array.isArray(ids) || typeof isGuide !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payload" });
    }

    const updated = await facultyController.updateIsGuide(ids, isGuide);

    res
      .status(200)
      .json({ success: true, data: updated, message: "Updated guide status" });
  } catch (error) {
    console.error("Error updating isGuide:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getFaculties,
  getAllFaculties,
  updateIsGuide,
  getGuideCount,
};
