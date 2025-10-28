"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectId = exports.isValidObjectId = void 0;
const mongoose_1 = require("mongoose");
const isValidObjectId = (value) => mongoose_1.Types.ObjectId.isValid(value);
exports.isValidObjectId = isValidObjectId;
const toObjectId = (value) => new mongoose_1.Types.ObjectId(value);
exports.toObjectId = toObjectId;
