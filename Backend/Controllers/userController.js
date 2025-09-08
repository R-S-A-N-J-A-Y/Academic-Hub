const pool = require("../db/dbConfig");

const createUser = async (user) => {
  const { name, email, password_hash, role } = user;

  const query = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [name, email, password_hash, role];
  const result = await pool.query(query, values);

  return result.rows[0];
};

module.exports = { createUser };
