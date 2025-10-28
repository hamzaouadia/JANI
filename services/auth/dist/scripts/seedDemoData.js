"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const dataModels_1 = require("../dataModels");
const FARMS = [];
const PARTNERS = [];
const ORDERS = [
    {
        ownerRole: "farm",
        ownerIdentifier: "REG-98241",
        reference: "Block 12 avocado harvest",
        partner: "Sunrise Exporters",
        destination: "Athi River packhouse",
        status: "in_transit",
        dueDate: "2024-10-17",
        quantity: "4 truckloads (18 tons)",
        value: "USD 48,600",
        lastUpdated: "2024-10-15T08:10:00Z",
        highlights: ["GPS shows convoy 42 km from packhouse", "Pulp temperature holding at 7.1°C"]
    },
    {
        ownerRole: "farm",
        ownerIdentifier: "REG-98241",
        reference: "Packhouse replenishment order",
        partner: "AgriPro Inputs",
        destination: "Main chemical store",
        status: "preparing",
        dueDate: "2024-10-19",
        quantity: "12 pallets of bio-stimulant",
        value: "KES 410,000",
        lastUpdated: "2024-10-14T16:25:00Z",
        highlights: ["Supplier confirmed dispatch for 18 Oct 08:00", "Finance approved invoice #INV-77142"]
    },
    {
        ownerRole: "farm",
        ownerIdentifier: "REG-98241",
        reference: "Grower delivery compliance audit",
        partner: "Valley Greens Outgrower Group",
        destination: "Farm aggregation centre",
        status: "delayed",
        dueDate: "2024-10-13",
        quantity: "9 tons French beans",
        value: "USD 21,700",
        lastUpdated: "2024-10-15T03:55:00Z",
        highlights: ["QA hold: insufficient pesticide logs uploaded", "Outgrower liaison conducting follow-up visits today"]
    },
    // Exporter orders
    {
        ownerRole: "exporter",
        ownerIdentifier: "EXP-7781",
        reference: "Flight ET 403 – berries consignment",
        partner: "Blue Ridge Farms",
        destination: "Frankfurt (FRA)",
        status: "preparing",
        dueDate: "2024-10-16",
        quantity: "2.4 tons blueberries",
        value: "EUR 36,900",
        lastUpdated: "2024-10-15T09:00:00Z",
        highlights: ["Phytosanitary certificate ready", "Cold room pre-cool completed 04:00 today"]
    },
    {
        ownerRole: "exporter",
        ownerIdentifier: "EXP-7781",
        reference: "Container MSKU 488613 – mangos",
        partner: "Coastal Grower Cooperative",
        destination: "Jebel Ali (DXB)",
        status: "in_transit",
        dueDate: "2024-10-28",
        quantity: "40 ft reefer (21.7 tons)",
        value: "USD 68,400",
        lastUpdated: "2024-10-15T05:20:00Z",
        highlights: ["Vessel: Maersk Horizon departed 13 Oct", "Remote probe shows 5.5°C, humidity 88%"]
    },
    {
        ownerRole: "exporter",
        ownerIdentifier: "EXP-7781",
        reference: "Air-freight herbs program – week 42",
        partner: "Prime Herbs Ltd",
        destination: "Heathrow (LHR)",
        status: "delayed",
        dueDate: "2024-10-12",
        quantity: "1.3 tons mixed herbs",
        value: "GBP 19,200",
        lastUpdated: "2024-10-15T02:05:00Z",
        highlights: ["Awaiting DEFRA residue clearance", "Backup slot requested on Kenya Airways 16 Oct"]
    },
    // Buyer orders
    {
        ownerRole: "buyer",
        ownerIdentifier: "BUY-5542",
        reference: "Retail promo – mango week 43",
        partner: "Sunrise Exporters",
        destination: "Nairobi regional DC",
        status: "preparing",
        dueDate: "2024-10-19",
        quantity: "16 pallets (9.6 tons)",
        value: "KES 1,180,000",
        lastUpdated: "2024-10-15T07:15:00Z",
        highlights: ["Planogram approved by merchandising team", "POS materials print run finishes 17 Oct"]
    },
    {
        ownerRole: "buyer",
        ownerIdentifier: "BUY-5542",
        reference: "HORECA avocado replenishment",
        partner: "Green Valley Packhouse",
        destination: "Hospitality channel – Nairobi",
        status: "in_transit",
        dueDate: "2024-10-16",
        quantity: "6 pallets (3.2 tons)",
        value: "KES 412,000",
        lastUpdated: "2024-10-15T09:40:00Z",
        highlights: ["Transport partner: CoolXpress truck 7", "QA team ready for 16 Oct 05:00 inspection"]
    },
    {
        ownerRole: "buyer",
        ownerIdentifier: "BUY-5542",
        reference: "Organic pineapples – seasonal trial",
        partner: "Coastal Grower Cooperative",
        destination: "Mombasa hypermarket",
        status: "delivered",
        dueDate: "2024-10-10",
        quantity: "4 pallets (2.4 tons)",
        value: "KES 268,000",
        lastUpdated: "2024-10-13T11:55:00Z",
        highlights: ["Delivered 2 days early", "Customer survey running until 22 Oct"]
    },
    // Logistics orders
    {
        ownerRole: "logistics",
        ownerIdentifier: "FLEET-204",
        reference: "Reefer dispatch – avocado export load",
        partner: "Sunrise Exporters",
        destination: "Mombasa port gate 3",
        status: "in_transit",
        dueDate: "2024-10-16",
        quantity: "2 x 40 ft reefers",
        value: "Freight revenue USD 5,600",
        lastUpdated: "2024-10-15T06:05:00Z",
        highlights: ["Telematics: avg temp 5.4°C", "ETA port 15 Oct 22:10"]
    },
    {
        ownerRole: "logistics",
        ownerIdentifier: "FLEET-204",
        reference: "Cold chain shuttle – packhouse resupply",
        partner: "Green Valley Packhouse",
        destination: "Nakuru packhouse",
        status: "awaiting_pickup",
        dueDate: "2024-10-15",
        quantity: "14 pallets mixed produce",
        value: "Freight revenue KES 68,500",
        lastUpdated: "2024-10-15T05:25:00Z",
        highlights: ["Driver on site awaiting loading clearance", "Temperature pre-trip checks complete"]
    },
    {
        ownerRole: "logistics",
        ownerIdentifier: "FLEET-204",
        reference: "Buyer distribution – Nairobi retail",
        partner: "HarvestLink buyer collective",
        destination: "Citywide retail route",
        status: "delayed",
        dueDate: "2024-10-14",
        quantity: "3 refrigerated trucks",
        value: "Freight revenue KES 112,000",
        lastUpdated: "2024-10-15T01:20:00Z",
        highlights: ["Delay caused by city permit renewal", "Permit office appointment booked for 16 Oct 09:00"]
    }
];
const seedFarms = async () => {
    for (const farmSeed of FARMS) {
        const farm = await dataModels_1.Farm.findOneAndUpdate({
            ownerRole: farmSeed.ownerRole,
            ownerIdentifier: farmSeed.ownerIdentifier,
            name: farmSeed.name
        }, {
            ownerRole: farmSeed.ownerRole,
            ownerIdentifier: farmSeed.ownerIdentifier,
            name: farmSeed.name,
            primaryCrop: farmSeed.primaryCrop,
            locationDescription: farmSeed.locationDescription,
            linked: farmSeed.linked,
            lastSync: farmSeed.lastSync ? new Date(farmSeed.lastSync) : undefined,
            nextActions: farmSeed.nextActions,
            credentials: farmSeed.credentials
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        const plotIds = new Set();
        for (const plotSeed of farmSeed.plots) {
            const plot = await dataModels_1.Plot.findOneAndUpdate({
                farmId: farm._id,
                name: plotSeed.name
            }, {
                farmId: farm._id,
                name: plotSeed.name,
                hectares: plotSeed.hectares,
                crop: plotSeed.crop,
                stage: plotSeed.stage,
                linked: plotSeed.linked,
                lastSync: plotSeed.lastSync ? new Date(plotSeed.lastSync) : undefined,
                sensors: plotSeed.sensors,
                nextActions: plotSeed.nextActions
            }, { upsert: true, new: true, setDefaultsOnInsert: true });
            plotIds.add(plot._id.toString());
        }
        // Clean up plots that are no longer in seed definition
        await dataModels_1.Plot.deleteMany({
            farmId: farm._id,
            _id: { $nin: Array.from(plotIds) }
        });
    }
    console.log(`🌾 Seeded ${FARMS.length} farm records with plots`);
};
const seedPartners = async () => {
    for (const partner of PARTNERS) {
        await dataModels_1.PartnerAccess.findOneAndUpdate({
            ownerRole: partner.ownerRole,
            ownerIdentifier: partner.ownerIdentifier,
            name: partner.name
        }, partner, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log(`🤝 Seeded ${PARTNERS.length} partner access records`);
};
const seedOrders = async () => {
    for (const order of ORDERS) {
        await dataModels_1.Order.findOneAndUpdate({
            ownerRole: order.ownerRole,
            ownerIdentifier: order.ownerIdentifier,
            reference: order.reference
        }, {
            ...order,
            dueDate: new Date(order.dueDate),
            lastUpdated: new Date(order.lastUpdated)
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log(`📦 Seeded ${ORDERS.length} order records`);
};
const seed = async () => {
    await (0, database_1.connectDatabase)();
    console.log("✅ Connected to MongoDB for demo data seeding");
    await seedFarms();
    await seedPartners();
    await seedOrders();
    await (0, database_1.disconnectDatabase)();
    console.log("✅ Demo data seeding complete. Connection closed.");
};
seed().catch((error) => {
    console.error("❌ Failed to seed demo data", error);
    (0, database_1.disconnectDatabase)().catch(() => {
        /* ignore */
    });
    process.exit(1);
});
