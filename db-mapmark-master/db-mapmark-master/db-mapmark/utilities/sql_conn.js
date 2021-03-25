// Pooling DB connection
const { Pool, Client } = require('pg');

const pool = new Pool({
    host: process.env.DATABASE_URL,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;