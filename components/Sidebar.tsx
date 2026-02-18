
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'chess', label: 'Chess Tracker', icon: '♟️' },
    { id: 'bjj', label: 'BJJ Tracker', icon: '🥋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="w-16 md:w-64 bg-slate-800 border-r border-slate-700 flex flex-col items-center md:items-stretch py-6 space-y-4">
      <div className="px-4 mb-8 hidden md:block">
        <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Zenith
        </h1>
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveView(item.id as View)}
          className={`flex items-center px-4 py-3 transition-colors ${
            activeView === item.id
              ? 'bg-blue-600/20 text-blue-400 border-r-4 border-blue-500'
              : 'text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="ml-3 font-medium hidden md:block">{item.label}</span>
        </button>
      ))}
      <div className="mt-auto p-4 hidden md:block">
        <p className="text-xs text-slate-500">v1.0.0 Cloud Sync Enabled</p>
      </div>
    </nav>
  );
};

export default Sidebar;
