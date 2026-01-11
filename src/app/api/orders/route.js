
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    await dbConnect();
    
    // Auto-seed if empty
    const count = await Order.countDocuments();
    if (count === 0) {
      console.log('Seeding orders...');
      const filePath = path.join(process.cwd(), 'src/data/orders.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const orders = JSON.parse(fileContent);
        // Ensure data matches schema if needed, or rely on mongoose flexibility
        // Removing 'id' if it conflicts with _id or let Mongoose handle it
        await Order.insertMany(orders);
        console.log('Orders seeded successfully');
      }
    }

    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Status default is 'pending' in Schema
    
    const newOrder = await Order.create(body);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
