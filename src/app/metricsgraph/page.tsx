"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Function to parse numeric values
function parseValue(value: string): number {
  // Remove quotes, spaces, and currency symbols
  const cleanValue = value.replace(/[""$,\s]/g, '');
  // Remove parentheses and make negative
  if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) {
    return -Number(cleanValue.slice(1, -1));
  }
  return Number(cleanValue);
}

// Generate a color for each metric
const colors = [
  'rgb(75, 192, 192)',   // teal
  'rgb(255, 99, 132)',   // pink
  'rgb(54, 162, 235)',   // blue
  'rgb(255, 206, 86)',   // yellow
  'rgb(153, 102, 255)',  // purple
  'rgb(255, 159, 64)',   // orange
  'rgb(75, 192, 100)',   // green
  'rgb(255, 99, 71)',    // red
];

// Metric categories
const categories = {
  'Cost of Goods': [
    'Process Labor',
    'Raw Material',
    'Packaging',
    'Maintenance',
    'Waste',
    'Inventory',
    'Utilities',
    'Shipping',
    'Total COGS'
  ],
  'Unit Metrics': [
    'Unit Process Labor',
    'Unit Raw Material',
    'Unit Packaging',
    'Unit Maintenance',
    'Unit Waste',
    'Unit Inventory',
    'Unit Utilities',
    'Unit Shipping',
    'Total Unit COGS'
  ],
  'SG&A Expenses': [
    'Professional Fees',
    'Sales & Marketing',
    'Overhead Labor',
    'Benefits',
    'Accounting',
    'Equipment Rental',
    'Tax',
    'Insurance',
    'Office',
    'Banking',
    'R&D',
    'Warehouse',
    'Misc',
    'Legal',
    'Total Expenses'
  ],
  'Business Performance': [
    'Total Orders',
    'Tons',
    'Product Revenue',
    'Tons/Order',
    'Revenue/Order',
    'Average Price',
    'Average GM',
    'Average OM',
    '% Average GM',
    '% Average OM'
  ],
  'Product Lines': [
    'KX Orders', 'KX Tons', 'KX Revenue', 'KX Avg Price', 'KX Avg GM', 'KX Avg OM',
    'DX Orders', 'DX Tons', 'DX Revenue', 'DX Avg Price', 'DX Avg GM', 'DX Avg OM',
    'EX Orders', 'EX Tons', 'EX Revenue', 'EX Avg Price', 'EX Avg GM', 'EX Avg OM'
  ]
};

export default function MetricsGraph() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [availableMetrics, setAvailableMetrics] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, this would fetch data from an API
    // For now, we'll use mock data
    const mockMetrics = Object.values(categories).flat();
    setAvailableMetrics(mockMetrics);
  }, []);

  useEffect(() => {
    if (selectedMetrics.length > 0) {
      // In a real implementation, this would fetch data from an API
      // For now, we'll generate mock data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const datasets = selectedMetrics.map((metric, index) => {
        // Generate random values for demo purposes
        const values = Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000000));
        
        return {
          label: metric,
          data: values,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length],
          tension: 0.1,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2
        };
      });

      setChartData({
        labels: months,
        datasets
      });
    } else {
      setChartData(null);
    }
  }, [selectedMetrics]);

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <>
      <Header title="Metrics Visualization" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-medium text-blue-800 mb-2">About This Graph</h2>
              <div className="text-sm text-blue-700 space-y-2">
                <p>
                  This interactive visualization allows you to analyze and compare different business metrics over time.
                  Use the selection tools below to choose which metrics to display.
                </p>
                <ul className="list-disc list-inside">
                  <li>Click the quick selection buttons to view all metrics in a category</li>
                  <li>Hover over data points to see detailed values</li>
                  <li>The y-axis automatically scales and formats large numbers (K = thousands, M = millions)</li>
                  <li>Use the checkboxes below to customize your view</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-700">Select Metrics</h2>
              {selectedMetrics.length > 0 && (
                <button
                  onClick={() => setSelectedMetrics([])}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
            
            {/* Two-panel selection system */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left panel: Category selection */}
              <div className="w-full md:w-1/4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {Object.entries(categories).map(([category, metrics], index) => {
                      // Determine category color
                      const colors = ['blue', 'green', 'yellow', 'purple', 'red'];
                      const colorClass = `${colors[index % colors.length]}`;
                      
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedMetrics(metrics)}
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm hover:bg-${colorClass}-50`}
                        >
                          <span className={`w-3 h-3 rounded-full bg-${colorClass}-500 mr-2`}></span>
                          <span>{category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Right panel: Selected metrics and search */}
              <div className="w-full md:w-3/4">
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search metrics..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Selected metrics as tags */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Selected Metrics</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMetrics.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No metrics selected. Choose a category or search for metrics.</p>
                    ) : (
                      selectedMetrics.map((metric, index) => (
                        <div 
                          key={metric} 
                          className={`flex items-center px-3 py-1 rounded-full text-sm ${
                            index % 5 === 0 ? 'bg-blue-100 text-blue-800' :
                            index % 5 === 1 ? 'bg-green-100 text-green-800' :
                            index % 5 === 2 ? 'bg-yellow-100 text-yellow-800' :
                            index % 5 === 3 ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          <span>{metric}</span>
                          <button 
                            onClick={() => handleMetricToggle(metric)}
                            className="ml-2 focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Quick metric selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Total Revenue', 'Total Orders', 'Average GM', 'Process Labor', 'Raw Material', 'Total COGS'].map((metric) => (
                      <button
                        key={metric}
                        onClick={() => {
                          if (!selectedMetrics.includes(metric)) {
                            setSelectedMetrics(prev => [...prev, metric]);
                          }
                        }}
                        disabled={selectedMetrics.includes(metric)}
                        className={`text-left px-3 py-2 rounded text-sm ${
                          selectedMetrics.includes(metric) 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {metric}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  interaction: {
                    mode: 'index' as const,
                    intersect: false,
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                      border: {
                        dash: [4, 4],
                      },
                      ticks: {
                        callback: function(value: any) {
                          // Get the current metric name
                          const currentMetric = selectedMetrics[0] || '';
                          
                          // Handle percentages
                          if (currentMetric.startsWith('%') || currentMetric.includes('GM') || currentMetric.includes('OM')) {
                            return value.toFixed(1) + '%';
                          }
                          
                          // Handle metrics with "Price" in the name
                          if (currentMetric.includes('Price') || currentMetric.includes('Revenue/Order')) {
                            return '$' + value.toFixed(2);
                          }
                          
                          // Handle metrics with "Orders" or "Tons" in the name
                          if (currentMetric.includes('Orders') || currentMetric.includes('Tons')) {
                            return value.toLocaleString();
                          }
                          
                          // Default currency formatting with K/M suffix for large numbers
                          if (Math.abs(value) >= 1000000) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                          } else if (Math.abs(value) >= 1000) {
                            return '$' + (value / 1000).toFixed(1) + 'K';
                          }
                          return '$' + value;
                        },
                        padding: 10
                      },
                      title: {
                        display: true,
                        text: selectedMetrics[0]?.includes('Orders') ? 'Number of Orders' :
                              selectedMetrics[0]?.includes('Tons') ? 'Tons' :
                              selectedMetrics[0]?.startsWith('%') || selectedMetrics[0]?.includes('GM') || selectedMetrics[0]?.includes('OM') ? 'Percentage' :
                              'Amount (USD)',
                        font: {
                          size: 14,
                          weight: 'bold'
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      title: {
                        display: true,
                        text: 'Month',
                        font: {
                          size: 14,
                          weight: 'bold'
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top' as const,
                      display: true,
                    },
                    title: {
                      display: true,
                      text: 'Monthly Trends',
                      font: {
                        size: 16,
                        weight: 'bold'
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context: any) {
                          let label = context.dataset.label || '';
                          let value = context.parsed.y;
                          
                          if (label) {
                            label += ': ';
                          }
                          
                          if (value !== null) {
                            // Handle percentages
                            if (label.startsWith('%') || label.includes('GM') || label.includes('OM')) {
                              label += value.toFixed(1) + '%';
                            }
                            // Handle metrics with "Price" in the name
                            else if (label.includes('Price') || label.includes('Revenue/Order')) {
                              label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(value);
                            }
                            // Handle metrics with "Orders" or "Tons" in the name
                            else if (label.includes('Orders') || label.includes('Tons')) {
                              label += value.toLocaleString();
                            }
                            // Default currency formatting
                            else {
                              label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              }).format(value);
                            }
                          }
                          return label;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="text-center text-gray-500 py-12">
                Select one or more metrics to display the chart
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
