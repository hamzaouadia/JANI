"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.serializeProfile = exports.normalizeProfile = exports.resolveIdentifier = exports.normalizeString = exports.isUserRole = exports.ROLE_REQUIREMENTS = exports.USER_ROLES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.USER_ROLES = ["admin", "farm", "exporter", "buyer", "logistics"];
exports.ROLE_REQUIREMENTS = {
    admin: {
        identifier: { name: "adminId", label: "Admin ID", required: true },
        profileFields: [
            { name: "fullName", label: "Full name", required: true },
            { name: "department", label: "Department" },
            { name: "accessLevel", label: "Access level", required: true }
        ]
    },
    farm: {
        identifier: { name: "registrationId", label: "Farm registration ID", required: true },
        profileFields: [
            { name: "businessName", label: "Business name", required: true },
            { name: "hectares", label: "Total hectares" },
            { name: "contactName", label: "Primary contact", required: true }
        ]
    },
    exporter: {
        identifier: { name: "exportLicense", label: "Export license number", required: true },
        profileFields: [
            { name: "companyName", label: "Company name", required: true },
            { name: "primaryMarket", label: "Primary market" },
            { name: "complianceOfficer", label: "Compliance officer" }
        ]
    },
    buyer: {
        identifier: { name: "buyerCode", label: "Buyer code", required: true },
        profileFields: [
            { name: "organizationName", label: "Organization name", required: true },
            { name: "category", label: "Buying category", required: true },
            { name: "annualDemand", label: "Annual demand" }
        ]
    },
    logistics: {
        identifier: { name: "fleetCode", label: "Fleet code", required: true },
        profileFields: [
            { name: "companyName", label: "Company name", required: true },
            { name: "coverageRegion", label: "Coverage region", required: true },
            { name: "fleetSize", label: "Fleet size" }
        ]
    }
};
const isUserRole = (value) => typeof value === "string" && exports.USER_ROLES.includes(value);
exports.isUserRole = isUserRole;
const normalizeString = (value) => {
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    if (typeof value === "number") {
        const asString = String(value);
        return asString.length > 0 ? asString : null;
    }
    return null;
};
exports.normalizeString = normalizeString;
const resolveIdentifier = (role, identifier, profile) => {
    const { identifier: identifierField } = exports.ROLE_REQUIREMENTS[role];
    const fromPayload = (0, exports.normalizeString)(identifier);
    if (fromPayload) {
        return fromPayload;
    }
    if (profile && typeof profile === "object" && profile !== null) {
        const fromProfile = (0, exports.normalizeString)(profile[identifierField.name]);
        if (fromProfile) {
            return fromProfile;
        }
    }
    throw new Error(`${identifierField.label} is required`);
};
exports.resolveIdentifier = resolveIdentifier;
const normalizeProfile = (role, profile) => {
    const { profileFields, identifier } = exports.ROLE_REQUIREMENTS[role];
    const source = profile && typeof profile === "object" ? profile : {};
    const normalized = {};
    for (const field of profileFields) {
        const value = (0, exports.normalizeString)(source[field.name]);
        if (field.required && !value) {
            throw new Error(`${field.label} is required`);
        }
        if (value) {
            normalized[field.name] = value;
        }
    }
    const identifierValue = (0, exports.normalizeString)(source[identifier.name]);
    if (identifierValue) {
        normalized[identifier.name] = identifierValue;
    }
    return normalized;
};
exports.normalizeProfile = normalizeProfile;
const serializeProfile = (profile) => {
    if (!profile) {
        return {};
    }
    if (profile instanceof mongoose_1.default.Types.Map) {
        return profile.toObject({ flattenMaps: true });
    }
    if (typeof profile.toObject === "function") {
        return (profile.toObject() ?? {});
    }
    if (profile instanceof Map || typeof profile[Symbol.iterator] === "function") {
        try {
            return Object.fromEntries(profile);
        }
        catch {
            // fall through
        }
    }
    if (typeof profile === "object") {
        return { ...profile };
    }
    return {};
};
exports.serializeProfile = serializeProfile;
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: exports.USER_ROLES },
    identifier: { type: String, required: true },
    profile: {
        type: Map,
        of: String,
        default: {}
    }
}, { timestamps: true });
userSchema.index({ role: 1, identifier: 1 }, { unique: true });
exports.User = mongoose_1.default.model("User", userSchema);
