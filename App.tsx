import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PosSystem } from './components/PosSystem';
import { MenuManager } from './components/MenuManager';
import { KitchenView } from './components/KitchenView';
import { OrderManager } from './components/OrderManager';
import { ReservationManager } from './components/ReservationManager';
import { DeliveryManager } from './components/DeliveryManager';
import { PickupManager } from './components/PickupManager';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<OrderManager />} />
          <Route path="/reservations" element={<ReservationManager />} />
          <Route path="/kitchen" element={<KitchenView />} />
          <Route path="/delivery" element={<DeliveryManager />} />
          <Route path="/pickup" element={<PickupManager />} />
          <Route path="/menu" element={<MenuManager />} />
          <Route path="/pos" element={<PosSystem />} />
          <Route path="/settings" element={<div className="p-8">Settings Placeholder</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
