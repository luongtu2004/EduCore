import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { LearningPathController } from './learning-path.controller';
import { LearningPathService } from './learning-path.service';
import { createLearningPathSchema, updateLearningPathSchema, updateLearningPathStatusSchema } from './learning-path.schema';

export const learningPathRoutes: FastifyPluginAsyncZod = async (server) => {
  const service = new LearningPathService(server as any);
  const controller = new LearningPathController(service);

  // Public API
  server.get('/', controller.list.bind(controller));
  server.get('/:slug', controller.getDetail.bind(controller));

  // Admin API
  server.post('/', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: createLearningPathSchema },
    handler: controller.create.bind(controller),
  });

  server.put('/:id', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: updateLearningPathSchema },
    handler: controller.update.bind(controller),
  });

  server.delete('/:id', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: controller.delete.bind(controller),
  });

  server.patch('/:id/status', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: updateLearningPathStatusSchema },
    handler: controller.updateStatus.bind(controller),
  });
};
