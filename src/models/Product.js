import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discount: { type: String },
  image: { type: String }, // Backwards compatibility or main image
  images: { type: [String] }, // Multiple images
  description: { type: String },
  features: { type: [String] },
  sizes: { type: [String] },
  colors: { type: [String] },
  type: { type: String },
}, { 
  timestamps: true 
});

ProductSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ProductSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

// Force model recompilation in dev to pick up schema changes
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
