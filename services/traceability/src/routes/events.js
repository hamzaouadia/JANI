const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const TraceabilityEvent = require('../models/TraceabilityEvent');
const router = express.Router();

// Validation schemas
const eventValidationSchema = Joi.object({
  type: Joi.string().valid(
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
  ).required(),
  
  farmId: Joi.string().required(),
  plotId: Joi.string().optional(),
  userId: Joi.string().required(),
  occurredAt: Joi.date().iso().required(),
  description: Joi.string().max(500).optional(),
  
  metadata: Joi.object({
    // Seed planting
    seedVariety: Joi.string().optional(),
    seedQuantity: Joi.number().positive().optional(),
    seedUnit: Joi.string().optional(),
    
    // Irrigation
    waterAmount: Joi.number().positive().optional(),
    waterSource: Joi.string().optional(),
    irrigationMethod: Joi.string().optional(),
    
    // Fertilizer
    fertilizerType: Joi.string().optional(),
    fertilizerAmount: Joi.number().positive().optional(),
    fertilizerUnit: Joi.string().optional(),
    applicationMethod: Joi.string().optional(),
    
    // Pesticide
    pesticideType: Joi.string().optional(),
    pesticideAmount: Joi.number().positive().optional(),
    pesticideUnit: Joi.string().optional(),
    targetPest: Joi.string().optional(),
    
    // Harvest
    harvestedQuantity: Joi.number().positive().optional(),
    harvestedUnit: Joi.string().optional(),
    qualityGrade: Joi.string().optional(),
    
    // Quality inspection
    inspectorName: Joi.string().optional(),
    inspectionResult: Joi.string().optional(),
    certificationBody: Joi.string().optional(),
    
    // General
    temperature: Joi.number().optional(),
    humidity: Joi.number().min(0).max(100).optional(),
    weatherConditions: Joi.string().optional(),
    equipmentUsed: Joi.array().items(Joi.string()).optional(),
    laborersCount: Joi.number().min(0).optional(),
    cost: Joi.number().min(0).optional(),
    notes: Joi.string().optional()
  }).optional(),
  
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    accuracy: Joi.number().positive().optional()
  }).optional(),
  
  attachments: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('photo', 'document', 'receipt').required(),
      url: Joi.string().uri().required(),
      filename: Joi.string().required(),
      size: Joi.number().positive().optional()
    })
  ).optional()
});

// GET /api/events - Get events with filtering
router.get('/', async (req, res) => {
  try {
    const {
      farmId,
      plotId,
      type,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
      verified,
      syncStatus
    } = req.query;

    // Build query
    const query = {};
    if (farmId) query.farmId = farmId;
    if (plotId) query.plotId = plotId;
    if (type) query.type = type;
    if (verified !== undefined) query.verified = verified === 'true';
    if (syncStatus) query.syncStatus = syncStatus;
    
    if (startDate || endDate) {
      query.occurredAt = {};
      if (startDate) query.occurredAt.$gte = new Date(startDate);
      if (endDate) query.occurredAt.$lte = new Date(endDate);
    }

    const events = await TraceabilityEvent.find(query)
      .sort({ occurredAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate('userId', 'name email')
      .populate('verifiedBy', 'name email');

    const total = await TraceabilityEvent.countDocuments(query);

    res.json({
      success: true,
      data: events,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + events.length) < total
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await TraceabilityEvent.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('verifiedBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
});

// POST /api/events - Create new event
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = eventValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Create event
    const eventData = {
      ...value,
      eventId: uuidv4(),
      createdBy: value.userId, // Assuming userId is the creator
      recordedAt: new Date()
    };

    const event = new TraceabilityEvent(eventData);
    await event.save();

    // Populate and return
    await event.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
});

// PUT /api/events/:id - Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await TraceabilityEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Validate request body
    const { error, value } = eventValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Update event
    Object.assign(event, value);
    event.updatedBy = req.body.userId; // Assuming userId is provided
    await event.save();

    await event.populate('userId', 'name email');

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await TraceabilityEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await TraceabilityEvent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
});

// POST /api/events/bulk - Create multiple events
router.post('/bulk', async (req, res) => {
  try {
    const { events } = req.body;
    
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Events array is required and cannot be empty'
      });
    }

    // Validate all events
    const validationErrors = [];
    const validatedEvents = [];

    for (let i = 0; i < events.length; i++) {
      const { error, value } = eventValidationSchema.validate(events[i]);
      if (error) {
        validationErrors.push({
          index: i,
          errors: error.details.map(detail => detail.message)
        });
      } else {
        validatedEvents.push({
          ...value,
          eventId: uuidv4(),
          createdBy: value.userId,
          recordedAt: new Date()
        });
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for some events',
        errors: validationErrors
      });
    }

    // Insert all events
    const insertedEvents = await TraceabilityEvent.insertMany(validatedEvents);

    res.status(201).json({
      success: true,
      data: insertedEvents,
      message: `${insertedEvents.length} events created successfully`
    });
  } catch (error) {
    console.error('Error creating bulk events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create events',
      error: error.message
    });
  }
});

// GET /api/events/farm/:farmId/timeline - Get farm timeline
router.get('/farm/:farmId/timeline', async (req, res) => {
  try {
    const { farmId } = req.params;
    const { plotId } = req.query;

    const events = await TraceabilityEvent.getFarmTimeline(farmId, plotId);

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timeline',
      error: error.message
    });
  }
});

// GET /api/events/farm/:farmId/summary - Get farm events summary
router.get('/farm/:farmId/summary', async (req, res) => {
  try {
    const { farmId } = req.params;
    const { plotId } = req.query;

    const query = { farmId };
    if (plotId) query.plotId = plotId;

    // Get event counts by type
    const eventCounts = await TraceabilityEvent.aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get latest events
    const latestEvents = await TraceabilityEvent.find(query)
      .sort({ occurredAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .select('type occurredAt description verified');

    // Get verification stats
    const verificationStats = await TraceabilityEvent.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$verified',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        eventCounts,
        latestEvents,
        verificationStats,
        totalEvents: eventCounts.reduce((sum, item) => sum + item.count, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary',
      error: error.message
    });
  }
});

// PATCH /api/events/:id/verify - Verify an event
router.patch('/:id/verify', async (req, res) => {
  try {
    const { verifierId } = req.body;
    
    if (!verifierId) {
      return res.status(400).json({
        success: false,
        message: 'Verifier ID is required'
      });
    }

    const event = await TraceabilityEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.markAsVerified(verifierId);
    await event.populate('verifiedBy', 'name email');

    res.json({
      success: true,
      data: event,
      message: 'Event verified successfully'
    });
  } catch (error) {
    console.error('Error verifying event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify event',
      error: error.message
    });
  }
});

// GET /api/events/docs - API documentation
router.get('/docs', (req, res) => {
  res.json({
    service: 'JANI Traceability Events API',
    version: '1.0.0',
    endpoints: {
      'GET /api/events': 'Get events with filtering',
      'GET /api/events/:id': 'Get single event',
      'POST /api/events': 'Create new event',
      'PUT /api/events/:id': 'Update event',
      'DELETE /api/events/:id': 'Delete event',
      'POST /api/events/bulk': 'Create multiple events',
      'GET /api/events/farm/:farmId/timeline': 'Get farm timeline',
      'GET /api/events/farm/:farmId/summary': 'Get farm events summary',
      'PATCH /api/events/:id/verify': 'Verify an event'
    },
    eventTypes: [
      'plot_registration', 'land_preparation', 'soil_test',
      'seed_planting', 'transplanting',
      'irrigation', 'fertilizer_application', 'pesticide_application', 'pruning', 'weeding',
      'harvest_start', 'harvest_collection', 'harvest_end',
      'sorting_grading', 'washing', 'packaging', 'storage', 'transfer_to_exporter',
      'quality_inspection', 'cold_storage', 'shipment_dispatch', 'delivery_confirmation',
      'residue_test', 'certification_audit', 'quality_check'
    ]
  });
});

module.exports = router;