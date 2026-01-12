
'use client';
import { useState, useEffect } from 'react';
import { X, Loader2, Save, Upload } from 'lucide-react';

export default function ProductModal({ product, isOpen, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: '',
    price: '',
    oldPrice: '',
    discount: '',
    description: '',
    image: '',
    images: '',
    features: '',
    sizes: '',
    colors: '' 
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        features: Array.isArray(product.features) ? product.features.join(', ') : product.features,
        images: Array.isArray(product.images) ? product.images.join('\n') : (product.image || ''),
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        type: product.type || ''
      });
    } else {
      setFormData({
        name: '',
        category: '',
        type: '',
        price: '',
        oldPrice: '',
        discount: '',
        description: '',
        image: '',
        images: '',
        features: '',
        sizes: '',
        colors: ''
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
        images: formData.images.split('\n').map(i => i.trim()).filter(i => i),
        // Set primary image to first image in list if not explicitly set, or keep existing logic
        image: formData.images.split('\n').map(i => i.trim()).filter(i => i)[0] || formData.image
      };

      await onSave(payload);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Product Name</label>
                <input
                required
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Category</label>
                <input
                required
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Price (৳)</label>
                <input
                required
                type="number"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Old Price (৳)</label>
                <input
                type="number"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.oldPrice}
                onChange={e => setFormData({ ...formData, oldPrice: e.target.value })}
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Discount Text</label>
                <input
                placeholder="e.g. 30%"
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.discount}
                onChange={e => setFormData({ ...formData, discount: e.target.value })}
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Type</label>
                <input
                type="text"
                placeholder="e.g. T-Shirt"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Images (one URL per line)</label>
            <textarea
              required
              rows={4}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none font-mono text-sm"
              value={formData.images}
              onChange={e => setFormData({ ...formData, images: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Sizes (comma separated)</label>
                <input
                type="text"
                placeholder="S, M, L, XL"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.sizes}
                onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Colors (comma separated)</label>
                <input
                type="text"
                placeholder="Red, Blue, Green"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.colors}
                onChange={e => setFormData({ ...formData, colors: e.target.value })}
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Description</label>
            <textarea
              required
              rows={3}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Features (comma separated)</label>
            <input
              type="text"
              placeholder="Feature 1, Feature 2, Feature 3"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.features}
              onChange={e => setFormData({ ...formData, features: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-4 justify-end">
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
