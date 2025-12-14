import React, { useState } from 'react';
import { CalendarDays, Users, Clock, Check, X, Phone } from 'lucide-react';
import { MOCK_RESERVATIONS } from '../constants';

export const ReservationManager: React.FC = () => {
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  const upcoming = reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING');
  const past = reservations.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reservations</h2>
          <p className="text-gray-500">Manage table bookings</p>
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-orange-700">
           New Reservation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
             <CalendarDays className="text-orange-600" size={20} /> Upcoming
           </h3>
           
           {upcoming.length === 0 ? (
             <p className="text-gray-400 italic">No upcoming reservations.</p>
           ) : (
             upcoming.map(res => (
               <div key={res.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                     <div className="flex flex-col items-center justify-center bg-orange-50 w-16 h-16 rounded-lg text-orange-700 border border-orange-100">
                        <span className="text-xs font-bold uppercase">{res.date.toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl font-bold">{res.date.getDate()}</span>
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-gray-900">{res.customerName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                           <span className="flex items-center gap-1"><Users size={14} /> {res.pax} Guests</span>
                           <span className="flex items-center gap-1"><Clock size={14} /> {res.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        {res.notes && <p className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded mt-2 inline-block">Note: {res.notes}</p>}
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     {res.status === 'PENDING' && (
                       <>
                         <button className="p-2 rounded-full hover:bg-green-50 text-green-600 border border-gray-200 hover:border-green-200 transition-all" title="Confirm">
                           <Check size={20} />
                         </button>
                         <button className="p-2 rounded-full hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 transition-all" title="Decline">
                           <X size={20} />
                         </button>
                       </>
                     )}
                     {res.status === 'CONFIRMED' && (
                       <div className="text-right">
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">Confirmed</span>
                          {res.tableId && <p className="text-xs text-gray-400 mt-1">Table {res.tableId}</p>}
                       </div>
                     )}
                     <a href={`tel:${res.phone}`} className="ml-2 p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
                        <Phone size={18} />
                     </a>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Right Column: History */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg text-gray-800">History</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {past.map(res => (
                     <tr key={res.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{res.customerName}</td>
                        <td className="px-4 py-3 text-gray-500">{res.date.toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                           <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${res.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600'}`}>
                              {res.status}
                           </span>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};
