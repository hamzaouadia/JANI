"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Farm = void 0;
const mongoose_1 = require("mongoose");
const userRoles_1 = require("../constants/userRoles");
const LocationSchema = new mongoose_1.Schema({
    address: { type: String },
    coordinates: {
        type: [Number],
        validate: {
            validator(value) {
                return !value || value.length === 2;
            },
            message: 'Coordinates must be a [longitude, latitude] tuple'
        }
    }
}, { _id: false });
const CredentialsSchema = new mongoose_1.Schema({
    registrationId: { type: String, required: true, trim: true },
    pin: { type: String, default: null }
}, { _id: false });
const FarmSchema = new mongoose_1.Schema({
    legacyId: { type: String, index: true },
    ownerRole: { type: String, required: true, enum: userRoles_1.USER_ROLES },
    ownerIdentifier: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    primaryCrop: { type: String, required: true, trim: true },
    location: { type: LocationSchema },
    locationDescription: { type: String, default: null },
    linked: { type: Boolean, default: false },
    lastSync: { type: Date },
    nextActions: { type: [String], default: [] },
    credentials: { type: CredentialsSchema, required: true },
    sizeHectares: { type: Number, min: 0 },
    status: {
        type: String,
        enum: ['active', 'inactive', 'dormant'],
        default: 'active'
    },
    tags: { type: [String], default: [] }
}, {
    timestamps: true
});
FarmSchema.index({ ownerRole: 1, ownerIdentifier: 1, name: 1 }, { unique: true });
FarmSchema.index({ 'location.coordinates': '2dsphere' });
exports.Farm = (0, mongoose_1.model)('Farm', FarmSchema);
