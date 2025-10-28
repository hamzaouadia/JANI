"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const farmRoutes_1 = __importDefault(require("./routes/farmRoutes"));
const fieldRoutes_1 = __importDefault(require("./routes/fieldRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
app.use((0, morgan_1.default)('dev'));
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: config_1.SERVICE_NAME,
        uptime: process.uptime()
    });
});
app.use('/farms', farmRoutes_1.default);
app.use('/fields', fieldRoutes_1.default);
app.use('/activities', activityRoutes_1.default);
// Legacy /api prefix support for existing clients
app.use('/api/farms', farmRoutes_1.default);
app.use('/api/fields', fieldRoutes_1.default);
app.use('/api/activities', activityRoutes_1.default);
app.use((_req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});
app.use((error, _req, res, _next) => {
    // Log now; swap with observability tool later if needed.
    console.error(`[operations-service]`, error);
    res.status(500).json({ message: 'Internal server error', detail: error.message });
});
async function bootstrap() {
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(config_1.MONGO_URI);
        console.log(`Connected to MongoDB at ${config_1.MONGO_URI}`);
        const server = app.listen(config_1.PORT, () => {
            console.log(`${config_1.SERVICE_NAME} listening on port ${config_1.PORT}`);
        });
        const shutdown = () => {
            console.log('Shutting down gracefully...');
            server.close(() => {
                mongoose_1.default.disconnect().then(() => process.exit(0));
            });
        };
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
    catch (error) {
        console.error('Failed to start operations service', error);
        process.exit(1);
    }
}
bootstrap();
