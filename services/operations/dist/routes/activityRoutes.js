"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const Activity_1 = require("../models/Activity");
const Farm_1 = require("../models/Farm");
const Field_1 = require("../models/Field");
const objectId_1 = require("../utils/objectId");
const router = (0, express_1.Router)();
const activityInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    quantity: zod_1.z.number().nonnegative().optional(),
    unit: zod_1.z.string().optional()
});
const baseActivitySchema = zod_1.z.object({
    fieldId: zod_1.z.string().min(1).optional(),
    type: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    scheduledDate: zod_1.z.coerce.date().optional(),
    status: zod_1.z.enum(['planned', 'in_progress', 'completed', 'cancelled']).optional(),
    inputs: zod_1.z.array(activityInputSchema).optional()
});
const createActivitySchema = baseActivitySchema.extend({
    farmId: zod_1.z.string().min(1),
    type: zod_1.z.string().min(1)
});
router.get('/', async (req, res, next) => {
    try {
        const { farmId, fieldId, status } = req.query;
        const filter = {};
        if (typeof farmId === 'string') {
            if (!(0, objectId_1.isValidObjectId)(farmId)) {
                return res.status(400).json({ message: 'Invalid farm id' });
            }
            filter.farm = (0, objectId_1.toObjectId)(farmId);
        }
        if (typeof fieldId === 'string') {
            if (!(0, objectId_1.isValidObjectId)(fieldId)) {
                return res.status(400).json({ message: 'Invalid field id' });
            }
            filter.field = (0, objectId_1.toObjectId)(fieldId);
        }
        if (typeof status === 'string') {
            filter.status = status;
        }
        const activities = await Activity_1.Activity.find(filter)
            .populate('farm', 'name')
            .populate('field', 'name crop')
            .sort({ scheduledDate: -1 })
            .lean();
        res.json({ data: activities });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const payload = createActivitySchema.parse(req.body);
        if (!(0, objectId_1.isValidObjectId)(payload.farmId)) {
            return res.status(400).json({ message: 'Invalid farm id' });
        }
        const farm = await Farm_1.Farm.findById(payload.farmId).lean();
        if (!farm) {
            return res.status(404).json({ message: 'Farm not found' });
        }
        let fieldId;
        if (payload.fieldId) {
            if (!(0, objectId_1.isValidObjectId)(payload.fieldId)) {
                return res.status(400).json({ message: 'Invalid field id' });
            }
            const field = await Field_1.Field.findById(payload.fieldId).lean();
            if (!field) {
                return res.status(404).json({ message: 'Field not found' });
            }
            fieldId = payload.fieldId;
        }
        const activity = await Activity_1.Activity.create({
            farm: (0, objectId_1.toObjectId)(payload.farmId),
            field: fieldId ? (0, objectId_1.toObjectId)(fieldId) : undefined,
            type: payload.type,
            description: payload.description,
            scheduledDate: payload.scheduledDate,
            status: payload.status,
            inputs: payload.inputs
        });
        res.status(201).json({ data: activity });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, objectId_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'Invalid activity id' });
        }
        const activity = await Activity_1.Activity.findById(id)
            .populate('farm', 'name')
            .populate('field', 'name')
            .lean();
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json({ data: activity });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, objectId_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'Invalid activity id' });
        }
        const payload = baseActivitySchema.parse(req.body);
        if (payload.fieldId && !(0, objectId_1.isValidObjectId)(payload.fieldId)) {
            return res.status(400).json({ message: 'Invalid field id' });
        }
        const updatedData = { ...payload };
        delete updatedData.fieldId;
        if (payload.fieldId) {
            updatedData.field = (0, objectId_1.toObjectId)(payload.fieldId);
        }
        const activity = await Activity_1.Activity.findByIdAndUpdate(id, updatedData, {
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
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, objectId_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'Invalid activity id' });
        }
        const activity = await Activity_1.Activity.findByIdAndDelete(id).lean();
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
