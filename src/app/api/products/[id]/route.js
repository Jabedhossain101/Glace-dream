
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { 
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
         return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
