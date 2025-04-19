import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { nanoid } from 'nanoid';

// GET all items
export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [items] = await connection.execute(
      'SELECT * FROM disnaker_items WHERE isActive = 1 ORDER BY categoryId, name'
    );

    const [lastUpdate] = await connection.execute(
      'SELECT MAX(updatedAt) as lastUpdate FROM disnaker_items WHERE isActive = 1'
    );

    await connection.end();
    return NextResponse.json({
      items,
      lastUpdate: lastUpdate[0].lastUpdate
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST new item
export async function POST(request: Request) {
  try {
    const { categoryId, name, selling_price, buying_price, unit, status } = await request.json();
    
    if (!categoryId || !name || !selling_price || !buying_price || !unit) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const id = `item_${nanoid(10)}`;
    
    await connection.execute(
      'INSERT INTO disnaker_items (id, categoryId, name, selling_price, buying_price, unit, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, categoryId, name, selling_price, buying_price, unit, status]
    );

    await connection.end();
    return NextResponse.json({ message: 'Item created successfully' });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT update item
export async function PUT(request: Request) {
  try {
    const { id, name, selling_price, buying_price, unit, status } = await request.json();
    
    if (!id || !name || !selling_price || !buying_price || !unit || !status) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.execute(
      'UPDATE disnaker_items SET name = ?, selling_price = ?, buying_price = ?, unit = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [name, selling_price, buying_price, unit, status, id]
    );

    await connection.end();
    return NextResponse.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE item (soft delete)
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.execute(
      'UPDATE disnaker_items SET isActive = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    await connection.end();
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 