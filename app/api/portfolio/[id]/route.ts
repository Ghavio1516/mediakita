import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string;
  media_list: string | null;
  category: string;
  created_at: string;
}

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

    const [rows] = await connection.execute(
      'SELECT * FROM portfolio WHERE id = ?',
      [params.id]
    );

    await connection.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    const item = rows[0] as PortfolioItem;
    const parsedItem = {
      ...item,
      media_list: item.media_list ? JSON.parse(item.media_list) : []
    };

    return NextResponse.json(parsedItem);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio item' },
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
    const { 
      title, 
      description, 
      media_type, 
      media_url, 
      thumbnail_url, 
      category,
      media_list 
    } = await request.json();

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
      'UPDATE portfolio SET title = ?, description = ?, media_type = ?, media_url = ?, thumbnail_url = ?, category = ?, media_list = ? WHERE id = ?',
      [
        title,
        description,
        media_type,
        media_url,
        thumbnail_url,
        category,
        media_list ? JSON.stringify(media_list) : null,
        params.id
      ]
    );

    await connection.end();
    return NextResponse.json({ message: 'Portfolio item updated successfully' });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
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

    await connection.execute('DELETE FROM portfolio WHERE id = ?', [params.id]);

    await connection.end();
    return NextResponse.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
} 