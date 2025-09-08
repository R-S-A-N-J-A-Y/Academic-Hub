const pool = require("../db/dbConfig");

const createStudent = async (student) => {
  const { user_id, batch_id, enrollment_no } = student;

  const query = `
    INSERT INTO students (user_id, batch_id, enrollment_no)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [user_id, batch_id, enrollment_no];
  const result = await pool.query(query, values);

  return result.rows[0];
};

module.exports = { createStudent };
