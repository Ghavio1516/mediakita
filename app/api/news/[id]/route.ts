import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// GET news by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [results] = await connection.execute(
      'SELECT * FROM news WHERE id = ?',
      [params.id]
    );

    await connection.end();

    if (!results[0]) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 