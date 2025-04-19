import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { nanoid } from 'nanoid';

// GET current live stream
export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [streams] = await connection.execute(
      'SELECT * FROM live_streams WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1'
    );

    await connection.end();
    return NextResponse.json(streams[0] || { youtube_url: '', title: '', is_active: 0 });
  } catch (error) {
    console.error('Error fetching live stream:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST new live stream
export async function POST(request: Request) {
  try {
    const { youtube_url, title } = await request.json();
    
    if (!youtube_url || !title) {
      return NextResponse.json({ error: 'URL and title are required' }, { status: 400 });
    }

    // Validate YouTube URL
    try {
      const url = new URL(youtube_url);
      if (!url.hostname.includes('youtube.com') && !url.hostname.includes('youtu.be')) {
        return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Deactivate all existing streams
    await connection.execute(
      'UPDATE live_streams SET is_active = 0 WHERE is_active = 1'
    );

    // Create new stream
    const id = `stream_${nanoid(10)}`;
    await connection.execute(
      'INSERT INTO live_streams (id, youtube_url, title) VALUES (?, ?, ?)',
      [id, youtube_url, title]
    );

    await connection.end();
    return NextResponse.json({ message: 'Live stream created successfully' });
  } catch (error) {
    console.error('Error creating live stream:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT update live stream status
export async function PUT(request: Request) {
  try {
    const { id, is_active } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Stream ID is required' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    if (is_active) {
      // Deactivate all other streams first
      await connection.execute(
        'UPDATE live_streams SET is_active = 0 WHERE id != ?',
        [id]
      );
    }

    await connection.execute(
      'UPDATE live_streams SET is_active = ? WHERE id = ?',
      [is_active ? 1 : 0, id]
    );

    await connection.end();
    return NextResponse.json({ message: 'Live stream updated successfully' });
  } catch (error) {
    console.error('Error updating live stream:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 