import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { PORT, MONGO_URI, SERVICE_NAME } from './config';
import farmRoutes from './routes/farmRoutes';
import fieldRoutes from './routes/fieldRoutes';
import activityRoutes from './routes/activityRoutes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: SERVICE_NAME,
    uptime: process.uptime()
  });
});

// Legacy /api prefix support for existing clients
app.use('/api/farms', farmRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/activities', activityRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use(
  (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    // Log now; swap with observability tool later if needed.
    console.error(`[operations-service]`, error);
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
);

async function bootstrap() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);

    const server = app.listen(PORT, () => {
      console.log(`${SERVICE_NAME} listening on port ${PORT}`);
    });

    const shutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        mongoose.disconnect().then(() => process.exit(0));
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start operations service', error);
    process.exit(1);
  }
}

bootstrap();
