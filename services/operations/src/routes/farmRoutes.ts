import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { Types } from 'mongoose';
import { Field } from '../models/Field';
import { Farm } from '../models/Farm';
import { isUserRole, USER_ROLES } from '../constants/userRoles';
import { isValidObjectId, toObjectId } from '../utils/objectId';
import type { FieldDocument } from '../models/Field';
import type { FarmDocument } from '../models/Farm';

const router = Router();

const locationSchema = z
  .object({
    address: z.string().optional(),
    coordinates: z
      .tuple([z.number(), z.number()])
      .refine(
        ([lng, lat]: [number, number]) =>
          lng >= -180 &&
          lng <= 180 &&
          lat >= -90 &&
          lat <= 90,
        'Coordinates must be [lng, lat] within valid ranges'
      )
      .optional()
  })
  .optional();

const credentialsSchema = z.object({
  registrationId: z.string().min(1),
  pin: z.string().optional()
});

const farmBaseSchema = z.object({
  ownerRole: z
    .string()
    .refine((value) => isUserRole(value), 'Invalid owner role')
    .optional(),
  ownerIdentifier: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  primaryCrop: z.string().min(1).optional(),
  location: locationSchema,
  locationDescription: z.string().optional(),
  linked: z.coerce.boolean().optional(),
  lastSync: z.coerce.date().optional(),
  nextActions: z.array(z.string()).optional(),
  credentials: credentialsSchema.partial().optional(),
  sizeHectares: z.number().nonnegative().optional(),
  status: z.enum(['active', 'inactive', 'dormant']).optional(),
  tags: z.array(z.string()).optional()
});

const createFarmSchema = farmBaseSchema.extend({
  ownerRole: z.enum(USER_ROLES),
  ownerIdentifier: z.string().min(1),
  name: z.string().min(1),
  primaryCrop: z.string().min(1),
  credentials: credentialsSchema
});

const searchQuerySchema = z
  .object({
    q: z
      .string()
      .trim()
      .min(2, 'Search query must have at least 2 characters'),
    ownerRole: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || isUserRole(value), 'Invalid owner role'),
    ownerIdentifier: z.string().trim().optional()
  })
  .strict();

const linkRequestSchema = z
  .object({
    accessCode: z
      .string()
      .trim()
      .min(4, 'Access code must have at least 4 characters')
      .max(64, 'Access code must be 64 characters or fewer')
  })
  .strict();

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

type FarmPayload = z.infer<typeof createFarmSchema>;

type FarmLike = Pick<
  FarmDocument,
  | 'legacyId'
  | 'ownerRole'
  | 'ownerIdentifier'
  | 'name'
  | 'primaryCrop'
  | 'locationDescription'
  | 'linked'
  | 'lastSync'
  | 'nextActions'
  | 'credentials'
  | 'sizeHectares'
  | 'status'
  | 'tags'
> & { _id: Types.ObjectId };

type FieldLike = Pick<
  FieldDocument,
  | 'legacyId'
  | 'farm'
  | 'name'
  | 'hectares'
  | 'crop'
  | 'stage'
  | 'linked'
  | 'lastSync'
  | 'sensors'
  | 'nextActions'
> & { _id: Types.ObjectId };

const normalizeFarm = (farm: FarmDocument | FarmLike): FarmLike =>
  'toObject' in farm ? (farm.toObject() as FarmLike) : farm;

const normalizeField = (field: FieldDocument | FieldLike): FieldLike =>
  'toObject' in field ? (field.toObject() as FieldLike) : field;

const toFieldDto = (fieldInput: FieldDocument | FieldLike) => {
  const field = normalizeField(fieldInput);

  return {
  id: field._id.toString(),
  name: field.name,
  hectares: field.hectares,
  crop: field.crop,
  stage: field.stage,
  linked: field.linked,
  lastSync: field.lastSync ?? null,
  sensors: {
    soilMoisture: field.sensors?.soilMoisture ?? '',
    weatherStation: Boolean(field.sensors?.weatherStation),
    logisticsPartner: field.sensors?.logisticsPartner ?? null
  },
  nextActions: field.nextActions ?? []
  };
};

const buildFarmDto = (
  farmInput: FarmDocument | FarmLike,
  plotsInput: Array<FieldDocument | FieldLike>
) => {
  const farm = normalizeFarm(farmInput);
  const plots = plotsInput.map((plot) => normalizeField(plot));
  const totalHectares = plots.reduce((sum, plot) => sum + (plot.hectares ?? 0), 0);
  const linkedPlots = plots.filter((plot) => plot.linked).length;
  const pendingTasks = (farm.nextActions?.length ?? 0) +
    plots.reduce((sum, plot) => sum + (plot.nextActions?.length ?? 0), 0);

  return {
    id: farm._id.toString(),
    ownerRole: farm.ownerRole,
    ownerIdentifier: farm.ownerIdentifier,
    name: farm.name,
    primaryCrop: farm.primaryCrop,
    locationDescription: farm.locationDescription ?? null,
    linked: farm.linked,
    lastSync: farm.lastSync ?? null,
    credentials: {
      registrationId: farm.credentials?.registrationId ?? '',
      pin: farm.credentials?.pin ?? null
    },
    nextActions: farm.nextActions ?? [],
    status: farm.status,
    tags: farm.tags ?? [],
    summary: {
      totalPlots: plots.length,
      linkedPlots,
      totalHectares: Number(totalHectares.toFixed(2)),
      pendingTasks
    },
    plots: plots.map(toFieldDto)
  };
};

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, ownerRole, ownerIdentifier, linked } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof status === 'string') {
      filter.status = status;
    }

    if (typeof ownerRole === 'string' && isUserRole(ownerRole)) {
      filter.ownerRole = ownerRole;
    }

    if (typeof ownerIdentifier === 'string' && ownerIdentifier.trim().length > 0) {
      filter.ownerIdentifier = ownerIdentifier.trim();
    }

    if (typeof linked === 'string') {
      if (['true', 'false'].includes(linked.toLowerCase())) {
        filter.linked = linked.toLowerCase() === 'true';
      }
    }

    const farms = await Farm.find(filter);
    const farmIds = farms.map((farm) => normalizeFarm(farm)._id);
    const fields = await Field.find({ farm: { $in: farmIds } });

  const fieldsByFarm = new Map<string, FieldLike[]>();
    for (const fieldDoc of fields) {
      const field = normalizeField(fieldDoc);
      const key = field.farm.toString();
      const bucket = fieldsByFarm.get(key);
      if (bucket) {
        bucket.push(field);
      } else {
        fieldsByFarm.set(key, [field]);
      }
    }

    const payload = farms.map((farm) => {
      const normalized = normalizeFarm(farm);
      const relatedFields = fieldsByFarm.get(normalized._id.toString()) ?? [];
      return buildFarmDto(normalized, relatedFields);
    });
    res.json({ data: payload });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/search',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = searchQuerySchema.safeParse({
        q: req.query.q,
        ownerRole: req.query.ownerRole,
        ownerIdentifier: req.query.ownerIdentifier
      });

      if (!parseResult.success) {
        const issue = parseResult.error.issues[0];
        return res.status(400).json({ message: issue?.message ?? 'Invalid search query' });
      }

      const { q, ownerRole: ownerRoleFilter, ownerIdentifier: ownerIdentifierFilter } = parseResult.data;
      const limitRaw = typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : undefined;
      const limit =
        typeof limitRaw === 'number' && Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 25) : 10;

      const normalizedQuery = q.trim();
      const regex = new RegExp(escapeRegex(normalizedQuery).replace(/\s+/g, '\\s+'), 'i');

      const filter: Record<string, unknown> = {
        $or: [
          { name: regex },
          { ownerIdentifier: regex },
          { primaryCrop: regex },
          { 'credentials.registrationId': regex }
        ]
      };

      if (ownerRoleFilter) {
        filter.ownerRole = ownerRoleFilter;
      }

      if (ownerIdentifierFilter) {
        filter.ownerIdentifier = ownerIdentifierFilter;
      }

      const farms = await Farm.find(filter, {
        name: 1,
        ownerRole: 1,
        ownerIdentifier: 1,
        status: 1,
        linked: 1,
        primaryCrop: 1,
        updatedAt: 1,
        credentials: 1
      })
        .sort({ linked: 1, updatedAt: -1 })
        .limit(limit)
        .lean();

      const payload = farms
        .filter((farm) => typeof farm.credentials?.registrationId === 'string' && farm.credentials.registrationId.trim().length > 0)
        .map((farm) => ({
          id: farm._id.toString(),
          name: farm.name,
          identifier: farm.credentials!.registrationId,
          status: farm.status,
          linked: Boolean(farm.linked),
          ownerRole: farm.ownerRole,
          ownerIdentifier: farm.ownerIdentifier,
          primaryCrop: farm.primaryCrop,
          updatedAt: farm.updatedAt ? farm.updatedAt.toISOString() : null
        }));

      res.json({ data: payload });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createFarmSchema.parse(req.body) as FarmPayload;
    const farm = await Farm.create({
      ownerRole: payload.ownerRole,
      ownerIdentifier: payload.ownerIdentifier.trim(),
      name: payload.name,
      primaryCrop: payload.primaryCrop,
      location: payload.location,
      locationDescription: payload.locationDescription,
      linked: payload.linked ?? false,
      lastSync: payload.lastSync,
      nextActions: payload.nextActions ?? [],
      credentials: {
        registrationId: payload.credentials.registrationId,
        pin: payload.credentials.pin ?? null
      },
      sizeHectares: payload.sizeHectares,
      status: payload.status ?? 'active',
      tags: payload.tags ?? []
    });

    const created = await Farm.findById(farm._id);
    if (!created) {
      return res.status(500).json({ message: 'Failed to load created farm' });
    }

    res.status(201).json({ data: buildFarmDto(created, []) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid farm id' });
    }

  const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

  const plots = await Field.find({ farm: farm._id });
    res.json({ data: buildFarmDto(farm, plots) });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/:id/link',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid farm id' });
      }

      const parseResult = linkRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        const issue = parseResult.error.issues[0];
        return res.status(400).json({ message: issue?.message ?? 'Invalid request body' });
      }

      const accessCode = parseResult.data.accessCode.trim().toUpperCase();

      const farm = await Farm.findById(id);
      if (!farm) {
        return res.status(404).json({ message: 'Farm not found' });
      }

      const storedPin = farm.credentials?.pin?.trim();
      if (!storedPin) {
        return res.status(400).json({ message: 'Farm does not have an access code configured' });
      }

      if (storedPin.toUpperCase() !== accessCode) {
        return res.status(403).json({ message: 'Invalid access code' });
      }

      const linkageAction = 'Notify partners about new linkage';
      farm.linked = true;
      farm.lastSync = new Date();
      if (!farm.nextActions.includes(linkageAction)) {
        farm.nextActions.push(linkageAction);
      }

      await farm.save();

      const [freshFarm, plots] = await Promise.all([
        Farm.findById(id),
        Field.find({ farm: toObjectId(id) })
      ]);

      if (!freshFarm) {
        return res.status(404).json({ message: 'Farm not found after linking' });
      }

      res.json({ data: buildFarmDto(freshFarm, plots) });
    } catch (error) {
      next(error);
    }
  }
);

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid farm id' });
    }

    const payload = farmBaseSchema.parse(req.body);
    const update: Record<string, unknown> = {};

    if (Object.prototype.hasOwnProperty.call(payload, 'ownerRole')) {
      update.ownerRole = payload.ownerRole;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'ownerIdentifier')) {
      update.ownerIdentifier = payload.ownerIdentifier?.trim();
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'name')) {
      update.name = payload.name?.trim();
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'primaryCrop')) {
      update.primaryCrop = payload.primaryCrop?.trim();
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'location')) {
      update.location = payload.location;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'locationDescription')) {
      update.locationDescription = payload.locationDescription;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'linked')) {
      update.linked = payload.linked;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'lastSync')) {
      update.lastSync = payload.lastSync ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'nextActions')) {
      update.nextActions = payload.nextActions ?? [];
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'sizeHectares')) {
      update.sizeHectares = payload.sizeHectares;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'status')) {
      update.status = payload.status;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'tags')) {
      update.tags = payload.tags ?? [];
    }

    if (payload.credentials) {
      const credentialsUpdate: Record<string, unknown> = {};

      if (Object.prototype.hasOwnProperty.call(payload.credentials, 'registrationId')) {
        credentialsUpdate.registrationId = payload.credentials.registrationId;
      }

      if (Object.prototype.hasOwnProperty.call(payload.credentials, 'pin')) {
        credentialsUpdate.pin = payload.credentials.pin ?? null;
      }

      if (Object.keys(credentialsUpdate).length > 0) {
        update.credentials = credentialsUpdate;
      }
    }

    const farm = await Farm.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

  const plots = await Field.find({ farm: farm._id });
    res.json({ data: buildFarmDto(farm, plots) });
  } catch (error) {
    next(error);
  }
});

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid farm id' });
    }

  const farm = await Farm.findByIdAndDelete(id);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
  }
);

router.get(
  '/:id/summary',
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid farm id' });
    }

  const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

  const plots = await Field.find({ farm: farm._id });
    res.json({ data: buildFarmDto(farm, plots).summary });
  } catch (error) {
    next(error);
  }
});

export default router;
