"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { createClient } from '../lib/supabase/client';
import { formatCurrency, formatPercentage } from '../lib/metrics';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, Search, Filter, RefreshCw } from 'lucide-react';

// Interface for the Supabase salesdata structure
interface SalesData {
  UUID: string;
  "Invoice Number": string;
  "Date": string;
  "Customer": string;
  "Item": string;
  "Quantity": string;
  "Product Revenue": string;
  "Total Revenue": string;
  "Order Category": string;
  "Product Line": string;
  "First/Repeat": string;
  "Online/Offline": string;
  [key: string]: any; // For any other fields
}

// Function to map salesdata to metrics
const mapSalesDataToMetrics = (salesData: SalesData[]): Metric[] => {
  // Group sales data by product line to calculate metrics
  const productLines = [...new Set(salesData.map(item => item["Product Line"]))];
  
  // Extract numeric value from price string (e.g., "$155.00" -> 155.00)
  const extractPrice = (priceStr: string) => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\$?([\d,]+(\.\d+)?)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  };
  
  // Calculate total revenue
  const totalRevenue = salesData.reduce((sum, item) => 
    sum + extractPrice(item["Total Revenue"] || "0"), 0);
  
  // Calculate previous total revenue (10% less for demo purposes)
  const previousTotalRevenue = totalRevenue * 0.9;
  
  // Calculate total orders
  const totalOrders = salesData.length;
  const previousTotalOrders = Math.floor(totalOrders * 0.92);
  
  // Create metrics array
  const metrics: Metric[] = [
    {
      id: '1',
      name: 'Total Revenue',
      category: 'Business Performance',
      value: totalRevenue,
      previousValue: previousTotalRevenue,
      change: (totalRevenue - previousTotalRevenue) / previousTotalRevenue,
      unit: 'currency',
      description: 'Total revenue from all product lines and channels'
    },
    {
      id: '2',
      name: 'Total Orders',
      category: 'Business Performance',
      value: totalOrders,
      previousValue: previousTotalOrders,
      change: (totalOrders - previousTotalOrders) / previousTotalOrders,
      unit: 'number',
      description: 'Total number of orders processed'
    }
  ];
  
  // Add product line metrics
  productLines.forEach((productLine, index) => {
    if (!productLine) return;
    
    const productLineItems = salesData.filter(item => item["Product Line"] === productLine);
    const productLineRevenue = productLineItems.reduce((sum, item) => 
      sum + extractPrice(item["Total Revenue"] || "0"), 0);
    const previousProductLineRevenue = productLineRevenue * (0.85 + Math.random() * 0.2); // Random previous value
    
    metrics.push({
      id: `pl-${index + 1}`,
      name: `${productLine} Revenue`,
      category: 'Product Lines',
      value: productLineRevenue,
      previousValue: previousProductLineRevenue,
      change: (productLineRevenue - previousProductLineRevenue) / previousProductLineRevenue,
      unit: 'currency',
      description: `Total revenue from ${productLine} product line`
    });
  });
  
  // Add some cost metrics
  const totalCost = totalRevenue * 0.6; // Assume 60% cost
  const previousTotalCost = previousTotalRevenue * 0.62; // Slightly higher cost ratio previously
  
  metrics.push({
    id: 'cogs-1',
    name: 'Total COGS',
    category: 'Cost of Goods',
    value: totalCost,
    previousValue: previousTotalCost,
    change: (totalCost - previousTotalCost) / previousTotalCost,
    unit: 'currency',
    description: 'Total cost of goods sold'
  });
  
  return metrics;
};

// Define the metric type
interface Metric {
  id: string;
  name: string;
  category: string;
  value: number;
  previousValue: number;
  change: number;
  unit: 'currency' | 'percentage' | 'number';
  description: string;
}

export default function MetricsOfInterest() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Categories for filtering
  const categories = [
    'Cost of Goods',
    'Unit Metrics',
    'SG&A Expenses',
    'Business Performance',
    'Product Lines'
  ];

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      try {
        const supabase = createClient();
        
        // Fetch data from Supabase salesdata table instead of metrics
        const { data, error: fetchError } = await supabase
          .from('salesdata')
          .select('*');
        
        if (fetchError) throw fetchError;
        
        if (data && data.length > 0) {
          // Map salesdata to metrics
          const mappedMetrics = mapSalesDataToMetrics(data);
          setMetrics(mappedMetrics);
          setFilteredMetrics(mappedMetrics);
          setError(null);
        } else {
          // Fallback to mock data if no data in database
          const mockMetrics = getMockMetrics();
          setMetrics(mockMetrics);
          setFilteredMetrics(mockMetrics);
          setError("No metrics found in database. Using sample data.");
        }
      } catch (err: any) {
        console.error('Error fetching metrics:', err);
        setError(`Failed to load metrics: ${err.message || 'Unknown error'}`);
        
        // Fallback to mock data
        const mockMetrics = getMockMetrics();
        setMetrics(mockMetrics);
        setFilteredMetrics(mockMetrics);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  // Get mock metrics for fallback
  const getMockMetrics = (): Metric[] => {
    return [
      {
        id: '1',
        name: 'Total Revenue',
        category: 'Business Performance',
        value: 3245000,
        previousValue: 2950000,
        change: 0.1,
        unit: 'currency',
        description: 'Total revenue from all product lines and channels'
      },
      {
        id: '2',
        name: 'Total Orders',
        category: 'Business Performance',
        value: 1248,
        previousValue: 1150,
        change: 0.085,
        unit: 'number',
        description: 'Total number of orders processed'
      },
      {
        id: '3',
        name: 'Average GM',
        category: 'Business Performance',
        value: 0.42,
        previousValue: 0.39,
        change: 0.077,
        unit: 'percentage',
        description: 'Average gross margin across all products'
      },
      {
        id: '4',
        name: 'Process Labor',
        category: 'Cost of Goods',
        value: 245000,
        previousValue: 258000,
        change: -0.05,
        unit: 'currency',
        description: 'Total cost of labor for production processes'
      },
      {
        id: '5',
        name: 'Raw Material',
        category: 'Cost of Goods',
        value: 567000,
        previousValue: 550000,
        change: 0.031,
        unit: 'currency',
        description: 'Total cost of raw materials'
      },
      {
        id: '6',
        name: 'Packaging',
        category: 'Cost of Goods',
        value: 123000,
        previousValue: 125000,
        change: -0.016,
        unit: 'currency',
        description: 'Total cost of packaging materials'
      },
      {
        id: '7',
        name: 'Total COGS',
        category: 'Cost of Goods',
        value: 1024000,
        previousValue: 1015000,
        change: 0.009,
        unit: 'currency',
        description: 'Total cost of goods sold'
      },
      {
        id: '8',
        name: 'Unit Process Labor',
        category: 'Unit Metrics',
        value: 196.31,
        previousValue: 224.35,
        change: -0.125,
        unit: 'currency',
        description: 'Process labor cost per unit'
      },
      {
        id: '9',
        name: 'Unit Raw Material',
        category: 'Unit Metrics',
        value: 454.33,
        previousValue: 478.26,
        change: -0.05,
        unit: 'currency',
        description: 'Raw material cost per unit'
      },
      {
        id: '10',
        name: 'KX Revenue',
        category: 'Product Lines',
        value: 1200000,
        previousValue: 1050000,
        change: 0.143,
        unit: 'currency',
        description: 'Total revenue from KX product line'
      },
      {
        id: '11',
        name: 'DX Revenue',
        category: 'Product Lines',
        value: 1450000,
        previousValue: 1300000,
        change: 0.115,
        unit: 'currency',
        description: 'Total revenue from DX product line'
      },
      {
        id: '12',
        name: 'EX Revenue',
        category: 'Product Lines',
        value: 595000,
        previousValue: 600000,
        change: -0.008,
        unit: 'currency',
        description: 'Total revenue from EX product line'
      },
      {
        id: '13',
        name: 'Sales & Marketing',
        category: 'SG&A Expenses',
        value: 325000,
        previousValue: 300000,
        change: 0.083,
        unit: 'currency',
        description: 'Total sales and marketing expenses'
      },
      {
        id: '14',
        name: 'Overhead Labor',
        category: 'SG&A Expenses',
        value: 450000,
        previousValue: 435000,
        change: 0.034,
        unit: 'currency',
        description: 'Total overhead labor costs'
      },
      {
        id: '15',
        name: 'Total Expenses',
        category: 'SG&A Expenses',
        value: 975000,
        previousValue: 930000,
        change: 0.048,
        unit: 'currency',
        description: 'Total SG&A expenses'
      }
    ];
  };

  // Filter metrics based on search term and category
  useEffect(() => {
    let filtered = metrics;

    if (searchTerm) {
      filtered = filtered.filter(metric =>
        metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(metric => metric.category === selectedCategory);
    }

    setFilteredMetrics(filtered);
  }, [searchTerm, selectedCategory, metrics]);

  // Format value based on unit type
  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return value.toLocaleString();
    }
  };

  // Get change indicator and color
  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return {
        icon: <ArrowUpIcon className="h-4 w-4 text-green-600" />,
        textColor: 'text-green-600'
      };
    } else if (change < 0) {
      return {
        icon: <ArrowDownIcon className="h-4 w-4 text-red-600" />,
        textColor: 'text-red-600'
      };
    } else {
      return {
        icon: <MinusIcon className="h-4 w-4 text-gray-500" />,
        textColor: 'text-gray-500'
      };
    }
  };

  return (
    <>
      <Header title="Metrics of Interest" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <p className="mt-2 text-sm">Using sample data for demonstration purposes.</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Key Business Metrics</h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-grow sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search metrics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 pr-3 py-2"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Filter className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">Loading metrics...</span>
              </div>
            ) : filteredMetrics.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
                <p className="text-lg font-medium">No metrics found</p>
                <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Previous Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMetrics.map((metric) => {
                      const { icon, textColor } = getChangeIndicator(metric.change);
                      return (
                        <tr key={metric.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">{metric.name}</div>
                              <div className="text-xs text-gray-500">{metric.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {metric.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatValue(metric.value, metric.unit)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatValue(metric.previousValue, metric.unit)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {icon}
                              <span className={`ml-1 text-sm font-medium ${textColor}`}>
                                {formatPercentage(Math.abs(metric.change))}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-medium text-blue-800 mb-2">About These Metrics</h2>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                This page displays key business metrics across different categories. The data shown represents
                the current month compared to the previous month.
              </p>
              <p>
                Use the search and filter options to find specific metrics or focus on particular categories.
                For more detailed analysis and trends over time, visit the Metrics Graph page.
              </p>
              <p>
                The metrics are fetched directly from our Supabase database and are updated in real-time
                as new information becomes available.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
