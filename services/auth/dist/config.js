"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_FORCE_PATH_STYLE = exports.S3_SECRET_KEY = exports.S3_ACCESS_KEY = exports.S3_BUCKET = exports.S3_REGION = exports.S3_ENDPOINT = exports.CORS_ORIGIN = exports.JWT_SECRET = exports.MONGO_URI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/jani-ai-auth";
exports.JWT_SECRET = process.env.JWT_SECRET || "supersecret";
exports.CORS_ORIGIN = process.env.CORS_ORIGIN;
// S3/MinIO media config
exports.S3_ENDPOINT = process.env.S3_ENDPOINT; // e.g., http://localhost:9000
exports.S3_REGION = process.env.S3_REGION || "us-east-1";
exports.S3_BUCKET = process.env.S3_BUCKET || "jani-media";
exports.S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER || "minioadmin";
exports.S3_SECRET_KEY = process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD || "minioadmin";
exports.S3_FORCE_PATH_STYLE = (process.env.S3_FORCE_PATH_STYLE || "true").toLowerCase() !== "false";
