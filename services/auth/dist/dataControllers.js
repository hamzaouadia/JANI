"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.getPartners = exports.linkFarm = exports.getFarms = void 0;
const dataModels_1 = require("./dataModels");
const statusPriority = {
    preparing: 3,
    awaiting_pickup: 2,
    in_transit: 1,
    delayed: 4,
    delivered: 0
};
const toPlotResponse = (plot) => ({
    id: plot._id.toString(),
    name: plot.name,
    hectares: plot.hectares,
    crop: plot.crop,
    stage: plot.stage,
    linked: plot.linked,
    lastSync: plot.lastSync ? plot.lastSync.toISOString() : null,
    sensors: plot.sensors,
    nextActions: plot.nextActions
});
const toFarmResponse = (farm, plots) => {
    const totalHectares = plots.reduce((sum, plot) => sum + (plot.hectares ?? 0), 0);
    const linkedPlots = plots.filter((plot) => plot.linked).length;
    const pendingTasks = (farm.nextActions?.length ?? 0) + plots.reduce((sum, plot) => sum + plot.nextActions.length, 0);
    return {
        id: farm._id.toString(),
        name: farm.name,
        primaryCrop: farm.primaryCrop,
        locationDescription: farm.locationDescription ?? null,
        linked: farm.linked,
        lastSync: farm.lastSync ? farm.lastSync.toISOString() : null,
        credentials: farm.credentials,
        nextActions: farm.nextActions,
        summary: {
            totalPlots: plots.length,
            linkedPlots,
            totalHectares: Number(totalHectares.toFixed(2)),
            pendingTasks
        },
        plots: plots.map((plot) => toPlotResponse(plot))
    };
};
const toPartnerResponse = (partner) => ({
    id: partner._id.toString(),
    name: partner.name,
    role: partner.role,
    status: partner.status,
    notes: partner.notes
});
const toOrderResponse = (order) => ({
    id: order._id.toString(),
    reference: order.reference,
    partner: order.partner,
    destination: order.destination,
    status: order.status,
    dueDate: order.dueDate.toISOString(),
    quantity: order.quantity,
    value: order.value,
    lastUpdated: order.lastUpdated.toISOString(),
    highlights: order.highlights
});
const calculateSummary = (orders) => {
    if (!orders.length) {
        return [];
    }
    const active = orders.filter((order) => order.status !== "delivered");
    const delayed = orders.filter((order) => {
        if (order.status === "delayed") {
            return true;
        }
        const now = new Date();
        return order.status !== "delivered" && order.dueDate.getTime() < now.getTime();
    });
    const nextDue = active
        .slice()
        .sort((a, b) => {
        const priorityDiff = statusPriority[b.status] - statusPriority[a.status];
        if (priorityDiff !== 0) {
            return priorityDiff;
        }
        return a.dueDate.getTime() - b.dueDate.getTime();
    })[0];
    const formatDays = (days) => {
        if (days === 0)
            return "today";
        if (days === 1)
            return "in 1 day";
        if (days === -1)
            return "1 day overdue";
        if (days > 1)
            return `in ${days} days`;
        return `${Math.abs(days)} days overdue`;
    };
    const calculateDaysUntil = (date) => {
        const now = new Date();
        const diffMs = date.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
        return Math.round(diffMs / (1000 * 60 * 60 * 24));
    };
    return [
        {
            id: "active",
            label: "Active orders",
            value: active.length.toString(),
            helper: `${orders.length} total tracked`
        },
        {
            id: "delayed",
            label: "At risk",
            value: delayed.length ? delayed.length.toString() : "0",
            helper: delayed.length ? "Requires immediate follow-up" : "All shipments on schedule"
        },
        nextDue
            ? {
                id: "next",
                label: "Next milestone",
                value: formatDays(calculateDaysUntil(nextDue.dueDate)),
                helper: `${nextDue.reference} • ${nextDue.partner}`
            }
            : {
                id: "next",
                label: "Next milestone",
                value: "No active orders"
            }
    ];
};
const getFarms = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const farms = await dataModels_1.Farm.find({
        ownerRole: user.role,
        ownerIdentifier: user.identifier
    }).sort({ createdAt: 1 });
    if (!farms.length) {
        return res.json({ farms: [] });
    }
    const plots = await dataModels_1.Plot.find({
        farmId: { $in: farms.map((farm) => farm._id) }
    }).sort({ createdAt: 1 });
    const plotsByFarm = new Map();
    for (const plot of plots) {
        const key = plot.farmId.toString();
        const bucket = plotsByFarm.get(key);
        if (bucket) {
            bucket.push(plot);
        }
        else {
            plotsByFarm.set(key, [plot]);
        }
    }
    return res.json({
        farms: farms.map((farm) => toFarmResponse(farm, plotsByFarm.get(farm._id.toString()) ?? []))
    });
};
exports.getFarms = getFarms;
const linkFarm = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ error: "Credential is required" });
    }
    const farm = await dataModels_1.Farm.findOne({
        _id: req.params.id,
        ownerRole: user.role,
        ownerIdentifier: user.identifier
    });
    if (!farm) {
        return res.status(404).json({ error: "Farm not found" });
    }
    const expected = farm.credentials.registrationId.trim().toUpperCase();
    const provided = credential.trim().toUpperCase();
    if (expected !== provided) {
        return res.status(401).json({ error: "Credential does not match our records." });
    }
    farm.linked = true;
    farm.lastSync = new Date();
    if (!farm.nextActions.includes("Notify partners about new linkage")) {
        farm.nextActions.push("Notify partners about new linkage");
    }
    await farm.save();
    const plots = await dataModels_1.Plot.find({ farmId: farm._id }).sort({ createdAt: 1 });
    return res.json({ farm: toFarmResponse(farm, plots) });
};
exports.linkFarm = linkFarm;
const getPartners = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const partners = await dataModels_1.PartnerAccess.find({
        ownerRole: user.role,
        ownerIdentifier: user.identifier
    }).sort({ createdAt: 1 });
    return res.json({ partners: partners.map((partner) => toPartnerResponse(partner)) });
};
exports.getPartners = getPartners;
const getOrders = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const orders = await dataModels_1.Order.find({ ownerRole: user.role, ownerIdentifier: user.identifier }).sort({
        dueDate: 1
    });
    return res.json({
        orders: orders.map((order) => toOrderResponse(order)),
        summary: calculateSummary(orders)
    });
};
exports.getOrders = getOrders;
