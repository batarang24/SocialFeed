const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'sql107.infinityfree.com',    // Use the MySQL hostname provided
    user: 'if0_38135226',              // Your MySQL username
    password: 'HEZlLgcxRFFI',          // Your MySQL password
    database: 'if0_38135226_social_feed' // Your database name (replace XXX with actual DB name                      // Default MySQL port (3306) 
});


module.exports=pool.promise();
