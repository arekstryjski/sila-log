// Database connection utility
require('dotenv').config();
const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Export the pool for use in other modules
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
