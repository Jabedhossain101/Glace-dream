'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
// import { products } from '@/constants/products';
import { Heart, ShoppingCart } from 'lucide-react';
import { useFavorites } from '@/context/FavoriteContext';
import OrderModal from '@/components/OrderModal';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        if (data.length > 0) setSelectedProduct(data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading shop...</div>;
  }

  if (!selectedProduct) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">No products available. Check back later!</div>;
  }

  const isFavorite = favorites.some(item => item.id === selectedProduct.id);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">

      {/* Product Details Section (Banner Area) */}
      <section className="max-w-6xl mx-auto mt-10 p-4 md:p-10 bg-white rounded-3xl shadow-sm flex flex-col md:row gap-12 items-center">
        <div className="flex-1 bg-[#F3F4F6] rounded-3xl relative w-full group">
          <span className="absolute top-6 left-6 bg-[#FF5A3D] text-white px-3 py-1 rounded-full text-sm font-bold z-10">
            -{selectedProduct.discount}
          </span>
          <button
            onClick={() => toggleFavorite(selectedProduct)}
            className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md z-10 hover:scale-110 transition"
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-112.5 object-contain mix-blend-multiply p-12"
          />
        </div>

        <div className="flex-1 space-y-6 w-full">
          <div>
            <p className="text-[#FF5A3D] text-sm font-semibold mb-1">
              {selectedProduct.category}
            </p>
            <h2 className="text-4xl font-extrabold text-[#1A1A1A]">
              {selectedProduct.name}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-[#FF5A3D]">
              ৳{selectedProduct.price}
            </span>
            <span className="text-xl text-gray-300 line-through">
              ৳{selectedProduct.oldPrice}
            </span>
            <span className="bg-[#FFEBE8] text-[#FF5A3D] px-3 py-1 rounded-md text-sm font-bold">
              {selectedProduct.discount} ছাড়
            </span>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed">
            {selectedProduct.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {selectedProduct.features.map(f => (
              <span
                key={f}
                className="bg-[#FFF0ED] text-[#FF5A3D] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
              >
                ✓ {f}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-[1.5] bg-[#FF5A3D] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:bg-[#e84e32] transition"
            >
              <ShoppingCart className="w-5 h-5" /> অর্ডার করুন
            </button>
            <button className="flex-1 border-2 border-gray-100 py-4 rounded-xl font-bold text-lg text-[#1A1A1A] hover:bg-gray-50 transition">
              কার্টে যোগ করুন
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-xs text-gray-500 font-medium">
            <div className="flex flex-col items-center gap-2">
              🚚 দ্রুত ডেলিভারি
            </div>
            <div className="flex flex-col items-center gap-2">
              🛡️ ১০০% অরিজিনাল
            </div>
            <div className="flex flex-col items-center gap-2">
              🔄 ইজি রিটার্ন
            </div>
          </div>
        </div>
      </section>

      {/* Product List Section */}
      <section className="max-w-6xl mx-auto mt-20 px-4">
        <h3 className="text-center text-4xl font-black text-[#1A1A1B] mb-2">
          আরও প্রোডাক্ট দেখুন
        </h3>
        <p className="text-center text-gray-400 mb-12">
          যেকোনো প্রোডাক্টে ক্লিক করুন বিস্তারিত দেখতে
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`group bg-white p-5 rounded-[2rem] cursor-pointer transition-all border-2 
                ${
                  selectedProduct.id === product.id
                    ? 'border-[#FF5A3D] shadow-xl scale-105'
                    : 'border-transparent hover:border-gray-100 shadow-sm hover:shadow-lg'
                }`}
            >
              <div className="relative bg-[#F3F4F6] rounded-2xl mb-5 overflow-hidden">
                <span className="absolute top-3 left-3 bg-[#FF5A3D] text-white text-[10px] px-2.5 py-1 rounded-full font-bold z-10">
                  -{product.discount}
                </span>
                <img
                  src={product.image}
                  className="w-full h-48 object-contain p-6 group-hover:scale-110 transition duration-500"
                />
              </div>
              <h4 className="font-bold text-[#1A1A1A] text-lg mb-2">
                {product.name}
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-[#FF5A3D] font-black text-xl">
                  ৳{product.price}
                </span>
                <span className="text-gray-300 line-through text-sm">
                  ৳{product.oldPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <OrderModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
