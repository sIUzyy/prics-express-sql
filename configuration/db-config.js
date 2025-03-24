/**
 * this file stores the database connection settings using environment variables.
 */

// ---- sql connection ----
const sqlConfiguration = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

module.exports = sqlConfiguration;
