import dotenv from "dotenv";

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/jani-ai-auth";
export const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
export const CORS_ORIGIN = process.env.CORS_ORIGIN;

// S3/MinIO media config
export const S3_ENDPOINT = process.env.S3_ENDPOINT; // e.g., http://localhost:9000
export const S3_REGION = process.env.S3_REGION || "us-east-1";
export const S3_BUCKET = process.env.S3_BUCKET || "jani-media";
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER || "minioadmin";
export const S3_SECRET_KEY = process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD || "minioadmin";
export const S3_FORCE_PATH_STYLE = (process.env.S3_FORCE_PATH_STYLE || "true").toLowerCase() !== "false";
