import { SettingsData } from './schema';

export const defaultSettings: SettingsData = {
  general: {
    siteName: 'JANI Platform',
    siteDescription: 'Agricultural Traceability and Sustainability Platform',
    contactEmail: 'admin@jani.platform',
    supportPhone: '+1 (555) 123-4567',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY'
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    securityAlerts: true,
    systemMaintenance: true
  },
  security: {
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    auditLogging: true,
    loginAttempts: 5
  },
  api: {
    apiRateLimit: 1000,
    apiTimeout: 30,
    webhookUrl: 'https://api.jani.platform/webhooks',
    enableApiLogging: true,
    apiVersion: 'v1.2.0',
    apiKey: 'sk_live_51234567890abcdef'
  },
  integrations: {
    blockchainNetwork: 'Ethereum',
    paymentGateway: 'Stripe',
    emailProvider: 'SendGrid',
    storageProvider: 'AWS S3',
    analyticsProvider: 'Google Analytics'
  },
  maintenance: {
    lastBackup: '2025-01-23T08:00:00Z',
    backupFrequency: 'daily',
    systemStatus: 'healthy',
    uptime: '99.8%',
    version: '2.1.4'
  }
};
