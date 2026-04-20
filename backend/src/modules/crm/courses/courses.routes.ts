import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CoursesService } from './courses.service';

export const courseRoutes: FastifyPluginAsyncZod = async (server) => {
  const service = new CoursesService(server as any);

  server.get('/', async (request, reply) => {
    const courses = await service.list();
    return { success: true, data: courses };
  });

  server.get('/:slug', async (request: any, reply) => {
    const { slug } = request.params;
    const course = await service.getBySlug(slug);
    if (!course) return reply.status(404).send({ success: false, message: 'Khóa học không tồn tại' });
    return { success: true, data: course };
  });
};
