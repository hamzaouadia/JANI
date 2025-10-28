import 'dotenv/config';

import mongoose, { Schema, Types, InferSchemaType } from 'mongoose';

import { MONGO_URI } from '../config';
import { Farm } from '../models/Farm';
import { Field } from '../models/Field';
import { isUserRole, type UserRole } from '../constants/userRoles';

const AUTH_MONGO_URI = process.env.AUTH_MONGO_URI ?? 'mongodb://localhost:27017/jani-ai-auth';
const args = new Set(process.argv.slice(2));
const isDryRun = args.has('--dry-run');
const shouldPrune = args.has('--prune') || args.has('--prune-orphans');

interface MigrationStats {
  farmsCreated: number;
  farmsUpdated: number;
  fieldsCreated: number;
  fieldsUpdated: number;
  farmsSkipped: number;
  fieldsSkipped: number;
  farmDeletes: number;
  fieldDeletes: number;
}

const stats: MigrationStats = {
  farmsCreated: 0,
  farmsUpdated: 0,
  fieldsCreated: 0,
  fieldsUpdated: 0,
  farmsSkipped: 0,
  fieldsSkipped: 0,
  farmDeletes: 0,
  fieldDeletes: 0
};

const authMongoose = new mongoose.Mongoose();

const authFarmSchema = new Schema(
  {
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
  },
  { collection: 'farms', timestamps: true }
);

type AuthFarm = InferSchemaType<typeof authFarmSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const authPlotSchema = new Schema(
  {
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
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
  },
  { collection: 'plots', timestamps: true }
);

type AuthPlot = InferSchemaType<typeof authPlotSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const sanitizeActions = (actions: unknown): string[] => {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim());
};

const sanitizeString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const sanitizeNullableString = (value: unknown): string | null => {
  const sanitized = sanitizeString(value);
  return sanitized ?? null;
};

async function migrate() {
  console.log(`🚚 Starting farm & field migration (dryRun=${isDryRun}, prune=${shouldPrune})`);
  console.log(`   → Auth Mongo URI: ${AUTH_MONGO_URI}`);
  console.log(`   → Operations Mongo URI: ${MONGO_URI}`);

  const operationsConn = await mongoose.connect(MONGO_URI);
  console.log(`✅ Connected to operations database (${operationsConn.connection.name})`);

  const authConn = await authMongoose.connect(AUTH_MONGO_URI);
  console.log(`✅ Connected to auth database (${authConn.connection.name})`);

  const AuthFarm = authConn.model<AuthFarm>('Farm', authFarmSchema);
  const AuthPlot = authConn.model<AuthPlot>('Plot', authPlotSchema);

  const authFarms = await AuthFarm.find().lean();
  if (!authFarms.length) {
    console.log('⚠️  No farms found in auth database. Nothing to migrate.');
    await shutdown();
    return;
  }

  const farmIds = authFarms.map((farm) => farm._id);
  const authPlots = await AuthPlot.find({ farmId: { $in: farmIds } }).lean();

  const plotsByFarm = new Map<string, AuthPlot[]>();
  for (const plot of authPlots) {
    const key = plot.farmId.toString();
    const bucket = plotsByFarm.get(key);
    if (bucket) {
      bucket.push(plot);
    } else {
      plotsByFarm.set(key, [plot]);
    }
  }

  const migratedFarmIds = new Set<string>();
  const migratedFieldIds = new Set<string>();

  for (const farm of authFarms) {
    const legacyId = farm._id.toString();
    migratedFarmIds.add(legacyId);

    const plots = plotsByFarm.get(legacyId) ?? [];
    const totalHectares = plots.reduce((sum, plot) => sum + (Number(plot.hectares) || 0), 0);
    const registrationId = sanitizeString(farm.credentials?.registrationId);

    if (!registrationId) {
      console.warn(`⚠️  Skipping farm ${farm.name} (${legacyId}) — missing registrationId`);
      stats.farmsSkipped += 1;
      continue;
    }

    if (!isUserRole(farm.ownerRole)) {
      console.warn(`⚠️  Skipping farm ${farm.name} (${legacyId}) — unsupported ownerRole ${farm.ownerRole}`);
      stats.farmsSkipped += 1;
      continue;
    }

    const ownerRole: UserRole = farm.ownerRole;
    const baseFarm = {
      legacyId,
      ownerRole,
      ownerIdentifier: sanitizeString(farm.ownerIdentifier) ?? farm.ownerIdentifier,
      name: sanitizeString(farm.name) ?? farm.name,
      primaryCrop: sanitizeString(farm.primaryCrop) ?? farm.primaryCrop,
      locationDescription: sanitizeNullableString(farm.locationDescription),
      linked: Boolean(farm.linked),
      lastSync: farm.lastSync ?? null,
      nextActions: sanitizeActions(farm.nextActions),
      credentials: {
        registrationId,
        pin: sanitizeNullableString(farm.credentials?.pin)
      },
      sizeHectares: Number.isFinite(totalHectares) && totalHectares > 0 ? Number(totalHectares.toFixed(2)) : undefined
    };

    const existingFarm = await Farm.findOne({ legacyId });
    let operationsFarmId: Types.ObjectId | null = existingFarm ? (existingFarm._id as Types.ObjectId) : null;

    if (isDryRun) {
      if (existingFarm) {
        stats.farmsUpdated += 1;
        operationsFarmId = existingFarm._id as Types.ObjectId;
      } else {
        stats.farmsCreated += 1;
        operationsFarmId = new Types.ObjectId();
      }
    } else if (existingFarm) {
      existingFarm.legacyId = legacyId;
      existingFarm.ownerRole = baseFarm.ownerRole;
      existingFarm.ownerIdentifier = baseFarm.ownerIdentifier;
      existingFarm.name = baseFarm.name;
      existingFarm.primaryCrop = baseFarm.primaryCrop;
      existingFarm.locationDescription = baseFarm.locationDescription;
      existingFarm.linked = baseFarm.linked;
      existingFarm.lastSync = baseFarm.lastSync ?? null;
      existingFarm.nextActions = baseFarm.nextActions;
      existingFarm.credentials = baseFarm.credentials;
      if (baseFarm.sizeHectares !== undefined) {
        existingFarm.sizeHectares = baseFarm.sizeHectares;
      }

      if (!existingFarm.status) {
        existingFarm.status = 'active';
      }

      await existingFarm.save();
      stats.farmsUpdated += 1;
      operationsFarmId = existingFarm._id as Types.ObjectId;
    } else {
      const created = await Farm.create({
        ...baseFarm,
        status: 'active',
        tags: []
      });
      stats.farmsCreated += 1;
      operationsFarmId = created._id as Types.ObjectId;
    }

    if (!operationsFarmId) {
      console.warn(`⚠️  Unable to resolve operations farm id for ${legacyId}. Skipping related fields.`);
      stats.fieldsSkipped += plots.length;
      continue;
    }

    for (const plot of plots) {
      const fieldLegacyId = plot._id.toString();
      migratedFieldIds.add(fieldLegacyId);

      const soilMoisture = sanitizeString(plot.sensors?.soilMoisture);
      if (!soilMoisture) {
        console.warn(`⚠️  Skipping plot ${plot.name} (${fieldLegacyId}) — missing soilMoisture sensor id`);
        stats.fieldsSkipped += 1;
        continue;
      }

      const baseField = {
        legacyId: fieldLegacyId,
        farm: operationsFarmId,
        name: sanitizeString(plot.name) ?? plot.name,
        hectares: Number(plot.hectares) || 0,
        crop: sanitizeString(plot.crop) ?? plot.crop,
        stage: sanitizeString(plot.stage) ?? plot.stage,
        linked: Boolean(plot.linked),
        lastSync: plot.lastSync ?? null,
        sensors: {
          soilMoisture,
          weatherStation: Boolean(plot.sensors?.weatherStation),
          logisticsPartner: sanitizeNullableString(plot.sensors?.logisticsPartner)
        },
        nextActions: sanitizeActions(plot.nextActions)
      };

      const existingField = await Field.findOne({ legacyId: fieldLegacyId });

      if (isDryRun) {
        if (existingField) {
          stats.fieldsUpdated += 1;
        } else {
          stats.fieldsCreated += 1;
        }
        continue;
      }

      if (existingField) {
        existingField.farm = operationsFarmId;
        existingField.name = baseField.name;
        existingField.hectares = baseField.hectares;
        existingField.crop = baseField.crop;
        existingField.stage = baseField.stage;
        existingField.linked = baseField.linked;
        existingField.lastSync = baseField.lastSync ?? null;
        existingField.sensors = baseField.sensors;
        existingField.nextActions = baseField.nextActions;
        existingField.legacyId = baseField.legacyId;

        await existingField.save();
        stats.fieldsUpdated += 1;
      } else {
        await Field.create(baseField);
        stats.fieldsCreated += 1;
      }
    }
  }

  if (shouldPrune) {
    await pruneOrphans(migratedFarmIds, migratedFieldIds);
  }

  await shutdown();

  console.log('\n📊 Migration summary');
  console.log(`   Farms created: ${stats.farmsCreated}`);
  console.log(`   Farms updated: ${stats.farmsUpdated}`);
  console.log(`   Farms skipped: ${stats.farmsSkipped}`);
  console.log(`   Fields created: ${stats.fieldsCreated}`);
  console.log(`   Fields updated: ${stats.fieldsUpdated}`);
  console.log(`   Fields skipped: ${stats.fieldsSkipped}`);
  if (shouldPrune) {
    console.log(`   Orphan farms removed: ${stats.farmDeletes}`);
    console.log(`   Orphan fields removed: ${stats.fieldDeletes}`);
  }

  if (isDryRun) {
    console.log('\nℹ️  Dry run mode — no changes were written to the operations database.');
  }
}

async function pruneOrphans(migratedFarmIds: Set<string>, migratedFieldIds: Set<string>) {
  const farmFilter = {
    legacyId: { $exists: true, $ne: null, $nin: Array.from(migratedFarmIds) }
  } as const;

  const fieldFilter = {
    legacyId: { $exists: true, $ne: null, $nin: Array.from(migratedFieldIds) }
  } as const;

  const orphanFields = await Field.find(fieldFilter).lean();
  const orphanFarms = await Farm.find(farmFilter).lean();

  if (!orphanFields.length && !orphanFarms.length) {
    return;
  }

  if (isDryRun) {
    if (orphanFields.length) {
      console.log(`🧹 Would remove ${orphanFields.length} orphan fields (legacyId mismatch)`);
    }
    if (orphanFarms.length) {
      console.log(`🧹 Would remove ${orphanFarms.length} orphan farms (legacyId mismatch)`);
    }
    return;
  }

  if (orphanFields.length) {
    const { deletedCount } = await Field.deleteMany(fieldFilter);
    stats.fieldDeletes += deletedCount ?? 0;
    console.log(`🧹 Removed ${deletedCount ?? 0} orphan field(s)`);
  }

  if (orphanFarms.length) {
    const { deletedCount } = await Farm.deleteMany(farmFilter);
    stats.farmDeletes += deletedCount ?? 0;
    console.log(`🧹 Removed ${deletedCount ?? 0} orphan farm(s)`);
  }
}

async function shutdown() {
  await Promise.all([
    mongoose.disconnect().catch(() => undefined),
    authMongoose.disconnect().catch(() => undefined)
  ]);
}

migrate().catch(async (error) => {
  console.error('❌ Migration failed', error);
  await shutdown();
  process.exit(1);
});
