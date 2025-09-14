const pool = require("../db/dbConfig");
const bcrypt = require("bcryptjs");

// Create User
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

// Authenticate User
const authenticateUser = async (email, password) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const values = [email];
  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    return null;
  }

  const user = result.rows[0];

  // compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return null; // password mismatch
  }
  // authentication successful
  return user;
};

module.exports = { createUser, authenticateUser };
