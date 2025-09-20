require("dotenv").config();

const { Pool } = require("pg");

const dbPassword = process.env.PASSWORD;
const dbName = process.env.DB_NAME;

const pool = new Pool({
  connectionString: `postgresql://postgres:${dbPassword}@db.${dbName}.supabase.co:5432/postgres`,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

module.exports = pool;
