
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/orders.json');

// Helper to read data
const getOrders = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

// Helper to write data
const saveOrders = (orders) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));
};

export async function GET() {
  const orders = getOrders();
  return NextResponse.json(orders);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orders = getOrders();
    
    const newOrder = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, completed, cancelled
      ...body
    };

    orders.push(newOrder);
    saveOrders(orders);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
