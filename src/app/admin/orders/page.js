
'use client';

import { useState, useEffect, useRef } from 'react';
import { Package, Clock, CheckCircle, XCircle, Search, RefreshCcw, ChevronDown, CheckSquare, Eye, X, Phone, MapPin, User } from 'lucide-react';

// View Details Modal Component
function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
            <p className="text-sm text-gray-500">ID: #{order._id || order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" /> Customer Information
                </h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase">Name</span>
                        <p className="font-medium text-gray-800">{order.customer?.name}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Phone
                        </span>
                        <p className="font-medium text-gray-800">{order.customer?.phone}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Address
                        </span>
                        <p className="font-medium text-gray-800 whitespace-pre-wrap">{order.customer?.address}</p>
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div>
               <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-500" /> Order Summary
                </h4>
                <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                            {item.image && (
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-800">৳{item.price * item.quantity}</p>
                        </div>
                    ))}
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-4">
                        <span className="font-bold text-gray-600">Total Amount</span>
                        <span className="font-black text-xl text-indigo-600">৳{order.total}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processingId, setProcessingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Sort by newest first
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    
    // Real-time polling every 5 seconds
    const interval = setInterval(() => {
        fetchOrders(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setProcessingId(orderId);
    try {
        const res = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            const updatedOrder = await res.json();
            setOrders(orders.map(o => {
                // Check matching _id or custom id
                const id = o._id || o.id;
                if (id === orderId) {
                    return { ...o, status: newStatus };
                }
                return o;
            }));
        } else {
            alert('Failed to update status');
        }
    } catch (error) {
        console.error('Update failed:', error);
        alert('Update failed');
    } finally {
        setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.id && order.id.toString().includes(searchTerm)) ||
        (order._id && order._id.toString().includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Order Management</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Real-time updates active
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="relative w-full md:w-auto">
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-auto pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer font-medium text-slate-600"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search orders..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={() => fetchOrders(true)} 
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
              {loading && orders.length === 0 ? (
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
                  <tr key={order._id || order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6 font-mono text-xs text-slate-500">
                        #{(order._id || order.id).toString().slice(-6)}
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-slate-800">{order.customer?.name || 'Guest'}</div>
                      <div className="text-xs text-slate-500">{order.customer?.phone}</div>
                    </td>
                    <td className="p-6">
                        <div className="flex flex-col gap-1">
                            {order.items?.map((item, idx) => (
                                <span key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                    {item.name} <span className="text-slate-400">x{item.quantity}</span>
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
                        <div className="relative group/status">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} flex items-center gap-1 w-fit cursor-pointer`}>
                                {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                {order.status === 'confirmed' && <CheckSquare className="w-3 h-3" />}
                                {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                {order.status.toUpperCase()}
                                {processingId === (order._id || order.id) && <RefreshCcw className="w-3 h-3 animate-spin ml-1" />}
                            </span>
                            
                            {/* Status Dropdown */}
                            <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-20 hidden group-hover/status:block">
                                {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(order._id || order.id, status)}
                                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors ${order.status === status ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}
