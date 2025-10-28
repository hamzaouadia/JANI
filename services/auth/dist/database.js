"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
let connectionPromise = null;
const connectDatabase = async () => {
    if (mongoose_1.default.connection.readyState === 1 || mongoose_1.default.connection.readyState === 2) {
        return mongoose_1.default.connection;
    }
    if (!connectionPromise) {
        connectionPromise = mongoose_1.default.connect(config_1.MONGO_URI).then((conn) => {
            console.log("✅ Connected to MongoDB");
            return conn;
        });
    }
    return connectionPromise;
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.disconnect();
        connectionPromise = null;
    }
};
exports.disconnectDatabase = disconnectDatabase;
