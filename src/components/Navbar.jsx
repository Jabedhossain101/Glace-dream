'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Box, Search, Menu, User } from 'lucide-react';
import { useFavorites } from '@/context/FavoriteContext';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide navbar on admin routes
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-6 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
            {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-[#FF5A3D] to-[#FF8A75] w-10 h-10 flex items-center justify-center rounded-xl text-white font-black text-2xl shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform duration-300">
              G
            </div>
            <div className="flex flex-col">
                <h1 className="text-xl font-black text-slate-800 leading-none tracking-tight group-hover:text-[#FF5A3D] transition-colors">
                Glace
                </h1>
                <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Dream House</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-12 relative animate-in fade-in zoom-in duration-500 delay-100">
            <input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A3D]/20 focus:border-[#FF5A3D] transition-all"
                onChange={(e) => {
                    // Placeholder for search logic
                    // functionality to be implemented with context or URL params
                }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            <button className="p-3 hover:bg-slate-50 rounded-full text-slate-600 transition-colors md:hidden">
                <Search className="w-6 h-6" />
            </button>

            <Link href="/favorites" className="relative p-3 hover:bg-red-50 rounded-full text-slate-600 hover:text-red-500 transition-all group">
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {favorites.length > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                        {favorites.length}
                    </span>
                )}
            </Link>
            
            <button 
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative p-3 hover:bg-orange-50 rounded-full text-slate-600 hover:text-[#FF5A3D] transition-all group"
            >
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2 right-2 bg-[#FF5A3D] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                    0
                </span>
            </button>



            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 hover:bg-slate-50 rounded-full text-slate-600 transition-colors md:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 p-4 bg-white animate-in slide-in-from-top-5">
            <div className="space-y-4">
                <div className="relative">
                     <input 
                        type="text" 
                        placeholder="Search for products..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

            </div>
        </div>
      )}
    </nav>
  );
}
