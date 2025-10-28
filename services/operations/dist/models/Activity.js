"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const mongoose_1 = require("mongoose");
const ActivityInputSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, min: 0 },
    unit: { type: String }
}, { _id: false });
const ActivitySchema = new mongoose_1.Schema({
    farm: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Farm', required: true },
    field: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Field' },
    type: { type: String, required: true },
    description: { type: String },
    scheduledDate: { type: Date },
    status: {
        type: String,
        enum: ['planned', 'in_progress', 'completed', 'cancelled'],
        default: 'planned'
    },
    inputs: { type: [ActivityInputSchema], default: [] }
}, {
    timestamps: true
});
ActivitySchema.index({ farm: 1, scheduledDate: -1 });
ActivitySchema.index({ field: 1, scheduledDate: -1 });
exports.Activity = (0, mongoose_1.model)('Activity', ActivitySchema);
