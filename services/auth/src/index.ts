import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const server = Fastify({ logger: true });

// Register plugins
server.register(cors, { origin: true });
server.register(jwt, { secret: process.env.JWT_SECRET || 'dev-secret' });

// Decorate server with prisma client for easy access in routes
server.decorate('prisma', prisma);

// Register auth routes with a prefix
server.register(authRoutes, { prefix: '/v1/auth' });

// Start the server
const start = async () => {
  try {
    await prisma.$connect();
    await server.listen({ port: Number(process.env.PORT) || 4001, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();


