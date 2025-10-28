"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const userModel_1 = require("../userModel");
const database_1 = require("../database");
// Load users from seed-users.json file
const loadUsersFromFile = () => {
    try {
        const filePath = path.resolve(process.cwd(), "seed-users.json");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const users = JSON.parse(fileContent);
        console.log(`📄 Loaded ${users.length} users from seed-users.json`);
        return users;
    }
    catch (_error) {
        console.error("⚠️  Failed to load seed-users.json, using fallback users", _error);
        // Fallback to original hardcoded users if file not found
        return [
            {
                email: "admin@jani.test",
                password: "Admin123!",
                role: "admin",
                identifier: "ADMIN-001",
                profile: {
                    adminId: "ADMIN-001",
                    fullName: "System Administrator",
                    department: "IT & Operations",
                    accessLevel: "full"
                }
            },
            {
                email: "farm-owner@jani.test",
                password: "Password123!",
                role: "farm",
                identifier: "REG-98241",
                profile: {
                    registrationId: "REG-98241",
                    businessName: "High Valley Farms",
                    hectares: "120",
                    contactName: "Jordan Rivers"
                }
            },
            {
                email: "exporter@jani.test",
                password: "Password123!",
                role: "exporter",
                identifier: "EXP-7781",
                profile: {
                    exportLicense: "EXP-7781",
                    companyName: "Global Origins Ltd",
                    primaryMarket: "EU",
                    complianceOfficer: "Samuel Opoku"
                }
            },
            {
                email: "buyer@jani.test",
                password: "Password123!",
                role: "buyer",
                identifier: "BUY-5542",
                profile: {
                    buyerCode: "BUY-5542",
                    organizationName: "Harvest Markets",
                    category: "Retail",
                    annualDemand: "1500"
                }
            },
            {
                email: "logistics@jani.test",
                password: "Password123!",
                role: "logistics",
                identifier: "FLEET-204",
                profile: {
                    fleetCode: "FLEET-204",
                    companyName: "Transborder Logistics",
                    coverageRegion: "East Africa",
                    fleetSize: "24"
                }
            }
        ];
    }
};
const USERS = loadUsersFromFile();
const normalizeSeedUser = (user) => {
    const role = user.role;
    const normalizedEmail = (0, userModel_1.normalizeString)(user.email)?.toLowerCase();
    if (!normalizedEmail) {
        throw new Error(`Invalid email for ${user.role}`);
    }
    const baseProfile = (0, userModel_1.normalizeProfile)(role, user.profile);
    const identifierValue = (0, userModel_1.resolveIdentifier)(role, user.identifier, baseProfile);
    baseProfile[userModel_1.ROLE_REQUIREMENTS[role].identifier.name] = identifierValue;
    return {
        email: normalizedEmail,
        role,
        identifier: identifierValue,
        profile: baseProfile
    };
};
const upsertUser = async (seed) => {
    const normalized = normalizeSeedUser(seed);
    const passwordHash = await bcrypt_1.default.hash(seed.password, 10);
    const filter = {
        $or: [{ email: normalized.email }, { role: normalized.role, identifier: normalized.identifier }]
    };
    const update = {
        email: normalized.email,
        passwordHash,
        role: normalized.role,
        identifier: normalized.identifier,
        profile: normalized.profile
    };
    const result = await userModel_1.User.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
    });
    const displayProfile = (0, userModel_1.serializeProfile)(result?.profile ?? normalized.profile);
    console.log(`
➡️  Seeded ${normalized.role.toUpperCase()} user
    Email: ${normalized.email}
    Identifier: ${normalized.identifier}
    Profile: ${JSON.stringify(displayProfile)}
    Normalized: ${JSON.stringify(normalized.profile)}
  `);
};
const seed = async () => {
    await (0, database_1.connectDatabase)();
    console.log("✅ Connected to MongoDB for user seeding");
    for (const user of USERS) {
        try {
            await upsertUser(user);
        }
        catch (_error) {
            console.error(`❌ Failed to seed ${user.role}:`, _error);
        }
    }
    await (0, database_1.disconnectDatabase)();
    console.log("✅ User seeding complete. Connection closed.");
};
seed().catch((_error) => {
    console.error("❌ Unexpected seeding error", _error);
    (0, database_1.disconnectDatabase)().catch(() => {
        /* ignore */
    });
    process.exit(1);
});
