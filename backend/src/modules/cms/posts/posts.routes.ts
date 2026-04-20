import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { createPostSchema, createCategorySchema } from './posts.schema';

export const postRoutes: FastifyPluginAsyncZod = async (server) => {
  const postsService = new PostsService(server as any);
  const postsController = new PostsController(postsService);

  // Public APIs
  server.get('/public', postsController.listPublic.bind(postsController));
  server.get('/public/:slug', postsController.getDetail.bind(postsController));
  server.get('/categories', postsController.listCategories.bind(postsController));
  server.get('/', postsController.list.bind(postsController));

  // Admin/Editor APIs
  server.post('/', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: createPostSchema },
    handler: postsController.create.bind(postsController),
  });

  server.post('/categories', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: createCategorySchema },
    handler: postsController.createCategory.bind(postsController),
  });

  server.patch('/:id', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: postsController.update.bind(postsController),
  });

  server.delete('/:id', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: postsController.delete.bind(postsController),
  });
};
