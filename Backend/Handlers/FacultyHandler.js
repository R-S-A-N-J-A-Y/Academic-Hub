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

module.exports = { getFaculties };
