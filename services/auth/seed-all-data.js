#!/usr/bin/env node

/** @fileoverview Seeds the auth service database with farms, plots, partners, orders, and summary counts. */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jani-ai-auth';
const farmSchema = new mongoose.Schema({
  ownerRole: { type: String, required: true },
  ownerIdentifier: { type: String, required: true },
  name: { type: String, required: true },
  primaryCrop: { type: String, required: true },
  locationDescription: { type: String },
  linked: { type: Boolean, default: false },
  lastSync: { type: Date },
  nextActions: { type: [String], default: [] },
  credentials: {
    registrationId: { type: String, required: true },
    pin: { type: String }
  }
}, { timestamps: true });

const plotSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  name: { type: String, required: true },
  hectares: { type: Number, required: true },
  crop: { type: String, required: true },
  stage: { type: String, required: true },
  linked: { type: Boolean, default: false },
  lastSync: { type: Date },
  sensors: {
    soilMoisture: { type: String, required: true },
    weatherStation: { type: Boolean, required: true },
    logisticsPartner: { type: String }
  },
  nextActions: { type: [String], default: [] }
}, { timestamps: true });

const partnerSchema = new mongoose.Schema({
  ownerRole: { type: String, required: true },
  ownerIdentifier: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['buyer', 'exporter', 'logistics', 'advisor'] },
  status: { type: String, required: true, enum: ['active', 'pending', 'invited'] },
  notes: { type: String, required: true }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  ownerRole: { type: String, required: true },
  ownerIdentifier: { type: String, required: true },
  reference: { type: String, required: true },
  partner: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true, enum: ['preparing', 'awaiting_pickup', 'in_transit', 'delayed', 'delivered'] },
  dueDate: { type: Date, required: true },
  quantity: { type: String, required: true },
  value: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
  highlights: { type: [String], default: [] }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  identifier: { type: String, required: true },
  profile: { type: Map, of: String, default: {} }
}, { timestamps: true });

const Farm = mongoose.model('Farm', farmSchema);
const Plot = mongoose.model('Plot', plotSchema);
const PartnerAccess = mongoose.model('PartnerAccess', partnerSchema);
const Order = mongoose.model('Order', orderSchema);
const User = mongoose.model('User', userSchema);

const seedFarms = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-farms.json'), 'utf8'));
const seedPlots = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-plots.json'), 'utf8'));
const seedPartners = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-partners.json'), 'utf8'));
const seedOrders = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-orders.json'), 'utf8'));

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({});
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user._id;
    });
    console.log(`📋 Found ${users.length} users in database\n`);

    console.log('🗑️  Clearing existing data...');
    await Farm.deleteMany({});
    await Plot.deleteMany({});
    await PartnerAccess.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data cleared\n');

    console.log('🌾 Seeding farms...');
    const farmMap = {};
    for (const farmData of seedFarms) {
      const farm = await Farm.create(farmData);
      farmMap[farmData.name] = farm._id;
      console.log(`  ✓ Created farm: ${farmData.name}`);
    }
    console.log(`✅ Created ${Object.keys(farmMap).length} farms\n`);

    console.log('📍 Seeding plots...');
    let plotCount = 0;
    for (const plotData of seedPlots) {
      const farmId = farmMap[plotData.farmName];
      if (farmId) {
        const { farmName, ...plotFields } = plotData;
        await Plot.create({ farmId, ...plotFields });
        console.log(`  ✓ Created plot: ${plotData.name} (${plotData.farmName})`);
        plotCount++;
      } else {
        console.log(`  ⚠ Warning: Farm not found for plot ${plotData.name}`);
      }
    }
    console.log(`✅ Created ${plotCount} plots\n`);

    console.log('🤝 Seeding partner relationships...');
    for (const partnerData of seedPartners) {
      await PartnerAccess.create(partnerData);
      console.log(`  ✓ Created partnership: ${partnerData.name} (${partnerData.role})`);
    }
    console.log(`✅ Created ${seedPartners.length} partner relationships\n`);

    console.log('📦 Seeding orders...');
    for (const orderData of seedOrders) {
      await Order.create(orderData);
      console.log(`  ✓ Created order: ${orderData.reference} - ${orderData.status}`);
    }
    console.log(`✅ Created ${seedOrders.length} orders\n`);

    console.log('\n📊 Database Seeding Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`   Users:       ${users.length} (existing)`);
    console.log(`   Farms:       ${Object.keys(farmMap).length}`);
    console.log(`   Plots:       ${plotCount}`);
    console.log(`   Partners:    ${seedPartners.length}`);
    console.log(`   Orders:      ${seedOrders.length}`);
    console.log('═══════════════════════════════════════');
    console.log('✅ Database seeded successfully!\n');

    console.log('🔍 Verifying database state...');
    const counts = {
      users: await User.countDocuments(),
      farms: await Farm.countDocuments(),
      plots: await Plot.countDocuments(),
      partners: await PartnerAccess.countDocuments(),
      orders: await Order.countDocuments()
    };
    
    console.log('\nFinal Counts:');
    console.log(`  Users:      ${counts.users}`);
    console.log(`  Farms:      ${counts.farms}`);
    console.log(`  Plots:      ${counts.plots}`);
    console.log(`  Partners:   ${counts.partners}`);
    console.log(`  Orders:     ${counts.orders}`);
    
    console.log('\n✨ All done! Database is ready for testing.\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedDatabase();
