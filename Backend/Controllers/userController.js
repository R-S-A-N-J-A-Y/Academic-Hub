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

// Change Password
const changePassword = async (userId, currentPassword, newPassword) => {
  // First, get the current user to verify current password
  const userQuery = `SELECT password_hash FROM users WHERE user_id = $1`;
  const userResult = await pool.query(userQuery, [userId]);
  
  if (userResult.rowCount === 0) {
    return { success: false, message: "User not found" };
  }
  
  const user = userResult.rows[0];
  
  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isCurrentPasswordValid) {
    return { success: false, message: "Current password is incorrect" };
  }
  
  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  
  // Update password
  const updateQuery = `UPDATE users SET password_hash = $1 WHERE user_id = $2`;
  await pool.query(updateQuery, [newPasswordHash, userId]);
  
  return { success: true, message: "Password changed successfully" };
};

module.exports = { createUser, authenticateUser, changePassword };
