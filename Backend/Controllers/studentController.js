const pool = require("../db/dbConfig");

const createStudent = async (student) => {
  const { user_id, batch_id, enrollment_no, dept_id } = student;

  const query = `
    INSERT INTO students (user_id, batch_id, enrollment_no, dept_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [user_id, batch_id, enrollment_no, dept_id];
  const result = await pool.query(query, values);

  return result.rows[0];
};

const getStudentDetails = async (userId) => {
  const res = await pool.query("SELECT * FROM students WHERE user_id = $1", [
    userId,
  ]);
  return res.rows.length > 0 ? res.rows[0] : {};
};

module.exports = { createStudent, getStudentDetails };
