'use client';
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useFavorites } from '@/context/FavoriteContext';
import OrderModal from '@/components/OrderModal';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { favorites, toggleFavorite } = useFavorites();

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedProduct?.id]);

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

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading shop...</div>;
  }

  if (!selectedProduct) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">No products available. Check back later!</div>;
  }

  const isFavorite = favorites.some(item => item.id === selectedProduct.id);

  return (
    <main className="min-h-screen bg-white pb-20">
      
      {/* Product Details Section (Banner Area) */}
      <section className="max-w-6xl mx-auto mt-6 md:mt-10 p-4 md:p-10 bg-white rounded-3xl shadow-sm flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        {/* Left Side - Image */}
        <div className="flex-1 bg-[#F3F4F6] rounded-3xl relative w-full group h-[300px] md:h-[500px] flex items-center justify-center">
          <span className="absolute top-4 md:top-6 left-4 md:left-6 bg-[#FF5A3D] text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold z-10 transition-transform hover:scale-105">
            -{selectedProduct.discount}
          </span>
          <button
            onClick={() => toggleFavorite(selectedProduct)}
            className="absolute top-4 md:top-6 right-4 md:right-6 p-2 bg-white rounded-full shadow-md z-10 hover:scale-110 transition"
          >
            <Heart
              className={`w-5 h-5 md:w-6 md:h-6 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-contain mix-blend-multiply p-8 md:p-12 transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Right Side - Details */}
        <div className="flex-1 space-y-4 md:space-y-6 w-full">
          <div>
            <p className="text-[#FF5A3D] text-sm font-semibold mb-2">
              {selectedProduct.category}
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] leading-tight">
              {selectedProduct.name}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-3xl md:text-4xl font-black text-[#FF5A3D]">
              ৳{selectedProduct.price}
            </span>
            <span className="text-lg md:text-xl text-gray-400 line-through font-medium">
              ৳{selectedProduct.oldPrice}
            </span>
            <span className="bg-[#FFEBE8] text-[#FF5A3D] px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-bold">
              {selectedProduct.discount} ছাড়
            </span>
          </div>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
            {selectedProduct.description}
          </p>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {selectedProduct.features.map(f => (
              <span
                key={f}
                className="bg-[#FFF0ED] text-[#FF5A3D] px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1"
              >
                ✓ {f}
              </span>
            ))}
          </div>

          {/* Stock & Quantity */}
          <div className="space-y-4">
            <p className="text-green-600 font-bold flex items-center gap-2 text-sm md:text-base">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              স্টকে আছে
            </p>
            
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700 text-sm md:text-base">পরিমাণ:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={handleDecrement} className="px-3 py-1 text-gray-500 hover:bg-gray-50 font-bold text-lg">-</button>
                    <span className="px-3 py-1 font-bold text-gray-800 min-w-[30px] text-center">{quantity}</span>
                    <button onClick={handleIncrement} className="px-3 py-1 text-gray-500 hover:bg-gray-50 font-bold text-lg">+</button>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 pt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-[1.5] bg-[#FF5A3D] text-white py-3 md:py-3.5 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:bg-[#e84e32] transition active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" /> অর্ডার করুন
            </button>
            <button className="flex-1 border border-gray-200 py-3 md:py-3.5 rounded-xl font-bold text-base md:text-lg text-[#1A1A1A] hover:bg-gray-50 transition bg-white active:scale-95">
              কার্টে যোগ করুন
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-between items-center pt-6 md:pt-8 border-t border-gray-100 gap-2 overflow-x-auto">
             <div className="flex items-center gap-2 md:gap-3 text-gray-600 min-w-max">
                <div className="p-1.5 md:p-2 bg-orange-50 rounded-full text-[#FF5A3D]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                </div>
                <div className="text-[10px] md:text-xs font-bold leading-tight">দ্রুত<br/>ডেলিভারি</div>
             </div>
             <div className="h-6 md:h-8 w-px bg-gray-100 flex-shrink-0"></div>
             <div className="flex items-center gap-2 md:gap-3 text-gray-600 min-w-max">
                <div className="p-1.5 md:p-2 bg-orange-50 rounded-full text-[#FF5A3D]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div className="text-[10px] md:text-xs font-bold leading-tight">১০০%<br/>অরিজিনাল</div>
             </div>
             <div className="h-6 md:h-8 w-px bg-gray-100 flex-shrink-0"></div>
             <div className="flex items-center gap-2 md:gap-3 text-gray-600 min-w-max">
                <div className="p-1.5 md:p-2 bg-orange-50 rounded-full text-[#FF5A3D]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
                </div>
                <div className="text-[10px] md:text-xs font-bold leading-tight">ইজি<br/>রিটার্ন</div>
             </div>
          </div>
        </div>
      </section>

      {/* Product List Section */}
      <section id="products-section" className="max-w-6xl mx-auto mt-12 md:mt-20 px-4">
        <h3 className="text-center text-2xl md:text-4xl font-black text-[#1A1A1B] mb-2">
          আরও প্রোডাক্ট দেখুন
        </h3>
        <p className="text-center text-gray-400 mb-8 md:mb-12 text-sm md:text-base">
          যেকোনো প্রোডাক্টে ক্লিক করুন বিস্তারিত দেখতে
        </p>

        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden -mx-4 px-4 md:mx-0 md:px-0">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`min-w-[280px] md:min-w-auto snap-center group relative bg-white p-4 rounded-3xl cursor-pointer transition-all duration-300 ease-in-out
                ${
                  selectedProduct.id === product.id
                    ? 'ring-2 ring-[#FF5A3D] shadow-2xl scale-[1.02]'
                    : 'hover:shadow-xl hover:-translate-y-1 border border-gray-100'
                }`}
            >
              <div className="relative bg-gray-50 rounded-2xl mb-4 overflow-hidden aspect-square flex items-center justify-center">
                <span className="absolute top-3 left-3 bg-[#FF5A3D]/10 text-[#FF5A3D] text-[10px] px-2.5 py-1 rounded-full font-bold z-10 backdrop-blur-sm">
                  {product.discount} ছাড়
                </span>
                <img
                  src={product.image}
                  className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-500 will-change-transform mix-blend-multiply"
                />
                
                {/* Overlay Action - Optional */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-2 px-1">
                <h4 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2 min-h-[3rem]">
                    {product.name}
                </h4>
                
                <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs line-through font-medium">
                            ৳{product.oldPrice}
                        </span>
                        <span className="text-[#FF5A3D] font-black text-xl">
                            ৳{product.price}
                        </span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#FF5A3D]">
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-6xl mx-auto mt-16 md:mt-20 px-4">
        <h3 className="text-center text-2xl md:text-3xl font-bold text-[#FF5A3D] mb-4">
          কেন <span className="text-[#FF5A3D]">Glace Dream House?</span>
        </h3>
        <p className="text-center text-gray-500 mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">
          আমরা বাংলাদেশের সেরা অনলাইন শপিং প্ল্যাটফর্মগুলোর একটি। আমাদের লক্ষ্য হলো আপনাকে
          সেরা মানের পণ্য সাশ্রয়ী মূল্যে পৌঁছে দেওয়া।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
                { icon: "⭐", title: "প্রিমিয়াম কোয়ালিটি", desc: "আমরা শুধুমাত্র উচ্চমানের পণ্য সরবরাহ করি" },
                { icon: "🚚", title: "দ্রুত ডেলিভারি", desc: "সারাদেশে ২-৫ দিনের মধ্যে ডেলিভারি" },
                { icon: "🛡️", title: "১০০% অরিজিনাল", desc: "সকল পণ্য ১০০% অরিজিনাল ও গ্যারান্টিযুক্ত" },
                { icon: "🎧", title: "২৪/৭ সাপোর্ট", desc: "যেকোনো সময় আমাদের সাথে যোগাযোগ করুন" }
            ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 text-[#FF5A3D]">
                        {item.icon}
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                    <p className="text-xs md:text-sm text-gray-500">{item.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto mt-16 md:mt-20 px-4 mb-16 md:mb-20">
        <h3 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-12">
          আমাদের গ্রাহকদের মতামত
        </h3>

        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden -mx-4 px-4 md:mx-0 md:px-0">
            {[
                { name: "রাহাত হোসেন", location: "ঢাকা", comment: "অনেক ভালো প্রোডাক্ট পেয়েছি। কোয়ালিটি অসাধারণ এবং ডেলিভারি অনেক দ্রুত ছিল।" },
                { name: "সাবরিনা আক্তার", location: "চট্টগ্রাম", comment: "Glace Dream House থেকে কেনাকাটা করে খুবই সন্তুষ্ট। দামও অনেক সাশ্রয়ী।" },
                { name: "মাহমুদ হাসান", location: "সিলেট", comment: "প্রোডাক্টের কোয়ালিটি যা দেখানো হয়েছে ঠিক তাই পেয়েছি। অবশ্যই আবার অর্ডার করবো।" }
            ].map((review, idx) => (
                <div key={idx} className="min-w-[300px] md:min-w-auto snap-center bg-white p-6 md:p-8 rounded-3xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex text-yellow-400 mb-4 text-sm gap-1">
                        {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
                    </div>
                    <p className="text-gray-600 mb-6 italic text-sm md:text-base">"{review.comment}"</p>
                    <div>
                        <h5 className="font-bold text-gray-800">{review.name}</h5>
                        <p className="text-xs text-gray-400">{review.location}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>
      
      {/* Footer Copyright */}
      <footer className="text-center text-gray-400 text-sm py-10 border-t border-gray-100 mt-12 md:mt-20">
        <p>© 2024 Glace Dream House. সর্বস্বত্ব সংরক্ষিত।</p>
        <p className="mt-1">যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন</p>
      </footer>
      <OrderModal 
        product={selectedProduct} 
        quantity={quantity}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
