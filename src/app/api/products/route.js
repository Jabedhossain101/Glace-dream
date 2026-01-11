
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    await dbConnect();

    // Auto-seed if empty
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Seeding products...');
      const filePath = path.join(process.cwd(), 'src/data/products.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const products = JSON.parse(fileContent);
        // Clean up IDs if they conflict or let mongo handle it.
        // Usually, mongo uses _id. If we want to keep integer IDs, we can, but usually better to let mongo generate _id.
        // However, for simplicity, we just insert.
        await Product.insertMany(products);
        console.log('Products seeded successfully');
      }
    }

    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // We don't need to manually generate ID, MongoDB does it.
    
    const newProduct = await Product.create(body);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
