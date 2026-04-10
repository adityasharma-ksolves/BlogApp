const { Pool } = require("pg");
require("dotenv").config();
const fs = require("fs");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });
// module.exports = pool;



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // This tells Node to trust the Aiven certificate
    // ca: fs.readFileSync("./ca.pem").toString(),

    rejectUnauthorized: false, // This ignores the "self-signed" error
  },
});


module.exports = pool;



// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
//   // ssl: false, 
//   // This is mandatory for Aiven
//   // ssl: {
//   //   rejectUnauthorized: false, 
//   // },
// });

// // Test the connection immediately on startup
// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error("❌ Database connection failed:", err.stack);
//   }
//   console.log("✅ Database connected successfully to Localhost");
//   release();
// });

// 

