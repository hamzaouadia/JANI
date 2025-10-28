import mongoose from "mongoose";

const { Schema } = mongoose;

const counterSchema = new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true, default: 0 }
  },
  { versionKey: false }
);

export type CounterDocument = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof counterSchema>>;
export const Counter = mongoose.model<mongoose.InferSchemaType<typeof counterSchema>>("Counter", counterSchema);

export const nextSequence = async (name: string) => {
  const updated = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  if (!updated) {
    throw new Error("Failed to increment counter");
  }
  return updated.seq as number;
};

const eventSchema = new Schema(
  {
    ownerRole: { type: String, required: true },
    ownerIdentifier: { type: String, required: true },
    clientId: { type: String, required: true },
    type: { type: String, required: true },
    actorRole: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    occurredAt: { type: Date, required: true },
    serverId: { type: String },
    seq: { type: Number, required: true }
  },
  { timestamps: true }
);

eventSchema.index({ ownerRole: 1, ownerIdentifier: 1, seq: 1 });
// Prevent duplicate client submissions per owner
eventSchema.index({ ownerRole: 1, ownerIdentifier: 1, clientId: 1 }, { unique: true });

export type SyncEventDocument = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof eventSchema>>;
export const SyncEvent = mongoose.model<mongoose.InferSchemaType<typeof eventSchema>>("SyncEvent", eventSchema);
