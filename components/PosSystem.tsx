import React, { useState } from 'react';
import { Users, Clock, ChevronRight, Search, Trash, CheckCircle } from 'lucide-react';
import { INITIAL_TABLES, MOCK_MENU } from '../constants';
import { Table, TableStatus, OrderItem, MenuItem, ProductCategory } from '../types';

export const PosSystem: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const selectedTable = tables.find(t => t.id === selectedTableId);

  const handleTableClick = (table: Table) => {
    setSelectedTableId(table.id);
    // In a real app, fetch existing order if table is OCCUPIED
    setCurrentOrder([]);
  };

  const addToOrder = (item: MenuItem) => {
    if (!selectedTableId) return;
    setCurrentOrder(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    
    // Auto update status if AVAILABLE
    if (selectedTable?.status === TableStatus.AVAILABLE) {
      setTables(prev => prev.map(t => t.id === selectedTableId ? { ...t, status: TableStatus.OCCUPIED } : t));
    }
  };

  const removeFromOrder = (itemId: string) => {
    setCurrentOrder(prev => prev.filter(i => i.menuItemId !== itemId));
  };

  const submitOrder = () => {
    if (currentOrder.length === 0) return;
    alert(`Order submitted for ${selectedTable?.name}! Total: $${currentOrder.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}`);
    setSelectedTableId(null);
    setCurrentOrder([]);
  };

  const filteredMenu = MOCK_MENU.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const total = currentOrder.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left: Table Grid or Menu Grid */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedTableId ? 'pr-96' : ''}`}>
        
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {selectedTableId ? `Ordering for ${selectedTable?.name}` : 'Floor Plan'}
          </h2>
          {selectedTableId && (
             <button onClick={() => setSelectedTableId(null)} className="text-sm text-orange-600 font-medium hover:underline">
               Back to Tables
             </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedTableId ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  className={`relative p-6 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all h-40 shadow-sm
                    ${table.status === TableStatus.AVAILABLE ? 'border-gray-200 bg-white hover:border-green-400' : ''}
                    ${table.status === TableStatus.OCCUPIED ? 'border-orange-200 bg-orange-50 hover:border-orange-400' : ''}
                    ${table.status === TableStatus.RESERVED ? 'border-blue-200 bg-blue-50 hover:border-blue-400' : ''}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${table.status === TableStatus.AVAILABLE ? 'bg-gray-100 text-gray-500' : ''}
                    ${table.status === TableStatus.OCCUPIED ? 'bg-orange-100 text-orange-600' : ''}
                    ${table.status === TableStatus.RESERVED ? 'bg-blue-100 text-blue-600' : ''}
                  `}>
                    <Users size={20} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-gray-800">{table.name}</h3>
                    <p className="text-xs text-gray-500 uppercase font-semibold mt-1">{table.status}</p>
                  </div>
                  {table.status === TableStatus.OCCUPIED && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-orange-600 text-xs font-bold">
                       <Clock size={12} /> 24m
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Menu Categories */}
              <div className="flex gap-2 overflow-x-auto pb-4 shrink-0">
                {['ALL', ...Object.values(ProductCategory)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors
                      ${activeCategory === cat ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Menu Search */}
              <div className="relative mb-4 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search menu..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                {filteredMenu.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => addToOrder(item)}
                    className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-orange-500 transition-colors flex flex-col gap-2"
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-24 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                      <p className="text-orange-600 font-bold text-sm">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar: Current Order Panel (Only visible when table selected) */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-2xl transform transition-transform duration-300 flex flex-col z-20 ${selectedTableId ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800 text-lg">Current Order</h3>
            <p className="text-sm text-gray-500">Table: {selectedTable?.name}</p>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentOrder.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Users className="w-12 h-12 mb-2 opacity-20" />
                <p>No items added yet</p>
              </div>
            ) : (
              currentOrder.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm border border-gray-100">
                       {item.quantity}x
                     </div>
                     <div>
                       <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                       <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <p className="font-bold text-gray-800 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                     <button onClick={() => removeFromOrder(item.menuItemId)} className="text-red-400 hover:text-red-600">
                       <Trash size={16} />
                     </button>
                   </div>
                </div>
              ))
            )}
         </div>

         <div className="p-6 border-t border-gray-100 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Tax (8%)</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-800 font-bold text-xl pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={submitOrder}
              disabled={currentOrder.length === 0}
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
            >
              Send to Kitchen <ChevronRight />
            </button>
         </div>
      </div>
    </div>
  );
};