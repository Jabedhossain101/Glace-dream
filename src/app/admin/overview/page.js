'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

export default function OverviewPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setOrders(data);
          processStats(data);
          processChartData(data);
        } else {
          console.error('API returned non-array data:', data);
          setOrders([]);
          setStats({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0 });
          setChartData([]);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
        // Keep default empty stats
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const processStats = (data) => {
    const totalRevenue = data.reduce((acc, order) => acc + (order.total || 0), 0);
    const pendingOrders = data.filter(o => o.status === 'pending').length;
    const completedOrders = data.filter(o => o.status === 'completed').length;

    setStats({
      totalRevenue,
      totalOrders: data.length,
      pendingOrders,
      completedOrders
    });
  };

  const processChartData = (data) => {
    // Group orders by date for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const grouped = last7Days.map(date => {
      const dayOrders = data.filter(o => o.createdAt.startsWith(date));
      return {
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((acc, o) => acc + (o.total || 0), 0)
      };
    });

    setChartData(grouped);
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center text-gray-400">Loading overview...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Snapshot of your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-800">৳{stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">Total Orders</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.totalOrders}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">Pending</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.pendingOrders}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">Conversion</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.totalOrders > 0 ? '100%' : '0%'}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Weekly Orders</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                    dataKey="orders" 
                    fill="#6366F1" 
                    radius={[6, 6, 6, 6]}
                    barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
