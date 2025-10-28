import { Schema, model, Document, Types } from 'mongoose';

export interface ActivityInput {
  name: string;
  quantity?: number;
  unit?: string;
}

export interface ActivityDocument extends Document {
  farm: Types.ObjectId;
  field?: Types.ObjectId;
  type: string;
  description?: string;
  scheduledDate?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  inputs: ActivityInput[];
  createdAt: Date;
  updatedAt: Date;
}

const ActivityInputSchema = new Schema<ActivityInput>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, min: 0 },
    unit: { type: String }
  },
  { _id: false }
);

const ActivitySchema = new Schema<ActivityDocument>(
  {
    farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    field: { type: Schema.Types.ObjectId, ref: 'Field' },
    type: { type: String, required: true },
    description: { type: String },
    scheduledDate: { type: Date },
    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed', 'cancelled'],
      default: 'planned'
    },
    inputs: { type: [ActivityInputSchema], default: [] }
  },
  {
    timestamps: true
  }
);

ActivitySchema.index({ farm: 1, scheduledDate: -1 });
ActivitySchema.index({ field: 1, scheduledDate: -1 });

export const Activity = model<ActivityDocument>('Activity', ActivitySchema);
