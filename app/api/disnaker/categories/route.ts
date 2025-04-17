import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// GET all categories
export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [rows] = await connection.execute(
      'SELECT * FROM disnaker_categories WHERE isActive = 1 ORDER BY name'
    );

    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 