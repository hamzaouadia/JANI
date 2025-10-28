import dotenv from 'dotenv';

dotenv.config();

export const SERVICE_NAME = process.env.SERVICE_NAME ?? 'operations-service';
export const PORT = Number(process.env.PORT ?? 4003);
export const MONGO_URI =
  process.env.MONGO_URI ?? 'mongodb://mongo:27017/jani-operations';
