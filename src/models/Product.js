import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discount: { type: String },
  image: { type: String },
  description: { type: String },
  features: { type: [String] },
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

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
