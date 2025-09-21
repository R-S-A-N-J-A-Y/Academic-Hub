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

const getStudentProfile = async (userId) => {
  const query = `
    SELECT 
      u.user_id,
      u.name,
      u.email,
      u.role,
      s.enrollment_no,
      s.batch_id,
      b.batch_name as batch,
      d.dept_name as department
    FROM users u
    INNER JOIN students s ON u.user_id = s.user_id
    LEFT JOIN batches b ON s.batch_id = b.batch_id
    LEFT JOIN department d ON s.dept_id = d.dept_id
    WHERE u.user_id = $1;
  `;
  
  const result = await pool.query(query, [userId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

module.exports = { createStudent, getStudentDetails, getStudentProfile };
