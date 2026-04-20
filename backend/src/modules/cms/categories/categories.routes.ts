import { FastifyInstance } from 'fastify';
import { CategoriesService } from './categories.service';
import { createCategorySchema, updateCategorySchema } from './categories.schema';

export async function categoriesRoutes(app: FastifyInstance) {
  const categoriesService = new CategoriesService(app.prisma);

  app.get('/', async (request, reply) => {
    try {
      const categories = await categoriesService.getAll();
      return { success: true, data: categories };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, message: 'Lỗi khi tải danh mục' });
    }
  });
  
  app.post('/', {
    schema: { body: createCategorySchema },
    preHandler: async (request, reply) => {
      await app.authenticate(request, reply);
    }
  }, async (request, reply) => {
    try {
      const category = await categoriesService.create(request.body as any);
      return { success: true, data: category };
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Lỗi khi tạo danh mục' });
    }
  });

  app.put('/:id', {
    schema: { body: updateCategorySchema },
    preHandler: async (request, reply) => {
      await app.authenticate(request, reply);
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const category = await categoriesService.update(id, request.body as any);
      return { success: true, data: category };
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Lỗi khi cập nhật danh mục' });
    }
  });

  app.delete('/:id', {
    preHandler: async (request, reply) => {
      await app.authenticate(request, reply);
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await categoriesService.delete(id);
      return { success: true, message: 'Đã xóa danh mục' };
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Lỗi khi xóa danh mục' });
    }
  });
}
