"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncEvent = exports.nextSequence = exports.Counter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, required: true, default: 0 }
}, { versionKey: false });
exports.Counter = mongoose_1.default.model("Counter", counterSchema);
const nextSequence = async (name) => {
    const updated = await exports.Counter.findByIdAndUpdate(name, { $inc: { seq: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    if (!updated) {
        throw new Error("Failed to increment counter");
    }
    return updated.seq;
};
exports.nextSequence = nextSequence;
const eventSchema = new Schema({
    ownerRole: { type: String, required: true },
    ownerIdentifier: { type: String, required: true },
    clientId: { type: String, required: true },
    type: { type: String, required: true },
    actorRole: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    occurredAt: { type: Date, required: true },
    serverId: { type: String },
    seq: { type: Number, required: true }
}, { timestamps: true });
eventSchema.index({ ownerRole: 1, ownerIdentifier: 1, seq: 1 });
// Prevent duplicate client submissions per owner
eventSchema.index({ ownerRole: 1, ownerIdentifier: 1, clientId: 1 }, { unique: true });
exports.SyncEvent = mongoose_1.default.model("SyncEvent", eventSchema);
