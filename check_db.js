const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  sizes: { type: [String] },
  colors: { type: [String] },
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function checkProducts() {
  try {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    console.log('Last 5 products:');
    products.forEach(p => {
        console.log(`Product: ${p.name}`);
        console.log(`  Sizes: ${JSON.stringify(p.sizes)}`);
        console.log(`  Colors: ${JSON.stringify(p.colors)}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();
