import { Schema, model, Document } from 'mongoose';

import { USER_ROLES, type UserRole } from '../constants/userRoles';

export interface Location {
  address?: string;
  coordinates?: [number, number];
}

export interface FarmCredentials {
  registrationId: string;
  pin?: string | null;
}

export interface FarmDocument extends Document {
  legacyId?: string;
  ownerRole: UserRole;
  ownerIdentifier: string;
  name: string;
  primaryCrop: string;
  location?: Location;
  locationDescription?: string | null;
  linked: boolean;
  lastSync?: Date | null;
  nextActions: string[];
  credentials: FarmCredentials;
  sizeHectares?: number;
  status: 'active' | 'inactive' | 'dormant';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<Location>(
  {
    address: { type: String },
    coordinates: {
      type: [Number],
      validate: {
        validator(value: number[]) {
          return !value || value.length === 2;
        },
        message: 'Coordinates must be a [longitude, latitude] tuple'
      }
    }
  },
  { _id: false }
);

const CredentialsSchema = new Schema<FarmCredentials>(
  {
    registrationId: { type: String, required: true, trim: true },
    pin: { type: String, default: null }
  },
  { _id: false }
);

const FarmSchema = new Schema<FarmDocument>(
  {
    legacyId: { type: String, index: true },
    ownerRole: { type: String, required: true, enum: USER_ROLES },
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
  },
  {
    timestamps: true
  }
);

FarmSchema.index({ ownerRole: 1, ownerIdentifier: 1, name: 1 }, { unique: true });
FarmSchema.index({ 'location.coordinates': '2dsphere' });

export const Farm = model<FarmDocument>('Farm', FarmSchema);
