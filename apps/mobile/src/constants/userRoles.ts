import type { TextInputProps } from 'react-native';
export type UserRole = 'admin' | 'farm' | 'exporter' | 'buyer' | 'logistics';

export type RoleFieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  helper?: string;
  requiredMessage?: string;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  keyboardType?: TextInputProps['keyboardType'];
};

export type RoleDefinition = {
  value: UserRole;
  label: string;
  description: string;
  identifier: RoleFieldConfig;
  signupFields: RoleFieldConfig[];
  loginHelper?: string;
};

const definition = <T extends RoleDefinition>(config: T) => config;

export const ROLE_CONFIG: Record<UserRole, RoleDefinition> = {
  admin: definition({
    value: 'admin',
    label: 'System Administrator',
    description: 'Manage platform operations, users, and system settings.',
    identifier: {
      name: 'adminId',
      label: 'Admin ID',
      placeholder: 'e.g. ADMIN-001',
      requiredMessage: 'Admin ID is required',
      autoCapitalize: 'characters'
    },
    signupFields: [
      {
        name: 'adminId',
        label: 'Admin ID',
        placeholder: 'e.g. ADMIN-001',
        requiredMessage: 'Admin ID is required',
        autoCapitalize: 'characters'
      },
      {
        name: 'fullName',
        label: 'Full name',
        placeholder: 'System Administrator',
        requiredMessage: 'Full name is required',
        autoCapitalize: 'words'
      },
      {
        name: 'department',
        label: 'Department',
        placeholder: 'IT & Operations',
        requiredMessage: 'Department is required',
        autoCapitalize: 'words'
      }
    ],
    loginHelper: 'Use your administrator credentials.'
  }),
  farm: definition({
    value: 'farm',
    label: 'Farm Owner',
    description: 'Oversee teams, contracts, and operational efficiency.',
    identifier: {
      name: 'registrationId',
      label: 'Farm registration ID',
      placeholder: 'e.g. REG-98241',
      requiredMessage: 'Farm registration ID is required',
      autoCapitalize: 'characters'
    },
    signupFields: [
      {
        name: 'registrationId',
        label: 'Farm registration ID',
        placeholder: 'e.g. REG-98241',
        requiredMessage: 'Farm registration ID is required',
        autoCapitalize: 'characters'
      },
      {
        name: 'businessName',
        label: 'Business name',
        placeholder: 'High Valley Farms',
        requiredMessage: 'Business name is required',
        autoCapitalize: 'words'
      },
      {
        name: 'contactName',
        label: 'Primary contact',
        placeholder: 'Jordan Rivers',
        requiredMessage: 'Primary contact is required',
        autoCapitalize: 'words'
      },
      {
        name: 'hectares',
        label: 'Total hectares',
        placeholder: 'e.g. 120',
        keyboardType: 'numeric'
      }
    ],
    loginHelper: 'Enter the farm registration ID issued during onboarding.'
  }),
  exporter: definition({
    value: 'exporter',
    label: 'Exporter',
    description: 'Coordinate logistics, compliance, and global demand.',
    identifier: {
      name: 'exportLicense',
      label: 'Export license number',
      placeholder: 'e.g. EXP-7781',
      requiredMessage: 'Export license number is required',
      autoCapitalize: 'characters'
    },
    signupFields: [
      {
        name: 'exportLicense',
        label: 'Export license number',
        placeholder: 'e.g. EXP-7781',
        requiredMessage: 'Export license number is required',
        autoCapitalize: 'characters'
      },
      {
        name: 'companyName',
        label: 'Company name',
        placeholder: 'Global Origins Ltd',
        requiredMessage: 'Company name is required',
        autoCapitalize: 'words'
      },
      {
        name: 'primaryMarket',
        label: 'Primary market',
        placeholder: 'EU, Middle East, etc.',
        autoCapitalize: 'words'
      },
      {
        name: 'complianceOfficer',
        label: 'Compliance officer',
        placeholder: 'Contact name',
        autoCapitalize: 'words'
      }
    ],
    loginHelper: 'Use the export license number registered with JANI.'
  }),
  buyer: definition({
    value: 'buyer',
    label: 'Buyer',
    description: 'Curate suppliers, negotiate terms, and secure quality.',
    identifier: {
      name: 'buyerCode',
      label: 'Buyer code',
      placeholder: 'e.g. BUY-5542',
      requiredMessage: 'Buyer code is required',
      autoCapitalize: 'characters'
    },
    signupFields: [
      {
        name: 'buyerCode',
        label: 'Buyer code',
        placeholder: 'e.g. BUY-5542',
        requiredMessage: 'Buyer code is required',
        autoCapitalize: 'characters'
      },
      {
        name: 'organizationName',
        label: 'Organization name',
        placeholder: 'Harvest Markets',
        requiredMessage: 'Organization name is required',
        autoCapitalize: 'words'
      },
      {
        name: 'category',
        label: 'Buying category',
        placeholder: 'Retail, distributor, horeca...',
        requiredMessage: 'Buying category is required',
        autoCapitalize: 'sentences'
      },
      {
        name: 'annualDemand',
        label: 'Annual demand',
        placeholder: 'Volume per year',
        keyboardType: 'numeric'
      }
    ],
    loginHelper: 'Supply the buyer code assigned by the JANI team.'
  }),
  logistics: definition({
    value: 'logistics',
    label: 'Logistics Partner',
    description: 'Track fulfillment milestones and resolve disruptions.',
    identifier: {
      name: 'fleetCode',
      label: 'Fleet code',
      placeholder: 'e.g. FLEET-204',
      requiredMessage: 'Fleet code is required',
      autoCapitalize: 'characters'
    },
    signupFields: [
      {
        name: 'fleetCode',
        label: 'Fleet code',
        placeholder: 'e.g. FLEET-204',
        requiredMessage: 'Fleet code is required',
        autoCapitalize: 'characters'
      },
      {
        name: 'companyName',
        label: 'Company name',
        placeholder: 'Transborder Logistics',
        requiredMessage: 'Company name is required',
        autoCapitalize: 'words'
      },
      {
        name: 'coverageRegion',
        label: 'Coverage region',
        placeholder: 'East Africa',
        requiredMessage: 'Coverage region is required',
        autoCapitalize: 'words'
      },
      {
        name: 'fleetSize',
        label: 'Fleet size',
        placeholder: 'Number of vehicles',
        keyboardType: 'numeric'
      }
    ],
    loginHelper: 'Authenticate with the fleet code issued in your SLA.'
  })
};

export const USER_ROLES = Object.values(ROLE_CONFIG);

export const getRoleDefinition = (role: UserRole) => ROLE_CONFIG[role];
