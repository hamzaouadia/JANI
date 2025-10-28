import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Field } from '../models/Field';
import { Farm } from '../models/Farm';
import { isValidObjectId, toObjectId } from '../utils/objectId';

const router = Router();

const coordinateTuple = z.tuple([z.number(), z.number()]);
const linearRingSchema = z.array(coordinateTuple).min(4);

const polygonSchema = z.object({
  type: z.literal('Polygon').optional(),
  coordinates: z.array(linearRingSchema)
});

const multiPolygonSchema = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(linearRingSchema))
});

const boundarySchema = z.union([polygonSchema, multiPolygonSchema]);

const sensorsSchema = z.object({
  soilMoisture: z.string().min(1),
  weatherStation: z.coerce.boolean(),
  logisticsPartner: z.string().min(1).optional()
});

const baseFieldSchema = z.object({
  name: z.string().min(1).optional(),
  hectares: z.number().nonnegative().optional(),
  crop: z.string().min(1).optional(),
  stage: z.string().min(1).optional(),
  linked: z.coerce.boolean().optional(),
  lastSync: z.coerce.date().optional(),
  sensors: sensorsSchema.optional(),
  nextActions: z.array(z.string()).optional(),
  boundary: boundarySchema.optional()
});

const createFieldSchema = baseFieldSchema.extend({
  farmId: z.string().min(1),
  name: z.string().min(1),
  hectares: z.number().nonnegative(),
  crop: z.string().min(1),
  stage: z.string().min(1),
  sensors: sensorsSchema
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { farmId } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof farmId === 'string') {
      if (!isValidObjectId(farmId)) {
        return res.status(400).json({ message: 'Invalid farm id' });
      }
      filter.farm = toObjectId(farmId);
    }

    const fields = await Field.find(filter).populate('farm', 'name status').lean();
    res.json({ data: fields });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createFieldSchema.parse(req.body);

    if (!isValidObjectId(payload.farmId)) {
      return res.status(400).json({ message: 'Invalid farm id' });
    }

    const farm = await Farm.findById(payload.farmId).lean();
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const field = await Field.create({
      farm: toObjectId(payload.farmId),
      name: payload.name,
      hectares: payload.hectares,
      crop: payload.crop,
      stage: payload.stage,
      linked: payload.linked ?? false,
      lastSync: payload.lastSync,
      sensors: payload.sensors,
      nextActions: payload.nextActions ?? [],
      boundary: payload.boundary
    });

    res.status(201).json({ data: field });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid field id' });
    }

    const field = await Field.findById(id).populate('farm', 'name status').lean();
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    res.json({ data: field });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid field id' });
    }

    const payload = baseFieldSchema.parse(req.body);

    const update: Record<string, unknown> = {};

    if (Object.prototype.hasOwnProperty.call(payload, 'name')) {
      update.name = payload.name;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'hectares')) {
      update.hectares = payload.hectares;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'crop')) {
      update.crop = payload.crop;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'stage')) {
      update.stage = payload.stage;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'linked')) {
      update.linked = payload.linked;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'lastSync')) {
      update.lastSync = payload.lastSync;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'sensors')) {
      update.sensors = payload.sensors;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'nextActions')) {
      update.nextActions = payload.nextActions ?? [];
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'boundary')) {
      const boundary = payload.boundary;
      update.boundary = boundary
        ? { type: boundary.type ?? 'Polygon', coordinates: boundary.coordinates }
        : undefined;
    }

    const field = await Field.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    }).lean();

    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    res.json({ data: field });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid field id' });
    }

    const field = await Field.findByIdAndDelete(id).lean();
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id/boundary',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid field id' });
      }

      const field = await Field.findById(id).select('boundary').lean();
      if (!field) {
        return res.status(404).json({ message: 'Field not found' });
      }

      res.json({ data: field.boundary ?? null });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id/boundary',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid field id' });
      }

      const boundary = boundarySchema.parse(req.body);

      const field = await Field.findByIdAndUpdate(
        id,
        { boundary: { type: boundary.type ?? 'Polygon', coordinates: boundary.coordinates } },
        { new: true, runValidators: true }
      ).lean();

      if (!field) {
        return res.status(404).json({ message: 'Field not found' });
      }

      res.json({ data: field.boundary });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
