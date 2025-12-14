import React from 'react';
import { Truck, MapPin, Clock, UserCheck } from 'lucide-react';
import { MOCK_ORDERS, MOCK_DRIVERS } from '../constants';
import { OrderType, OrderStatus } from '../types';

export const DeliveryManager: React.FC = () => {
  const deliveryOrders = MOCK_ORDERS.filter(o => o.type === OrderType.DELIVERY);
  const unassigned = deliveryOrders.filter(o => !o.driverId && o.status !== OrderStatus.COMPLETED);
  const active = deliveryOrders.filter(o => o.driverId && o.status !== OrderStatus.COMPLETED);

  return (
    <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Delivery Dispatch</h2>
        <div className="flex gap-4 mt-4">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 flex items-center justify-between">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase">Unassigned</p>
                 <p className="text-2xl font-bold text-gray-800">{unassigned.length}</p>
              </div>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Truck size={20} /></div>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 flex items-center justify-between">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase">In Transit</p>
                 <p className="text-2xl font-bold text-gray-800">{active.length}</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={20} /></div>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 flex items-center justify-between">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase">Drivers Available</p>
                 <p className="text-2xl font-bold text-gray-800">{MOCK_DRIVERS.filter(d => d.status === 'AVAILABLE').length}</p>
              </div>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><UserCheck size={20} /></div>
           </div>
        </div>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
         {/* Unassigned List */}
         <div className="flex-1 flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 bg-white border-b border-gray-200">
               <h3 className="font-bold text-gray-800">Ready for Pickup</h3>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
               {unassigned.map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">#{order.id}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">{order.status}</span>
                     </div>
                     <p className="font-medium text-gray-800 mb-1">{order.customerName}</p>
                     <p className="text-sm text-gray-500 flex items-start gap-1 mb-3">
                        <MapPin size={14} className="mt-0.5 shrink-0" /> {order.deliveryAddress}
                     </p>
                     <button className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                        Assign Driver
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {/* Active Deliveries */}
         <div className="flex-1 flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 bg-white border-b border-gray-200">
               <h3 className="font-bold text-gray-800">Out for Delivery</h3>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
               {active.map(order => {
                  const driver = MOCK_DRIVERS.find(d => d.id === order.driverId);
                  return (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                       <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-900">#{order.id}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">ON ROUTE</span>
                       </div>
                       <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-50">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold">
                             {driver?.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-800">{driver?.name}</p>
                             <p className="text-xs text-gray-400">Driver</p>
                          </div>
                          <a href={`tel:${driver?.phone}`} className="ml-auto p-1.5 bg-green-50 text-green-600 rounded">
                             <UserCheck size={16} />
                          </a>
                       </div>
                       <div className="flex justify-between items-center text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={14} /> Est. 15m</span>
                          <button className="text-teal-600 font-medium hover:underline">Track</button>
                       </div>
                    </div>
                  );
               })}
            </div>
         </div>
      </div>
    </div>
  );
};
