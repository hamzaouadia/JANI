import type { UserRole } from '@/constants/userRoles';
// Map existing auth roles to navigation roles in navMatrix
// - 'farm' approximates to 'farm-manager'
// - 'logistics' approximates to 'transporter'
// - 'buyer' approximates to 'consumer' (lite app)
export const mapAuthRoleToNavRole = (role: UserRole): string => {
  switch (role) {
    case 'farm':
      return 'farm-manager';
    case 'logistics':
      return 'transporter';
    case 'exporter':
      return 'exporter';
    case 'buyer':
      return 'consumer';
    default:
      return 'farm-manager';
  }
};
