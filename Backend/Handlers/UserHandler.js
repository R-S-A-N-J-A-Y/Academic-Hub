const { getFacultyProfile } = require("../Controllers/facultyController");
const { getStudentProfile } = require("../Controllers/studentController");
const { changePassword } = require("../Controllers/userController");

const getProfile = async (req, res) => {
  try {
    const { user_id, role } = req.user;// from JWT token via authMiddleware

    let profileData = null;
    

    // Fetch profile based on user role
    if (role === "faculty" || role === "coordinator") {
      profileData = await getFacultyProfile(user_id);
    } else if (role === "student") {
      profileData = await getStudentProfile(user_id);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { user_id } = req.user; // from JWT token via authMiddleware
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const result = await changePassword(user_id, currentPassword, newPassword);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { getProfile, changeUserPassword };
