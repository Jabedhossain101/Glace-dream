
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    } catch (error) {
        console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:relative
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-extrabold text-indigo-950 tracking-tight">Glace Admin</span>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            onClick={() => setIsSidebarOpen(false)}
            href="/admin/overview"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                pathname.includes('/overview') 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link
            onClick={() => setIsSidebarOpen(false)}
            href="/admin/orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                pathname.includes('/orders') 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Orders
          </Link>
          <Link
            onClick={() => setIsSidebarOpen(false)}
            href="/admin/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                pathname.includes('/products') 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
            }`}
          >
            <Settings className="w-5 h-5" />
            Products
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                    A
                </div>
            </div>
        </header>
        <div className="p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
