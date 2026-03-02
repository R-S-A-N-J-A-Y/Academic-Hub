require("dotenv").config();

const { Pool } = require("pg");

const dbPassword = process.env.PASSWORD;
const dbName = process.env.DB_NAME;

const pool = new Pool({
  connectionString: `postgresql://postgres.${dbName}:${dbPassword}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres`,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

module.exports = pool;
