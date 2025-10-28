import mongoose from 'mongoose';
import { MONGO_URI } from '../config';
import { Types } from 'mongoose';
import { Farm } from '../models/Farm';
import { Field } from '../models/Field';
import { Activity } from '../models/Activity';
import { toObjectId } from '../utils/objectId';

const farms = [
  {
    name: 'Sunrise Valley Estate',
    location: {
      address: 'Nakuru County, Kenya',
      coordinates: [36.0662, -0.3031] as [number, number]
    },
    sizeHectares: 420,
    status: 'active' as const,
    tags: ['export', 'avocado', 'irrigated']
  },
  {
    name: 'Green Plains Cooperative',
    location: {
      address: 'Eldoret, Uasin Gishu',
      coordinates: [35.2698, 0.5143] as [number, number]
    },
    sizeHectares: 185,
    status: 'active' as const,
    tags: ['maize', 'training-hub']
  },
  {
    name: 'Riverbend Demo Farm',
    location: {
      address: 'Murang’a County, Kenya',
      coordinates: [36.9596, -0.6996] as [number, number]
    },
    sizeHectares: 92,
    status: 'inactive' as const,
    tags: ['tea', 'under-maintenance']
  }
];

const fields = [
  {
    farmName: 'Sunrise Valley Estate',
    name: 'Block A – Avocados',
    crop: 'Hass Avocado',
    plantingDate: '2022-04-12',
    boundary: {
      type: 'Polygon' as const,
      coordinates: [
        [
          [36.0607, -0.2987],
          [36.0645, -0.2987],
          [36.0645, -0.3024],
          [36.0607, -0.3024],
          [36.0607, -0.2987]
        ]
      ]
    }
  },
  {
    farmName: 'Sunrise Valley Estate',
    name: 'Block B – Nursery',
    crop: 'Seedlings',
    plantingDate: '2023-08-01',
    boundary: {
      type: 'Polygon' as const,
      coordinates: [
        [
          [36.0648, -0.3018],
          [36.0668, -0.3018],
          [36.0668, -0.3041],
          [36.0648, -0.3041],
          [36.0648, -0.3018]
        ]
      ]
    }
  },
  {
    farmName: 'Green Plains Cooperative',
    name: 'North Strip',
    crop: 'Maize',
    plantingDate: '2024-02-18',
    boundary: {
      type: 'Polygon' as const,
      coordinates: [
        [
          [35.2649, 0.5191],
          [35.2687, 0.5191],
          [35.2687, 0.5155],
          [35.2649, 0.5155],
          [35.2649, 0.5191]
        ]
      ]
    }
  }
];

const activities = [
  {
    farmName: 'Sunrise Valley Estate',
    fieldName: 'Block A – Avocados',
    type: 'Irrigation cycle',
    description: 'Micro-sprinkler run 6 hours',
    scheduledDate: '2025-10-26',
    status: 'planned' as const,
    inputs: [
      { name: 'Water', quantity: 180, unit: 'm³' },
      { name: 'Energy (diesel)', quantity: 35, unit: 'L' }
    ]
  },
  {
    farmName: 'Sunrise Valley Estate',
    fieldName: 'Block B – Nursery',
    type: 'Foliar feeding',
    description: 'Apply calcium nitrate foliar spray',
    scheduledDate: '2025-10-20',
    status: 'in_progress' as const,
    inputs: [{ name: 'Calcium nitrate', quantity: 25, unit: 'kg' }]
  },
  {
    farmName: 'Green Plains Cooperative',
    type: 'Field training session',
    description: 'Precision planting refresher for cooperative members',
    scheduledDate: '2025-10-30',
    status: 'planned' as const,
    inputs: [{ name: 'Training manuals', quantity: 45, unit: 'units' }]
  }
];

async function seedFarms() {
  const farmIdMap = new Map<string, string>();

  for (const farm of farms) {
    const doc = await Farm.findOneAndUpdate(
      { name: farm.name },
      farm,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!doc?._id) {
      throw new Error(`Upsert for farm ${farm.name} did not return an identifier`);
    }

    farmIdMap.set(farm.name, (doc._id as Types.ObjectId).toString());
  }

  console.log(`🌾 Seeded ${farmIdMap.size} farm documents`);
  return farmIdMap;
}

async function seedFields(farmIdMap: Map<string, string>) {
  const fieldIdMap = new Map<string, string>();

  for (const field of fields) {
    const farmId = farmIdMap.get(field.farmName);
    if (!farmId) {
      console.warn(`⚠️ Skipping field ${field.name} – farm not found`);
      continue;
    }

    const doc = await Field.findOneAndUpdate(
      { farm: toObjectId(farmId), name: field.name },
      {
        farm: toObjectId(farmId),
        name: field.name,
        crop: field.crop,
        plantingDate: field.plantingDate ? new Date(field.plantingDate) : undefined,
        boundary: field.boundary
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!doc?._id) {
      throw new Error(`Upsert for field ${field.name} did not return an identifier`);
    }

    fieldIdMap.set(
      `${field.farmName}:${field.name}`,
      (doc._id as Types.ObjectId).toString()
    );
  }

  console.log(`🗺️  Seeded ${fieldIdMap.size} field documents`);
  return fieldIdMap;
}

async function seedActivities(
  farmIdMap: Map<string, string>,
  fieldIdMap: Map<string, string>
) {
  for (const activity of activities) {
    const farmId = farmIdMap.get(activity.farmName);
    if (!farmId) {
      console.warn(`⚠️ Skipping activity ${activity.type} – farm not found`);
      continue;
    }

    const fieldId = activity.fieldName
      ? fieldIdMap.get(`${activity.farmName}:${activity.fieldName}`)
      : undefined;

    await Activity.findOneAndUpdate(
      {
        farm: toObjectId(farmId),
        field: fieldId ? toObjectId(fieldId) : undefined,
        type: activity.type,
        scheduledDate: new Date(activity.scheduledDate)
      },
      {
        farm: toObjectId(farmId),
        field: fieldId ? toObjectId(fieldId) : undefined,
        type: activity.type,
        description: activity.description,
        scheduledDate: new Date(activity.scheduledDate),
        status: activity.status,
        inputs: activity.inputs
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`✅ Seeded ${activities.length} activity documents`);
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to MongoDB at ${MONGO_URI}`);

  const farmMap = await seedFarms();
  const fieldMap = await seedFields(farmMap);
  await seedActivities(farmMap, fieldMap);

  await mongoose.disconnect();
  console.log('Seeding complete. Connection closed.');
}

seed().catch(async (error) => {
  console.error('❌ Failed to seed operations demo data', error);
  await mongoose.disconnect().catch(() => {
    /* noop */
  });
  process.exit(1);
});
