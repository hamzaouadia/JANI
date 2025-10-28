import mongoose from "mongoose";

import { MONGO_URI } from "./config";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGO_URI).then((conn) => {
      console.log("✅ Connected to MongoDB");
      return conn;
    });
  }

  return connectionPromise;
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    connectionPromise = null;
  }
};
