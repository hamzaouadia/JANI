"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStrongPassword = exports.sanitizeEmail = void 0;
const sanitizeEmail = (value) => value.trim().toLowerCase();
exports.sanitizeEmail = sanitizeEmail;
const isStrongPassword = (password) => password.length >= 8;
exports.isStrongPassword = isStrongPassword;
