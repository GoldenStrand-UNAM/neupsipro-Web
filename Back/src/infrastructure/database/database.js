module.exports = pool.promise();const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306,
});


pool.getConnection((err, connection) => {
  if (err) {
      //eslint-disable-next-line no-console
      console.error('Database connection error:', err);
  } else {
      //eslint-disable-next-line no-console
      console.log('Successfully connected to the database');
      connection.release();
  }
});

module.exports = pool.promise();
