"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { FileText, Download, ChevronDown, Check } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDF components to ensure they only load on the client side
const PDFDocument = dynamic(() => import('./pdf-document').then(mod => ({ default: mod.PDFDocument })), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>
});

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => ({ default: mod.PDFViewer })), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>
});

export default function MonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState<string>('February');
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [includeGraphs, setIncludeGraphs] = useState<boolean>(true);
  const [includeRawData, setIncludeRawData] = useState<boolean>(true);
  const [includeExecutiveSummary, setIncludeExecutiveSummary] = useState<boolean>(true);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const years = ['2023', '2024', '2025'];

  // Mock data for the report
  const reportData = {
    month: selectedMonth,
    year: selectedYear,
    metrics: [
      { name: 'Total Revenue', value: '$3,245,000', change: '+12%' },
      { name: 'Total Orders', value: '1,248', change: '+8%' },
      { name: 'Average Order Value', value: '$2,600', change: '+4%' },
      { name: 'Production Efficiency', value: '87%', change: '+2%' },
      { name: 'Process Labor', value: '$245,000', change: '-5%' },
      { name: 'Raw Material', value: '$567,000', change: '+3%' },
      { name: 'Packaging', value: '$123,000', change: '-2%' },
      { name: 'Total COGS', value: '$1,024,000', change: '+1%' }
    ],
    products: [
      { name: 'Product A', revenue: '$1,200,000', units: '450', avgPrice: '$2,667' },
      { name: 'Product B', revenue: '$1,800,000', units: '620', avgPrice: '$2,903' },
      { name: 'Product C', revenue: '$800,000', units: '320', avgPrice: '$2,500' },
      { name: 'Product D', revenue: '$600,000', units: '250', avgPrice: '$2,400' }
    ],
    executiveSummary: `
      In ${selectedMonth} ${selectedYear}, 10X Engineered Materials continued to show strong performance across key metrics. 
      Total revenue increased by 12% compared to the previous month, driven primarily by growth in Product B sales.
      
      Production efficiency improved by 2 percentage points, reflecting the impact of recent process improvements and equipment upgrades.
      
      Process labor costs decreased by 5%, demonstrating the effectiveness of our automation initiatives. However, raw material costs 
      increased by 3% due to supply chain challenges that we are actively addressing.
      
      Looking ahead, we anticipate continued growth in Q2, with a focus on expanding our Product B line and further optimizing 
      our production processes to maintain margin improvements.
    `.trim().replace(/\s+/g, ' '),
    includeGraphs,
    includeRawData,
    includeExecutiveSummary
  };

  const handleGenerateReport = () => {
    setShowPreview(true);
  };

  return (
    <>
      <Header title="Monthly Report Generator" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Time Period Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Report Content Options */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Report Content</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeExecutiveSummary}
                    onChange={() => setIncludeExecutiveSummary(!includeExecutiveSummary)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Executive Summary</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeGraphs}
                    onChange={() => setIncludeGraphs(!includeGraphs)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Performance Graphs</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeRawData}
                    onChange={() => setIncludeRawData(!includeRawData)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Raw Data Tables</span>
                </label>
              </div>
            </div>
            
            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerateReport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="mr-2 h-5 w-5" />
                Generate Report
              </button>
            </div>
          </div>
          
          {/* PDF Preview */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Report Preview</h2>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Download PDF
                </button>
              </div>
              
              <div className="border border-gray-300 rounded-md h-[600px] overflow-hidden">
                <PDFViewer width="100%" height="100%" className="rounded-md">
                  <PDFDocument data={reportData} />
                </PDFViewer>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
