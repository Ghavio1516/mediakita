import mysql from 'mysql2';
import dotenv from 'dotenv';

// Memuat konfigurasi dari file .env
dotenv.config();

// Koneksi ke MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

export default connection;
