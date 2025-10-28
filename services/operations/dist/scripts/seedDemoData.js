"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const Farm_1 = require("../models/Farm");
const Field_1 = require("../models/Field");
const Activity_1 = require("../models/Activity");
const objectId_1 = require("../utils/objectId");
const farms = [
    {
        name: 'Sunrise Valley Estate',
        location: {
            address: 'Nakuru County, Kenya',
            coordinates: [36.0662, -0.3031]
        },
        sizeHectares: 420,
        status: 'active',
        tags: ['export', 'avocado', 'irrigated']
    },
    {
        name: 'Green Plains Cooperative',
        location: {
            address: 'Eldoret, Uasin Gishu',
            coordinates: [35.2698, 0.5143]
        },
        sizeHectares: 185,
        status: 'active',
        tags: ['maize', 'training-hub']
    },
    {
        name: 'Riverbend Demo Farm',
        location: {
            address: 'Murang’a County, Kenya',
            coordinates: [36.9596, -0.6996]
        },
        sizeHectares: 92,
        status: 'inactive',
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
            type: 'Polygon',
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
            type: 'Polygon',
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
            type: 'Polygon',
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
        status: 'planned',
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
        status: 'in_progress',
        inputs: [{ name: 'Calcium nitrate', quantity: 25, unit: 'kg' }]
    },
    {
        farmName: 'Green Plains Cooperative',
        type: 'Field training session',
        description: 'Precision planting refresher for cooperative members',
        scheduledDate: '2025-10-30',
        status: 'planned',
        inputs: [{ name: 'Training manuals', quantity: 45, unit: 'units' }]
    }
];
async function seedFarms() {
    const farmIdMap = new Map();
    for (const farm of farms) {
        const doc = await Farm_1.Farm.findOneAndUpdate({ name: farm.name }, farm, { upsert: true, new: true, setDefaultsOnInsert: true });
        if (!doc?._id) {
            throw new Error(`Upsert for farm ${farm.name} did not return an identifier`);
        }
        farmIdMap.set(farm.name, doc._id.toString());
    }
    console.log(`🌾 Seeded ${farmIdMap.size} farm documents`);
    return farmIdMap;
}
async function seedFields(farmIdMap) {
    const fieldIdMap = new Map();
    for (const field of fields) {
        const farmId = farmIdMap.get(field.farmName);
        if (!farmId) {
            console.warn(`⚠️ Skipping field ${field.name} – farm not found`);
            continue;
        }
        const doc = await Field_1.Field.findOneAndUpdate({ farm: (0, objectId_1.toObjectId)(farmId), name: field.name }, {
            farm: (0, objectId_1.toObjectId)(farmId),
            name: field.name,
            crop: field.crop,
            plantingDate: field.plantingDate ? new Date(field.plantingDate) : undefined,
            boundary: field.boundary
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        if (!doc?._id) {
            throw new Error(`Upsert for field ${field.name} did not return an identifier`);
        }
        fieldIdMap.set(`${field.farmName}:${field.name}`, doc._id.toString());
    }
    console.log(`🗺️  Seeded ${fieldIdMap.size} field documents`);
    return fieldIdMap;
}
async function seedActivities(farmIdMap, fieldIdMap) {
    for (const activity of activities) {
        const farmId = farmIdMap.get(activity.farmName);
        if (!farmId) {
            console.warn(`⚠️ Skipping activity ${activity.type} – farm not found`);
            continue;
        }
        const fieldId = activity.fieldName
            ? fieldIdMap.get(`${activity.farmName}:${activity.fieldName}`)
            : undefined;
        await Activity_1.Activity.findOneAndUpdate({
            farm: (0, objectId_1.toObjectId)(farmId),
            field: fieldId ? (0, objectId_1.toObjectId)(fieldId) : undefined,
            type: activity.type,
            scheduledDate: new Date(activity.scheduledDate)
        }, {
            farm: (0, objectId_1.toObjectId)(farmId),
            field: fieldId ? (0, objectId_1.toObjectId)(fieldId) : undefined,
            type: activity.type,
            description: activity.description,
            scheduledDate: new Date(activity.scheduledDate),
            status: activity.status,
            inputs: activity.inputs
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log(`✅ Seeded ${activities.length} activity documents`);
}
async function seed() {
    await mongoose_1.default.connect(config_1.MONGO_URI);
    console.log(`Connected to MongoDB at ${config_1.MONGO_URI}`);
    const farmMap = await seedFarms();
    const fieldMap = await seedFields(farmMap);
    await seedActivities(farmMap, fieldMap);
    await mongoose_1.default.disconnect();
    console.log('Seeding complete. Connection closed.');
}
seed().catch(async (error) => {
    console.error('❌ Failed to seed operations demo data', error);
    await mongoose_1.default.disconnect().catch(() => {
        /* noop */
    });
    process.exit(1);
});
