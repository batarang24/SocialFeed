const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: ' ', // Enter your MySQL root password
    database: 'social_feed',   // Database name
});

// Export the pool
module.exports = pool.promise();
