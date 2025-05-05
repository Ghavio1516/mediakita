import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// GET single portfolio item
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
      'SELECT * FROM portfolio WHERE id = ?',
      [params.id]
    );

    await connection.end();

    if (!results[0]) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT update portfolio item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, media_type, media_url, thumbnail_url, category } = await request.json();

    if (!title || !media_type || !media_url) {
      return NextResponse.json(
        { error: 'Title, media type, and media URL are required' },
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
      'UPDATE portfolio SET title = ?, description = ?, media_type = ?, media_url = ?, thumbnail_url = ?, category = ? WHERE id = ?',
      [title, description, media_type, media_url, thumbnail_url, category, params.id]
    );

    await connection.end();
    return NextResponse.json({ message: 'Portfolio item updated successfully' });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE portfolio item
export async function DELETE(
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

    await connection.execute(
      'DELETE FROM portfolio WHERE id = ?',
      [params.id]
    );

    await connection.end();
    return NextResponse.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 