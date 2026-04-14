const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: '****', 
    database: 'unam01eng', 
    port: 3306,
});

pool.getConnection((err, connection) => {
  if (err) {
      console.error('Database connection error:', err);
  } else {
      console.log('Successfully connected to the database');
      connection.release();
  }
});

module.exports = pool.promise();