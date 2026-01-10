
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, display only the children (the login form)
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
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col z-20">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
          <span className="text-xl font-extrabold text-indigo-950 tracking-tight">Glace Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
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
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 px-8 py-5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                    A
                </div>
            </div>
        </header>
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
