import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: Request) {
  try {
    // Get the auth token from cookies
    const cookies = request.headers.get('cookie');
    if (!cookies) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const authToken = cookies.split('auth-token=')[1]?.split(';')[0];
    if (!authToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Decode the token to get user ID
    const [userId] = Buffer.from(authToken, 'base64').toString().split(':');

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Get user from database
    const [rows] = await connection.execute(
      'SELECT id, email, role FROM users WHERE id = ?',
      [userId]
    );

    await connection.end();

    const user = rows[0];
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 401 }
      );
    }

    // Return user data including role
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 