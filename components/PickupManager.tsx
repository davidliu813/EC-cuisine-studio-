import React from 'react';
import { ShoppingBasket, Copy, CheckCircle, Trash2 } from 'lucide-react';
import { MOCK_ORDERS } from '../constants';
import { OrderType, OrderStatus } from '../types';

export const PickupManager: React.FC = () => {
  const pickupOrders = MOCK_ORDERS.filter(o => o.type === OrderType.PICKUP);
  const active = pickupOrders.filter(o => o.status !== OrderStatus.COMPLETED);
  const history = pickupOrders.filter(o => o.status === OrderStatus.COMPLETED);

  return (
    <div className="p-8 max-w-6xl mx-auto">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pickup Counter</h2>
          <p className="text-gray-500">Manage customer collections</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 flex items-center gap-2">
           <ShoppingBasket size={18} /> New Pickup Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
         {active.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShoppingBasket size={100} />
               </div>
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Pickup Code</p>
                        <h3 className="text-3xl font-extrabold text-indigo-600 tracking-tight mt-1">{order.pickupCode || 'N/A'}</h3>
                     </div>
                     <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Copy Code">
                        <Copy size={20} />
                     </button>
                  </div>

                  <div className="space-y-1 mb-6">
                     <p className="font-bold text-gray-800 text-lg">{order.customerName}</p>
                     <p className="text-gray-500 text-sm">{order.items.length} items • ${order.totalAmount.toFixed(2)}</p>
                     <p className="text-xs font-medium px-2 py-0.5 rounded bg-orange-100 text-orange-700 inline-block mt-1">{order.status}</p>
                  </div>

                  <div className="flex gap-2">
                     <button className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-green-200 hover:bg-green-700 transition flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> Picked Up
                     </button>
                     <button className="p-2.5 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition">
                        <Trash2 size={20} />
                     </button>
                  </div>
               </div>
            </div>
         ))}
         
         {active.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
               <ShoppingBasket className="mx-auto text-gray-300 mb-3" size={48} />
               <p className="text-gray-500 font-medium">No active pickup orders</p>
            </div>
         )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-gray-700">Recent Completed Pickups</h3>
         </div>
         <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b border-gray-100">
               <tr>
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {history.length > 0 ? history.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                     <td className="px-6 py-3 font-mono font-medium text-gray-600">{order.pickupCode}</td>
                     <td className="px-6 py-3 font-medium text-gray-900">{order.customerName}</td>
                     <td className="px-6 py-3 text-gray-500">{order.timestamp.toLocaleTimeString()}</td>
                     <td className="px-6 py-3 text-right font-medium">${order.totalAmount.toFixed(2)}</td>
                  </tr>
               )) : (
                  <tr>
                     <td colSpan={4} className="px-6 py-4 text-center text-gray-400 italic">No history available</td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};
