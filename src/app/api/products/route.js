
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    await dbConnect();

    // Seed initial products if database is empty
    const count = await Product.countDocuments();
    if (count === 0) {
      const filePath = path.join(process.cwd(), 'src/data/products.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const products = JSON.parse(fileContent);
        await Product.insertMany(products);
      }
    }

    const products = await Product.find({}).sort({ createdAt: -1 });
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

    
    const newProduct = await Product.create(body);
    console.log("Created Product:", newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
