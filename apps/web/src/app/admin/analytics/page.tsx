"use client";

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Building2, Package, Activity, Download, Globe, Leaf } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalFarms: number;
    totalExporters: number;
    totalTraceabilityEvents: number;
    growthMetrics: {
      usersGrowth: number;
      farmsGrowth: number;
      exportersGrowth: number;
      eventsGrowth: number;
    };
  };
  timeSeriesData: {
    date: string;
    users: number;
    farms: number;
    exports: number;
    events: number;
  }[];
  geographicData: {
    region: string;
    farms: number;
    exports: number;
    revenue: number;
  }[];
  complianceMetrics: {
    compliantFarms: number;
    totalFarms: number;
    complianceRate: number;
    certifiedExporters: number;
    totalExporters: number;
    certificationRate: number;
  };
  sustainabilityMetrics: {
    averageSustainabilityScore: number;
    organicFarms: number;
    fairTradeFarms: number;
    totalCarbonFootprint: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Sample analytics data
        const sampleAnalytics: AnalyticsData = {
          overview: {
            totalUsers: 1284,
            totalFarms: 156,
            totalExporters: 23,
            totalTraceabilityEvents: 4567,
            growthMetrics: {
              usersGrowth: 12.5,
              farmsGrowth: 8.3,
              exportersGrowth: 15.7,
              eventsGrowth: 23.4
            }
          },
          timeSeriesData: [
            { date: '2025-09-23', users: 1200, farms: 140, exports: 89, events: 3200 },
            { date: '2025-09-30', users: 1220, farms: 142, exports: 92, events: 3350 },
            { date: '2025-10-07', users: 1245, farms: 145, exports: 95, events: 3580 },
            { date: '2025-10-14', users: 1260, farms: 148, exports: 98, events: 3850 },
            { date: '2025-10-21', users: 1275, farms: 152, exports: 101, events: 4200 },
            { date: '2025-10-23', users: 1284, farms: 156, exports: 103, events: 4567 }
          ],
          geographicData: [
            { region: 'North Valley', farms: 45, exports: 234, revenue: 1250000 },
            { region: 'Highland District', farms: 38, exports: 198, revenue: 980000 },
            { region: 'Coastal Region', farms: 42, exports: 267, revenue: 1420000 },
            { region: 'Mountain Area', farms: 31, exports: 156, revenue: 890000 }
          ],
          complianceMetrics: {
            compliantFarms: 142,
            totalFarms: 156,
            complianceRate: 91.0,
            certifiedExporters: 18,
            totalExporters: 23,
            certificationRate: 78.3
          },
          sustainabilityMetrics: {
            averageSustainabilityScore: 78.5,
            organicFarms: 89,
            fairTradeFarms: 67,
            totalCarbonFootprint: 2340
          }
        };

        setTimeout(() => {
          setAnalytics(sampleAnalytics);
          setLoading(false);
        }, 800);

      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedTimeRange]);

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="ml-4 text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalUsers.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(analytics.overview.growthMetrics.usersGrowth)}
                <span className={`text-sm ${getGrowthColor(analytics.overview.growthMetrics.usersGrowth)}`}>
                  {analytics.overview.growthMetrics.usersGrowth > 0 ? '+' : ''}{analytics.overview.growthMetrics.usersGrowth}%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Farms</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalFarms}</p>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(analytics.overview.growthMetrics.farmsGrowth)}
                <span className={`text-sm ${getGrowthColor(analytics.overview.growthMetrics.farmsGrowth)}`}>
                  {analytics.overview.growthMetrics.farmsGrowth > 0 ? '+' : ''}{analytics.overview.growthMetrics.farmsGrowth}%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Exporters</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalExporters}</p>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(analytics.overview.growthMetrics.exportersGrowth)}
                <span className={`text-sm ${getGrowthColor(analytics.overview.growthMetrics.exportersGrowth)}`}>
                  {analytics.overview.growthMetrics.exportersGrowth > 0 ? '+' : ''}{analytics.overview.growthMetrics.exportersGrowth}%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Traceability Events</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalTraceabilityEvents.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(analytics.overview.growthMetrics.eventsGrowth)}
                <span className={`text-sm ${getGrowthColor(analytics.overview.growthMetrics.eventsGrowth)}`}>
                  {analytics.overview.growthMetrics.eventsGrowth > 0 ? '+' : ''}{analytics.overview.growthMetrics.eventsGrowth}%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-orange-500">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Time Series Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Growth Trends</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded text-sm bg-green-100 text-green-800">
              Overview
            </button>
          </div>
        </div>
        
        {/* Simple chart representation */}
        <div className="h-64 flex items-end justify-between space-x-2">
          {analytics.timeSeriesData.map((data, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="flex space-x-1">
                <div 
                  className="w-3 bg-blue-500 rounded-t" 
                  style={{ height: `${(data.users / 1300) * 200}px` }}
                ></div>
                <div 
                  className="w-3 bg-green-500 rounded-t" 
                  style={{ height: `${(data.farms / 160) * 200}px` }}
                ></div>
                <div 
                  className="w-3 bg-purple-500 rounded-t" 
                  style={{ height: `${(data.exports / 110) * 200}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Farms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-600">Exports</span>
          </div>
        </div>
      </div>

      {/* Geographic Data and Compliance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </h3>
          <div className="space-y-3">
            {analytics.geographicData.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{region.region}</p>
                  <p className="text-sm text-gray-500">{region.farms} farms • {region.exports} exports</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${region.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Overview</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Farm Compliance</span>
                <span className="text-sm font-bold text-gray-900">{analytics.complianceMetrics.complianceRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${analytics.complianceMetrics.complianceRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.complianceMetrics.compliantFarms} of {analytics.complianceMetrics.totalFarms} farms compliant
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Exporter Certification</span>
                <span className="text-sm font-bold text-gray-900">{analytics.complianceMetrics.certificationRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${analytics.complianceMetrics.certificationRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.complianceMetrics.certifiedExporters} of {analytics.complianceMetrics.totalExporters} exporters certified
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-500" />
          Sustainability Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{analytics.sustainabilityMetrics.averageSustainabilityScore}</div>
            <div className="text-sm text-gray-600">Avg Sustainability Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{analytics.sustainabilityMetrics.organicFarms}</div>
            <div className="text-sm text-gray-600">Organic Certified Farms</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{analytics.sustainabilityMetrics.fairTradeFarms}</div>
            <div className="text-sm text-gray-600">Fair Trade Farms</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{analytics.sustainabilityMetrics.totalCarbonFootprint}t</div>
            <div className="text-sm text-gray-600">CO2 Offset This Year</div>
          </div>
        </div>
      </div>

      {/* Export and Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Data Export & Reports</h3>
            <p className="text-sm text-gray-500">Download comprehensive reports and analytics data</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Download className="h-4 w-4" />
              CSV Export
            </button>
            <button className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Download className="h-4 w-4" />
              PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
