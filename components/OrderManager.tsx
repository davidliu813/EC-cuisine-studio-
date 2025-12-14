import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ShoppingBag, MapPin, User, DollarSign } from 'lucide-react';
import { MOCK_ORDERS } from '../constants';
import { Order, OrderStatus, OrderType } from '../types';

export const OrderManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const tabs = [
    { id: 'ALL', label: 'All Orders' },
    { id: OrderStatus.PENDING, label: 'Pending' },
    { id: OrderStatus.COOKING, label: 'In Kitchen' },
    { id: OrderStatus.READY, label: 'Ready' },
    { id: OrderStatus.COMPLETED, label: 'Completed' },
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-blue-100 text-blue-700';
      case OrderStatus.COOKING: return 'bg-orange-100 text-orange-700';
      case OrderStatus.READY: return 'bg-green-100 text-green-700';
      case OrderStatus.COMPLETED: return 'bg-gray-100 text-gray-700';
      case OrderStatus.SERVED: return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const filteredOrders = activeTab === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  return (
    <div className="p-6 h-screen flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
           <p className="text-sm text-gray-500">Track and manage all restaurant orders</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Order #, Name..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter size={16} /> Filter <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-orange-600 text-orange-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-20">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
             <div className="p-4 border-b border-gray-100 flex justify-between items-start">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="font-bold text-gray-800">{order.id}</span>
                   {order.type === OrderType.DELIVERY && <TruckIcon />}
                   {order.type === OrderType.PICKUP && <BagIcon />}
                 </div>
                 <p className="text-xs text-gray-500">{new Date(order.timestamp).toLocaleString()}</p>
               </div>
               <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                 {order.status}
               </span>
             </div>

             <div className="p-4 flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {order.customerName || `Table ${order.tableId}`}
                    </p>
                    {order.deliveryAddress && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {order.deliveryAddress}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                       <span className="text-gray-600 flex items-center gap-2">
                         <span className="font-bold text-xs w-4">{item.quantity}x</span> {item.name}
                       </span>
                       <span className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center rounded-b-xl">
               <span className="text-sm text-gray-500">Total</span>
               <span className="text-lg font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TruckIcon = () => (
  <span className="bg-teal-100 text-teal-700 p-1 rounded">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
  </span>
);

const BagIcon = () => (
  <span className="bg-indigo-100 text-indigo-700 p-1 rounded">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
  </span>
);
