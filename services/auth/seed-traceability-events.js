#!/usr/bin/env node

/** @fileoverview Seeds the traceability database with traceability events derived from seed files. */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.TRACEABILITY_MONGODB_URI || 'mongodb://localhost:27017/jani-traceability';
const traceabilityEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  plotId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  occurredAt: { type: Date, required: true },
  recordedAt: { type: Date, default: Date.now },
  description: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  syncStatus: { type: String, enum: ['pending', 'synced', 'failed'], default: 'synced' },
  syncedAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const TraceabilityEvent = mongoose.model('TraceabilityEvent', traceabilityEventSchema);

const seedEvents = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-traceability.json'), 'utf8'));

async function seedTraceabilityEvents() {
  try {
    console.log('🔌 Connecting to Traceability Database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const authDb = mongoose.connection.useDb('jani-ai-auth');
    const User = authDb.model('User', new mongoose.Schema({}, { strict: false }));
    const Farm = authDb.model('Farm', new mongoose.Schema({}, { strict: false }));
    
    const users = await User.find({});
    const farms = await Farm.find({});
    
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user._id;
    });
    
    const farmMap = {};
    farms.forEach(farm => {
      farmMap[farm.name] = farm._id;
    });
    
    console.log(`📋 Found ${users.length} users and ${farms.length} farms\n`);

    console.log('🗑️  Clearing existing traceability events...');
    await TraceabilityEvent.deleteMany({});
    console.log('✅ Existing events cleared\n');

    console.log('📝 Seeding traceability events...');
    let eventCount = 0;
    
    for (const eventData of seedEvents) {
      const userId = userMap[eventData.userEmail];
      const farmId = farmMap[eventData.farmReference];
      
      if (!userId) {
        console.log(`  ⚠ Warning: User not found for email ${eventData.userEmail}`);
        continue;
      }
      
      if (!farmId) {
        console.log(`  ⚠ Warning: Farm not found: ${eventData.farmReference}`);
        continue;
      }
      
      const { userEmail, farmReference, ...eventFields } = eventData;
      
      const event = await TraceabilityEvent.create({
        ...eventFields,
        farmId,
        userId,
        createdBy: userId,
        verifiedBy: eventData.verified ? userId : undefined,
        verifiedAt: eventData.verified ? new Date(eventData.occurredAt) : undefined,
        syncedAt: new Date(eventData.occurredAt)
      });
      
      console.log(`  ✓ Created event: ${event.eventId} - ${event.type}`);
      eventCount++;
    }
    
    console.log(`✅ Created ${eventCount} traceability events\n`);

    console.log('\n📊 Traceability Database Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`   Events:      ${eventCount}`);
    console.log('═══════════════════════════════════════');
    console.log('✅ Traceability events seeded successfully!\n');

    const finalCount = await TraceabilityEvent.countDocuments();
    console.log(`🔍 Final event count: ${finalCount}\n`);
    
    const eventTypes = await TraceabilityEvent.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('Event Type Distribution:');
    eventTypes.forEach(type => {
      console.log(`  ${type._id}: ${type.count}`);
    });
    
    console.log('\n✨ All done! Traceability database is ready.\n');

  } catch (error) {
    console.error('❌ Error seeding traceability events:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedTraceabilityEvents();
