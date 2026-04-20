import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { loginSchema, refreshTokenSchema } from './auth.schema';

export const authRoutes: FastifyPluginAsyncZod = async (server) => {
  const authService = new AuthService(server as any);
  const authController = new AuthController(authService);

  server.post('/login', {
    schema: {
      body: loginSchema,
    },
    handler: authController.login.bind(authController),
  });

  server.post('/logout', {
    schema: {
      body: refreshTokenSchema,
    },
    handler: authController.logout.bind(authController),
  });

  server.get('/me', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: authController.me.bind(authController),
  });

  server.get('/users', {
    handler: authController.list.bind(authController),
  });

  server.post('/users', {
    handler: authController.create.bind(authController),
  });

  server.patch('/users/:id', {
    handler: authController.update.bind(authController),
  });

  server.delete('/users/:id', {
    handler: authController.delete.bind(authController),
  });
};
