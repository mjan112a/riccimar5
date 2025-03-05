"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { createClient, testSupabaseConnection } from '../lib/supabase/client';
import { formatCurrency } from '../lib/metrics';
import { Download, Filter, ChevronDown, ChevronUp, Loader2, AlertTriangle } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
}

// Interface for the actual Supabase data structure
interface SupabaseOrder {
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

export default function RawData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Order>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const PAGE_SIZE = 10;

  // Test Supabase connection on component mount
  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();
        const status = await testSupabaseConnection(supabase);
        setConnectionStatus(status);
        console.log('Connection test result:', status);
      } catch (err: any) {
        console.error('Error testing connection:', err);
        setConnectionStatus({
          success: false,
          error: err.message || 'Unknown error',
          details: err,
          latency: null,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL
        });
      }
    }
    
    testConnection();
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const supabase = createClient();
        
        // Get total count for pagination
        const { count, error: countError } = await supabase
          .from('salesdata')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setTotalCount(count || 0);
        setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
        
        // Build query
        let query = supabase
          .from('salesdata')
          .select('*');
        
        // Apply status filter if not 'all'
        if (filterStatus !== 'all') {
          // Map status to Order Category values
          const statusToCategory: Record<string, string> = {
            'completed': 'Direct',
            'processing': 'Pending',
            'shipped': 'Shipping'
          };
          
          const categoryValue = statusToCategory[filterStatus];
          if (categoryValue) {
            query = query.ilike('Order Category', `%${categoryValue}%`);
          }
        }
        
        // Apply sorting - Map frontend field names to database column names
        const fieldToColumnMap: Record<string, string> = {
          'id': 'Invoice Number',
          'created_at': 'Date',
          'customer_name': 'Customer',
          'product_name': 'Item',
          'quantity': 'Quantity',
          'price': 'Product Revenue',
          'total': 'Total Revenue',
          'status': 'Order Category'
        };
        
        // Use the mapped column name for sorting
        const dbColumnName = fieldToColumnMap[sortField] || 'Date';
        query = query.order(dbColumnName, { ascending: sortDirection === 'asc' });
        
        // Apply pagination
        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);
        
        // Execute query
        const { data, error: dataError } = await query;
        
        if (dataError) throw dataError;
        
        // Map Supabase data to Order interface
        if (data && data.length > 0) {
          const mappedOrders = data.map((item: SupabaseOrder) => {
            // Extract numeric value from price string (e.g., "$155.00" -> 155.00)
            const extractPrice = (priceStr: string) => {
              const match = priceStr.match(/\$?([\d,]+(\.\d+)?)/);
              return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
            };
            
            // Determine status based on Order Category or other fields
            const determineStatus = (item: SupabaseOrder) => {
              const category = item["Order Category"]?.toLowerCase() || '';
              if (category.includes('direct')) return 'completed';
              if (category.includes('pending')) return 'processing';
              if (category.includes('shipping')) return 'shipped';
              return 'completed'; // Default status
            };
            
            return {
              id: item["Invoice Number"] || item.UUID?.toString() || 'N/A',
              created_at: item["Date"] || new Date().toISOString(),
              customer_name: item["Customer"] || 'N/A',
              product_name: item["Item"] || 'N/A',
              quantity: parseInt(item["Quantity"] || '0', 10),
              price: extractPrice(item["Product Revenue"] || '0'),
              total: extractPrice(item["Total Revenue"] || '0'),
              status: determineStatus(item)
            };
          });
          
          setOrders(mappedOrders);
        } else {
          setOrders([]);
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(`Failed to load orders: ${err.message || 'Unknown error'}`);
        
        // Fallback to mock data for development/demo purposes
        const mockOrders: Order[] = [
          {
            id: 'ORD-001',
            created_at: '2025-02-15T10:30:00Z',
            customer_name: 'Acme Industries',
            product_name: 'KX-200',
            quantity: 50,
            price: 1200,
            total: 60000,
            status: 'completed'
          },
          {
            id: 'ORD-002',
            created_at: '2025-02-14T14:45:00Z',
            customer_name: 'TechCorp Solutions',
            product_name: 'DX-100',
            quantity: 25,
            price: 1800,
            total: 45000,
            status: 'processing'
          },
          {
            id: 'ORD-003',
            created_at: '2025-02-12T09:15:00Z',
            customer_name: 'Global Manufacturing',
            product_name: 'EX-300',
            quantity: 100,
            price: 950,
            total: 95000,
            status: 'completed'
          },
          {
            id: 'ORD-004',
            created_at: '2025-02-10T16:20:00Z',
            customer_name: 'Precision Tools Inc.',
            product_name: 'KX-150',
            quantity: 30,
            price: 1100,
            total: 33000,
            status: 'shipped'
          },
          {
            id: 'ORD-005',
            created_at: '2025-02-08T11:00:00Z',
            customer_name: 'Advanced Materials Co.',
            product_name: 'DX-200',
            quantity: 75,
            price: 1500,
            total: 112500,
            status: 'completed'
          },
          {
            id: 'ORD-006',
            created_at: '2025-02-05T13:30:00Z',
            customer_name: 'Industrial Solutions',
            product_name: 'EX-100',
            quantity: 40,
            price: 850,
            total: 34000,
            status: 'processing'
          },
          {
            id: 'ORD-007',
            created_at: '2025-02-03T10:45:00Z',
            customer_name: 'Quality Products Ltd.',
            product_name: 'KX-300',
            quantity: 60,
            price: 1350,
            total: 81000,
            status: 'shipped'
          },
          {
            id: 'ORD-008',
            created_at: '2025-02-01T09:00:00Z',
            customer_name: 'Innovative Manufacturing',
            product_name: 'DX-150',
            quantity: 35,
            price: 1650,
            total: 57750,
            status: 'completed'
          }
        ];
        
        // Apply status filter
        let filteredOrders = [...mockOrders];
        if (filterStatus !== 'all') {
          filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
        }
        
        // Apply sorting
        filteredOrders.sort((a, b) => {
          if (sortField === 'created_at') {
            return sortDirection === 'asc' 
              ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          
          if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
            return sortDirection === 'asc'
              ? (a[sortField] as string).localeCompare(b[sortField] as string)
              : (b[sortField] as string).localeCompare(a[sortField] as string);
          }
          
          return sortDirection === 'asc'
            ? (a[sortField] as number) - (b[sortField] as number)
            : (b[sortField] as number) - (a[sortField] as number);
        });
        
        setOrders(filteredOrders);
        setTotalCount(filteredOrders.length);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [sortField, sortDirection, filterStatus, currentPage]);

  const handleSort = (field: keyof Order) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Header title="Raw Sales Data" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Orders</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Filter className="h-4 w-4" />
                  </div>
                </div>
                
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">Loading data...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <p className="mt-2 text-sm">Using fallback data for demonstration purposes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('id')}
                      >
                        <div className="flex items-center">
                          Order ID
                          {sortField === 'id' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center">
                          Date
                          {sortField === 'created_at' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('customer_name')}
                      >
                        <div className="flex items-center">
                          Customer
                          {sortField === 'customer_name' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('product_name')}
                      >
                        <div className="flex items-center">
                          Product
                          {sortField === 'product_name' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('quantity')}
                      >
                        <div className="flex items-center">
                          Quantity
                          {sortField === 'quantity' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center">
                          Price
                          {sortField === 'price' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('total')}
                      >
                        <div className="flex items-center">
                          Total
                          {sortField === 'total' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          {sortField === 'status' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.price, 2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {orders.length} of {totalCount} orders
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          
          {/* Connection Status Diagnostic Panel */}
          {connectionStatus && (
            <div className={`mb-6 border rounded-lg p-4 ${connectionStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h2 className={`text-lg font-medium mb-2 flex items-center ${connectionStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                {connectionStatus.success ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Supabase Connection: Successful
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Supabase Connection: Failed
                  </>
                )}
              </h2>
              <div className={`text-sm ${connectionStatus.success ? 'text-green-700' : 'text-red-700'} space-y-1`}>
                <p><strong>URL:</strong> {connectionStatus.url}</p>
                {connectionStatus.latency && <p><strong>Latency:</strong> {connectionStatus.latency}ms</p>}
                {!connectionStatus.success && (
                  <>
                    <p><strong>Error:</strong> {connectionStatus.error}</p>
                    <p className="mt-2 font-semibold">Troubleshooting Steps:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Verify the Supabase URL and API key in your .env.local file</li>
                      <li>Check your network connection and DNS settings</li>
                      <li>Ensure the Supabase project is active and not in maintenance mode</li>
                      <li>Verify that your IP is not blocked by Supabase</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-medium text-blue-800 mb-2">About This Data</h2>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                This page displays raw sales data from our order management system, fetched directly from our Supabase database.
              </p>
              <p>
                You can sort the data by clicking on any column header, and filter by order status using the dropdown menu.
                The export button allows you to download the current view as a CSV file for further analysis.
              </p>
              <p>
                For more detailed analysis of this data, visit the Metrics and Trend Graphs pages.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
