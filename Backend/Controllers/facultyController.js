const pool = require("../db/dbConfig");

const createFaculty = async (faculty) => {
  const { user_id, dept_id, designation } = faculty;

  const query = `
    INSERT INTO faculty (user_id, dept_id, designation)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [user_id, dept_id, designation];
  const result = await pool.query(query, values);

  return result.rows[0];
};

const fetchFaculties = async (deptId) => {
  const query = `
    SELECT 
      f.id,
      f.user_id,
      f.dept_id,
      f.designation,
      u.name,
      u.email
    FROM faculty f
    INNER JOIN users u ON f.user_id = u.user_id
    WHERE f.dept_id = $1
    ORDER BY u.name ASC;
  `;

  const result = await pool.query(query, [deptId]);
  return result.rows;
};

const getFacultyDetails = async (userId) => {
  const res = await pool.query(
    "SELECT dept_id, designation FROM faculty WHERE user_id = $1",
    [userId]
  );
  return res.rows.length > 0 ? res.rows[0] : {};
};

module.exports = { createFaculty, fetchFaculties, getFacultyDetails };
