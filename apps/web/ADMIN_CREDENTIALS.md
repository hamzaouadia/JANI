# Admin Panel Access

## Admin Credentials

### Default Admin Account
- **Email**: `admin@jani.test`
- **Password**: `Admin123!`
- **Admin ID**: `ADMIN-001`
- **Access Level**: Full System Access

## Accessing the Admin Panel

1. **Login**: Navigate to `http://localhost:3001/login`
2. **Enter Credentials**: Use the admin email and password above
3. **Admin Panel**: After successful login, navigate to `http://localhost:3001/admin`

## Admin Panel Features

### 1. Dashboard (`/admin`)
- System overview with key metrics
- Recent activity timeline
- Pending actions and alerts
- Quick action buttons

### 2. Users Management (`/admin/users`)
- View all users across all roles
- Search and filter by role/status
- Manage user accounts (view, edit, suspend)
- User statistics and analytics

### 3. Farms Management (`/admin/farms`)
- Monitor all registered farms
- View farm details, certifications, and plots
- Track farm verification status
- Manage farm registrations

### 4. Exporters Management (`/admin/exporters`)
- Oversee licensed exporters
- Monitor license expiry dates
- Track compliance scores
- Manage exporter applications

### 5. Traceability Monitoring (`/admin/traceability`)
- View all traceability events system-wide
- Verify event authenticity
- Filter by event type and status
- GPS verification tracking

### 6. Analytics Dashboard (`/admin/analytics`)
- Platform-wide metrics and trends
- Activity breakdown by category
- Regional statistics
- System performance monitoring

### 7. Settings (`/admin/settings`)
- General platform configuration
- Security settings (2FA, password policies)
- Notification preferences
- Email/SMTP configuration
- Database management
- API key management

## Security Features

- **Role-Based Access Control**: Only users with `admin` role can access the admin panel
- **Session Management**: Automatic timeout after inactivity
- **Audit Logging**: All admin actions are logged (coming soon)
- **Protected Routes**: Middleware enforces admin-only access

## Test Accounts

In addition to the admin account, the following test accounts are available:

### Farm Owner
- **Email**: `farm-owner@jani.test`
- **Password**: `Password123!`
- **Registration ID**: `REG-98241`

### Exporter
- **Email**: `exporter@jani.test`
- **Password**: `Password123!`
- **License**: `EXP-7781`

### Buyer
- **Email**: `buyer@jani.test`
- **Password**: `Password123!`
- **Buyer Code**: `BUY-5542`

### Logistics
- **Email**: `logistics@jani.test`
- **Password**: `Password123!`
- **Fleet Code**: `FLEET-204`

## Production Deployment

⚠️ **Important**: Before deploying to production:

1. **Change Default Password**: Update the admin password immediately
2. **Remove Test Accounts**: Delete or disable all test accounts
3. **Enable 2FA**: Require two-factor authentication for admin accounts
4. **Set Strong Password Policy**: Enforce minimum password requirements
5. **Review Access Logs**: Monitor admin access regularly
6. **Backup Database**: Ensure regular automated backups
7. **SSL/TLS**: Use HTTPS in production environments

## Troubleshooting

### Cannot Access Admin Panel
- Ensure you're logged in with an admin role account
- Clear browser cookies and try logging in again
- Check that the auth service is running

### Unauthorized Access Error
- Verify your account has the `admin` role
- Contact system administrator to upgrade your account

### Login Issues
- Ensure auth service is running: `docker-compose up auth -d`
- Check that seed users have been loaded
- Verify database connectivity

## Support

For admin panel issues or feature requests, please contact the development team or create an issue in the project repository.
