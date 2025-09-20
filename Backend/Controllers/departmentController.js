const pool = require("../db/dbConfig");

const getDeptId = async (dept_name) => {
  const query = "SELECT dept_id FROM department WHERE dept_name = $1";
  const values = [dept_name];
  const result = await pool.query(query, values);
  return result.rows[0]?.dept_id;
};

module.exports = { getDeptId };
