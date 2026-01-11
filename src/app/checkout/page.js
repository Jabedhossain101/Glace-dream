'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  CheckCircle,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // প্রোডাক্টের ডাটা (এটি আপনি চাইলে প্রপস বা স্টেট থেকে নিতে পারেন)
  const product = {
    name: 'Premium Wireless Earbuds',
    price: 1299,
    image: '/earbuds.jpg', // নিশ্চিত করুন এই ফাইলটি public ফোল্ডারে আছে
  };

  const handleOrder = e => {
    e.preventDefault();
    setOrderConfirmed(true);
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">
          ধন্যবাদ! আপনার অর্ডারটি সফল হয়েছে।
        </h1>
        <p className="text-gray-500 mb-8">
          আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করবো।
        </p>
        <Link
          href="/"
          className="bg-[#FF5A3D] text-white px-8 py-3 rounded-xl font-bold"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold">চেকআউট</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-8 px-4 space-y-6">
        {/* আপনার অর্ডার সেকশন */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="text-orange-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold">আপনার অর্ডার</h2>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 relative">
            <div className="w-20 h-20 bg-white rounded-xl flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-[#FF5A3D] font-bold">৳{product.price}</p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button className="absolute right-4 text-red-400 hover:text-red-600 transition">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">মোট:</span>
            <span className="text-2xl font-black text-[#FF5A3D]">
              ৳{product.price * quantity}
            </span>
          </div>
        </div>

        {/* ডেলিভারি তথ্য */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6">ডেলিভারি তথ্য</h2>
          <form onSubmit={handleOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                আপনার নাম *
              </label>
              <input
                required
                type="text"
                placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-orange-500 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                মোবাইল নম্বর *
              </label>
              <input
                required
                type="tel"
                placeholder="01XXXXXXXXX"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-orange-500 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ডেলিভারি ঠিকানা *
              </label>
              <textarea
                required
                rows="3"
                placeholder="বাড়ি নং, রোড, এলাকা, জেলা"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-orange-500 transition text-sm"
              ></textarea>
            </div>
          </form>
        </div>

        {/* পেমেন্ট পদ্ধতি */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6">পেমেন্ট পদ্ধতি</h2>
          <div className="space-y-3">
            {/* Cash on Delivery */}
            <label
              onClick={() => setPaymentMethod('cod')}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'cod'
                  ? 'bg-gray-50 border-orange-500'
                  : 'bg-gray-50 border-transparent'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500'
                    : 'border-gray-300'
                }`}
              >
                {paymentMethod === 'cod' && (
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                )}
              </div>
              <div>
                <p className="font-bold text-sm">ক্যাশ অন ডেলিভারি</p>
                <p className="text-xs text-gray-500">
                  প্রোডাক্ট হাতে পেয়ে পেমেন্ট করুন
                </p>
              </div>
            </label>

            {/* Bkash */}
            <label
              onClick={() => setPaymentMethod('bkash')}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'bkash'
                  ? 'bg-gray-50 border-orange-500'
                  : 'bg-gray-50 border-transparent'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'bkash'
                    ? 'border-orange-500'
                    : 'border-gray-300'
                }`}
              >
                {paymentMethod === 'bkash' && (
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                )}
              </div>
              <div>
                <p className="font-bold text-sm">বিকাশ</p>
                <p className="text-xs text-gray-500">বিকাশ দিয়ে পেমেন্ট করুন</p>
              </div>
            </label>

            {/* Nagad */}
            <label
              onClick={() => setPaymentMethod('nagad')}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'nagad'
                  ? 'bg-gray-50 border-orange-500'
                  : 'bg-gray-50 border-transparent'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'nagad'
                    ? 'border-orange-500'
                    : 'border-gray-300'
                }`}
              >
                {paymentMethod === 'nagad' && (
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                )}
              </div>
              <div>
                <p className="font-bold text-sm">নগদ</p>
                <p className="text-xs text-gray-500">নগদ দিয়ে পেমেন্ট করুন</p>
              </div>
            </label>
          </div>
        </div>

        {/* কনফার্ম বাটন */}
        <button
          onClick={handleOrder}
          className="w-full bg-[#FF5A3D] text-white py-5 rounded-2xl font-bold text-xl shadow-lg shadow-orange-100 hover:bg-[#e84e32] transition"
        >
          অর্ডার কনফার্ম করুন
        </button>
      </div>
    </main>
  );
}
