"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleRoot = exports.endOfDayUtc = exports.startOfDayUtc = exports.MerkleRoot = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const { Schema } = mongoose_1.default;
const merkleSchema = new Schema({
    ownerRole: { type: String, required: true },
    ownerIdentifier: { type: String, required: true },
    merkleDate: { type: Date, required: true }, // normalized to 00:00:00Z
    rootHash: { type: String, required: true },
    eventCount: { type: Number, required: true },
    anchored: { type: Boolean, default: false },
    anchorTxid: { type: String }
}, { timestamps: true });
merkleSchema.index({ ownerRole: 1, ownerIdentifier: 1, merkleDate: 1 }, { unique: true });
exports.MerkleRoot = mongoose_1.default.model("MerkleRoot", merkleSchema);
const startOfDayUtc = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
exports.startOfDayUtc = startOfDayUtc;
const endOfDayUtc = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
exports.endOfDayUtc = endOfDayUtc;
const simpleRoot = (leafs) => {
    const hash = crypto_1.default.createHash("sha256");
    for (const leaf of leafs) {
        hash.update(leaf);
    }
    return hash.digest("hex");
};
exports.simpleRoot = simpleRoot;
