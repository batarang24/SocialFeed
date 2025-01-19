const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'sql107.infinityfree.com',      // Host from InfinityFree
  user: 'if0_38135226',               // Your MySQL username
  password: 'HEZlLgcxRFFI',           // Your MySQL password
  database: 'if0_38135226_social_feed',      // Your database name
  port: 3306,                          // Default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool to be used in other parts of the app
module.exports = pool.promise();
