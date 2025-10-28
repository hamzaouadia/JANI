# JANI Database Seed Data Documentation

## Overview
This directory contains seed data files and scripts to populate the JANI platform databases with realistic test data for development and testing purposes.

## 📁 Seed Data Files

### 1. **seed-users.json** (5 users)
Pre-existing user accounts for all role types:
- **admin@jani.test** - System Administrator (ADMIN-001) - Password: `Admin123!`
- **farm-owner@jani.test** - Farm Owner (REG-98241) - Password: `Password123!`
- **exporter@jani.test** - Exporter (EXP-7781) - Password: `Password123!`
- **buyer@jani.test** - Buyer (BUY-5542) - Password: `Password123!`
- **logistics@jani.test** - Logistics Provider (FLEET-204) - Password: `Password123!`

### 2. **seed-farms.json** (8 farms)
Diverse farm operations across Tanzania:
- **High Valley Farms** - Coffee (Kilimanjaro Region)
- **Mountain View Coffee Estate** - Arabica Coffee (Arusha Region)
- **Sunset Organic Farm** - Tea (Mbeya Region)
- **Green Hills Agriculture** - Avocado (Moshi District)
- **Tropical Fruit Collective** - Mango (Tanga Region)
- **Golden Fields Cooperative** - Cashew (Lindi Region)
- **Sunrise Organic Vegetables** - Mixed Vegetables (Dar es Salaam)
- **Heritage Coffee Plantation** - Robusta Coffee (Kagera Region)

### 3. **seed-plots.json** (10 plots)
Individual farm plots with sensor data and growth stages:
- Coffee plots in various stages (planning, growing, harvesting, completed)
- Mango, avocado, tea, and cashew cultivation areas
- Sensor configurations (soil moisture, weather stations)
- Plot sizes ranging from 7-30 hectares

### 4. **seed-partners.json** (14 partnerships)
Business relationships between platform users:
- Exporter partnerships (Premium Coffee Exporters Ltd, Fresh Fruit Exporters, etc.)
- Buyer relationships (Fair Trade International, Global Coffee Roasters)
- Logistics partners (SwiftMove Logistics, OceanFreight Services)
- Agricultural advisors (AgriTech Consultants)

### 5. **seed-orders.json** (15 orders)
Active and historical orders across the supply chain:
- Farm-to-exporter orders (Coffee, Mango, Avocado, Cashew)
- International exports to Europe, Asia, Australia
- Logistics shipments with temperature control
- Multiple order statuses: preparing, awaiting_pickup, in_transit, delivered
- Order values ranging from $600 to $97,500

### 6. **seed-traceability.json** (20 events)
Complete traceability timeline from farm to export:
- **Planning Phase**: plot_registration, land_preparation, soil_test
- **Planting Phase**: seed_planting with variety details
- **Growing Phase**: irrigation, fertilizer_application, pesticide_application, pruning
- **Harvesting Phase**: harvest_start, harvest_collection with quality grades
- **Post-Harvest**: sorting_grading, washing, packaging, storage
- **Quality Assurance**: quality_inspection, quality_check, certification_audit
- **Distribution**: transfer_to_exporter, cold_storage

## 🚀 Quick Start

### Run All Seed Scripts
```bash
cd services/auth
./seed-database.sh
```

This master script will:
1. ✅ Check MongoDB connection
2. 👥 Verify users are seeded (or seed them)
3. 🌾 Seed farms, plots, partners, and orders
4. 📝 Seed traceability events
5. 📊 Display final database state

### Run Individual Seed Scripts

**Seed main application data only:**
```bash
cd services/auth
node seed-all-data.js
```

**Seed traceability events only:**
```bash
cd services/auth
node seed-traceability-events.js
```

**Seed users only:**
```bash
cd services/auth
npm run seed
# or
node src/scripts/seedUsers.js
```

## 📊 Seeded Database State

After running the seed scripts, your database will contain:

| Collection | Database | Count | Description |
|------------|----------|-------|-------------|
| users | jani-ai-auth | 5 | All user roles (admin, farm, exporter, buyer, logistics) |
| farms | jani-ai-auth | 8 | Diverse farm operations |
| plots | jani-ai-auth | 10 | Individual cultivation plots |
| partneraccesses | jani-ai-auth | 14 | Business partnerships |
| orders | jani-ai-auth | 15 | Active and completed orders |
| traceabilityevents | jani-traceability | 20 | Complete farm-to-export timeline |

**Total Documents**: 72

## 🧪 Testing Scenarios

### 1. Farm Owner Login
```
Email: farm-owner@jani.test
Password: Password123!
Features: View farms, manage plots, track orders, record traceability events
```

**Available Data:**
- 3 farms owned (High Valley Farms, Mountain View Coffee Estate, Sunset Organic Farm)
- 4 plots across these farms
- 3 active orders in various stages
- Complete traceability history for Plot B-South

### 2. Exporter Login
```
Email: exporter@jani.test
Password: Password123!
Features: Manage export orders, view partnerships, track shipments
```

**Available Data:**
- 3 export orders (1 delivered, 1 in-transit, 1 preparing)
- Partnerships with 3 international buyers
- Logistics coordination with OceanFreight Services

### 3. Admin Login
```
Email: admin@jani.test
Password: Admin123!
Features: Full platform access, user management, analytics, system settings
```

**Available Data:**
- Complete visibility across all users, farms, orders
- Analytics data from 8 farms and 15 orders
- System-wide traceability events

### 4. Buyer Login
```
Email: buyer@jani.test
Password: Password123!
Features: Browse products, place orders, track deliveries
```

**Available Data:**
- 2 purchase orders (both preparing/in-transit)
- Partnerships with 2 exporters
- Order tracking across international shipments

### 5. Logistics Provider Login
```
Email: logistics@jani.test
Password: FLEET-204
Features: Manage shipments, optimize routes, update delivery status
```

**Available Data:**
- 3 active logistics assignments
- Temperature-controlled transport for perishables
- Multi-farm collection routes

## 🌍 Geographic Distribution

Farms are distributed across Tanzania's agricultural regions:
- **Kilimanjaro Region**: Coffee cultivation at high altitudes
- **Arusha Region**: Premium Arabica coffee estates
- **Tanga Region**: Tropical fruit production (Mango)
- **Mbeya Region**: Tea plantations
- **Lindi Region**: Cashew nut cooperatives
- **Kagera Region**: Robusta coffee heritage plantations
- **Dar es Salaam Region**: Organic vegetable farms near urban markets

## 📈 Order Status Distribution

- **Preparing**: 6 orders (40%)
- **In Transit**: 5 orders (33%)
- **Awaiting Pickup**: 2 orders (13%)
- **Delivered**: 2 orders (13%)

## 🌱 Crop Varieties

- **Coffee**: 5 farms (Arabica Bourbon, Robusta)
- **Mango**: 1 farm (Kent, Tommy Atkins varieties)
- **Avocado**: 1 farm (Hass variety)
- **Tea**: 1 farm (Black tea)
- **Cashew**: 1 farm
- **Mixed Vegetables**: 1 farm

## 🔄 Traceability Timeline Example

**High Valley Farms - Plot B-South** (Complete Coffee Lifecycle):
1. ✅ Plot Registration (Jan 15, 2025)
2. ✅ Land Preparation (Feb 1, 2025)
3. ✅ Soil Testing (Feb 10, 2025)
4. ✅ Seed Planting - Arabica Bourbon (Mar 5, 2025)
5. ✅ Irrigation System Installation (Apr 12, 2025)
6. ✅ Organic Fertilizer Application (May 20, 2025)
7. ✅ Organic Pest Control (Jun 15, 2025)
8. ✅ Pruning (Jul 10, 2025)
9. ✅ Pre-Harvest Quality Inspection (Aug 25, 2025)
10. ✅ Harvest Start (Sep 15, 2025)
11. ✅ Harvest Collection - 450kg Grade A (Sep 20, 2025)
12. ✅ Sorting & Grading (Sep 21, 2025)
13. ✅ Washed Processing (Sep 21, 2025)
14. ✅ Packaging for Export (Oct 5, 2025)
15. ✅ Final Quality Check (Oct 8, 2025)
16. ✅ Climate-Controlled Storage (Oct 10, 2025)
17. ✅ Transfer to Exporter (Oct 15, 2025)

## 🛠️ Maintenance

### Clear All Seed Data
```bash
docker exec jani-mongo mongosh jani-ai-auth --eval "
  db.farms.deleteMany({});
  db.plots.deleteMany({});
  db.partneraccesses.deleteMany({});
  db.orders.deleteMany({});
"

docker exec jani-mongo mongosh jani-traceability --eval "
  db.traceabilityevents.deleteMany({});
"
```

### Re-seed Database
```bash
cd services/auth
./seed-database.sh
```

### Verify Seed Data
```bash
docker exec jani-mongo mongosh --quiet --eval "
  ['jani-ai-auth', 'jani-traceability'].forEach(function(dbName) {
    db = db.getSiblingDB(dbName);
    print('Database: ' + dbName);
    db.getCollectionNames().forEach(function(col) {
      print('  ' + col + ': ' + db[col].countDocuments() + ' documents');
    });
  });
"
```

## 🎯 Use Cases Supported

1. **Supply Chain Traceability**: Complete coffee bean journey from plot to export
2. **Multi-Farm Management**: Farm owner with multiple properties and crops
3. **Export Operations**: International shipping with compliance and certification
4. **Quality Assurance**: Inspection, grading, and certification workflows
5. **Logistics Coordination**: Temperature-controlled transport and route optimization
6. **Business Partnerships**: Buyer-seller-logistics network relationships
7. **Organic Certification**: Audit trail for organic and fair trade compliance
8. **Geographic Analytics**: Regional distribution and crop diversity analysis

## 📝 Notes

- All timestamps are in UTC
- Prices are in USD
- Quantities use metric units (kg, hectares)
- GPS coordinates are actual Tanzanian agricultural regions
- Seed data is designed for realistic testing scenarios
- All passwords are intentionally simple for development purposes

## 🔐 Security Note

**⚠️ WARNING**: This seed data is for **development and testing only**. 
- Never use these credentials in production
- All passwords are publicly documented
- Reset all data before production deployment

## 📞 Support

For issues or questions about seed data:
1. Check MongoDB connection: `docker ps | grep mongo`
2. Review seed logs in the script output
3. Verify database state with the verification commands above
4. Clear and re-run seed scripts if data is corrupted

---

Last Updated: October 23, 2025
