import { z } from 'zod';

export const systemStatusValues = ['healthy', 'warning', 'error'] as const;

export const settingsSchema = z.object({
  general: z.object({
    siteName: z.string().min(1, 'Site name is required'),
    siteDescription: z.string().min(1, 'Site description is required'),
    contactEmail: z.string().email('Provide a valid contact email'),
    supportPhone: z.string().min(1, 'Support phone is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    language: z.string().min(1, 'Language code is required'),
    dateFormat: z.string().min(1, 'Date format is required')
  }),
  notifications: z.object({
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    weeklyReports: z.boolean(),
    securityAlerts: z.boolean(),
    systemMaintenance: z.boolean()
  }),
  security: z.object({
    twoFactorAuth: z.boolean(),
    passwordExpiry: z.number().int().min(0),
    sessionTimeout: z.number().int().min(0),
    ipWhitelist: z.array(z.string()),
    auditLogging: z.boolean(),
    loginAttempts: z.number().int().min(0)
  }),
  api: z.object({
    apiRateLimit: z.number().int().min(0),
    apiTimeout: z.number().int().min(0),
    webhookUrl: z.string().url('Provide a valid webhook URL'),
    enableApiLogging: z.boolean(),
    apiVersion: z.string().min(1, 'API version is required'),
    apiKey: z.string().min(1, 'API key is required')
  }),
  integrations: z.object({
    blockchainNetwork: z.string().min(1, 'Blockchain network is required'),
    paymentGateway: z.string().min(1, 'Payment gateway is required'),
    emailProvider: z.string().min(1, 'Email provider is required'),
    storageProvider: z.string().min(1, 'Storage provider is required'),
    analyticsProvider: z.string().min(1, 'Analytics provider is required')
  }),
  maintenance: z.object({
    lastBackup: z.string().datetime({ offset: true }),
    backupFrequency: z.enum(['hourly', 'daily', 'weekly']),
    systemStatus: z.enum(systemStatusValues),
    uptime: z.string().min(1, 'Uptime value is required'),
    version: z.string().min(1, 'Version is required')
  })
});

export type SettingsData = z.infer<typeof settingsSchema>;
