import { z } from 'zod';
import bcrypt from 'bcrypt';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function authRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  // --- Signup ---
  server.post('/signup', async (request, reply) => {
    const body = signupSchema.parse(request.body);
    const hashed = await bcrypt.hash(body.password, 10);

    const user = await (server as any).prisma.user.create({
      data: { email: body.email, password: hashed },
    });

    const token = server.jwt.sign({ userId: user.id });
    return reply.send({ token, user: { id: user.id, email: user.email } });
  });

  // --- Login ---
  server.post('/login', async (request, reply) => {
    const body = signupSchema.parse(request.body);
    const user = await (server as any).prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) return reply.status(401).send({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(body.password, user.password);
    if (!ok) return reply.status(401).send({ error: 'Invalid credentials' });

    const token = server.jwt.sign({ userId: user.id });
    return reply.send({ token });
  });

  // --- Get current user ---
  server.get('/me', async (request, reply) => {
    try {
      await (request as any).jwtVerify();
      const userId = (request as any).user.userId;
      const user = await (server as any).prisma.user.findUnique({
        where: { id: userId },
      });
      return reply.send({ user: { id: user.id, email: user.email } });
    } catch (err) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }
  });

  // --- Health check for auth routes ---
  server.get('/health', async () => ({ status: 'ok', message: 'Auth service is running' }));
}
