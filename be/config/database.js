const mysql = require('mysql2');
require ('dotenv').config();

//crete connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//konversi ke promised base api
const promisePool = pool.promise();

//tes koneksi
pool.getConnection((err,connection) => {
    if (err){
        console.error('database nya tidak masuk: ', err.message);
        return;
    }
    console.log('berhasil masuk dengan smooth databasenya');
    connection.release();
 })

module.exports= promisePool;
