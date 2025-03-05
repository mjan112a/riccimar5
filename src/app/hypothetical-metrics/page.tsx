"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
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
import { Bar } from 'react-chartjs-2';
import { PlusCircle, Trash2, Save, Copy, RefreshCw, ArrowUpDown } from 'lucide-react';

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

// Define the scenario type
interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: {
    productMix: {
      kx: number;
      dx: number;
      ex: number;
    };
    pricing: {
      kx: number;
      dx: number;
      ex: number;
    };
    costs: {
      materials: number;
      labor: number;
      overhead: number;
    };
    production: {
      volume: number;
      efficiency: number;
    };
    market: {
      growth: number;
      competition: number;
    };
  };
  results: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    grossMargin: number;
    operatingExpenses: number;
    operatingProfit: number;
    operatingMargin: number;
  };
}

// Default scenario template
const defaultScenario: Scenario = {
  id: '',
  name: '',
  description: '',
  parameters: {
    productMix: {
      kx: 40,
      dx: 35,
      ex: 25
    },
    pricing: {
      kx: 1200,
      dx: 1800,
      ex: 950
    },
    costs: {
      materials: 450,
      labor: 350,
      overhead: 250
    },
    production: {
      volume: 500,
      efficiency: 85
    },
    market: {
      growth: 5,
      competition: 3
    }
  },
  results: {
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    grossMargin: 0,
    operatingExpenses: 0,
    operatingProfit: 0,
    operatingMargin: 0
  }
};

// Calculate results for a scenario
const calculateResults = (scenario: Scenario): Scenario => {
  const { parameters } = scenario;
  const { productMix, pricing, costs, production, market } = parameters;
  
  // Ensure product mix percentages sum to 100
  const totalMix = productMix.kx + productMix.dx + productMix.ex;
  const normalizedMix = {
    kx: productMix.kx / totalMix * 100,
    dx: productMix.dx / totalMix * 100,
    ex: productMix.ex / totalMix * 100
  };
  
  // Calculate units for each product line
  const efficiencyFactor = production.efficiency / 100;
  const effectiveVolume = production.volume * efficiencyFactor;
  
  const units = {
    kx: effectiveVolume * (normalizedMix.kx / 100),
    dx: effectiveVolume * (normalizedMix.dx / 100),
    ex: effectiveVolume * (normalizedMix.ex / 100)
  };
  
  // Calculate revenue
  const revenue = {
    kx: units.kx * pricing.kx,
    dx: units.dx * pricing.dx,
    ex: units.ex * pricing.ex
  };
  
  const totalRevenue = revenue.kx + revenue.dx + revenue.ex;
  
  // Calculate COGS
  const totalUnits = units.kx + units.dx + units.ex;
  const totalCosts = {
    materials: costs.materials * totalUnits,
    labor: costs.labor * totalUnits,
    overhead: costs.overhead * totalUnits
  };
  
  const totalCOGS = totalCosts.materials + totalCosts.labor + totalCosts.overhead;
  
  // Calculate gross profit and margin
  const grossProfit = totalRevenue - totalCOGS;
  const grossMargin = grossProfit / totalRevenue;
  
  // Calculate operating expenses (simplified model)
  // Assume operating expenses are 20% of revenue plus a fixed amount
  const operatingExpenses = totalRevenue * 0.2 + 100000;
  
  // Calculate operating profit and margin
  const operatingProfit = grossProfit - operatingExpenses;
  const operatingMargin = operatingProfit / totalRevenue;
  
  // Apply market factors (simplified)
  // Market growth increases revenue, competition decreases margins
  const marketAdjustedRevenue = totalRevenue * (1 + market.growth / 100);
  const marketAdjustedOperatingProfit = operatingProfit * (1 - market.competition / 100);
  const marketAdjustedOperatingMargin = marketAdjustedOperatingProfit / marketAdjustedRevenue;
  
  return {
    ...scenario,
    results: {
      revenue: marketAdjustedRevenue,
      cogs: totalCOGS,
      grossProfit: marketAdjustedRevenue - totalCOGS,
      grossMargin: (marketAdjustedRevenue - totalCOGS) / marketAdjustedRevenue,
      operatingExpenses: operatingExpenses,
      operatingProfit: marketAdjustedOperatingProfit,
      operatingMargin: marketAdjustedOperatingMargin
    }
  };
};

export default function HypotheticalMetrics() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  
  // Initialize with sample scenarios
  useEffect(() => {
    // In a real implementation, these would be fetched from an API
    const sampleScenarios: Scenario[] = [
      calculateResults({
        ...defaultScenario,
        id: '1',
        name: 'Current State',
        description: 'Baseline scenario using current business parameters'
      }),
      calculateResults({
        ...defaultScenario,
        id: '2',
        name: 'Growth Strategy',
        description: 'Increased production volume with higher market growth',
        parameters: {
          ...defaultScenario.parameters,
          production: {
            volume: 650,
            efficiency: 82
          },
          market: {
            growth: 8,
            competition: 4
          }
        }
      }),
      calculateResults({
        ...defaultScenario,
        id: '3',
        name: 'Premium Pricing',
        description: 'Higher prices with focus on DX product line',
        parameters: {
          ...defaultScenario.parameters,
          productMix: {
            kx: 30,
            dx: 50,
            ex: 20
          },
          pricing: {
            kx: 1300,
            dx: 2000,
            ex: 1050
          }
        }
      }),
      calculateResults({
        ...defaultScenario,
        id: '4',
        name: 'Cost Reduction',
        description: 'Lower material and labor costs with improved efficiency',
        parameters: {
          ...defaultScenario.parameters,
          costs: {
            materials: 400,
            labor: 320,
            overhead: 230
          },
          production: {
            volume: 520,
            efficiency: 90
          }
        }
      })
    ];
    
    setScenarios(sampleScenarios);
    setSelectedScenarios(['1', '2']); // Select first two scenarios by default
    setLoading(false);
  }, []);
  
  // Update chart when scenarios or selection changes
  useEffect(() => {
    updateChart();
  }, [scenarios, selectedScenarios]);
  
  // Create a new scenario
  const createScenario = () => {
    const newId = (Math.max(0, ...scenarios.map(s => parseInt(s.id))) + 1).toString();
    const newScenario = calculateResults({
      ...defaultScenario,
      id: newId,
      name: `New Scenario ${newId}`,
      description: 'Description of the new scenario'
    });
    
    setScenarios([...scenarios, newScenario]);
    setActiveScenario(newScenario);
    setIsEditing(true);
  };
  
  // Duplicate a scenario
  const duplicateScenario = (id: string) => {
    const scenarioToDuplicate = scenarios.find(s => s.id === id);
    if (!scenarioToDuplicate) return;
    
    const newId = (Math.max(0, ...scenarios.map(s => parseInt(s.id))) + 1).toString();
    const newScenario = calculateResults({
      ...scenarioToDuplicate,
      id: newId,
      name: `${scenarioToDuplicate.name} (Copy)`,
    });
    
    setScenarios([...scenarios, newScenario]);
    setActiveScenario(newScenario);
    setIsEditing(true);
  };
  
  // Delete a scenario
  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
    setSelectedScenarios(selectedScenarios.filter(s => s !== id));
    
    if (activeScenario && activeScenario.id === id) {
      setActiveScenario(null);
      setIsEditing(false);
    }
  };
  
  // Edit a scenario
  const editScenario = (id: string) => {
    const scenarioToEdit = scenarios.find(s => s.id === id);
    if (scenarioToEdit) {
      setActiveScenario(scenarioToEdit);
      setIsEditing(true);
    }
  };
  
  // Save scenario changes
  const saveScenario = () => {
    if (!activeScenario) return;
    
    const updatedScenario = calculateResults(activeScenario);
    
    setScenarios(scenarios.map(s => 
      s.id === updatedScenario.id ? updatedScenario : s
    ));
    
    setActiveScenario(null);
    setIsEditing(false);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setActiveScenario(null);
    setIsEditing(false);
  };
  
  // Update active scenario field
  const updateScenarioField = (field: string, value: string | number) => {
    if (!activeScenario) return;
    
    if (field === 'name' || field === 'description') {
      setActiveScenario({
        ...activeScenario,
        [field]: value
      });
    }
  };
  
  // Update parameter value
  const updateParameter = (category: string, param: string, value: number) => {
    if (!activeScenario) return;
    
    setActiveScenario({
      ...activeScenario,
      parameters: {
        ...activeScenario.parameters,
        [category]: {
          ...activeScenario.parameters[category as keyof typeof activeScenario.parameters],
          [param]: value
        }
      }
    });
  };
  
  // Toggle scenario selection for comparison
  const toggleScenarioSelection = (id: string) => {
    if (selectedScenarios.includes(id)) {
      setSelectedScenarios(selectedScenarios.filter(s => s !== id));
    } else {
      // Limit to 4 scenarios for comparison
      if (selectedScenarios.length < 4) {
        setSelectedScenarios([...selectedScenarios, id]);
      }
    }
  };
  
  // Update chart data
  const updateChart = () => {
    if (scenarios.length === 0 || selectedScenarios.length === 0) {
      setChartData(null);
      return;
    }
    
    const selectedScenarioObjects = scenarios.filter(s => selectedScenarios.includes(s.id));
    
    // Prepare data for the chart
    const labels = ['Revenue', 'COGS', 'Gross Profit', 'Operating Expenses', 'Operating Profit'];
    
    const datasets = selectedScenarioObjects.map((scenario, index) => {
      // Generate a color based on index
      const colors = [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)'
      ];
      
      const borderColors = [
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)'
      ];
      
      return {
        label: scenario.name,
        data: [
          scenario.results.revenue,
          scenario.results.cogs,
          scenario.results.grossProfit,
          scenario.results.operatingExpenses,
          scenario.results.operatingProfit
        ],
        backgroundColor: colors[index % colors.length],
        borderColor: borderColors[index % borderColors.length],
        borderWidth: 1
      };
    });
    
    setChartData({
      labels,
      datasets
    });
  };

  return (
    <>
      <Header title="Hypothetical Scenarios" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Scenario Management */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Business Scenarios</h2>
              
              <button
                onClick={createScenario}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isEditing}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Scenario
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">Loading scenarios...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                        Compare
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scenario
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gross Margin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operating Margin
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scenarios.map((scenario) => (
                      <tr key={scenario.id} className={`hover:bg-gray-50 ${isEditing && activeScenario?.id === scenario.id ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedScenarios.includes(scenario.id)}
                            onChange={() => toggleScenarioSelection(scenario.id)}
                            disabled={!selectedScenarios.includes(scenario.id) && selectedScenarios.length >= 4}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">{scenario.name}</div>
                            <div className="text-xs text-gray-500">{scenario.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(scenario.results.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPercentage(scenario.results.grossMargin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPercentage(scenario.results.operatingMargin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => editScenario(scenario.id)}
                              className="text-blue-600 hover:text-blue-900"
                              disabled={isEditing}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => duplicateScenario(scenario.id)}
                              className="text-green-600 hover:text-green-900"
                              disabled={isEditing}
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteScenario(scenario.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={isEditing || scenarios.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Scenario Editor */}
          {isEditing && activeScenario && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Edit Scenario</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={cancelEditing}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveScenario}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="mr-1 h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="scenario-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario Name
                  </label>
                  <input
                    type="text"
                    id="scenario-name"
                    value={activeScenario.name}
                    onChange={(e) => updateScenarioField('name', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="scenario-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="scenario-description"
                    value={activeScenario.description}
                    onChange={(e) => updateScenarioField('description', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product Mix */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Product Mix (%)</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="kx-mix" className="block text-xs font-medium text-gray-500">
                          KX Series
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          {activeScenario.parameters.productMix.kx}%
                        </span>
                      </div>
                      <input
                        type="range"
                        id="kx-mix"
                        min="0"
                        max="100"
                        step="5"
                        value={activeScenario.parameters.productMix.kx}
                        onChange={(e) => updateParameter('productMix', 'kx', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="dx-mix" className="block text-xs font-medium text-gray-500">
                          DX Series
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          {activeScenario.parameters.productMix.dx}%
                        </span>
                      </div>
                      <input
                        type="range"
                        id="dx-mix"
                        min="0"
                        max="100"
                        step="5"
                        value={activeScenario.parameters.productMix.dx}
                        onChange={(e) => updateParameter('productMix', 'dx', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="ex-mix" className="block text-xs font-medium text-gray-500">
                          EX Series
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          {activeScenario.parameters.productMix.ex}%
                        </span>
                      </div>
                      <input
                        type="range"
                        id="ex-mix"
                        min="0"
                        max="100"
                        step="5"
                        value={activeScenario.parameters.productMix.ex}
                        onChange={(e) => updateParameter('productMix', 'ex', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Pricing ($/unit)</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="kx-price" className="block text-xs font-medium text-gray-500">
                          KX Series
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          ${activeScenario.parameters.pricing.kx}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="kx-price"
                        min="800"
                        max="2000"
                        step="50"
                        value={activeScenario.parameters.pricing.kx}
                        onChange={(e) => updateParameter('pricing', 'kx', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="dx-price" className="block text-xs font-medium text-gray-500">
                          DX Series
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          ${activeScenario.parameters.pricing.dx}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="dx-price"
                        min="1200"
                        max="2500"
                        step="50"
                        value={activeScenario.parameters.pricing.dx}
                        onChange={(e) => updateParameter('pricing', 'dx', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="ex-price" className="block text-xs font-medium text-gray-500">
                          EX Series
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          ${activeScenario.parameters.pricing.ex}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="ex-price"
                        min="600"
                        max="1500"
                        step="50"
                        value={activeScenario.parameters.pricing.ex}
                        onChange={(e) => updateParameter('pricing', 'ex', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Costs */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Costs ($/unit)</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="materials-cost" className="block text-xs font-medium text-gray-500">
                          Materials
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          ${activeScenario.parameters.costs.materials}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="materials-cost"
                        min="300"
                        max="600"
                        step="10"
                        value={activeScenario.parameters.costs.materials}
                        onChange={(e) => updateParameter('costs', 'materials', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="labor-cost" className="block text-xs font-medium text-gray-500">
                          Labor
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          ${activeScenario.parameters.costs.labor}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="labor-cost"
                        min="250"
                        max="500"
                        step="10"
                        value={activeScenario.parameters.costs.labor}
                        onChange={(e) => updateParameter('costs', 'labor', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="overhead-cost" className="block text-xs font-medium text-gray-500">
                          Overhead
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          ${activeScenario.parameters.costs.overhead}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="overhead-cost"
                        min="150"
                        max="400"
                        step="10"
                        value={activeScenario.parameters.costs.overhead}
                        onChange={(e) => updateParameter('costs', 'overhead', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Production */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Production</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="volume" className="block text-xs font-medium text-gray-500">
                          Monthly Volume (units)
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          {activeScenario.parameters.production.volume}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="volume"
                        min="100"
                        max="1000"
                        step="25"
                        value={activeScenario.parameters.production.volume}
                        onChange={(e) => updateParameter('production', 'volume', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="efficiency" className="block text-xs font-medium text-gray-500">
                          Efficiency (%)
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          {activeScenario.parameters.production.efficiency}%
                        </span>
                      </div>
                      <input
                        type="range"
                        id="efficiency"
                        min="50"
                        max="100"
                        step="1"
                        value={activeScenario.parameters.production.efficiency}
                        onChange={(e) => updateParameter('production', 'efficiency', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Market */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Market Conditions</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="growth" className="block text-xs font-medium text-gray-500">
                          Market Growth (%)
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          {activeScenario.parameters.market.growth}%
                        </span>
                      </div>
                      <input
                        type="range"
                        id="growth"
                        min="-5"
                        max="15"
                        step="1"
                        value={activeScenario.parameters.market.growth}
                        onChange={(e) => updateParameter('market', 'growth', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="competition" className="block text-xs font-medium text-gray-500">
                          Competition Intensity (%)
                        </label>
                        <span className="text-xs font-medium text-gray-700">
                          {activeScenario.parameters.market.competition}%
                        </span>
                      </div>
                      <input
                        type="range"
                        id="competition"
                        min="0"
                        max="10"
                        step="1"
                        value={activeScenario.parameters.market.competition}
                        onChange={(e) => updateParameter('market', 'competition', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Projected Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(calculateResults(activeScenario).results.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gross Margin</p>
                    <p className="text-sm font-medium text-gray-900">{formatPercentage(calculateResults(activeScenario).results.grossMargin)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Operating Profit</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(calculateResults(activeScenario).results.operatingProfit)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Operating Margin</p>
                    <p className="text-sm font-medium text-gray-900">{formatPercentage(calculateResults(activeScenario).results.operatingMargin)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Comparison Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Scenario Comparison</h2>
            
            {selectedScenarios.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
                <p className="text-lg font-medium">No scenarios selected</p>
                <p className="text-sm mt-2">Select at least one scenario to view comparison</p>
              </div>
            ) : chartData ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
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
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-medium text-blue-800 mb-2">About Hypothetical Scenarios</h2>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                This page allows you to create and compare different business scenarios by adjusting various parameters.
                Use the scenario editor to modify parameters and see how they affect key financial metrics.
              </p>
              <p>
                You can select up to 4 scenarios to compare side by side in the chart. This helps visualize the potential
                impact of different business strategies and market conditions.
              </p>
              <p>
                In a production environment, this tool would use more sophisticated financial models and real business data
                to provide accurate forecasts and what-if analyses.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
