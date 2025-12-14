
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  CalendarDays, 
  ChefHat, 
  Truck, 
  ShoppingBasket, 
  Menu as MenuIcon,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { MOCK_ORDERS, MOCK_RESERVATIONS } from '../constants';
import { OrderStatus } from '../types';
import { analyzeDailySales } from '../services/geminiService';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Real-time calculation from Mock Data
  const stats = {
    revenue: MOCK_ORDERS.reduce((acc, curr) => acc + curr.totalAmount, 0),
    totalOrders: MOCK_ORDERS.length,
    preparing: MOCK_ORDERS.filter(o => o.status === OrderStatus.COOKING || o.status === OrderStatus.PENDING).length,
    ready: MOCK_ORDERS.filter(o => o.status === OrderStatus.READY).length,
  };

  // Mock Data for Charts (Simulating hourly trends)
  const salesData = [
    { time: '10:00', amount: 120, orders: 4 },
    { time: '11:00', amount: 350, orders: 12 },
    { time: '12:00', amount: 980, orders: 28 }, // Lunch Peak
    { time: '13:00', amount: 850, orders: 24 },
    { time: '14:00', amount: 400, orders: 10 },
    { time: '15:00', amount: 280, orders: 8 },
    { time: '16:00', amount: 420, orders: 15 }, // Afternoon snack
  ];

  const statusData = [
    { name: 'Pending', count: MOCK_ORDERS.filter(o => o.status === OrderStatus.PENDING).length, color: '#60A5FA' },
    { name: 'Cooking', count: MOCK_ORDERS.filter(o => o.status === OrderStatus.COOKING).length, color: '#F97316' },
    { name: 'Ready', count: MOCK_ORDERS.filter(o => o.status === OrderStatus.READY).length, color: '#34D399' },
    { name: 'Served', count: MOCK_ORDERS.filter(o => o.status === OrderStatus.SERVED || o.status === OrderStatus.COMPLETED).length, color: '#94A3B8' },
  ];

  const handleGetInsight = async () => {
    setLoadingAi(true);
    const popularItems = ['Truffle Burger', 'Margherita Pizza']; // Mock logic
    const insight = await analyzeDailySales(salesData, popularItems);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  // Auto-fetch insight on mount
  useEffect(() => {
    handleGetInsight();
  }, []);

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `$${stats.revenue.toFixed(2)}`, 
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      link: '/orders',
      sub: '+12% from yesterday'
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      icon: ShoppingBag, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100', 
      link: '/orders',
      sub: `${MOCK_ORDERS.filter(o => o.type === 'DELIVERY').length} deliveries`
    },
    { 
      title: 'Preparing', 
      value: stats.preparing, 
      icon: ChefHat, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100', 
      link: '/kitchen',
      sub: 'Needs attention'
    },
    { 
      title: 'Ready to Serve', 
      value: stats.ready, 
      icon: CheckCircle, 
      color: 'text-teal-600', 
      bg: 'bg-teal-100', 
      link: '/pickup',
      sub: 'Waiting for pickup'
    },
  ];

  const moduleCards = [
    { title: 'New Order', icon: UtensilsCrossed, color: 'text-pink-600', bg: 'bg-pink-50', hover: 'hover:bg-pink-100', link: '/pos', desc: 'POS System' },
    { title: 'Kitchen View', icon: ChefHat, color: 'text-orange-600', bg: 'bg-orange-50', hover: 'hover:bg-orange-100', link: '/kitchen', desc: 'KDS Display' },
    { title: 'Delivery', icon: Truck, color: 'text-teal-600', bg: 'bg-teal-50', hover: 'hover:bg-teal-100', link: '/delivery', desc: 'Dispatch' },
    { title: 'Reservations', icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50', hover: 'hover:bg-indigo-100', link: '/reservations', desc: 'Bookings' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time overview of your restaurant's performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <p className="text-sm font-bold text-gray-700">System Online</p>
           <span className="text-gray-300">|</span>
           <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Interactive Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(stat.link)}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-orange-200 transition-all group"
          >
             <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                 <stat.icon size={24} />
               </div>
               {idx === 2 && stats.preparing > 0 && (
                 <span className="flex h-3 w-3 relative">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                 </span>
               )}
             </div>
             <div>
               <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
               <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                 {stat.sub} <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
               </p>
             </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="text-lg font-bold text-gray-800">Hourly Revenue</h3>
                <p className="text-sm text-gray-400">Today's sales trend</p>
             </div>
             <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold text-orange-600 bg-orange-50 rounded-full">Today</button>
                <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-full">Weekly</button>
             </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="amount" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status & AI Insight */}
        <div className="space-y-6">
          {/* Order Status Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Pipeline</h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" barSize={20}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles size={100} />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-3">
                 <Sparkles className="text-yellow-400" size={20} />
                 <h3 className="font-bold text-lg">AI Business Insight</h3>
               </div>
               <p className="text-indigo-100 text-sm leading-relaxed min-h-[80px]">
                 {loadingAi ? (
                   <span className="animate-pulse">Analyzing sales patterns...</span>
                 ) : (
                   aiInsight || "Analyzing your data to provide actionable insights..."
                 )}
               </p>
               <button 
                onClick={handleGetInsight}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
               >
                 Refresh Analysis
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Modules */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moduleCards.map((card, idx) => (
            <button 
              key={idx}
              onClick={() => navigate(card.link)}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border border-transparent transition-all duration-300 group bg-white shadow-sm hover:shadow-md border-gray-100`}
            >
              <div className={`p-3 rounded-full ${card.bg} ${card.color} mb-3 group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-900">{card.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
