import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    // We expect body to contain { status: 'new_status' }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      // Try searching by custom id if _id fails (though usually we use _id)
      const updatedOrderAlt = await Order.findOneAndUpdate(
        { id: id },
         { $set: body },
        { new: true, runValidators: true }
      );
      
      if (!updatedOrderAlt) {
         return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(updatedOrderAlt);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deletedOrder = await Order.findByIdAndDelete(id);
    
    if (!deletedOrder) {
        // Try custom id
        const deletedOrderAlt = await Order.findOneAndDelete({ id: id });
         if (!deletedOrderAlt) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
         }
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
