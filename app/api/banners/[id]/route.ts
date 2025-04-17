import { NextResponse } from "next/server";
import mysql from 'mysql2/promise';

// Koneksi ke MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET single banner
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await pool.getConnection();
    const [banner] = await connection.query(
      'SELECT * FROM banners WHERE id = ?',
      [params.id]
    );
    connection.release();

    if (!banner || (banner as any[]).length === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(banner[0]);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json({ error: 'Failed to fetch banner' }, { status: 500 });
  }
}

// PUT update banner
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { image_url, title, description, is_active } = await request.json();

    if (!image_url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    await connection.query(
      `UPDATE banners 
       SET image_url = ?, title = ?, description = ?, is_active = ?
       WHERE id = ?`,
      [image_url, title, description, is_active, params.id]
    );
    connection.release();

    return NextResponse.json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

// DELETE banner (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE banners SET is_active = false WHERE id = ?',
      [params.id]
    );
    connection.release();

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
} 