import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// GET comments for a specific news article
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

    const [comments] = await connection.execute(
      'SELECT * FROM news_comments WHERE news_id = ? ORDER BY created_at DESC',
      [params.id]
    );

    await connection.end();
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST new comment
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: commentId, user_name, comment } = await request.json();

    if (!user_name || !comment) {
      return NextResponse.json(
        { error: 'Username and comment are required' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.execute(
      'INSERT INTO news_comments (id, news_id, user_name, comment) VALUES (?, ?, ?, ?)',
      [commentId, params.id, user_name, comment]
    );

    await connection.end();
    return NextResponse.json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 