'use client';
import { useFavorites } from '@/context/FavoriteContext';
import Navbar from '@/components/Navbar';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/">
            <ArrowLeft className="w-6 h-6 cursor-pointer text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold">ফেভারিট</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>আপনার ফেভারিট লিস্টে কোনো প্রোডাক্ট নেই।</p>
          </div>
        ) : (
          <div className="space-y-6">
            {favorites.map(product => (
              <div
                key={product.id}
                className="flex items-center gap-6 p-4 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition"
              >
                {/* Product Image */}
                <div className="w-32 h-32 bg-gray-50 rounded-2xl flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[#FF5A3D] font-bold text-lg">
                      ৳{product.price}
                    </span>
                    <span className="text-gray-300 line-through text-sm">
                      ৳{product.oldPrice}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button className="flex-1 bg-[#FF5A3D] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e84e32]">
                      <ShoppingCart className="w-4 h-4" /> কার্টে যোগ করুন
                    </button>
                    <button
                      onClick={() => toggleFavorite(product)}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"
                    >
                      <Heart className="w-5 h-5 fill-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
