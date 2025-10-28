export type TraceabilityEventType = 
  // Plot Registration
  | 'plot_registration'
  
  // Planting Events
  | 'land_preparation'
  | 'seed_planting'
  | 'transplanting'
  
  // Care & Maintenance
  | 'irrigation'
  | 'fertilizer_application'
  | 'pesticide_application'
  | 'pruning'
  | 'weeding'
  
  // Harvest Events
  | 'harvest_start'
  | 'harvest_collection'
  | 'harvest_end'
  
  // Post-harvest
  | 'sorting_grading'
  | 'washing'
  | 'packaging'
  | 'storage'
  
  // Transfer/Logistics
  | 'transfer_to_exporter'
  | 'quality_inspection'
  | 'cold_storage'
  | 'shipment_dispatch'
  | 'delivery_confirmation'
  
  // Quality & Compliance
  | 'soil_test'
  | 'residue_test'
  | 'certification_audit'
  | 'quality_check';

export type LocationData = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  timestamp: number;
};


export type PlotRegistrationPayload = {
  plotId: string;
  farmerId: string;
  plotName: string;
  location: LocationData;
  size: number; // hectares
  soilType?: string;
  cropType?: string;
  previousCrop?: string;
};

export type PlantingEventPayload = {
  plotId: string;
  seedVariety: string;
  seedBatchNumber?: string;
  plantingDate: string;
  seedQuantity: number;
  seedingMethod: 'direct' | 'transplant' | 'broadcast';
  location: LocationData;
};

export type InputApplicationPayload = {
  plotId: string;
  inputType: 'fertilizer' | 'pesticide' | 'herbicide' | 'fungicide';
  productName: string;
  activeIngredient?: string;
  applicationRate: number;
  applicationMethod: string;
  applicationDate: string;
  location: LocationData;
  preHarvestInterval?: number; // days
};

export type HarvestEventPayload = {
  plotId: string;
  harvestLotId: string;
  harvestDate: string;
  quantity: number;
  unit: 'kg' | 'tons' | 'boxes';
  quality: 'premium' | 'standard' | 'seconds';
  maturityStage: string;
  location: LocationData;
  harvesters?: string[]; // worker IDs
};

export type TransferEventPayload = {
  fromEntity: string;
  toEntity: string;
  lotIds: string[];
  transferDate: string;
  quantity: number;
  unit: string;
  temperature?: number;
  vehicleId?: string;
  driverId?: string;
  location: LocationData;
};

export type QualityInspectionPayload = {
  lotId: string;
  inspectorId: string;
  inspectionDate: string;
  visualQuality: 1 | 2 | 3 | 4 | 5; // 1 poor, 5 excellent
  defects: string[];
  brixLevel?: number;
  firmness?: string;
  colorScore?: number;
  overallGrade: 'A' | 'B' | 'C' | 'rejected';
  location: LocationData;
};

export type TraceabilityEventPayload = 
  | PlotRegistrationPayload
  | PlantingEventPayload
  | InputApplicationPayload
  | HarvestEventPayload
  | TransferEventPayload
  | QualityInspectionPayload
  | { [key: string]: unknown }; // Generic fallback

export type TraceabilityEvent = {
  id: string;
  type: TraceabilityEventType;
  actorRole: string;
  actorId: string;
  payload: TraceabilityEventPayload;
  occurredAt: string;
  location?: LocationData;
  notes?: string;
  mediaIds?: string[];
  status: 'pending' | 'synced' | 'failed';
  createdAt: string;
  updatedAt: string;
  serverId?: string;
};

export type MediaFile = {
  id: string;
  eventId: string;
  type: 'photo' | 'video' | 'barcode' | 'qr_code';
  uri: string;
  checksum: string;
  size: number;
  mimeType?: string;
  status: 'pending' | 'uploaded' | 'failed';
  createdAt: string;
  serverId?: string;
};

// Event configuration for UI
export const EVENT_CONFIGS: Record<TraceabilityEventType, {
  title: string;
  icon: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
  requiresPhoto: boolean;
  requiresLocation: boolean;
  allowsBarcode: boolean;
}> = {
  plot_registration: {
    title: 'Register Plot',
    icon: '🗺️',
    description: 'Add a new plot to your farm',
    requiredFields: ['plotName'],
    optionalFields: ['size', 'soilType', 'cropType'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  land_preparation: {
    title: 'Land Preparation',
    icon: '🚜',
    description: 'Record land preparation activities',
    requiredFields: ['plotId'],
    optionalFields: ['preparationMethod', 'equipment'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  seed_planting: {
    title: 'Plant Seeds',
    icon: '🌱',
    description: 'Record what you planted',
    requiredFields: ['plotId', 'seedVariety'],
    optionalFields: ['seedQuantity', 'seedBatchNumber'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: true,
  },
  transplanting: {
    title: 'Transplanting',
    icon: '🌿',
    description: 'Record transplanting of seedlings',
    requiredFields: ['plotId', 'plantingDate'],
    optionalFields: ['seedlingAge', 'spacing'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  irrigation: {
    title: 'Water Plants',
    icon: '💧',
    description: 'Record watering your crops',
    requiredFields: ['plotId'],
    optionalFields: ['waterSource', 'duration'],
    requiresPhoto: false,
    requiresLocation: true,
    allowsBarcode: false,
  },
  fertilizer_application: {
    title: 'Apply Fertilizer',
    icon: '🧪',
    description: 'Record fertilizer used',
    requiredFields: ['plotId', 'productName'],
    optionalFields: ['applicationRate', 'applicationMethod'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: true,
  },
  pesticide_application: {
    title: 'Pesticide Application',
    icon: '🚿',
    description: 'Record pesticide/herbicide application',
    requiredFields: ['plotId', 'productName', 'applicationRate', 'applicationDate'],
    optionalFields: ['activeIngredient', 'preHarvestInterval'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: true,
  },
  pruning: {
    title: 'Pruning',
    icon: '✂️',
    description: 'Record pruning activities',
    requiredFields: ['plotId'],
    optionalFields: ['pruningType', 'equipment'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  weeding: {
    title: 'Weeding',
    icon: '🌾',
    description: 'Record weeding activities',
    requiredFields: ['plotId'],
    optionalFields: ['weedingMethod', 'equipment'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  harvest_start: {
    title: 'Harvest Start',
    icon: '🏁',
    description: 'Mark beginning of harvest season',
    requiredFields: ['plotId', 'harvestDate'],
    optionalFields: ['expectedQuantity', 'harvestCrew'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  harvest_collection: {
    title: 'Harvest Crop',
    icon: '🧺',
    description: 'Record harvest from your plot',
    requiredFields: ['plotId', 'quantity'],
    optionalFields: ['quality', 'harvestLotId'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  harvest_end: {
    title: 'Harvest End',
    icon: '🏁',
    description: 'Mark end of harvest season',
    requiredFields: ['plotId', 'totalQuantity'],
    optionalFields: ['yieldPerHectare', 'lossPercentage'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  sorting_grading: {
    title: 'Sorting & Grading',
    icon: '🔍',
    description: 'Record sorting and grading activities',
    requiredFields: ['lotId', 'overallGrade'],
    optionalFields: ['defects', 'visualQuality'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  washing: {
    title: 'Washing',
    icon: '🚿',
    description: 'Record washing/cleaning activities',
    requiredFields: ['lotId'],
    optionalFields: ['sanitizer', 'waterSource'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  packaging: {
    title: 'Packaging',
    icon: '📦',
    description: 'Record packaging activities',
    requiredFields: ['lotId', 'packageType'],
    optionalFields: ['packageCount', 'labelInfo'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: true,
  },
  storage: {
    title: 'Cold Storage',
    icon: '❄️',
    description: 'Record storage placement',
    requiredFields: ['lotId', 'storageLocation'],
    optionalFields: ['temperature', 'humidity'],
    requiresPhoto: false,
    requiresLocation: true,
    allowsBarcode: false,
  },
  transfer_to_exporter: {
    title: 'Transfer to Exporter',
    icon: '🚚',
    description: 'Record transfer to exporter',
    requiredFields: ['fromEntity', 'toEntity', 'lotIds', 'quantity'],
    optionalFields: ['vehicleId', 'driverId', 'temperature'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: true,
  },
  quality_inspection: {
    title: 'Quality Inspection',
    icon: '🔍',
    description: 'Record quality inspection results',
    requiredFields: ['lotId', 'inspectorId', 'visualQuality', 'overallGrade'],
    optionalFields: ['brixLevel', 'firmness', 'colorScore'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  cold_storage: {
    title: 'Cold Storage Entry',
    icon: '🧊',
    description: 'Record entry into cold storage',
    requiredFields: ['lotId', 'temperature'],
    optionalFields: ['humidity', 'storageUnit'],
    requiresPhoto: false,
    requiresLocation: true,
    allowsBarcode: false,
  },
  shipment_dispatch: {
    title: 'Shipment Dispatch',
    icon: '📦',
    description: 'Record shipment dispatch',
    requiredFields: ['lotIds', 'destination', 'vehicleId'],
    optionalFields: ['driverId', 'estimatedArrival'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: true,
  },
  delivery_confirmation: {
    title: 'Delivery Confirmation',
    icon: '✅',
    description: 'Confirm delivery at destination',
    requiredFields: ['lotIds', 'receivedBy'],
    optionalFields: ['condition', 'receivedQuantity'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  soil_test: {
    title: 'Soil Test',
    icon: '🧪',
    description: 'Record soil test results',
    requiredFields: ['plotId', 'testDate'],
    optionalFields: ['pH', 'nutrients', 'organicMatter'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  residue_test: {
    title: 'Residue Test',
    icon: '🧬',
    description: 'Record pesticide residue test results',
    requiredFields: ['lotId', 'testDate', 'result'],
    optionalFields: ['testingLab', 'certificateNumber'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  certification_audit: {
    title: 'Certification Audit',
    icon: '📋',
    description: 'Record certification audit',
    requiredFields: ['auditDate', 'auditor', 'certificationType'],
    optionalFields: ['findings', 'corrective actions'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
  quality_check: {
    title: 'Quality Check',
    icon: '✓',
    description: 'General quality check',
    requiredFields: ['lotId', 'checkDate', 'result'],
    optionalFields: ['checkedBy', 'remarks'],
    requiresPhoto: true,
    requiresLocation: true,
    allowsBarcode: false,
  },
};