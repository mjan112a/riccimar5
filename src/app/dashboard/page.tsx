"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Link from 'next/link';
import { BarChart3, LineChart, FileText, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  // Define types for our metrics
  interface Metric {
    id: number;
    name: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }

  interface Stats {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    productionEfficiency: number;
    recentMetrics: Metric[];
  }

  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    productionEfficiency: 0,
    recentMetrics: []
  });

  // Fetch dashboard data
  useEffect(() => {
    // In a real implementation, this would fetch data from Supabase
    // For now, we'll use mock data
    setStats({
      totalOrders: 1248,
      totalRevenue: 3245000,
      avgOrderValue: 2600,
      productionEfficiency: 87,
      recentMetrics: [
        { id: 1, name: 'Process Labor', value: '$245,000', trend: 'up' },
        { id: 2, name: 'Raw Material', value: '$567,000', trend: 'down' },
        { id: 3, name: 'Packaging', value: '$123,000', trend: 'stable' },
        { id: 4, name: 'Maintenance', value: '$89,000', trend: 'up' },
        { id: 5, name: 'Total COGS', value: '$1,024,000', trend: 'down' }
      ]
    });
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/raw-data" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View all orders
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/metricsofinterest" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View revenue metrics
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(stats.avgOrderValue)}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/metricsgraph" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View trend graphs
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Production Efficiency</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.productionEfficiency}%</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/dynamic-metrics" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View efficiency metrics
                </Link>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Distribution Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h2>
              <div className="h-64 flex items-end justify-around">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-blue-500 rounded-t-lg" 
                    style={{ height: '120px' }}
                  ></div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Product A</p>
                  <p className="text-sm text-gray-500">$1.2M</p>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-green-500 rounded-t-lg" 
                    style={{ height: '180px' }}
                  ></div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Product B</p>
                  <p className="text-sm text-gray-500">$1.8M</p>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-purple-500 rounded-t-lg" 
                    style={{ height: '80px' }}
                  ></div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Product C</p>
                  <p className="text-sm text-gray-500">$0.8M</p>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-amber-500 rounded-t-lg" 
                    style={{ height: '60px' }}
                  ></div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Product D</p>
                  <p className="text-sm text-gray-500">$0.6M</p>
                </div>
              </div>
            </div>

            {/* Recent Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Metrics</h2>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentMetrics.map((metric) => (
                      <tr key={metric.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metric.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {metric.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            metric.trend === 'up' ? 'bg-green-100 text-green-800' :
                            metric.trend === 'down' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {metric.trend === 'up' ? '↑ Up' : 
                             metric.trend === 'down' ? '↓ Down' : '→ Stable'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Link href="/metricsofinterest" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View all metrics
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/metricsgraph" 
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <LineChart className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">View Trends</p>
                  <p className="text-sm text-blue-700">Analyze metric trends</p>
                </div>
              </Link>
              
              <Link 
                href="/monthly-report" 
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Generate Report</p>
                  <p className="text-sm text-green-700">Create monthly PDF reports</p>
                </div>
              </Link>
              
              <Link 
                href="/ai-assistant" 
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-purple-900">AI Assistant</p>
                  <p className="text-sm text-purple-700">Ask questions about your data</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
