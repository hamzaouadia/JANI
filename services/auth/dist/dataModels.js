"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoleMatch = exports.Order = exports.PartnerAccess = exports.Plot = exports.Farm = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = require("./userModel");
const { Schema } = mongoose_1.default;
const sensorSchema = new Schema({
    soilMoisture: { type: String, required: true },
    weatherStation: { type: Boolean, required: true },
    logisticsPartner: { type: String }
}, { _id: false });
const credentialsSchema = new Schema({
    registrationId: { type: String, required: true },
    pin: { type: String }
}, { _id: false });
const farmSchema = new Schema({
    ownerRole: { type: String, required: true, enum: userModel_1.USER_ROLES },
    ownerIdentifier: { type: String, required: true },
    name: { type: String, required: true },
    primaryCrop: { type: String, required: true },
    locationDescription: { type: String },
    linked: { type: Boolean, default: false },
    lastSync: { type: Date },
    nextActions: { type: [String], default: [] },
    credentials: { type: credentialsSchema, required: true }
}, { timestamps: true });
farmSchema.index({ ownerRole: 1, ownerIdentifier: 1, name: 1 }, { unique: true });
const plotSchema = new Schema({
    farmId: { type: Schema.Types.ObjectId, ref: "Farm", required: true },
    name: { type: String, required: true },
    hectares: { type: Number, required: true },
    crop: { type: String, required: true },
    stage: { type: String, required: true },
    linked: { type: Boolean, default: false },
    lastSync: { type: Date },
    sensors: { type: sensorSchema, required: true },
    nextActions: { type: [String], default: [] }
}, { timestamps: true });
plotSchema.index({ farmId: 1, name: 1 }, { unique: true });
exports.Farm = mongoose_1.default.model("Farm", farmSchema);
exports.Plot = mongoose_1.default.model("Plot", plotSchema);
const partnerSchema = new Schema({
    ownerRole: { type: String, required: true, enum: userModel_1.USER_ROLES },
    ownerIdentifier: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ["buyer", "exporter", "logistics", "advisor"] },
    status: { type: String, required: true, enum: ["active", "pending", "invited"] },
    notes: { type: String, required: true }
}, { timestamps: true });
partnerSchema.index({ ownerRole: 1, ownerIdentifier: 1, name: 1 }, { unique: true });
exports.PartnerAccess = mongoose_1.default.model("PartnerAccess", partnerSchema);
const ORDER_STATUSES = ["preparing", "awaiting_pickup", "in_transit", "delayed", "delivered"];
const orderSchema = new Schema({
    ownerRole: { type: String, required: true, enum: userModel_1.USER_ROLES },
    ownerIdentifier: { type: String, required: true },
    reference: { type: String, required: true },
    partner: { type: String, required: true },
    destination: { type: String, required: true },
    status: { type: String, required: true, enum: ORDER_STATUSES },
    dueDate: { type: Date, required: true },
    quantity: { type: String, required: true },
    value: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
    highlights: { type: [String], default: [] }
}, { timestamps: true });
orderSchema.index({ ownerRole: 1, ownerIdentifier: 1, reference: 1 }, { unique: true });
exports.Order = mongoose_1.default.model("Order", orderSchema);
const isRoleMatch = (userRole, resourceRole) => userRole === resourceRole;
exports.isRoleMatch = isRoleMatch;
