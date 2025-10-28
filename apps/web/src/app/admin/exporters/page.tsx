"use client";

import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Plus, Edit, Eye, FileText, CheckCircle2, AlertTriangle, Clock, Shield, Globe } from 'lucide-react';

interface Exporter {
  id: string;
  companyName: string;
  exporterId: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  licenses: {
    exportLicense: {
      number: string;
      issueDate: string;
      expiryDate: string;
      status: 'active' | 'expired' | 'suspended';
    };
    businessLicense: {
      number: string;
      issueDate: string;
      expiryDate: string;
      status: 'active' | 'expired' | 'suspended';
    };
  };
  certifications: {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    status: 'active' | 'expired' | 'pending';
  }[];
  compliance: {
    score: number;
    lastAudit: string;
    issues: number;
    status: 'compliant' | 'non_compliant' | 'under_review';
  };
  performance: {
    totalExports: number;
    successfulShipments: number;
    averageDeliveryTime: number;
    customerRating: number;
  };
  registrationDate: string;
  lastActivity: string;
  status: 'active' | 'inactive' | 'suspended';
}

export default function ExportersPage() {
  const [exporters, setExporters] = useState<Exporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCompliance, setSelectedCompliance] = useState<string>('all');

  useEffect(() => {
    const fetchExporters = async () => {
      try {
        setLoading(true);
        
        // Sample exporter data
        const sampleExporters: Exporter[] = [
          {
            id: '1',
            companyName: 'Global Trade Co.',
            exporterId: 'EXP-001',
            contactPerson: { name: 'Alice Exporter', email: 'alice@globaltrade.com', phone: '+1234567890' },
            address: { street: '123 Export St', city: 'Trade City', country: 'United States', postalCode: '12345' },
            licenses: {
              exportLicense: { number: 'EXP-2024-001', issueDate: '2024-01-15', expiryDate: '2026-01-15', status: 'active' },
              businessLicense: { number: 'BUS-2024-001', issueDate: '2024-01-01', expiryDate: '2025-12-31', status: 'active' }
            },
            certifications: [
              { name: 'ISO 22000', issuer: 'ISO Certification Body', issueDate: '2024-03-01', expiryDate: '2027-03-01', status: 'active' },
              { name: 'Fair Trade Certified', issuer: 'Fair Trade USA', issueDate: '2024-02-15', expiryDate: '2026-02-15', status: 'active' }
            ],
            compliance: { score: 92, lastAudit: '2024-09-15', issues: 0, status: 'compliant' },
            performance: { totalExports: 156, successfulShipments: 152, averageDeliveryTime: 12, customerRating: 4.8 },
            registrationDate: '2024-01-15T00:00:00Z',
            lastActivity: '2025-10-23T10:30:00Z',
            status: 'active'
          },
          {
            id: '2',
            companyName: 'Premium Coffee Exports',
            exporterId: 'EXP-002',
            contactPerson: { name: 'Bob Coffee', email: 'bob@premiumcoffee.com', phone: '+1234567891' },
            address: { street: '456 Coffee Ave', city: 'Bean Town', country: 'United States', postalCode: '54321' },
            licenses: {
              exportLicense: { number: 'EXP-2024-002', issueDate: '2024-03-01', expiryDate: '2026-03-01', status: 'active' },
              businessLicense: { number: 'BUS-2024-002', issueDate: '2024-02-15', expiryDate: '2025-12-31', status: 'active' }
            },
            certifications: [
              { name: 'Organic Certification', issuer: 'USDA Organic', issueDate: '2024-04-01', expiryDate: '2026-04-01', status: 'active' }
            ],
            compliance: { score: 78, lastAudit: '2024-08-20', issues: 2, status: 'under_review' },
            performance: { totalExports: 89, successfulShipments: 85, averageDeliveryTime: 15, customerRating: 4.3 },
            registrationDate: '2024-03-01T00:00:00Z',
            lastActivity: '2025-10-22T14:15:00Z',
            status: 'active'
          },
          {
            id: '3',
            companyName: 'Tropical Exports Ltd',
            exporterId: 'EXP-003',
            contactPerson: { name: 'Carlos Trader', email: 'carlos@tropical.com', phone: '+1234567892' },
            address: { street: '789 Tropical Blvd', city: 'Port City', country: 'United States', postalCode: '98765' },
            licenses: {
              exportLicense: { number: 'EXP-2023-003', issueDate: '2023-06-01', expiryDate: '2025-06-01', status: 'active' },
              businessLicense: { number: 'BUS-2023-003', issueDate: '2023-05-15', expiryDate: '2024-12-31', status: 'expired' }
            },
            certifications: [],
            compliance: { score: 45, lastAudit: '2024-07-10', issues: 8, status: 'non_compliant' },
            performance: { totalExports: 23, successfulShipments: 18, averageDeliveryTime: 25, customerRating: 3.2 },
            registrationDate: '2023-06-01T00:00:00Z',
            lastActivity: '2025-10-18T16:45:00Z',
            status: 'suspended'
          }
        ];

        setTimeout(() => {
          setExporters(sampleExporters);
          setLoading(false);
        }, 800);

      } catch (error) {
        console.error('Failed to fetch exporters:', error);
        setLoading(false);
      }
    };

    fetchExporters();
  }, []);

  const filteredExporters = exporters.filter(exporter => {
    const matchesSearch = exporter.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exporter.exporterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exporter.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || exporter.status === selectedStatus;
    const matchesCompliance = selectedCompliance === 'all' || exporter.compliance.status === selectedCompliance;
    
    return matchesSearch && matchesStatus && matchesCompliance;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getComplianceColor = (status: string) => {
    const colors = {
      compliant: 'bg-green-100 text-green-800',
      non_compliant: 'bg-red-100 text-red-800',
      under_review: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4" />;
      case 'suspended': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle2 className="h-4 w-4" />;
      case 'non_compliant': return <AlertTriangle className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Exporters</p>
              <p className="text-2xl font-bold text-gray-900">{exporters.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {exporters.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliant</p>
              <p className="text-2xl font-bold text-gray-900">
                {exporters.filter(e => e.compliance.status === 'compliant').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Exports</p>
              <p className="text-2xl font-bold text-gray-900">
                {exporters.reduce((sum, e) => sum + e.performance.totalExports, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certified</p>
              <p className="text-2xl font-bold text-gray-900">
                {exporters.filter(e => e.certifications.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Exporter Management</h2>
            <p className="text-sm text-gray-500">Manage export licenses, compliance, and certifications</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add Exporter
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exporters by company, ID, or contact..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCompliance}
              onChange={(e) => setSelectedCompliance(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Compliance</option>
              <option value="compliant">Compliant</option>
              <option value="under_review">Under Review</option>
              <option value="non_compliant">Non-Compliant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exporters Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading exporters...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Licenses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExporters.map((exporter) => (
                  <tr key={exporter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{exporter.companyName}</div>
                          <div className="text-sm text-gray-500">ID: {exporter.exporterId}</div>
                          <div className="text-xs text-gray-400">{exporter.contactPerson.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exporter.status)}`}>
                        {getStatusIcon(exporter.status)}
                        {exporter.status.charAt(0).toUpperCase() + exporter.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(exporter.compliance.status)}`}>
                        {getComplianceIcon(exporter.compliance.status)}
                        {exporter.compliance.status.replace('_', ' ')}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Score: {exporter.compliance.score}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className={`text-xs px-2 py-1 rounded ${
                          exporter.licenses.exportLicense.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Export: {exporter.licenses.exportLicense.status}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          exporter.licenses.businessLicense.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Business: {exporter.licenses.businessLicense.status}
                        </div>
                        {exporter.certifications.length > 0 && (
                          <div className="text-xs text-blue-600">
                            {exporter.certifications.length} certifications
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{exporter.performance.totalExports} exports</div>
                        <div className="text-xs">Success: {Math.round((exporter.performance.successfulShipments / exporter.performance.totalExports) * 100)}%</div>
                        <div className="text-xs">Rating: {exporter.performance.customerRating}/5</div>
                        <div className="text-xs">Avg delivery: {exporter.performance.averageDeliveryTime}d</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-orange-600 hover:text-orange-900">
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredExporters.length === 0 && (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exporters found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedStatus !== 'all' || selectedCompliance !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first exporter.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
