const pool = require("../db/dbConfig");

// Search students by email (prefix/substring) for the logged-in student's department only
const searchStudentsByEmail = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    // Find the caller's department (must be a student)
    const deptResult = await pool.query(
      `SELECT dept_id FROM students WHERE user_id = $1`,
      [user_id]
    );

    if (!deptResult.rows.length) {
      return res.status(400).json({
        success: false,
        message: "Only students can search for team members",
      });
    }

    const deptId = deptResult.rows[0].dept_id;

    // Search students in same department whose email matches query, excluding the caller
    const result = await pool.query(
      `
      SELECT u.user_id, u.name, u.email
      FROM users u
      JOIN students s ON u.user_id = s.user_id
      WHERE s.dept_id = $1
        AND u.role = 'student'
        AND u.user_id <> $2
        AND LOWER(u.email) LIKE LOWER($3)
      ORDER BY u.email ASC
      LIMIT 10;
    `,
      [deptId, user_id, `${query.toLowerCase()}%`]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: "Students fetched successfully",
    });
  } catch (error) {
    console.error("Error searching students:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { searchStudentsByEmail };


