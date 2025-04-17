import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';

// Koneksi ke MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET all banners
export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [banners] = await connection.query(
      'SELECT * FROM banners WHERE is_active = 1 ORDER BY order_number ASC'
    );
    connection.release();
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

// POST new banner
export async function POST(request: Request) {
  try {
    const { image_url, title, description, order_number } = await request.json();

    if (!image_url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const id = uuidv4();
    const connection = await pool.getConnection();
    
    await connection.query(
      `INSERT INTO banners (id, image_url, title, description, order_number)
       VALUES (?, ?, ?, ?, ?)`,
      [id, image_url, title, description, order_number]
    );
    
    connection.release();
    return NextResponse.json({ message: 'Banner created successfully', id });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}

// PUT update banner order
export async function PUT(request: Request) {
  try {
    const banners = await request.json();
    const connection = await pool.getConnection();
    
    // Update each banner's order
    for (const banner of banners) {
      await connection.query(
        'UPDATE banners SET order_number = ? WHERE id = ?',
        [banner.order_number, banner.id]
      );
    }
    
    connection.release();
    return NextResponse.json({ message: 'Banner order updated successfully' });
  } catch (error) {
    console.error('Error updating banner order:', error);
    return NextResponse.json({ error: 'Failed to update banner order' }, { status: 500 });
  }
} 