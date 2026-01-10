
'use client';

import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Search, RefreshCcw } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      // Sort by newest first
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Order Management</h1>
          <p className="text-slate-500 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search orders..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={fetchOrders} 
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-slate-600 transition-colors"
                title="Refresh Orders"
            >
                <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-6">Order ID</th>
                <th className="p-6">Customer</th>
                <th className="p-6">Items</th>
                <th className="p-6">Total Amount</th>
                <th className="p-6">Date</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center flex flex-col items-center justify-center text-gray-400 gap-3">
                    <Package className="w-12 h-12 opacity-20" />
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6 font-mono text-xs text-slate-500">#{order.id.slice(-6)}</td>
                    <td className="p-6">
                      <div className="font-bold text-slate-800">{order.customer?.name || 'Guest'}</div>
                      <div className="text-xs text-slate-500">{order.customer?.phone}</div>
                    </td>
                    <td className="p-6">
                        <div className="flex flex-col gap-1">
                            {order.items?.map((item, idx) => (
                                <span key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                    {item.name} <span className="text-slate-400">x1</span>
                                </span>
                            ))}
                        </div>
                    </td>
                    <td className="p-6 font-bold text-slate-800">
                      ৳{order.total?.toLocaleString()}
                    </td>
                    <td className="p-6 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                        {order.status === 'pending' && <Clock className="w-3 h-3" />}
                        {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                        {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
