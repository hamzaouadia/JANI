const mongoose = require('mongoose');

// Ensure related schemas are registered before this model attempts to populate them.
require('./User');

const traceabilityEventSchema = new mongoose.Schema({
  // Event identification
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Event type (from traceabilityEvents constants)
  type: {
    type: String,
    required: true,
    enum: [
      // Planning phase
      'plot_registration',
      'land_preparation',
      'soil_test',
      
      // Planting phase
      'seed_planting',
      'transplanting',
      
      // Growing phase
      'irrigation',
      'fertilizer_application',
      'pesticide_application',
      'pruning',
      'weeding',
      
      // Harvesting phase
      'harvest_start',
      'harvest_collection',
      'harvest_end',
      
      // Post-harvest
      'sorting_grading',
      'washing',
      'packaging',
      'storage',
      'transfer_to_exporter',
      
      // Quality & compliance
      'quality_inspection',
      'cold_storage',
      'shipment_dispatch',
      'delivery_confirmation',
      'residue_test',
      'certification_audit',
      'quality_check'
    ]
  },
  
  // Farm and plot identification
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  
  plotId: {
    type: String,
    required: false // Some events might apply to entire farm
  },
  
  // User who recorded the event
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Timing
  occurredAt: {
    type: Date,
    required: true
  },
  
  recordedAt: {
    type: Date,
    default: Date.now
  },
  
  // Event details
  description: {
    type: String,
    maxlength: 500
  },
  
  // Event-specific data
  metadata: {
    // For seed_planting
    seedVariety: String,
    seedQuantity: Number,
    seedUnit: String,
    
    // For irrigation
    waterAmount: Number,
    waterSource: String,
    irrigationMethod: String,
    
    // For fertilizer_application
    fertilizerType: String,
    fertilizerAmount: Number,
    fertilizerUnit: String,
    applicationMethod: String,
    
    // For pesticide_application
    pesticideType: String,
    pesticideAmount: Number,
    pesticideUnit: String,
    targetPest: String,
    
    // For harvest_collection
    harvestedQuantity: Number,
    harvestedUnit: String,
    qualityGrade: String,
    
    // For quality_inspection
    inspectorName: String,
    inspectionResult: String,
    certificationBody: String,
    
    // General metadata
    temperature: Number,
    humidity: Number,
    weatherConditions: String,
    equipmentUsed: [String],
    laborersCount: Number,
    cost: Number,
    notes: String
  },
  
  // Location data
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  
  // Photos/attachments
  attachments: [{
    type: {
      type: String,
      enum: ['photo', 'document', 'receipt']
    },
    url: String,
    filename: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Verification and compliance
  verified: {
    type: Boolean,
    default: false
  },
  
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  verifiedAt: Date,
  
  // Sync status for offline-first approach
  syncStatus: {
    type: String,
    enum: ['pending', 'synced', 'failed'],
    default: 'synced'
  },
  
  syncedAt: Date,
  
  // Audit trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
traceabilityEventSchema.index({ farmId: 1, occurredAt: -1 });
traceabilityEventSchema.index({ plotId: 1, occurredAt: -1 });
traceabilityEventSchema.index({ type: 1, occurredAt: -1 });
traceabilityEventSchema.index({ userId: 1, occurredAt: -1 });
traceabilityEventSchema.index({ eventId: 1 }, { unique: true });

// Virtual for farm state calculation
traceabilityEventSchema.virtual('farmState').get(function() {
  const stateMap = {
    'plot_registration': 'planning',
    'land_preparation': 'planning',
    'soil_test': 'planning',
    'seed_planting': 'planting',
    'transplanting': 'planting',
    'irrigation': 'growing',
    'fertilizer_application': 'growing',
    'pesticide_application': 'growing',
    'pruning': 'growing',
    'weeding': 'growing',
    'harvest_start': 'harvesting',
    'harvest_collection': 'harvesting',
    'harvest_end': 'completed',
    'sorting_grading': 'completed',
    'washing': 'completed',
    'packaging': 'completed',
    'storage': 'completed',
    'transfer_to_exporter': 'completed',
    'quality_inspection': 'growing',
    'cold_storage': 'completed',
    'shipment_dispatch': 'completed',
    'delivery_confirmation': 'completed',
    'residue_test': 'growing',
    'certification_audit': 'growing',
    'quality_check': 'growing'
  };
  
  return stateMap[this.type] || 'planning';
});

// Instance methods
traceabilityEventSchema.methods.markAsVerified = function(verifierId) {
  this.verified = true;
  this.verifiedBy = verifierId;
  this.verifiedAt = new Date();
  return this.save();
};

traceabilityEventSchema.methods.markAsSynced = function() {
  this.syncStatus = 'synced';
  this.syncedAt = new Date();
  return this.save();
};

// Static methods
traceabilityEventSchema.statics.getEventsByFarm = function(farmId, options = {}) {
  const query = { farmId };
  if (options.plotId) query.plotId = options.plotId;
  if (options.type) query.type = options.type;
  if (options.startDate || options.endDate) {
    query.occurredAt = {};
    if (options.startDate) query.occurredAt.$gte = new Date(options.startDate);
    if (options.endDate) query.occurredAt.$lte = new Date(options.endDate);
  }
  
  return this.find(query)
    .sort({ occurredAt: -1 })
    .populate('userId', 'name email')
    .populate('verifiedBy', 'name email')
    .limit(options.limit || 100);
};

traceabilityEventSchema.statics.getFarmTimeline = function(farmId, plotId = null) {
  const query = { farmId };
  if (plotId) query.plotId = plotId;
  
  return this.find(query)
    .sort({ occurredAt: 1 })
    .populate('userId', 'name email')
    .select('type occurredAt description metadata verified');
};

module.exports = mongoose.model('TraceabilityEvent', traceabilityEventSchema);