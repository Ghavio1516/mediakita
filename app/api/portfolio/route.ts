import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { nanoid } from 'nanoid';

// GET all portfolio items
export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [items] = await connection.execute(
      'SELECT * FROM portfolio ORDER BY created_at DESC'
    );

    await connection.end();

    // Parse media_list JSON string back to array
    const parsedItems = Array.isArray(items) ? items.map(item => ({
      ...item,
      media_list: item.media_list ? JSON.parse(item.media_list) : []
    })) : [];

    return NextResponse.json(parsedItems);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST new portfolio item
export async function POST(request: Request) {
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

    const id = `portfolio_${nanoid()}`;
    
    // Insert main portfolio item
    await connection.execute(
      'INSERT INTO portfolio (id, title, description, media_type, media_url, thumbnail_url, category, media_list) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, 
        title, 
        description, 
        media_type, 
        media_url, 
        thumbnail_url, 
        category,
        media_list ? JSON.stringify(media_list) : null
      ]
    );

    await connection.end();
    return NextResponse.json({ message: 'Portfolio item added successfully', id });
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 