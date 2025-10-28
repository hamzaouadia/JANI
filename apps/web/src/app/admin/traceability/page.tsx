"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Search, Filter, Eye, MapPin, Calendar, Package, ArrowRight, CheckCircle2, AlertTriangle, Clock, Truck, Leaf } from 'lucide-react';

interface TraceabilityEvent {
  id: string;
  eventType: 'harvest' | 'processing' | 'transport' | 'export' | 'import' | 'retail';
  title: string;
  description: string;
  timestamp: string;
  location: {
    name: string;
    coordinates?: { lat: number; lng: number; };
    address: string;
  };
  actor: {
    name: string;
    role: string;
    identifier: string;
  };
  product: {
    name: string;
    quantity: number;
    unit: string;
    batchId: string;
  };
  metadata: {
    temperature?: number;
    humidity?: number;
    certifications: string[];
    quality: 'A' | 'B' | 'C';
  };
  status: 'verified' | 'pending' | 'disputed';
  blockchainHash?: string;
}

interface TraceabilityChain {
  id: string;
  productName: string;
  batchId: string;
  origin: string;
  destination: string;
  status: 'in_transit' | 'completed' | 'delayed';
  events: TraceabilityEvent[];
  createdAt: string;
}

export default function TraceabilityPage() {
  const [events, setEvents] = useState<TraceabilityEvent[]>([]);
  const [chains, setChains] = useState<TraceabilityChain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'events' | 'chains'>('events');

  useEffect(() => {
    const fetchTraceabilityData = async () => {
      try {
        setLoading(true);
        
        // Sample traceability events
        const sampleEvents: TraceabilityEvent[] = [
          {
            id: '1',
            eventType: 'harvest',
            title: 'Coffee Beans Harvested',
            description: 'Premium Arabica coffee beans harvested from Green Valley Farm',
            timestamp: '2025-10-23T08:30:00Z',
            location: { name: 'Green Valley Farm', address: '123 Valley Road, Green County', coordinates: { lat: 40.7128, lng: -74.0060 } },
            actor: { name: 'John Farmer', role: 'Farm Owner', identifier: 'FARM-001' },
            product: { name: 'Arabica Coffee Beans', quantity: 500, unit: 'kg', batchId: 'GVF-2025-001' },
            metadata: { temperature: 22, humidity: 65, certifications: ['Organic', 'Fair Trade'], quality: 'A' },
            status: 'verified',
            blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890'
          },
          {
            id: '2',
            eventType: 'processing',
            title: 'Coffee Processing Completed',
            description: 'Wet processing and drying completed at certified facility',
            timestamp: '2025-10-23T14:15:00Z',
            location: { name: 'Valley Processing Center', address: '456 Processing St, Green County' },
            actor: { name: 'Maria Santos', role: 'Processing Manager', identifier: 'PROC-002' },
            product: { name: 'Processed Coffee Beans', quantity: 450, unit: 'kg', batchId: 'GVF-2025-001' },
            metadata: { temperature: 18, humidity: 60, certifications: ['Organic', 'Fair Trade'], quality: 'A' },
            status: 'verified',
            blockchainHash: '0x2b3c4d5e6f7890abcdef1234567890ab'
          },
          {
            id: '3',
            eventType: 'transport',
            title: 'Transport to Export Facility',
            description: 'Coffee beans transported to export warehouse',
            timestamp: '2025-10-23T16:45:00Z',
            location: { name: 'Port Export Warehouse', address: '789 Port Road, Coastal City' },
            actor: { name: 'Carlos Rodriguez', role: 'Logistics Manager', identifier: 'LOG-003' },
            product: { name: 'Processed Coffee Beans', quantity: 450, unit: 'kg', batchId: 'GVF-2025-001' },
            metadata: { temperature: 20, humidity: 55, certifications: ['Organic', 'Fair Trade'], quality: 'A' },
            status: 'pending',
            blockchainHash: '0x3c4d5e6f7890abcdef1234567890abcd'
          },
          {
            id: '4',
            eventType: 'export',
            title: 'Export Documentation Complete',
            description: 'All export permits and certificates prepared',
            timestamp: '2025-10-23T18:00:00Z',
            location: { name: 'Port Export Office', address: '790 Port Road, Coastal City' },
            actor: { name: 'Alice Exporter', role: 'Export Manager', identifier: 'EXP-001' },
            product: { name: 'Export-Ready Coffee Beans', quantity: 450, unit: 'kg', batchId: 'GVF-2025-001' },
            metadata: { certifications: ['Organic', 'Fair Trade', 'Export Certified'], quality: 'A' },
            status: 'verified'
          }
        ];

        // Sample traceability chains
        const sampleChains: TraceabilityChain[] = [
          {
            id: '1',
            productName: 'Premium Arabica Coffee',
            batchId: 'GVF-2025-001',
            origin: 'Green Valley Farm',
            destination: 'European Markets',
            status: 'in_transit',
            events: sampleEvents,
            createdAt: '2025-10-23T08:30:00Z'
          }
        ];

        setTimeout(() => {
          setEvents(sampleEvents);
          setChains(sampleChains);
          setLoading(false);
        }, 800);

      } catch (error) {
        console.error('Failed to fetch traceability data:', error);
        setLoading(false);
      }
    };

    fetchTraceabilityData();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.product.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.actor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEventType = selectedEventType === 'all' || event.eventType === selectedEventType;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    
    return matchesSearch && matchesEventType && matchesStatus;
  });

  const getEventTypeColor = (type: string) => {
    const colors = {
      harvest: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      transport: 'bg-orange-100 text-orange-800',
      export: 'bg-purple-100 text-purple-800',
      import: 'bg-indigo-100 text-indigo-800',
      retail: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'harvest': return <Leaf className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'transport': return <Truck className="h-4 w-4" />;
      case 'export': return <ArrowRight className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      disputed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'disputed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'verified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Chains</p>
              <p className="text-2xl font-bold text-gray-900">{chains.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Products Tracked</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(events.map(e => e.product.batchId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Traceability Management</h2>
            <p className="text-sm text-gray-500">Track product journey from farm to market</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('events')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'events' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Events View
            </button>
            <button
              onClick={() => setViewMode('chains')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'chains' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chains View
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by batch ID, product, or actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Event Types</option>
              <option value="harvest">Harvest</option>
              <option value="processing">Processing</option>
              <option value="transport">Transport</option>
              <option value="export">Export</option>
              <option value="import">Import</option>
              <option value="retail">Retail</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events/Chains Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading traceability data...</p>
          </div>
        ) : viewMode === 'events' ? (
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getEventTypeColor(event.eventType)}`}>
                      {getEventTypeIcon(event.eventType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">Product</p>
                          <p className="text-gray-600">{event.product.name}</p>
                          <p className="text-gray-500">Batch: {event.product.batchId}</p>
                          <p className="text-gray-500">{event.product.quantity} {event.product.unit}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-900">Actor</p>
                          <p className="text-gray-600">{event.actor.name}</p>
                          <p className="text-gray-500">{event.actor.role}</p>
                          <p className="text-gray-500">ID: {event.actor.identifier}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-900">Location & Time</p>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {event.location.name}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {event.metadata.certifications.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {event.metadata.certifications.map((cert, idx) => (
                              <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {event.blockchainHash && (
                        <div className="mt-2 text-xs text-gray-500">
                          Blockchain: {event.blockchainHash}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-6">
              {chains.map((chain) => (
                <div key={chain.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{chain.productName}</h3>
                      <p className="text-sm text-gray-500">Batch: {chain.batchId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      chain.status === 'completed' ? 'bg-green-100 text-green-800' :
                      chain.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {chain.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {chain.origin} → {chain.destination}
                  </div>
                  
                  <div className="flex items-center space-x-4 overflow-x-auto">
                    {chain.events.map((event, idx) => (
                      <div key={event.id} className="flex items-center">
                        <div className="flex flex-col items-center min-w-0">
                          <div className={`p-2 rounded-full ${getEventTypeColor(event.eventType)}`}>
                            {getEventTypeIcon(event.eventType)}
                          </div>
                          <span className="text-xs text-gray-600 mt-1 text-center">
                            {event.eventType}
                          </span>
                        </div>
                        {idx < chain.events.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && filteredEvents.length === 0 && viewMode === 'events' && (
          <div className="p-8 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedEventType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No traceability events available yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
