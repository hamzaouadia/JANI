import mongoose from "mongoose";

export const USER_ROLES = ["admin", "farm", "exporter", "buyer", "logistics"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type RoleFieldDefinition = {
  name: string;
  label: string;
  required?: boolean;
};

export const ROLE_REQUIREMENTS: Record<
  UserRole,
  {
    identifier: RoleFieldDefinition;
    profileFields: RoleFieldDefinition[];
  }
> = {
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

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);

export const normalizeString = (value: unknown) => {
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

export const resolveIdentifier = (
  role: UserRole,
  identifier: unknown,
  profile: unknown
): string => {
  const { identifier: identifierField } = ROLE_REQUIREMENTS[role];
  const fromPayload = normalizeString(identifier);
  if (fromPayload) {
    return fromPayload;
  }

  if (profile && typeof profile === "object" && profile !== null) {
    const fromProfile = normalizeString((profile as Record<string, unknown>)[identifierField.name]);
    if (fromProfile) {
      return fromProfile;
    }
  }

  throw new Error(`${identifierField.label} is required`);
};

export const normalizeProfile = (role: UserRole, profile: unknown) => {
  const { profileFields, identifier } = ROLE_REQUIREMENTS[role];
  const source = profile && typeof profile === "object" ? (profile as Record<string, unknown>) : {};
  const normalized: Record<string, string> = {};

  for (const field of profileFields) {
    const value = normalizeString(source[field.name]);
    if (field.required && !value) {
      throw new Error(`${field.label} is required`);
    }
    if (value) {
      normalized[field.name] = value;
    }
  }

  const identifierValue = normalizeString(source[identifier.name]);
  if (identifierValue) {
    normalized[identifier.name] = identifierValue;
  }

  return normalized;
};

export const serializeProfile = (profile: unknown): Record<string, string> => {
  if (!profile) {
    return {};
  }

  if (profile instanceof mongoose.Types.Map) {
    return profile.toObject({ flattenMaps: true }) as Record<string, string>;
  }

  if (typeof (profile as { toObject?: () => unknown }).toObject === "function") {
    return ((profile as { toObject: () => unknown }).toObject() ?? {}) as Record<string, string>;
  }

  if (profile instanceof Map || typeof (profile as Iterable<unknown>)[Symbol.iterator] === "function") {
    try {
      return Object.fromEntries(profile as Iterable<[string, string]>);
    } catch {
      // fall through
    }
  }

  if (typeof profile === "object") {
    return { ...(profile as Record<string, string>) };
  }

  return {};
};

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: USER_ROLES },
    identifier: { type: String, required: true },
    profile: {
      type: Map,
      of: String,
      default: {}
    }
  },
  { timestamps: true }
);

userSchema.index({ role: 1, identifier: 1 }, { unique: true });

export type UserDocument = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof userSchema>>;

export const User = mongoose.model<mongoose.InferSchemaType<typeof userSchema>>("User", userSchema);
