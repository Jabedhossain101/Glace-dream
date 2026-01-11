
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, RefreshCcw, Package } from 'lucide-react';
import ProductModal from '@/components/ProductModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      
      const data = await res.json();
      if (Array.isArray(data)) {
         setProducts(data);
      } else {
         console.error('API returned non-array data:', data);
         setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Optional: Add UI feedback here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
        console.error(error);
        alert('Failed to delete product');
    }
  };

  const handleSave = async (productData) => {
    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          const updated = await res.json();
          setProducts(products.map(p => p.id === updated.id ? updated : p));
        }
      } else {
        // Create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          const newProduct = await res.json();
          setProducts([...products, newProduct]);
        }
      }
    } catch (error) {
       throw error;
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Products Inventory</h1>
          <p className="text-slate-500 mt-1">Manage all your store items here</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={handleCreate} 
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200"
            >
                <Plus className="w-5 h-5" /> Add Product
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
             <div className="col-span-full h-64 flex items-center justify-center text-gray-400">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-400 gap-2">
                <Package className="w-12 h-12 opacity-20" />
                No products found
            </div>
        ) : (
             filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition group">
                    <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                        <img src={product.image} alt={product.name} className="h-full object-contain mix-blend-multiply" />
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                            ID: {product.id}
                        </span>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{product.category}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(product)} className="p-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 rounded-lg transition">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-1">{product.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 line-through">৳{product.oldPrice}</span>
                                <span className="font-black text-xl text-gray-800">৳{product.price}</span>
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {product.discount} OFF
                            </span>
                        </div>
                    </div>
                </div>
             ))
        )}
      </div>

      <ProductModal 
        product={editingProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
