
'use client';
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function OrderModal({ product, isOpen, onClose, quantity = 1 }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer: formData,
        items: [
            {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            }
        ],
        total: (product.price * quantity) + 60,
        status: 'pending'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        alert('অর্ডার সফল হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।');
        onClose();
        setFormData({ name: '', phone: '', address: '' });
      } else {
        alert('দুঃখিত, অর্ডার করতে সমস্যা হয়েছে।');
      }
    } catch (error) {
      console.error(error);
      alert('দুঃখিত, অর্ডার করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">অর্ডার কনফার্ম করুন</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Summary */}
          <div className="flex gap-4 p-4 bg-orange-50 rounded-2xl mb-6 border border-orange-100 items-start">
            <img src={product.image} alt={product.name} className="w-20 h-20 object-contain bg-white rounded-xl p-2 border border-orange-100" />
            <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm md:text-base line-clamp-2">{product.name}</p>
                <div className="flex justify-between items-end mt-2">
                    <p className="text-gray-500 text-sm">পরিমাণ: <span className="font-bold text-gray-800">{quantity}</span></p>
                    <p className="text-[#FF5A3D] font-black text-lg md:text-xl">৳{(product.price * quantity).toLocaleString()}</p>
                </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">আপনার নাম</label>
            <input
              required
              type="text"
              placeholder="Ex: মোঃ করিম"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A3D] transition"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">মোবাইল নাম্বার</label>
            <input
              required
              type="tel"
              placeholder="Ex: 017..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A3D] transition"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">ঠিকানা</label>
            <textarea
              required
              placeholder="Ex: হাউজ #১০, রোড #৫, ঢাকা"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A3D] transition h-24 resize-none"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
             <div className="flex justify-between text-sm text-gray-600">
                <span>সাবটোটাল</span>
                <span className="font-bold">৳{(product.price * quantity).toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-sm text-gray-600">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-bold">৳৬০</span>
             </div>
             <div className="h-px bg-gray-200 my-2"></div>
             <div className="flex justify-between text-base font-black text-gray-800">
                <span>সর্বমোট</span>
                <span className="text-[#FF5A3D]">৳{(product.price * quantity + 60).toLocaleString()}</span>
             </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF5A3D] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-[#e84e32] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'অর্ডার সম্পন্ন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
