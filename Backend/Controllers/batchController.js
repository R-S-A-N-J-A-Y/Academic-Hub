const pool = require("../db/dbConfig");

const createBatch = async (batch) => {
  const { batch_name, start_date, end_date } = batch;

  const query = `
    INSERT INTO batches (batch_name, start_date, end_date)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [batch_name, start_date, end_date];
  const result = await pool.query(query, values);

  return result.rows[0];
};

const getAllBatches = async () => {
  const result = await pool.query("SELECT * FROM batches;");
  return result.rows;
};

const getBatchId = async (batch_name) => {
  const query = "SELECT batch_id FROM batches WHERE batch_name = $1";
  const values = [batch_name];
  const result = await pool.query(query, values);
  return result.rows[0]?.batch_id;
};

module.exports = { createBatch, getAllBatches, getBatchId };
