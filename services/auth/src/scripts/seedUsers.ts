import bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";

import {
  User,
  ROLE_REQUIREMENTS,
  type UserRole,
  normalizeProfile,
  resolveIdentifier,
  serializeProfile,
  normalizeString
} from "../userModel";
import { connectDatabase, disconnectDatabase } from "../database";

type SeedUser = {
  email: string;
  password: string;
  role: UserRole;
  identifier: string;
  profile: Record<string, string>;
};

// Load users from seed-users.json file
const loadUsersFromFile = (): SeedUser[] => {
  try {
    const filePath = path.resolve(process.cwd(), "seed-users.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const users = JSON.parse(fileContent) as SeedUser[];
    console.log(`📄 Loaded ${users.length} users from seed-users.json`);
    return users;
  } catch (_error) {
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

const normalizeSeedUser = (user: SeedUser) => {
  const role = user.role;

  const normalizedEmail = normalizeString(user.email)?.toLowerCase();
  if (!normalizedEmail) {
    throw new Error(`Invalid email for ${user.role}`);
  }

  const baseProfile = normalizeProfile(role, user.profile);
  const identifierValue = resolveIdentifier(role, user.identifier, baseProfile);
  baseProfile[ROLE_REQUIREMENTS[role].identifier.name] = identifierValue;

  return {
    email: normalizedEmail,
    role,
    identifier: identifierValue,
    profile: baseProfile
  };
};

const upsertUser = async (seed: SeedUser) => {
  const normalized = normalizeSeedUser(seed);

  const passwordHash = await bcrypt.hash(seed.password, 10);

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

  const result = await User.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  });

  const displayProfile = serializeProfile(result?.profile ?? normalized.profile);

  console.log(`
➡️  Seeded ${normalized.role.toUpperCase()} user
    Email: ${normalized.email}
    Identifier: ${normalized.identifier}
    Profile: ${JSON.stringify(displayProfile)}
    Normalized: ${JSON.stringify(normalized.profile)}
  `);
};

const seed = async () => {
  await connectDatabase();
  console.log("✅ Connected to MongoDB for user seeding");

  for (const user of USERS) {
    try {
      await upsertUser(user);
    } catch (_error) {
      console.error(`❌ Failed to seed ${user.role}:`, _error);
    }
  }

  await disconnectDatabase();
  console.log("✅ User seeding complete. Connection closed.");
};

seed().catch((_error) => {
  console.error("❌ Unexpected seeding error", _error);
  disconnectDatabase().catch(() => {
    /* ignore */
  });
  process.exit(1);
});
