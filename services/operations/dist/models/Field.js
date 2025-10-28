"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const mongoose_1 = require("mongoose");
const BoundarySchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['Polygon', 'MultiPolygon'],
        default: 'Polygon'
    },
    coordinates: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true
    }
}, { _id: false });
const SensorsSchema = new mongoose_1.Schema({
    soilMoisture: { type: String, required: true, trim: true },
    weatherStation: { type: Boolean, required: true },
    logisticsPartner: { type: String, default: null }
}, { _id: false });
const FieldSchema = new mongoose_1.Schema({
    legacyId: { type: String, index: true },
    farm: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Farm', required: true },
    name: { type: String, required: true, trim: true },
    hectares: { type: Number, required: true, min: 0 },
    crop: { type: String, required: true, trim: true },
    stage: { type: String, required: true, trim: true },
    linked: { type: Boolean, default: false },
    lastSync: { type: Date },
    sensors: { type: SensorsSchema, required: true },
    nextActions: { type: [String], default: [] },
    boundary: { type: BoundarySchema }
}, {
    timestamps: true
});
FieldSchema.index({ farm: 1, name: 1 }, { unique: true });
FieldSchema.index({ boundary: '2dsphere' });
exports.Field = (0, mongoose_1.model)('Field', FieldSchema);
