"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const Field_1 = require("../models/Field");
const Farm_1 = require("../models/Farm");
const objectId_1 = require("../utils/objectId");
const router = (0, express_1.Router)();
const coordinateTuple = zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]);
const linearRingSchema = zod_1.z.array(coordinateTuple).min(4);
const polygonSchema = zod_1.z.object({
    type: zod_1.z.literal('Polygon').optional(),
    coordinates: zod_1.z.array(linearRingSchema)
});
const multiPolygonSchema = zod_1.z.object({
    type: zod_1.z.literal('MultiPolygon'),
    coordinates: zod_1.z.array(zod_1.z.array(linearRingSchema))
});
const boundarySchema = zod_1.z.union([polygonSchema, multiPolygonSchema]);
const sensorsSchema = zod_1.z.object({
    soilMoisture: zod_1.z.string().min(1),
    weatherStation: zod_1.z.coerce.boolean(),
    logisticsPartner: zod_1.z.string().min(1).optional()
});
const baseFieldSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    hectares: zod_1.z.number().nonnegative().optional(),
    crop: zod_1.z.string().min(1).optional(),
    stage: zod_1.z.string().min(1).optional(),
    linked: zod_1.z.coerce.boolean().optional(),
    lastSync: zod_1.z.coerce.date().optional(),
    sensors: sensorsSchema.optional(),
    nextActions: zod_1.z.array(zod_1.z.string()).optional(),
    boundary: boundarySchema.optional()
});
const createFieldSchema = baseFieldSchema.extend({
    farmId: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    hectares: zod_1.z.number().nonnegative(),
    crop: zod_1.z.string().min(1),
    stage: zod_1.z.string().min(1),
    sensors: sensorsSchema
});
router.get('/', async (req, res, next) => {
    try {
        const { farmId } = req.query;
        const filter = {};
        if (typeof farmId === 'string') {
            if (!(0, objectId_1.isValidObjectId)(farmId)) {
                return res.status(400).json({ message: 'Invalid farm id' });
            }
            filter.farm = (0, objectId_1.toObjectId)(farmId);
        }
        const fields = await Field_1.Field.find(filter).populate('farm', 'name status').lean();
        res.json({ data: fields });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const payload = createFieldSchema.parse(req.body);
        if (!(0, objectId_1.isValidObjectId)(payload.farmId)) {
            return res.status(400).json({ message: 'Invalid farm id' });
        }
        const farm = await Farm_1.Farm.findById(payload.farmId).lean();
        if (!farm) {
            return res.status(404).json({ message: 'Farm not found' });
        }
        const field = await Field_1.Field.create({
            farm: (0, objectId_1.toObjectId)(payload.farmId),
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
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, objectId_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'Invalid field id' });
        }
        const field = await Field_1.Field.findById(id).populate('farm', 'name status').lean();
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }
        res.json({ data: field });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, objectId_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'Invalid field id' });
        }
        const payload = baseFieldSchema.parse(req.body);
        const update = {};
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
        const field = await Field_1.Field.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true
        }).lean();
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }
        res.json({ data: field });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, objectId_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'Invalid field id' });
        }
        const field = await Field_1.Field.findByIdAndDelete(id).lean();
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id/boundary', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, objectId_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'Invalid field id' });
        }
        const field = await Field_1.Field.findById(id).select('boundary').lean();
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }
        res.json({ data: field.boundary ?? null });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id/boundary', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, objectId_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'Invalid field id' });
        }
        const boundary = boundarySchema.parse(req.body);
        const field = await Field_1.Field.findByIdAndUpdate(id, { boundary: { type: boundary.type ?? 'Polygon', coordinates: boundary.coordinates } }, { new: true, runValidators: true }).lean();
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }
        res.json({ data: field.boundary });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
