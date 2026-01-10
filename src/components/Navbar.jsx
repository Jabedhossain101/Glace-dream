'use client';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Box } from 'lucide-react';
import { useFavorites } from '@/context/FavoriteContext';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="flex items-center justify-between px-6 md:px-20 py-4 bg-white border-b sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-orange-500 w-8 h-8 flex items-center justify-center rounded text-white font-bold text-xl">
          G
        </div>
        <h1 className="text-xl font-bold">
          Glace <span className="text-orange-500">Dream House</span>
        </h1>
      </Link>
      <div className="flex gap-6 text-gray-600 items-center">
        <Box className="w-6 h-6 cursor-pointer hover:text-orange-500" />
        <Link
          href="/favorites"
          className="relative cursor-pointer hover:text-orange-500"
        >
          <Heart className="w-6 h-6" />
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {favorites.length}
            </span>
          )}
        </Link>
        <ShoppingBag className="w-6 h-6 cursor-pointer hover:text-orange-500" />
      </div>
    </nav>
  );
}
