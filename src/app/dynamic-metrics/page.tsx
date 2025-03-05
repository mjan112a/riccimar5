"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { createClient } from '../lib/supabase/client';
import { formatCurrency, formatPercentage } from '../lib/metrics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Sliders, BarChart2, LineChart, Save, RefreshCw } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the parameter type
interface Parameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
}

// Define the metric type
interface Metric {
  id: string;
  name: string;
  value: number;
  unit: 'currency' | 'percentage' | 'number';
  description: string;
}

// Define the preset type
interface Preset {
  id: string;
  name: string;
  parameters: Parameter[];
}

export default function DynamicMetrics() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [presetName, setPresetName] = useState<string>('');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize parameters and metrics
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const supabase = createClient();
        
        // Try to fetch data from salesdata table instead of parameters
        // This is a temporary solution until the parameters table is created
        const { data: salesData, error: salesError } = await supabase
          .from('salesdata')
          .select('*');
        
        if (salesError) throw salesError;
        
        // Since we don't have a parameters table, we'll use default parameters
        const defaultParams = getDefaultParameters();
        setParameters(defaultParams);
        
        // Since we don't have a presets table, we'll use default presets
        const defaultPresets = getDefaultPresets(defaultParams);
        setPresets(defaultPresets);
        
        // No need to process data since we're using default values
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(`Failed to load data: ${err.message || 'Unknown error'}`);
        
        // Fallback to default data
        const defaultParams = getDefaultParameters();
        setParameters(defaultParams);
        setPresets(getDefaultPresets(defaultParams));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get default parameters (fallback)
  const getDefaultParameters = (): Parameter[] => {
    return [
      {
        id: 'p1',
        name: 'Production Efficiency',
        value: 85,
        min: 50,
        max: 100,
        step: 1,
        unit: '%',
        description: 'Overall efficiency of production processes'
      },
      {
        id: 'p2',
        name: 'Raw Material Cost',
        value: 450,
        min: 300,
        max: 800,
        step: 10,
        unit: '$/unit',
        description: 'Cost of raw materials per unit'
      },
      {
        id: 'p3',
        name: 'Labor Hours',
        value: 12,
        min: 6,
        max: 24,
        step: 0.5,
        unit: 'hours/unit',
        description: 'Labor hours required per unit'
      },
      {
        id: 'p4',
        name: 'Selling Price',
        value: 2500,
        min: 1500,
        max: 4000,
        step: 50,
        unit: '$/unit',
        description: 'Average selling price per unit'
      },
      {
        id: 'p5',
        name: 'Monthly Production',
        value: 500,
        min: 100,
        max: 1000,
        step: 25,
        unit: 'units',
        description: 'Number of units produced per month'
      }
    ];
  };

  // Get default presets (fallback)
  const getDefaultPresets = (defaultParams: Parameter[]): Preset[] => {
    return [
      {
        id: 'preset1',
        name: 'High Efficiency',
        parameters: [
          {...defaultParams[0], value: 95},
          {...defaultParams[1], value: 500},
          {...defaultParams[2], value: 10},
          {...defaultParams[3], value: 2600},
          {...defaultParams[4], value: 550}
        ]
      },
      {
        id: 'preset2',
        name: 'Cost Reduction',
        parameters: [
          {...defaultParams[0], value: 90},
          {...defaultParams[1], value: 380},
          {...defaultParams[2], value: 9},
          {...defaultParams[3], value: 2400},
          {...defaultParams[4], value: 525}
        ]
      },
      {
        id: 'preset3',
        name: 'Premium Product',
        parameters: [
          {...defaultParams[0], value: 88},
          {...defaultParams[1], value: 600},
          {...defaultParams[2], value: 15},
          {...defaultParams[3], value: 3200},
          {...defaultParams[4], value: 400}
        ]
      }
    ];
  };

  // Calculate metrics based on parameters
  useEffect(() => {
    if (parameters.length === 0) return;

    // Find parameters by name
    const efficiency = parameters.find(p => p.name === 'Production Efficiency')?.value || 85;
    const materialCost = parameters.find(p => p.name === 'Raw Material Cost')?.value || 450;
    const laborHours = parameters.find(p => p.name === 'Labor Hours')?.value || 12;
    const sellingPrice = parameters.find(p => p.name === 'Selling Price')?.value || 2500;
    const monthlyProduction = parameters.find(p => p.name === 'Monthly Production')?.value || 500;

    // Calculate derived metrics
    const laborCost = laborHours * 35; // Assuming $35/hour labor rate
    const overheadCost = 250; // Fixed overhead per unit
    const totalCostPerUnit = materialCost + laborCost + overheadCost;
    const grossMargin = sellingPrice - totalCostPerUnit;
    const grossMarginPercent = grossMargin / sellingPrice;
    const monthlyRevenue = sellingPrice * monthlyProduction;
    const monthlyCost = totalCostPerUnit * monthlyProduction;
    const monthlyProfit = monthlyRevenue - monthlyCost;
    const roi = monthlyProfit / monthlyCost;

    // Efficiency impact
    const efficiencyFactor = efficiency / 100;
    const adjustedProduction = monthlyProduction * efficiencyFactor;
    const adjustedRevenue = sellingPrice * adjustedProduction;
    const adjustedProfit = adjustedRevenue - (totalCostPerUnit * adjustedProduction);

    // Update metrics
    const calculatedMetrics: Metric[] = [
      {
        id: 'm1',
        name: 'Unit Cost',
        value: totalCostPerUnit,
        unit: 'currency',
        description: 'Total cost to produce one unit'
      },
      {
        id: 'm2',
        name: 'Gross Margin',
        value: grossMargin,
        unit: 'currency',
        description: 'Profit per unit before operating expenses'
      },
      {
        id: 'm3',
        name: 'Gross Margin %',
        value: grossMarginPercent,
        unit: 'percentage',
        description: 'Gross margin as a percentage of selling price'
      },
      {
        id: 'm4',
        name: 'Monthly Revenue',
        value: adjustedRevenue,
        unit: 'currency',
        description: 'Total monthly revenue adjusted for efficiency'
      },
      {
        id: 'm5',
        name: 'Monthly Profit',
        value: adjustedProfit,
        unit: 'currency',
        description: 'Total monthly profit adjusted for efficiency'
      },
      {
        id: 'm6',
        name: 'ROI',
        value: roi,
        unit: 'percentage',
        description: 'Return on investment (monthly profit / monthly cost)'
      },
      {
        id: 'm7',
        name: 'Effective Production',
        value: adjustedProduction,
        unit: 'number',
        description: 'Actual production after efficiency adjustment'
      }
    ];

    setMetrics(calculatedMetrics);

    // Update chart data
    updateChartData();
  }, [parameters]);

  // Update chart data
  const updateChartData = () => {
    if (metrics.length === 0) return;

    // Create data for sensitivity analysis
    // We'll show how Monthly Profit changes with different parameter values
    const efficiencyValues = [70, 75, 80, 85, 90, 95, 100];
    const currentEfficiency = parameters.find(p => p.name === 'Production Efficiency')?.value || 85;

    // Calculate profits at different efficiency levels
    const profitsByEfficiency = efficiencyValues.map(efficiency => {
      const efficiencyFactor = efficiency / 100;
      const monthlyProduction = parameters.find(p => p.name === 'Monthly Production')?.value || 500;
      const sellingPrice = parameters.find(p => p.name === 'Selling Price')?.value || 2500;
      const materialCost = parameters.find(p => p.name === 'Raw Material Cost')?.value || 450;
      const laborHours = parameters.find(p => p.name === 'Labor Hours')?.value || 12;

      const laborCost = laborHours * 35;
      const overheadCost = 250;
      const totalCostPerUnit = materialCost + laborCost + overheadCost;

      const adjustedProduction = monthlyProduction * efficiencyFactor;
      const adjustedRevenue = sellingPrice * adjustedProduction;
      const adjustedProfit = adjustedRevenue - (totalCostPerUnit * adjustedProduction);

      return adjustedProfit;
    });

    // Calculate profits at different selling prices
    const priceValues = [2000, 2200, 2400, 2600, 2800, 3000, 3200];
    const currentPrice = parameters.find(p => p.name === 'Selling Price')?.value || 2500;

    const profitsByPrice = priceValues.map(price => {
      const efficiency = parameters.find(p => p.name === 'Production Efficiency')?.value || 85;
      const efficiencyFactor = efficiency / 100;
      const monthlyProduction = parameters.find(p => p.name === 'Monthly Production')?.value || 500;
      const materialCost = parameters.find(p => p.name === 'Raw Material Cost')?.value || 450;
      const laborHours = parameters.find(p => p.name === 'Labor Hours')?.value || 12;

      const laborCost = laborHours * 35;
      const overheadCost = 250;
      const totalCostPerUnit = materialCost + laborCost + overheadCost;

      const adjustedProduction = monthlyProduction * efficiencyFactor;
      const adjustedRevenue = price * adjustedProduction;
      const adjustedProfit = adjustedRevenue - (totalCostPerUnit * adjustedProduction);

      return adjustedProfit;
    });

    setChartData({
      labels: chartType === 'line' ? efficiencyValues.map(v => v + '%') : ['Efficiency Impact', 'Price Impact'],
      datasets: chartType === 'line' ? [
        {
          label: 'Monthly Profit by Efficiency',
          data: profitsByEfficiency,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2
        },
        {
          label: 'Monthly Profit by Price',
          data: profitsByPrice,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          xAxisID: 'x2'
        }
      ] : [
        {
          label: 'Sensitivity Analysis',
          data: [
            profitsByEfficiency[efficiencyValues.indexOf(Math.round(currentEfficiency))],
            profitsByPrice[priceValues.indexOf(currentPrice) !== -1 ? priceValues.indexOf(currentPrice) : 3]
          ],
          backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
          borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
          borderWidth: 1
        }
      ]
    });
  };

  // Handle parameter change
  const handleParameterChange = (id: string, value: number) => {
    setParameters(prev =>
      prev.map(param =>
        param.id === id ? { ...param, value } : param
      )
    );
  };

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

  // Load a preset
  const loadPreset = (presetIndex: number) => {
    if (presetIndex >= 0 && presetIndex < presets.length) {
      setParameters(presets[presetIndex].parameters);
    }
  };

  // Save current parameters as a preset
  const savePreset = async () => {
    if (presetName.trim() === '') return;

    const newPreset: Preset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      parameters: [...parameters]
    };

    try {
      const supabase = createClient();
      
      // Save to Supabase
      const { error } = await supabase
        .from('presets')
        .insert([newPreset]);
      
      if (error) throw error;
      
      // Update local state
      setPresets(prev => [...prev, newPreset]);
      setPresetName('');
      setError(null);
    } catch (err: any) {
      console.error('Error saving preset:', err);
      setError(`Failed to save preset: ${err.message || 'Unknown error'}`);
      
      // Still update local state for demo purposes
      setPresets(prev => [...prev, newPreset]);
      setPresetName('');
    }
  };

  return (
    <>
      <Header title="Dynamic Metrics" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <p className="mt-2 text-sm">Using fallback data for demonstration purposes.</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
                <Sliders className="inline-block mr-2 h-5 w-5" />
                Parameter Adjustment
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10"
                    onChange={(e) => loadPreset(parseInt(e.target.value))}
                    defaultValue=""
                  >
                    <option value="" disabled>Load Preset</option>
                    {presets.map((preset, index) => (
                      <option key={preset.id} value={index}>{preset.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex">
                  <input
                    type="text"
                    placeholder="New preset name"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                  />
                  <button
                    onClick={savePreset}
                    disabled={presetName.trim() === ''}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">Loading parameters...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parameters.map((param) => (
                  <div key={param.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor={param.id} className="block text-sm font-medium text-gray-700">
                        {param.name}
                      </label>
                      <span className="text-sm font-medium text-gray-900">
                        {param.value}{param.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      id={param.id}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={param.value}
                      onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{param.min}{param.unit}</span>
                      <span>{param.max}{param.unit}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{param.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Sensitivity Analysis</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setChartType('line'); updateChartData(); }}
                    className={`p-2 rounded-md ${chartType === 'line' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Line Chart"
                  >
                    <LineChart className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => { setChartType('bar'); updateChartData(); }}
                    className={`p-2 rounded-md ${chartType === 'bar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Bar Chart"
                  >
                    <BarChart2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {chartData ? (
                chartType === 'line' ? (
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      interaction: {
                        mode: 'index' as const,
                        intersect: false
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Efficiency (%)'
                          }
                        },
                        x2: {
                          title: {
                            display: true,
                            text: 'Price ($)'
                          },
                          labels: [2000, 2200, 2400, 2600, 2800, 3000, 3200].map(v => '$' + v),
                          display: false
                        },
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Monthly Profit ($)'
                          },
                          ticks: {
                            callback: function(value: any) {
                              if (Math.abs(value) >= 1000000) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                              } else if (Math.abs(value) >= 1000) {
                                return '$' + (value / 1000).toFixed(1) + 'K';
                              }
                              return '$' + value;
                            }
                          }
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              let label = context.dataset.label || '';
                              let value = context.parsed.y;

                              if (label) {
                                label += ': ';
                              }

                              if (value !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                }).format(value);
                              }
                              return label;
                            }
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
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
                                label += new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                }).format(value);
                              }
                              return label;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Monthly Profit ($)'
                          },
                          ticks: {
                            callback: function(value: any) {
                              if (Math.abs(value) >= 1000000) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                              } else if (Math.abs(value) >= 1000) {
                                return '$' + (value / 1000).toFixed(1) + 'K';
                              }
                              return '$' + value;
                            }
                          }
                        }
                      }
                    }}
                  />
                )
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Calculated Metrics</h2>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-500">Loading metrics...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.map((metric) => {
                    // Determine color based on metric type
                    const valueColor =
                      metric.unit === 'percentage' ? 'text-purple-600' :
                      metric.unit === 'currency' ? 'text-green-600' :
                      'text-blue-600';

                    return (
                      <div key={metric.id} className="border-b border-gray-200 pb-3 last:border-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                          <span className={`text-sm font-bold ${valueColor}`}>
                            {formatValue(metric.value, metric.unit)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-medium text-blue-800 mb-2">About Dynamic Metrics</h2>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                This page allows you to adjust key business parameters and see how they affect various metrics in real-time.
                Use the sliders to change parameter values and observe the impact on calculated metrics and charts.
              </p>
              <p>
                The sensitivity analysis shows how monthly profit changes with different efficiency levels and selling prices.
                You can save your parameter configurations as presets for future reference.
              </p>
              <p>
                Parameters and presets are stored in our Supabase database, allowing you to access your saved configurations
                from any device and share them with your team.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
