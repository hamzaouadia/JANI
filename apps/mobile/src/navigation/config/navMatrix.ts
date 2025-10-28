export type NavScreen = { name: string; path: string };
export type NavTab = {
  key: string;
  title: string;
  initialRoute: string;
  stack: NavScreen[];
};
export type RoleNavConfig = {
  role: string;
  initialTab: string;
  tabs: NavTab[];
};

export type NavMatrix = {
  version: string;
  baseDeeplink: string;
  roles: RoleNavConfig[];
};

export const navMatrix: NavMatrix = {
  version: '1.0',
  baseDeeplink: 'app://',
  roles: [
    {
      role: 'farm-manager',
      initialTab: 'overview',
      tabs: [
        {
          key: 'overview',
          title: 'Overview',
          initialRoute: 'FMOverview',
          stack: [{ name: 'FMOverview', path: 'farm-manager/overview' }]
        },
        {
          key: 'dashboard',
          title: 'Dashboard',
          initialRoute: 'FMDashboard',
          stack: [
            { name: 'FMDashboard', path: 'farm-manager/dashboard' },
            { name: 'KPIInsight', path: 'farm-manager/dashboard/kpis/:kpiId' }
          ]
        },
        {
          key: 'lots-collections',
          title: 'Lots/Collections',
          initialRoute: 'LotsList',
          stack: [
            { name: 'LotsList', path: 'farm-manager/lots' },
            { name: 'LotDetail', path: 'farm-manager/lots/:lotId' },
            { name: 'FMCollections', path: 'farm-manager/collections' }
          ]
        },
        {
          key: 'inventory-tasks',
          title: 'Inventory & Tasks',
          initialRoute: 'Inventory',
          stack: [
            { name: 'Inventory', path: 'farm-manager/inventory' },
            { name: 'TaskBoard', path: 'farm-manager/tasks' },
            { name: 'TaskDetail', path: 'farm-manager/tasks/:taskId' }
          ]
        },
        {
          key: 'team-chat',
          title: 'Team & Chat',
          initialRoute: 'Team',
          stack: [
            { name: 'Team', path: 'farm-manager/team' },
            { name: 'FMThreads', path: 'farm-manager/chat' },
            { name: 'FMThread', path: 'farm-manager/chat/:threadId' }
          ]
        },
        {
          key: 'profile',
          title: 'Profile',
          initialRoute: 'FMProfile',
          stack: [{ name: 'FMProfile', path: 'farm-manager/profile' }]
        },
        {
          key: 'settings',
          title: 'Settings',
          initialRoute: 'FMSettings',
          stack: [{ name: 'FMSettings', path: 'farm-manager/settings' }]
        }
      ]
    },
    {
      role: 'field-agent',
      initialTab: 'tasks',
      tabs: [
        {
          key: 'tasks',
          title: 'Tasks',
          initialRoute: 'FATaskBoard',
          stack: [
            { name: 'FATaskBoard', path: 'field-agent/tasks' },
            { name: 'FATaskDetail', path: 'field-agent/tasks/:taskId' },
            { name: 'NewTask', path: 'field-agent/tasks/new' }
          ]
        },
        {
          key: 'capture',
          title: 'Capture',
          initialRoute: 'FACaptureHome',
          stack: [
            { name: 'FACaptureHome', path: 'field-agent/capture' },
            { name: 'PlantingForm', path: 'field-agent/capture/planting' },
            { name: 'ApplicationForm', path: 'field-agent/capture/application' },
            { name: 'HarvestForm', path: 'field-agent/capture/harvest' }
          ]
        },
        {
          key: 'farmers-farms',
          title: 'Farmers & Farms',
          initialRoute: 'FarmersList',
          stack: [
            { name: 'FarmersList', path: 'field-agent/farmers' },
            { name: 'FarmerProfile', path: 'field-agent/farmers/:farmerId' },
            { name: 'FAFarmDetail', path: 'field-agent/farms/:farmId' }
          ]
        },
        {
          key: 'audits-flags',
          title: 'Audits/Flags',
          initialRoute: 'AuditsList',
          stack: [
            { name: 'AuditsList', path: 'field-agent/audits' },
            { name: 'AuditDetail', path: 'field-agent/audits/:auditId' },
            { name: 'FlagsList', path: 'field-agent/flags' }
          ]
        },
        {
          key: 'chat',
          title: 'Chat',
          initialRoute: 'FAThreads',
          stack: [
            { name: 'FAThreads', path: 'field-agent/chat' },
            { name: 'FAThread', path: 'field-agent/chat/:threadId' }
          ]
        },
        {
          key: 'profile',
          title: 'Profile',
          initialRoute: 'FAProfile',
          stack: [{ name: 'FAProfile', path: 'field-agent/profile' }]
        },
        {
          key: 'settings',
          title: 'Settings',
          initialRoute: 'FASettings',
          stack: [{ name: 'FASettings', path: 'field-agent/settings' }]
        }
      ]
    },
    {
      role: 'transporter',
      initialTab: 'routes',
      tabs: [
        {
          key: 'routes',
          title: 'Routes',
          initialRoute: 'RouteBoard',
          stack: [
            { name: 'RouteBoard', path: 'transporter/routes' },
            { name: 'RouteDetail', path: 'transporter/routes/:routeId' }
          ]
        },
        {
          key: 'scans',
          title: 'Scans (QR)',
          initialRoute: 'QRScanner',
          stack: [
            { name: 'QRScanner', path: 'transporter/scans' },
            { name: 'ScanResult', path: 'transporter/scans/:scanId' }
          ]
        },
        {
          key: 'loads-manifests',
          title: 'Loads/Manifests',
          initialRoute: 'LoadsList',
          stack: [
            { name: 'LoadsList', path: 'transporter/loads' },
            { name: 'ManifestDetail', path: 'transporter/loads/:manifestId' }
          ]
        },
        {
          key: 'incidents',
          title: 'Incidents',
          initialRoute: 'IncidentsList',
          stack: [
            { name: 'IncidentsList', path: 'transporter/incidents' },
            { name: 'IncidentDetail', path: 'transporter/incidents/:incidentId' },
            { name: 'NewIncident', path: 'transporter/incidents/new' }
          ]
        },
        {
          key: 'chat',
          title: 'Chat',
          initialRoute: 'TRThreads',
          stack: [
            { name: 'TRThreads', path: 'transporter/chat' },
            { name: 'TRThread', path: 'transporter/chat/:threadId' }
          ]
        },
        {
          key: 'profile',
          title: 'Profile',
          initialRoute: 'TRProfile',
          stack: [{ name: 'TRProfile', path: 'transporter/profile' }]
        },
        {
          key: 'settings',
          title: 'Settings',
          initialRoute: 'TRSettings',
          stack: [{ name: 'TRSettings', path: 'transporter/settings' }]
        }
      ]
    },
    {
      role: 'exporter',
      initialTab: 'dashboard',
      tabs: [
        {
          key: 'dashboard',
          title: 'Dashboard',
          initialRoute: 'EXPDashboard',
          stack: [{ name: 'EXPDashboard', path: 'exporter/dashboard' }]
        },
        {
          key: 'lots',
          title: 'Lots',
          initialRoute: 'EXPLots',
          stack: [
            { name: 'EXPLots', path: 'exporter/lots' },
            { name: 'EXPLotDetail', path: 'exporter/lots/:lotId' }
          ]
        },
        {
          key: 'certificates',
          title: 'Certificates',
          initialRoute: 'Certificates',
          stack: [
            { name: 'Certificates', path: 'exporter/certificates' },
            { name: 'CertificateDetail', path: 'exporter/certificates/:certId' }
          ]
        },
        {
          key: 'audits',
          title: 'Audits',
          initialRoute: 'EXPAudits',
          stack: [
            { name: 'EXPAudits', path: 'exporter/audits' },
            { name: 'EXPAuditDetail', path: 'exporter/audits/:auditId' }
          ]
        },
        {
          key: 'analytics',
          title: 'Analytics (lite)',
          initialRoute: 'EXPAnalytics',
          stack: [{ name: 'EXPAnalytics', path: 'exporter/analytics' }]
        },
        {
          key: 'chat',
          title: 'Chat',
          initialRoute: 'EXPThreads',
          stack: [
            { name: 'EXPThreads', path: 'exporter/chat' },
            { name: 'EXPThread', path: 'exporter/chat/:threadId' }
          ]
        },
        {
          key: 'profile-settings',
          title: 'Profile/Settings',
          initialRoute: 'EXPProfile',
          stack: [
            { name: 'EXPProfile', path: 'exporter/profile' },
            { name: 'EXPSettings', path: 'exporter/settings' }
          ]
        }
      ]
    },
    {
      role: 'coop-admin',
      initialTab: 'overview',
      tabs: [
        {
          key: 'overview',
          title: 'Overview',
          initialRoute: 'CoopOverview',
          stack: [{ name: 'CoopOverview', path: 'coop-admin/overview' }]
        },
        {
          key: 'members-farms',
          title: 'Members & Farms',
          initialRoute: 'MembersList',
          stack: [
            { name: 'MembersList', path: 'coop-admin/members' },
            { name: 'MemberDetail', path: 'coop-admin/members/:memberId' },
            { name: 'CAFarmDetail', path: 'coop-admin/farms/:farmId' }
          ]
        },
        {
          key: 'data-quality',
          title: 'Data Quality',
          initialRoute: 'DataQualityBoard',
          stack: [
            { name: 'DataQualityBoard', path: 'coop-admin/data-quality' },
            { name: 'DataIssueDetail', path: 'coop-admin/data-quality/:issueId' }
          ]
        },
        {
          key: 'incentives',
          title: 'Incentives/Payments',
          initialRoute: 'Incentives',
          stack: [
            { name: 'Incentives', path: 'coop-admin/incentives' },
            { name: 'PaymentDetail', path: 'coop-admin/incentives/:paymentId' }
          ]
        },
        {
          key: 'audits',
          title: 'Audits',
          initialRoute: 'CAAudits',
          stack: [
            { name: 'CAAudits', path: 'coop-admin/audits' },
            { name: 'CAAuditDetail', path: 'coop-admin/audits/:auditId' }
          ]
        },
        {
          key: 'chat',
          title: 'Chat',
          initialRoute: 'CAThreads',
          stack: [
            { name: 'CAThreads', path: 'coop-admin/chat' },
            { name: 'CAThread', path: 'coop-admin/chat/:threadId' }
          ]
        },
        {
          key: 'settings',
          title: 'Settings',
          initialRoute: 'CASettings',
          stack: [{ name: 'CASettings', path: 'coop-admin/settings' }]
        }
      ]
    },
    {
      role: 'consumer',
      initialTab: 'scan',
      tabs: [
        {
          key: 'scan',
          title: 'Scan',
          initialRoute: 'ConsumerScan',
          stack: [
            { name: 'ConsumerScan', path: 'consumer/scan' },
            { name: 'ScanResult', path: 'consumer/scan/:scanId' }
          ]
        },
        {
          key: 'trace',
          title: 'Trace Timeline',
          initialRoute: 'TraceTimeline',
          stack: [{ name: 'TraceTimeline', path: 'consumer/trace/:lotId' }]
        },
        {
          key: 'certifications',
          title: 'Certifications',
          initialRoute: 'ConsumerCerts',
          stack: [{ name: 'ConsumerCerts', path: 'consumer/certifications' }]
        },
        {
          key: 'story',
          title: 'Story/Impact',
          initialRoute: 'StoryImpact',
          stack: [{ name: 'StoryImpact', path: 'consumer/story/:lotId' }]
        },
        {
          key: 'feedback',
          title: 'Feedback/Share',
          initialRoute: 'Feedback',
          stack: [
            { name: 'Feedback', path: 'consumer/feedback' },
            { name: 'Share', path: 'consumer/share' }
          ]
        },
        {
          key: 'settings',
          title: 'Settings',
          initialRoute: 'ConsumerSettings',
          stack: [{ name: 'ConsumerSettings', path: 'consumer/settings' }]
        }
      ]
    },
    {
      role: 'system-admin',
      initialTab: 'health',
      tabs: [
        {
          key: 'health',
          title: 'Health',
          initialRoute: 'SysHealth',
          stack: [{ name: 'SysHealth', path: 'system-admin/health' }]
        },
        {
          key: 'users-roles',
          title: 'Users & Roles',
          initialRoute: 'SysUsers',
          stack: [
            { name: 'SysUsers', path: 'system-admin/users' },
            { name: 'SysUserDetail', path: 'system-admin/users/:userId' },
            { name: 'SysRoles', path: 'system-admin/roles' }
          ]
        },
        {
          key: 'jobs',
          title: 'Jobs (Merkle/Backfills)',
          initialRoute: 'SysJobs',
          stack: [
            { name: 'SysJobs', path: 'system-admin/jobs' },
            { name: 'JobDetail', path: 'system-admin/jobs/:jobId' }
          ]
        },
        {
          key: 'logs-alerts',
          title: 'Logs/Alerts',
          initialRoute: 'SysLogs',
          stack: [
            { name: 'SysLogs', path: 'system-admin/logs' },
            { name: 'AlertDetail', path: 'system-admin/alerts/:alertId' }
          ]
        },
        {
          key: 'config-flags',
          title: 'Config/Flags',
          initialRoute: 'SysConfig',
          stack: [
            { name: 'SysConfig', path: 'system-admin/config' },
            { name: 'FeatureFlags', path: 'system-admin/flags' }
          ]
        },
        {
          key: 'settings',
          title: 'Settings',
          initialRoute: 'SysSettings',
          stack: [{ name: 'SysSettings', path: 'system-admin/settings' }]
        }
      ]
    }
  ]
};
