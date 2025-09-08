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

module.exports = { createFaculty };
