import type { UserRole } from '@/constants/userRoles';
export type TraceabilityStep = {
  title: string;
  actions: string[];
};

export type TraceabilityStage = {
  id: string;
  emoji: string;
  title: string;
  goal: string;
  steps: TraceabilityStep[];
};

export type TraceabilitySummary = {
  stage: string;
  description: string;
};

export type TraceabilityFlow = {
  intro: string;
  stages: TraceabilityStage[];
  summary: TraceabilitySummary[];
};



const farmOwnerStages: TraceabilityStage[] = [
  {
    id: 'strategic-planning',
    emoji: '🗺️',
    title: 'Strategic Planning',
    goal: 'Align farm assets to demand and sustainability goals.',
    steps: [
      {
        title: 'Enterprise Analysis',
        actions: [
          'Consolidate historical performance per crop and field block.',
          'Prioritize rotations balancing soil health and contract obligations.'
        ]
      },
      {
        title: 'Budgeting & CapEx',
        actions: [
          'Model input, labor, and equipment costs for the season.',
          'Approve capital improvements (irrigation, solar pumps, storage).'
        ]
      }
    ]
  },
  {
    id: 'resource-allocation',
    emoji: '📦',
    title: 'Resource Allocation',
    goal: 'Position inputs, labor, and equipment for execution.',
    steps: [
      {
        title: 'Input Procurement',
        actions: ['Source certified seeds, fertilizers, and crop protection with trace docs.', 'Stage inputs in locked stores with issuance logs.']
      },
      {
        title: 'Workforce Planning',
        actions: ['Build crew rosters with skill matrices.', 'Schedule agronomist field walks and mechanization windows.']
      }
    ]
  },
  {
    id: 'establishment',
    emoji: '🚜',
    title: 'Field Establishment',
    goal: 'Ensure each plot is planted to specification.',
    steps: [
      {
        title: 'Compliance Checks',
        actions: ['Verify SOP adherence for land prep, transplanting, and irrigation setup.', 'Capture geo-tagged evidence for certification audits.']
      },
      {
        title: 'Operational Visibility',
        actions: ['Track work orders completion in farm management system.', 'Escalate delays or quality deviations with root-cause notes.']
      }
    ]
  },
  {
    id: 'crop-performance',
    emoji: '📈',
    title: 'Crop Performance Monitoring',
    goal: 'Maintain oversight of all production blocks.',
    steps: [
      {
        title: 'Scouting & Diagnostics',
        actions: ['Aggregate pest, disease, and nutrient issue logs.', 'Trigger agronomic interventions and track resolution.']
      },
      {
        title: 'Irrigation Governance',
        actions: ['Monitor water usage versus quotas.', 'Validate pump runtime and energy costs.']
      }
    ]
  },
  {
    id: 'harvest-operations',
    emoji: '📦',
    title: 'Harvest Operations',
    goal: 'Coordinate multi-block harvest programs.',
    steps: [
      {
        title: 'Harvest Readiness',
        actions: ['Approve harvest start based on quality thresholds.', 'Assign crews and equipment per block with shift targets.']
      },
      {
        title: 'Throughput Tracking',
        actions: ['Consolidate weighbridge or crate counts by lot.', 'Report on reject rates and labor productivity.']
      }
    ]
  },
  {
    id: 'postharvest-logistics',
    emoji: '🏬',
    title: 'Post-Harvest & Logistics',
    goal: 'Move product efficiently to cold rooms or buyers.',
    steps: [
      {
        title: 'Facility Management',
        actions: ['Record cold room temperatures and inventory turnover.', 'Ensure packaging meets brand and buyer specs.']
      },
      {
        title: 'Distribution Planning',
        actions: ['Sequence deliveries across buyers and hubs.', 'Maintain trace documents (harvest logs, phytosanitary certificates).']
      }
    ]
  },
  {
    id: 'performance-review',
    emoji: '📊',
    title: 'Performance Review & Compliance',
    goal: 'Close the season with actionable insights.',
    steps: [
      {
        title: 'Audit Trail',
        actions: ['Prepare documentation for organic, GlobalG.A.P., or sustainability audits.', 'Archive corrective actions and certifications.']
      },
      {
        title: 'Financial Analysis',
        actions: ['Compare actual vs budgeted costs and yields.', 'Refine next season plans and investment priorities.']
      }
    ]
  }
];

const farmOwnerSummary: TraceabilitySummary[] = [
  { stage: 'Plan', description: 'Budgets, rotations, and compliance targets set.' },
  { stage: 'Inputs', description: 'Procured and traced across stores and fields.' },
  { stage: 'Execution', description: 'Field work orders tracked to completion.' },
  { stage: 'Harvest', description: 'Yield, quality, and labor metrics consolidated.' },
  { stage: 'Storage', description: 'Cold-chain and packaging compliance ensured.' },
  { stage: 'Delivery', description: 'Lots dispatched with full documentation.' },
  { stage: 'Review', description: 'Seasonal financials and audits completed.' }
];

const exporterStages: TraceabilityStage[] = [
  {
    id: 'intake',
    emoji: '📥',
    title: 'Intake & Verification',
    goal: 'Confirm supplier deliveries meet contractual specs.',
    steps: [
      {
        title: 'Pre-Arrival Coordination',
        actions: ['Receive ASN (advanced shipment notices) from farms.', 'Schedule dock slots and allocate QA inspectors.']
      },
      {
        title: 'Goods Receipt',
        actions: ['Capture weight, lot IDs, and temperature upon arrival.', 'Run visual inspections and residue quick tests.']
      }
    ]
  },
  {
    id: 'grading',
    emoji: '🧪',
    title: 'Processing & Grading',
    goal: 'Standardize quality for each destination market.',
    steps: [
      {
        title: 'Sorting',
        actions: ['Segregate produce by size, blemish score, and maturity.', 'Document downgrades and claims back to suppliers.']
      },
      {
        title: 'Treatment & Conditioning',
        actions: ['Apply approved fungicides or hot-water dips if required.', 'Pre-cool to target pulp temperature.']
      }
    ]
  },
  {
    id: 'documentation',
    emoji: '📄',
    title: 'Compliance & Documentation',
    goal: 'Compile all export paperwork and trace data.',
    steps: [
      {
        title: 'Regulatory',
        actions: ['Obtain phytosanitary certificates and lab residue reports.', 'Validate supplier certifications (GlobalG.A.P., SMETA).']
      },
      {
        title: 'Commercial',
        actions: ['Prepare invoices, packing lists, and certificates of origin.', 'Digitally sign traceability statements for buyers.']
      }
    ]
  },
  {
    id: 'cold-chain',
    emoji: '❄️',
    title: 'Cold Chain Management',
    goal: 'Protect product integrity pre-shipment.',
    steps: [
      {
        title: 'Facility Controls',
        actions: ['Monitor cold room temperatures and humidity continuously.', 'Calibrate sensors and log deviations with corrective actions.']
      },
      {
        title: 'Loading Protocols',
        actions: ['Pre-cool containers and record set points.', 'Seal pallets and capture seal numbers with photos.']
      }
    ]
  },
  {
    id: 'logistics',
    emoji: '🚢',
    title: 'Logistics Coordination',
    goal: 'Secure transport capacity and visibility.',
    steps: [
      {
        title: 'Booking & Routing',
        actions: ['Book ocean or air freight with contingency plans.', 'Upload routing data to traceability portal.']
      },
      {
        title: 'Regulatory Filings',
        actions: ['Submit export declarations and AMS/ENS filings.', 'Share shipping instructions and VGM (verified gross mass).']
      }
    ]
  },
  {
    id: 'customs',
    emoji: '🛃',
    title: 'Customs & Clearance',
    goal: 'Ensure smooth border crossing.',
    steps: [
      {
        title: 'Pre-Clearance',
        actions: ['Transmit documents to destination brokers.', 'Respond to inspections or sampling requests.']
      },
      {
        title: 'Arrival Confirmation',
        actions: ['Track container status and release times.', 'Notify buyers with updated ETAs and deviations.']
      }
    ]
  },
  {
    id: 'customer-feedback',
    emoji: '🤝',
    title: 'Customer Delivery & Feedback',
    goal: 'Close shipments with insights.',
    steps: [
      {
        title: 'Proof of Delivery',
        actions: ['Capture quality reports at destination.', 'Issue credit or claims workflows if required.']
      },
      {
        title: 'Continuous Improvement',
        actions: ['Review transit times versus benchmarks.', 'Update supplier scorecards and share learnings.']
      }
    ]
  }
];

const exporterSummary: TraceabilitySummary[] = [
  { stage: 'Intake', description: 'Supplier lots verified with quality and safety checks.' },
  { stage: 'Processing', description: 'Products sorted, treated, and conditioned.' },
  { stage: 'Compliance', description: 'Documentation packet complete and stored digitally.' },
  { stage: 'Cold Chain', description: 'Temperature-controlled storage and loading recorded.' },
  { stage: 'Logistics', description: 'Freight bookings and filings confirmed.' },
  { stage: 'Customs', description: 'Shipments cleared with transparent status updates.' },
  { stage: 'Feedback', description: 'Buyer insights captured for future optimization.' }
];

const buyerStages: TraceabilityStage[] = [
  {
    id: 'sourcing',
    emoji: '🔍',
    title: 'Sourcing Strategy',
    goal: 'Define demand and supplier mix.',
    steps: [
      {
        title: 'Demand Planning',
        actions: ['Analyze historical sales and forecast demand by SKU.', 'Identify sustainability or certification targets.']
      },
      {
        title: 'Supplier Mapping',
        actions: ['Segment suppliers by region, crop, and risk profile.', 'Publish sourcing policies to network.']
      }
    ]
  },
  {
    id: 'vetting',
    emoji: '🧾',
    title: 'Supplier Vetting & Onboarding',
    goal: 'Ensure suppliers meet standards before contracting.',
    steps: [
      {
        title: 'Due Diligence',
        actions: ['Review certifications, audit reports, and insurance.', 'Assess traceability and data-sharing capabilities.']
      },
      {
        title: 'Onboarding',
        actions: ['Capture banking, tax, and contact information.', 'Define quality specs, packaging, and KPIs.']
      }
    ]
  },
  {
    id: 'contracting',
    emoji: '📝',
    title: 'Contracting & Pricing',
    goal: 'Secure supply with transparent terms.',
    steps: [
      {
        title: 'Agreement Drafting',
        actions: ['Set volumes, delivery windows, and payment terms.', 'Incorporate ESG clauses and traceability expectations.']
      },
      {
        title: 'Approval Workflow',
        actions: ['Obtain legal and finance sign-off.', 'Share executed contracts in supplier portal.']
      }
    ]
  },
  {
    id: 'ordering',
    emoji: '📦',
    title: 'Purchase Orders & Coordination',
    goal: 'Translate forecasts into executable orders.',
    steps: [
      {
        title: 'PO Issuance',
        actions: ['Send POs with lot-level requirements.', 'Confirm supplier acceptance and logistics availability.']
      },
      {
        title: 'Pre-Delivery Checks',
        actions: ['Validate traceability data (farm, harvest date).', 'Ensure cold-chain and packaging standards are understood.']
      }
    ]
  },
  {
    id: 'receiving',
    emoji: '🏬',
    title: 'Receiving & Quality Assurance',
    goal: 'Ensure inbound goods match specifications.',
    steps: [
      {
        title: 'Inbound Scheduling',
        actions: ['Reserve dock slots and QA resources.', 'Communicate live ETAs to warehouse teams.']
      },
      {
        title: 'Quality Inspection',
        actions: ['Check temperature, appearance, and documentation.', 'Log deviations and trigger supplier corrective actions.']
      }
    ]
  },
  {
    id: 'merchandising',
    emoji: '🛒',
    title: 'Inventory & Merchandising',
    goal: 'Move product to stores or customers efficiently.',
    steps: [
      {
        title: 'Allocation',
        actions: ['Allocate lots to sales channels based on freshness and demand.', 'Maintain FEFO (first-expired-first-out) flow.']
      },
      {
        title: 'Consumer Communication',
        actions: ['Surface farm stories and certifications in marketing.', 'Enable QR codes or apps for transparency.']
      }
    ]
  },
  {
    id: 'analysis',
    emoji: '📊',
    title: 'Feedback & Analytics',
    goal: 'Improve partnerships and assortment.',
    steps: [
      {
        title: 'Performance Reviews',
        actions: ['Share scorecards with suppliers on OTIF, quality, ESG.', 'Reward top performers with preferred status.']
      },
      {
        title: 'Consumer Insights',
        actions: ['Analyze sell-through, waste, and customer feedback.', 'Adjust sourcing plans and specs accordingly.']
      }
    ]
  }
];

const buyerSummary: TraceabilitySummary[] = [
  { stage: 'Plan', description: 'Demand forecasts and sourcing goals defined.' },
  { stage: 'Vet', description: 'Suppliers onboarded with due diligence complete.' },
  { stage: 'Contract', description: 'Commercial and ESG commitments locked in.' },
  { stage: 'Order', description: 'Purchase orders synchronized with supply plans.' },
  { stage: 'Receive', description: 'QA checks assure specification compliance.' },
  { stage: 'Merchandise', description: 'Inventory allocated with consumer storytelling.' },
  { stage: 'Analyze', description: 'Supplier performance and shopper insights looped.' }
];

const logisticsStages: TraceabilityStage[] = [
  {
    id: 'planning',
    emoji: '🗂️',
    title: 'Load Planning',
    goal: 'Build efficient routes and capacity plans.',
    steps: [
      {
        title: 'Demand Intake',
        actions: ['Consolidate orders from farms, exporters, and buyers.', 'Prioritize loads based on perishability and SLAs.']
      },
      {
        title: 'Route Optimization',
        actions: ['Design routes leveraging TMS and traffic data.', 'Assign drivers and vehicles with compliance checks.']
      }
    ]
  },
  {
    id: 'vehicle-prep',
    emoji: '🧰',
    title: 'Vehicle Preparation',
    goal: 'Ensure fleet readiness before dispatch.',
    steps: [
      {
        title: 'Pre-Trip Inspection',
        actions: ['Check refrigeration units, tires, and hygiene.', 'Log inspection in maintenance system.']
      },
      {
        title: 'Documentation',
        actions: ['Load manifests, permits, and temperature set points onto telematics devices.', 'Verify driver certifications and hours.']
      }
    ]
  },
  {
    id: 'pickup',
    emoji: '📦',
    title: 'Pickup & Loading',
    goal: 'Collect cargo with minimal dwell time.',
    steps: [
      {
        title: 'Dock Coordination',
        actions: ['Arrive within scheduled window.', 'Capture loading start/end times and seal numbers.']
      },
      {
        title: 'Condition Verification',
        actions: ['Check pulp temperatures and packaging integrity.', 'Upload photos and digital signatures.']
      }
    ]
  },
  {
    id: 'in-transit',
    emoji: '📡',
    title: 'In-Transit Monitoring',
    goal: 'Protect cargo quality in motion.',
    steps: [
      {
        title: 'Telematics',
        actions: ['Track GPS, temperature, and door status in real time.', 'Trigger alerts on route deviations or excursions.']
      },
      {
        title: 'Driver Support',
        actions: ['Provide rest stops and contingency guidance.', 'Log incidents or delays with root-cause notes.']
      }
    ]
  },
  {
    id: 'handover',
    emoji: '📬',
    title: 'Delivery & Handover',
    goal: 'Complete delivery with trace documentation.',
    steps: [
      {
        title: 'Receiving Protocol',
        actions: ['Verify recipient identity and unload sequence.', 'Capture proof of delivery, temperatures, and feedback.']
      },
      {
        title: 'Returns Management',
        actions: ['Document refusals or damages.', 'Coordinate return logistics or disposal per policy.']
      }
    ]
  },
  {
    id: 'post-trip',
    emoji: '🧾',
    title: 'Post-Trip Administration',
    goal: 'Close loads and update stakeholders.',
    steps: [
      {
        title: 'Settlement',
        actions: ['Submit driver logs, expenses, and fuel receipts.', 'Invoice shippers with accessorials documented.']
      },
      {
        title: 'Data Sync',
        actions: ['Push delivery events to partners and traceability platform.', 'Update asset utilization and availability.']
      }
    ]
  },
  {
    id: 'continuous-improvement',
    emoji: '📈',
    title: 'Continuous Improvement',
    goal: 'Enhance fleet performance and sustainability.',
    steps: [
      {
        title: 'KPI Review',
        actions: ['Analyze on-time delivery, spoilage, and cost-per-km.', 'Benchmark drivers and lanes for incentive programs.']
      },
      {
        title: 'Sustainability',
        actions: ['Track emissions and fuel efficiency.', 'Plan for route consolidation or modal shifts.']
      }
    ]
  }
];

const logisticsSummary: TraceabilitySummary[] = [
  { stage: 'Plan', description: 'Routes and capacity optimized before dispatch.' },
  { stage: 'Prepare', description: 'Fleet and compliance checks completed.' },
  { stage: 'Pickup', description: 'Loads collected with condition data captured.' },
  { stage: 'Transit', description: 'Real-time monitoring and alerts active.' },
  { stage: 'Deliver', description: 'Proof of delivery and exceptions recorded.' },
  { stage: 'Close', description: 'Financials settled and data synchronized.' },
  { stage: 'Improve', description: 'KPIs reviewed for efficiency gains.' }
];

const TRACEABILITY_CONFIG: Record<UserRole, TraceabilityFlow> = {
  admin: {
    intro: 'Administrators monitor overall traceability performance and support operations across roles.',
    stages: farmOwnerStages,
    summary: farmOwnerSummary
  },
  farm: {
    intro: 'Farm owners orchestrate resources, compliance, and teams to deliver consistent volumes.',
    stages: farmOwnerStages,
    summary: farmOwnerSummary
  },
  exporter: {
    intro: 'Exporters transform farm lots into compliant international shipments under strict cold-chain control.',
    stages: exporterStages,
    summary: exporterSummary
  },
  buyer: {
    intro: 'Buyers balance demand, supplier relationships, and consumer trust through transparent procurement.',
    stages: buyerStages,
    summary: buyerSummary
  },
  logistics: {
    intro: 'Logistics partners safeguard freshness from origin to destination with monitored handoffs.',
    stages: logisticsStages,
    summary: logisticsSummary
  }
};

export const getTraceabilityFlow = (role: UserRole): TraceabilityFlow => TRACEABILITY_CONFIG[role];
