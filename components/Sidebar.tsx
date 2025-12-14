import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, ShoppingBag, ChefHat, Truck, ShoppingBasket, Menu, Settings, LogOut, PlusCircle } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? 'bg-orange-600 text-white shadow-md font-medium'
        : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0 z-10">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <div className="bg-orange-600 p-2 rounded-lg shadow-sm">
           <ChefHat className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">OkoPos</h1>
          <p className="text-xs text-gray-400">Manager V2.0</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink to="/" className={linkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Operations</p>

        <NavLink to="/orders" className={linkClass}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/reservations" className={linkClass}>
          <CalendarDays size={20} />
          <span>Reservations</span>
        </NavLink>
        
        <NavLink to="/kitchen" className={linkClass}>
          <ChefHat size={20} />
          <span>KDS (Kitchen)</span>
        </NavLink>

        <NavLink to="/delivery" className={linkClass}>
          <Truck size={20} />
          <span>Delivery</span>
        </NavLink>

        <NavLink to="/pickup" className={linkClass}>
          <ShoppingBasket size={20} />
          <span>Pickup</span>
        </NavLink>

        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Management</p>

        <NavLink to="/menu" className={linkClass}>
          <Menu size={20} />
          <span>Menu Manager</span>
        </NavLink>
        
        <NavLink to="/pos" className={linkClass}>
          <PlusCircle size={20} />
          <span>New Order (POS)</span>
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
