import { Schema, model, Document, Types } from 'mongoose';

export interface Boundary {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface FieldSensors {
  soilMoisture: string;
  weatherStation: boolean;
  logisticsPartner?: string | null;
}

export interface FieldDocument extends Document {
  legacyId?: string;
  farm: Types.ObjectId;
  name: string;
  hectares: number;
  crop: string;
  stage: string;
  linked: boolean;
  lastSync?: Date | null;
  sensors: FieldSensors;
  nextActions: string[];
  boundary?: Boundary;
  createdAt: Date;
  updatedAt: Date;
}

const BoundarySchema = new Schema<Boundary>(
  {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      default: 'Polygon'
    },
    coordinates: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  { _id: false }
);

const SensorsSchema = new Schema<FieldSensors>(
  {
    soilMoisture: { type: String, required: true, trim: true },
    weatherStation: { type: Boolean, required: true },
    logisticsPartner: { type: String, default: null }
  },
  { _id: false }
);

const FieldSchema = new Schema<FieldDocument>(
  {
    legacyId: { type: String, index: true },
    farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    name: { type: String, required: true, trim: true },
    hectares: { type: Number, required: true, min: 0 },
    crop: { type: String, required: true, trim: true },
    stage: { type: String, required: true, trim: true },
    linked: { type: Boolean, default: false },
    lastSync: { type: Date },
    sensors: { type: SensorsSchema, required: true },
    nextActions: { type: [String], default: [] },
    boundary: { type: BoundarySchema }
  },
  {
    timestamps: true
  }
);

FieldSchema.index({ farm: 1, name: 1 }, { unique: true });
FieldSchema.index({ boundary: '2dsphere' });

export const Field = model<FieldDocument>('Field', FieldSchema);
