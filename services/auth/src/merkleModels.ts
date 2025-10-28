import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

const merkleSchema = new Schema(
  {
    ownerRole: { type: String, required: true },
    ownerIdentifier: { type: String, required: true },
    merkleDate: { type: Date, required: true }, // normalized to 00:00:00Z
    rootHash: { type: String, required: true },
    eventCount: { type: Number, required: true },
    anchored: { type: Boolean, default: false },
    anchorTxid: { type: String }
  },
  { timestamps: true }
);

merkleSchema.index({ ownerRole: 1, ownerIdentifier: 1, merkleDate: 1 }, { unique: true });

export type MerkleRootDocument = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof merkleSchema>>;
export const MerkleRoot = mongoose.model<mongoose.InferSchemaType<typeof merkleSchema>>("MerkleRoot", merkleSchema);

export const startOfDayUtc = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
export const endOfDayUtc = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));

export const simpleRoot = (leafs: string[]) => {
  const hash = crypto.createHash("sha256");
  for (const leaf of leafs) {
    hash.update(leaf);
  }
  return hash.digest("hex");
};
