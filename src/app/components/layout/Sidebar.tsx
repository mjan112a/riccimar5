"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  ChartPieIcon,
  FileText,
  Home,
  LineChart,
  Menu,
  MessageSquare,
  ShoppingCart,
} from 'lucide-react';

// Navigation items based on riccifeb20 app
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
  { name: 'Raw Data', path: '/raw-data', icon: <ShoppingCart className="h-5 w-5" /> },
  { name: 'Metrics', path: '/metricsofinterest', icon: <BarChart3 className="h-5 w-5" /> },
  { name: 'Trend Graphs', path: '/metricsgraph', icon: <LineChart className="h-5 w-5" /> },
  { name: 'Dynamic Charts', path: '/dynamic-metrics', icon: <ChartPieIcon className="h-5 w-5" /> },
  { name: 'Hypothetical Scenarios', path: '/hypothetical-metrics', icon: <LineChart className="h-5 w-5" /> },
  { name: 'Monthly Report', path: '/monthly-report', icon: <FileText className="h-5 w-5" /> },
  { name: 'AI Assistant', path: '/ai-assistant', icon: <MessageSquare className="h-5 w-5" /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
      {/* Logo and toggle */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="text-xl font-bold">10X Materials Dashboard</div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            
            return (
              <li key={item.name} className="mb-2">
                <Link 
                  href={item.path}
                  className={`flex items-center px-4 py-3 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'} transition-colors duration-200`}
                >
                  {item.icon}
                  {!collapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!collapsed && (
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} 10X Engineered Materials
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
