"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URI = exports.PORT = exports.SERVICE_NAME = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SERVICE_NAME = process.env.SERVICE_NAME ?? 'operations-service';
exports.PORT = Number(process.env.PORT ?? 4003);
exports.MONGO_URI = process.env.MONGO_URI ?? 'mongodb://mongo:27017/jani-operations';
