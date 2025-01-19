const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'sql107.infinityfree.com',
    user: 'if0_38135226',
    password: 'HEZlLgcxRFFI', // Enter your MySQL root password
    database: 'social_feed',   // Database name
});

// Export the pool
module.exports = pool.promise();
