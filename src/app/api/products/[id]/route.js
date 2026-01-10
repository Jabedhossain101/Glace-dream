
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Helper to read data
const getProducts = () => {
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
const saveProducts = (products) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
};

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const products = getProducts();
    
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products[index] = { ...products[index], ...body };
    saveProducts(products);

    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const products = getProducts();
    
    const filteredProducts = products.filter(p => p.id !== parseInt(id));
    
    if (products.length === filteredProducts.length) {
         return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    saveProducts(filteredProducts);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
