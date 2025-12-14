import Fastify from 'fastify';
import mongoose from 'mongoose';
import winston from 'winston';

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 3000;

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// Register plugins
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/helmet'));
fastify.register(import('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '15 minutes',
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Mock package data
const packages = [
  {
    name: 'math',
    version: '1.0.0',
    description: 'Built-in math module',
    author: 'Kexra Team',
    license: 'MIT',
  },
  {
    name: 'math-extra',
    version: '0.1.0',
    description: 'Extra math utilities',
    author: 'manjunathh-xyz',
    license: 'MIT',
  },
];

// Routes
fastify.get('/packages', async () => {
  logger.info('GET /packages');
  return packages;
});

fastify.get('/packages/:name', async (request) => {
  const { name } = request.params as { name: string };
  const pkg = packages.find((p) => p.name === name);
  if (!pkg) {
    throw fastify.httpErrors.notFound('Package not found');
  }
  logger.info(`GET /packages/${name}`);
  return pkg;
});

fastify.get('/packages/:name/versions', async (request) => {
  const { name } = request.params as { name: string };
  // Mock versions
  return [{ version: '0.1.0', publishedAt: new Date().toISOString() }];
});

fastify.get('/search', async (request) => {
  const { q } = request.query as { q: string };
  const results = packages.filter((p) => p.name.includes(q) || p.description?.includes(q));
  return results;
});

// Publish endpoint
fastify.post(
  '/publish',
  {
    preHandler: async (request) => {
      const auth = request.headers.authorization;
      if (!auth || !auth.startsWith('Bearer ')) {
        throw fastify.httpErrors.unauthorized('Missing token');
      }
      const token = auth.substring(7);
      if (token !== process.env.REGISTRY_PUBLISH_TOKEN) {
        throw fastify.httpErrors.forbidden('Invalid token');
      }
    },
  },
  async (request) => {
    const body = request.body as any;
    logger.info('POST /publish', body);
    // Validate package
    if (!body.name || !body.version) {
      throw fastify.httpErrors.badRequest('Invalid package data');
    }
    // In real implementation, store in DB
    return { message: 'Package published successfully' };
  }
);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: PORT as number, host: '0.0.0.0' });
    logger.info(`Server running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
