import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// GET single item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [items] = await connection.execute(
      'SELECT * FROM disnaker_items WHERE id = ? AND isActive = 1',
      [id]
    );

    await connection.end();

    if (!items[0]) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(items[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT update item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updates = await request.json();
    
    // Validate that at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Get current item data
    const [items] = await connection.execute(
      'SELECT * FROM disnaker_items WHERE id = ? AND isActive = 1',
      [id]
    );

    if (!items[0]) {
      await connection.end();
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const currentItem = items[0];

    // Merge current data with updates
    const updatedData = {
      name: updates.name ?? currentItem.name,
      selling_price: updates.selling_price ?? currentItem.selling_price,
      buying_price: updates.buying_price ?? currentItem.buying_price,
      unit: updates.unit ?? currentItem.unit,
      status: updates.status ?? currentItem.status
    };

    const [result] = await connection.execute(
      'UPDATE disnaker_items SET name = ?, selling_price = ?, buying_price = ?, unit = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND isActive = 1',
      [updatedData.name, updatedData.selling_price, updatedData.buying_price, updatedData.unit, updatedData.status, id]
    );

    await connection.end();

    // @ts-ignore
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE item (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [result] = await connection.execute(
      'UPDATE disnaker_items SET isActive = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND isActive = 1',
      [id]
    );

    await connection.end();

    // @ts-ignore
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 