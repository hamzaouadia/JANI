import type { UserRole } from '@/constants/userRoles';
export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  helper?: string;
  trend?: {
    label: string;
    value: string;
    direction: 'up' | 'down';
  };
};

export type DashboardSectionItem = {
  id: string;
  label: string;
  helper?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
};

export type DashboardSection = {
  id: string;
  title: string;
  description: string;
  items?: DashboardSectionItem[];
};

export type RoleDashboardContent = {
  title: string;
  subtitle: string;
  metrics: DashboardMetric[];
  sections: DashboardSection[];
};

type DashboardConfig = Record<UserRole, RoleDashboardContent>;
export const ROLE_DASHBOARD_CONFIG: DashboardConfig = {
  admin: {
    title: 'Admin Control Center',
    subtitle: 'Monitor platform operations, users, and system performance.',
    metrics: [
      {
        id: 'total-users',
        label: 'Total Users',
        value: '1,284',
        trend: {
          label: 'this month',
          value: '+12.5%',
          direction: 'up'
        }
      },
      {
        id: 'active-farms',
        label: 'Active Farms',
        value: '156',
        trend: {
          label: 'verified',
          value: '+8.3%',
          direction: 'up'
        }
      },
      {
        id: 'system-health',
        label: 'System Health',
        value: '99.8%',
        helper: 'All services operational'
      }
    ],
    sections: [
      {
        id: 'user-management',
        title: 'User Management',
        description: 'Recent user activities and pending verifications.',
        items: [
          {
            id: 'pending-verifications',
            label: '12 farms pending verification',
            status: 'warning'
          },
          {
            id: 'new-signups',
            label: '8 new user registrations today',
            status: 'info'
          },
          {
            id: 'compliance-alerts',
            label: '3 compliance alerts require attention',
            status: 'error'
          }
        ]
      },
      {
        id: 'system-monitoring',
        title: 'System Monitoring',
        description: 'Platform performance and operational metrics.',
        items: [
          {
            id: 'api-performance',
            label: 'API response time: 125ms average',
            status: 'success'
          },
          {
            id: 'database-health',
            label: 'Database connections healthy',
            status: 'success'
          },
          {
            id: 'backup-status',
            label: 'Last backup completed successfully',
            status: 'success'
          }
        ]
      },
      {
        id: 'analytics-insights',
        title: 'Platform Analytics',
        description: 'Key performance indicators and trends.',
        items: [
          {
            id: 'traceability-events',
            label: '4,567 traceability events this week',
            status: 'info'
          },
          {
            id: 'export-compliance',
            label: '91% farms meeting compliance standards',
            status: 'success'
          },
          {
            id: 'sustainability-score',
            label: 'Average sustainability score: 78.5/100',
            status: 'info'
          }
        ]
      }
    ]
  },
  farm: {
    title: 'Operation Control Tower',
    subtitle: 'Monitor labour, inputs, and contract grower delivery performance.',
    metrics: [
      {
        id: 'workforce',
        label: 'Workforce Utilization',
        value: '92%',
        trend: {
          label: 'vs plan',
          value: '+6%',
          direction: 'up'
        }
      },
      {
        id: 'input-stock',
        label: 'Input Stock Coverage',
        value: '18 days',
        helper: 'Fertilizer restock arrives on Friday'
      },
      {
        id: 'contract-delivery',
        label: 'Contract Deliveries',
        value: '76%',
        trend: {
          label: 'on-time',
          value: '-8%',
          direction: 'down'
        }
      }
    ],
    sections: [
      {
        id: 'crew',
        title: 'Crew Readiness',
        description: 'Labour assignments and compliance requirements for the next shift.',
        items: [
          {
            id: 'field-ops',
            label: 'Assign irrigation crew to Blocks 4 & 5',
            status: 'info'
          },
          {
            id: 'safety-brief',
            label: 'Safety briefing overdue for packhouse team',
            status: 'warning'
          }
        ]
      },
      {
        id: 'procurement',
        title: 'Procurement Watchlist',
        description: 'Critical inputs and service contracts expiring soon.',
        items: [
          {
            id: 'cold-chain',
            label: 'Cold room maintenance contract renews in 5 days',
            status: 'warning'
          },
          {
            id: 'inputs',
            label: 'Bio-stimulant supplier confirmed shipment',
            status: 'success'
          }
        ]
      }
    ]
  },
  exporter: {
    title: 'Export Pipeline',
    subtitle: 'Shipment execution, compliance documents, and market readiness.',
    metrics: [
      {
        id: 'shipments',
        label: 'Active Shipments',
        value: '9',
        helper: '3 containers departing within 48h'
      },
      {
        id: 'docs',
        label: 'Document Readiness',
        value: '87%',
        trend: {
          label: 'complete',
          value: '+5%',
          direction: 'up'
        }
      },
      {
        id: 'quality-holds',
        label: 'Quality Holds',
        value: '1 lot',
        helper: 'Awaiting aflatoxin retest'
      }
    ],
    sections: [
      {
        id: 'compliance',
        title: 'Compliance Checklist',
        description: 'Certificates and inspections that block exports if overdue.',
        items: [
          {
            id: 'phyto',
            label: 'Phytosanitary certificates issued for EU lots',
            status: 'success'
          },
          {
            id: 'organic-cert',
            label: 'Organic audit follow-up due in 2 days',
            status: 'warning'
          },
          {
            id: 'trace-export',
            label: 'Traceability batch 24-18 ready for retailer portal',
            status: 'info'
          }
        ]
      },
      {
        id: 'logistics',
        title: 'Logistics Coordination',
        description: 'Hand-offs with cold chain and freight forwarders.',
        items: [
          {
            id: 'freight',
            label: 'Forwarder confirmed vessel ETD 19 Oct',
            status: 'success'
          },
          {
            id: 'cold-chain-gap',
            label: 'Cold chain gap at Mombasa hub (reefer at 7°C)',
            status: 'error'
          }
        ]
      }
    ]
  },
  buyer: {
    title: 'Procurement Insights',
    subtitle: 'Supplier reliability, demand coverage, and inbound quality.',
    metrics: [
      {
        id: 'fill-rate',
        label: 'Fill Rate',
        value: '94%',
        trend: {
          label: 'rolling 30d',
          value: '+3%',
          direction: 'up'
        }
      },
      {
        id: 'quality-score',
        label: 'Quality Score',
        value: '4.6/5',
        helper: 'Defects down 11% week-on-week'
      },
      {
        id: 'inventory-cover',
        label: 'Inventory Cover',
        value: '14 days',
        helper: 'Place top-up order by Monday'
      }
    ],
    sections: [
      {
        id: 'supplier-actions',
        title: 'Supplier Actions',
        description: 'Relationship health and corrective actions to keep supply stable.',
        items: [
          {
            id: 'preferred-supplier',
            label: 'Renew annual contract with Green Fields',
            status: 'success'
          },
          {
            id: 'alert-supplier',
            label: 'Escalate late deliveries from Sunrise Agris',
            status: 'warning'
          }
        ]
      },
      {
        id: 'demand',
        title: 'Demand & Promotion',
        description: 'Upcoming demand spikes and promotional commitments.',
        items: [
          {
            id: 'promo',
            label: 'Retail promo on avocados starts in 6 days',
            status: 'info'
          },
          {
            id: 'forecast-gap',
            label: 'Forecast gap: berries short by 8%',
            status: 'warning'
          }
        ]
      }
    ]
  },
  logistics: {
    title: 'Fleet Orchestration',
    subtitle: 'Cold chain integrity, route execution, and load compliance today.',
    metrics: [
      {
        id: 'fleet-ready',
        label: 'Fleet Availability',
        value: '84%',
        helper: '2 reefers in maintenance'
      },
      {
        id: 'ontime',
        label: 'On-Time Departures',
        value: '91%',
        trend: {
          label: 'today',
          value: '+5%',
          direction: 'up'
        }
      },
      {
        id: 'temp-alerts',
        label: 'Temp Alerts (24h)',
        value: '3',
        helper: 'All resolved within excursion window'
      }
    ],
    sections: [
      {
        id: 'routes',
        title: 'Route Monitor',
        description: 'Shipments in motion and checkpoints to watch.',
        items: [
          {
            id: 'nairobi-route',
            label: 'Route NRB-04: ETA 16:45, within temperature band',
            status: 'success'
          },
          {
            id: 'mombasa-route',
            label: 'Route MBS-12: congestion around Mariakani weighbridge',
            status: 'warning'
          }
        ]
      },
      {
        id: 'compliance',
        title: 'Driver & Asset Compliance',
        description: 'Documents and sensor health that could halt dispatch.',
        items: [
          {
            id: 'driver-med',
            label: 'Driver medical check for Team B expires in 2 days',
            status: 'warning'
          },
          {
            id: 'sensor-health',
            label: 'IoT sensor firmware update deployed fleet-wide',
            status: 'success'
          }
        ]
      }
    ]
  }
};
