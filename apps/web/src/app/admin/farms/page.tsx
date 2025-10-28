"use client";

import React, { useState, useEffect } from 'react';
import { Building2, Search, Filter, Plus, Edit, Eye, MapPin, CheckCircle2, AlertTriangle, Clock, Shield, Sprout } from 'lucide-react';

interface Farm {
  id: string;
  name: string;
  farmId: string;
  owner: {
    name: string;
    email: string;
    phone?: string;
  };
  location: {
    address: string;
    region: string;
    coordinates?: { lat: number; lng: number; };
  };
  verification: {
    status: 'verified' | 'pending' | 'rejected';
    certifications: string[];
    lastInspection?: string;
  };
  crops: string[];
  area: number;
  registrationDate: string;
  lastActivity?: string;
  totalHarvests: number;
  sustainability: {
    score: number;
    certifications: string[];
  };
}

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        
        // Sample farm data
        const sampleFarms: Farm[] = [
          {
            id: '1',
            name: 'Green Valley Farm',
            farmId: 'GVF-001',
            owner: { name: 'John Farmer', email: 'john@greenvalley.farm', phone: '+1234567890' },
            location: { address: '123 Valley Road, Green County', region: 'North Valley', coordinates: { lat: 40.7128, lng: -74.0060 } },
            verification: { status: 'verified', certifications: ['Organic', 'Fair Trade'], lastInspection: '2024-08-15T00:00:00Z' },
            crops: ['Coffee', 'Cacao', 'Bananas'],
            area: 25.5,
            registrationDate: '2024-01-15T00:00:00Z',
            lastActivity: '2025-10-22T14:30:00Z',
            totalHarvests: 12,
            sustainability: { score: 85, certifications: ['Rainforest Alliance', 'UTZ'] }
          },
          {
            id: '2',
            name: 'Sunrise Coffee Estate',
            farmId: 'SCE-002',
            owner: { name: 'Maria Santos', email: 'maria@sunrise.coffee', phone: '+1234567891' },
            location: { address: '456 Mountain View, Highlands', region: 'Highland District' },
            verification: { status: 'pending', certifications: ['Organic (Pending)'], lastInspection: '2024-10-01T00:00:00Z' },
            crops: ['Coffee', 'Avocado'],
            area: 18.2,
            registrationDate: '2024-09-20T00:00:00Z',
            lastActivity: '2025-10-21T09:15:00Z',
            totalHarvests: 3,
            sustainability: { score: 72, certifications: ['Organic (Pending)'] }
          },
          {
            id: '3',
            name: 'Tropical Fruits Cooperative',
            farmId: 'TFC-003',
            owner: { name: 'Carlos Rodriguez', email: 'carlos@tropical.coop' },
            location: { address: '789 Coastal Highway', region: 'Coastal Region' },
            verification: { status: 'rejected', certifications: [], lastInspection: '2024-07-10T00:00:00Z' },
            crops: ['Mango', 'Papaya', 'Coconut'],
            area: 42.0,
            registrationDate: '2024-06-01T00:00:00Z',
            lastActivity: '2025-10-18T16:45:00Z',
            totalHarvests: 8,
            sustainability: { score: 45, certifications: [] }
          }
        ];

        setTimeout(() => {
          setFarms(sampleFarms);
          setLoading(false);
        }, 800);

      } catch (error) {
        console.error('Failed to fetch farms:', error);
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.farmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.owner.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || farm.verification.status === selectedStatus;
    const matchesRegion = selectedRegion === 'all' || farm.location.region === selectedRegion;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const regions = [...new Set(farms.map(farm => farm.location.region))];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Farms</p>
              <p className="text-2xl font-bold text-gray-900">{farms.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {farms.filter(f => f.verification.status === 'verified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {farms.filter(f => f.verification.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Area</p>
              <p className="text-2xl font-bold text-gray-900">
                {farms.reduce((sum, farm) => sum + farm.area, 0).toFixed(1)}
                <span className="text-sm font-normal text-gray-500 ml-1">ha</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certified</p>
              <p className="text-2xl font-bold text-gray-900">
                {farms.filter(f => f.verification.certifications.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Farm Management</h2>
            <p className="text-sm text-gray-500">Monitor registered farms, verification status, and sustainability metrics</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4" />
            Register Farm
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search farms by name, ID, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Farms Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading farms...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area & Crops</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sustainability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFarms.map((farm) => (
                  <tr key={farm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                            <Sprout className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{farm.name}</div>
                          <div className="text-sm text-gray-500">ID: {farm.farmId}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {farm.location.region}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{farm.owner.name}</div>
                      <div className="text-sm text-gray-500">{farm.owner.email}</div>
                      {farm.owner.phone && <div className="text-xs text-gray-400">{farm.owner.phone}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(farm.verification.status)}`}>
                        {getStatusIcon(farm.verification.status)}
                        {farm.verification.status.charAt(0).toUpperCase() + farm.verification.status.slice(1)}
                      </span>
                      {farm.verification.certifications.length > 0 && (
                        <div className="mt-1">
                          {farm.verification.certifications.slice(0, 2).map((cert, idx) => (
                            <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1">
                              {cert}
                            </span>
                          ))}
                          {farm.verification.certifications.length > 2 && (
                            <span className="text-xs text-gray-500">+{farm.verification.certifications.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{farm.area} hectares</div>
                      <div className="text-xs">
                        {farm.crops.slice(0, 3).join(', ')}
                        {farm.crops.length > 3 && ` +${farm.crops.length - 3} more`}
                      </div>
                      <div className="text-xs text-gray-400">{farm.totalHarvests} harvests</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSustainabilityColor(farm.sustainability.score)}`}>
                        Score: {farm.sustainability.score}%
                      </div>
                      {farm.sustainability.certifications.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">{farm.sustainability.certifications.length} certifications</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                        <button className="text-green-600 hover:text-green-900"><Edit className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredFarms.length === 0 && (
          <div className="p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No farms found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedStatus !== 'all' || selectedRegion !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by registering your first farm.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
