import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String }
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }
  ],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'] 
  }
}, { 
  timestamps: true 
});

OrderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

OrderSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
