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

const getFacultyProfile = async (userId) => {
  const query = `
    SELECT 
      u.user_id,
      u.name,
      u.email,
      u.role,
      f.designation,
      d.dept_name as department
    FROM users u
    INNER JOIN faculty f ON u.user_id = f.user_id
    LEFT JOIN department d ON f.dept_id = d.dept_id
    WHERE u.user_id = $1;
  `;
  
  const result = await pool.query(query, [userId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

module.exports = { createFaculty, fetchFaculties, getFacultyDetails, getFacultyProfile };
