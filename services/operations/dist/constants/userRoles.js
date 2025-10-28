"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserRole = exports.USER_ROLES = void 0;
exports.USER_ROLES = ['admin', 'farm', 'exporter', 'buyer', 'logistics'];
const isUserRole = (value) => typeof value === 'string' && exports.USER_ROLES.includes(value);
exports.isUserRole = isUserRole;
