import mysql from 'mysql2';
import dotenv from 'dotenv';

// Memuat konfigurasi dari file .env
dotenv.config();

// Koneksi ke MySQL (Gunakan pool untuk lebih efisien di server)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool.promise();  // Menggunakan promise untuk query
