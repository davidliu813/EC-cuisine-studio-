import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Flame, ChefHat, Bell } from 'lucide-react';
import { MOCK_ORDERS } from '../constants';
import { Order, OrderStatus } from '../types';

export const KitchenView: React.FC = () => {
  // Filter only active kitchen orders
  const [orders, setOrders] = useState<Order[]>(
    MOCK_ORDERS.filter(o => 
      [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.COOKING].includes(o.status)
    )
  );

  const moveStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = OrderStatus.COOKING;
    if (currentStatus === OrderStatus.PENDING || currentStatus === OrderStatus.CONFIRMED) {
      nextStatus = OrderStatus.COOKING;
    } else if (currentStatus === OrderStatus.COOKING) {
      nextStatus = OrderStatus.READY;
    }

    // In a real app, API call here.
    if (nextStatus === OrderStatus.READY) {
      setOrders(prev => prev.filter(o => o.id !== orderId)); // Remove from active view
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    }
  };

  const getTimerColor = (minutes: number) => {
    if (minutes > 20) return 'text-red-400';
    if (minutes > 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  const calculateDuration = (timestamp: Date) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    return Math.floor(diff / 60000);
  };

  const renderCard = (order: Order) => {
    const duration = calculateDuration(order.timestamp);
    
    return (
      <div key={order.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg flex flex-col mb-4">
        {/* Card Header */}
        <div className={`p-3 flex justify-between items-start border-b ${
          order.status === OrderStatus.COOKING ? 'bg-orange-900/30 border-orange-700' : 'bg-gray-750 border-gray-700'
        }`}>
          <div>
            <div className="flex items-center gap-2">
               <span className="text-xl font-bold text-white">#{order.id.split('-')[1] || order.id}</span>
               <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-600 text-gray-200 uppercase">{order.type}</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              {order.type === 'DINE_IN' ? `Table ${order.tableId}` : order.customerName}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1 font-mono font-bold ${getTimerColor(duration)}`}>
               <Clock size={14} /> {duration}m
            </div>
            <span className="text-gray-500 text-xs mt-1">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>

        {/* Card Items */}
        <div className="p-4 space-y-3 flex-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-3 text-sm">
              <span className="font-bold text-orange-400 w-6 text-lg">{item.quantity}</span>
              <span className="text-gray-200 flex-1 pt-0.5">{item.name}</span>
            </div>
          ))}
          {order.note && (
             <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-700/50 rounded text-yellow-200 text-xs flex gap-2">
                <Bell size={12} className="mt-0.5 shrink-0" />
                <span className="font-medium">{order.note}</span>
             </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="p-3 bg-gray-750/50 border-t border-gray-700">
           <button 
            onClick={() => moveStatus(order.id, order.status)}
            className={`w-full py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
              order.status === OrderStatus.COOKING 
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-orange-600 hover:bg-orange-500 text-white'
            }`}
           >
             {order.status === OrderStatus.COOKING ? (
               <><CheckCircle size={18} /> MARK READY</>
             ) : (
               <><Flame size={18} /> START COOKING</>
             )}
           </button>
        </div>
      </div>
    );
  };

  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.CONFIRMED);
  const cookingOrders = orders.filter(o => o.status === OrderStatus.COOKING);
  // In real life, ready orders would move to a separate screen or section, 
  // but for KDS we focus on what needs to be cooked. 
  // We can show 'Recently Ready' in the 3rd column if desired.
  const readyOrders = MOCK_ORDERS.filter(o => o.status === OrderStatus.READY);

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex flex-col overflow-hidden font-sans">
      <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3">
           <ChefHat className="text-orange-500" />
           <h2 className="text-xl font-bold tracking-wide">KITCHEN DISPLAY SYSTEM</h2>
         </div>
         <div className="flex gap-6 text-sm font-medium text-gray-400">
            <span>Pending: <span className="text-white">{pendingOrders.length}</span></span>
            <span>Cooking: <span className="text-white">{cookingOrders.length}</span></span>
         </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        {/* Column 1: PENDING */}
        <div className="flex flex-col h-full bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-3 bg-red-900/40 border-b border-red-900/50 flex justify-between items-center">
            <h3 className="font-bold text-red-100 uppercase tracking-wider">Pending</h3>
            <span className="bg-red-900 text-red-200 text-xs px-2 py-0.5 rounded-full">{pendingOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
             {pendingOrders.map(renderCard)}
          </div>
        </div>

        {/* Column 2: COOKING */}
        <div className="flex flex-col h-full bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-3 bg-orange-900/40 border-b border-orange-900/50 flex justify-between items-center">
            <h3 className="font-bold text-orange-100 uppercase tracking-wider">Cooking</h3>
            <span className="bg-orange-900 text-orange-200 text-xs px-2 py-0.5 rounded-full">{cookingOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
             {cookingOrders.map(renderCard)}
          </div>
        </div>

        {/* Column 3: READY / PICKUP */}
        <div className="flex flex-col h-full bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-3 bg-green-900/40 border-b border-green-900/50 flex justify-between items-center">
            <h3 className="font-bold text-green-100 uppercase tracking-wider">Ready to Serve</h3>
            <span className="bg-green-900 text-green-200 text-xs px-2 py-0.5 rounded-full">{readyOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
             {readyOrders.map(order => (
                <div key={order.id} className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500 shadow mb-3 opacity-75">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-white">#{order.id.split('-')[1] || order.id}</span>
                     <span className="text-green-400 text-xs font-bold uppercase">READY</span>
                  </div>
                  <p className="text-gray-400 text-sm">{order.type} - {order.customerName || `Table ${order.tableId}`}</p>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
