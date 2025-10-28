import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Activity } from '../models/Activity';
import { Farm } from '../models/Farm';
import { Field } from '../models/Field';
import { isValidObjectId, toObjectId } from '../utils/objectId';

const router = Router();

const activityInputSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().nonnegative().optional(),
  unit: z.string().optional()
});

const baseActivitySchema = z.object({
  fieldId: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  description: z.string().optional(),
  scheduledDate: z.coerce.date().optional(),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']).optional(),
  inputs: z.array(activityInputSchema).optional()
});

const createActivitySchema = baseActivitySchema.extend({
  farmId: z.string().min(1),
  type: z.string().min(1)
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { farmId, fieldId, status } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof farmId === 'string') {
      if (!isValidObjectId(farmId)) {
        return res.status(400).json({ message: 'Invalid farm id' });
      }
      filter.farm = toObjectId(farmId);
    }

    if (typeof fieldId === 'string') {
      if (!isValidObjectId(fieldId)) {
        return res.status(400).json({ message: 'Invalid field id' });
      }
      filter.field = toObjectId(fieldId);
    }

    if (typeof status === 'string') {
      filter.status = status;
    }

    const activities = await Activity.find(filter)
      .populate('farm', 'name')
      .populate('field', 'name crop')
      .sort({ scheduledDate: -1 })
      .lean();

    res.json({ data: activities });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createActivitySchema.parse(req.body);

    if (!isValidObjectId(payload.farmId)) {
      return res.status(400).json({ message: 'Invalid farm id' });
    }

    const farm = await Farm.findById(payload.farmId).lean();
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    let fieldId: string | undefined;
    if (payload.fieldId) {
      if (!isValidObjectId(payload.fieldId)) {
        return res.status(400).json({ message: 'Invalid field id' });
      }
      const field = await Field.findById(payload.fieldId).lean();
      if (!field) {
        return res.status(404).json({ message: 'Field not found' });
      }
      fieldId = payload.fieldId;
    }

    const activity = await Activity.create({
      farm: toObjectId(payload.farmId),
      field: fieldId ? toObjectId(fieldId) : undefined,
      type: payload.type,
      description: payload.description,
      scheduledDate: payload.scheduledDate,
      status: payload.status,
      inputs: payload.inputs
    });

    res.status(201).json({ data: activity });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid activity id' });
    }

    const activity = await Activity.findById(id)
      .populate('farm', 'name')
      .populate('field', 'name')
      .lean();

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ data: activity });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid activity id' });
    }

    const payload = baseActivitySchema.parse(req.body);

    if (payload.fieldId && !isValidObjectId(payload.fieldId)) {
      return res.status(400).json({ message: 'Invalid field id' });
    }

    const updatedData: Record<string, unknown> = { ...payload };
    delete updatedData.fieldId;
    if (payload.fieldId) {
      updatedData.field = toObjectId(payload.fieldId);
    }

    const activity = await Activity.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    })
      .populate('farm', 'name')
      .populate('field', 'name')
      .lean();

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ data: activity });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid activity id' });
    }

    const activity = await Activity.findByIdAndDelete(id).lean();
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
