const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',      // Host from InfinityFree
  user: 'root',               // Your MySQL username
  password: '1234',           // Your MySQL password
  database: 'social_feed',      // Your database name
 
});

// Export the pool to be used in other parts of the app
module.exports = pool.promise();
