import { FastifyReply, FastifyRequest } from 'fastify';
import { LearningPathService } from './learning-path.service';

export class LearningPathController {
  constructor(private service: LearningPathService) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    const paths = await this.service.list();
    return { success: true, data: paths };
  }

  async getDetail(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    const { slug } = request.params;
    const path = await this.service.getBySlug(slug);
    
    if (!path) {
      return reply.status(404).send({ success: false, message: 'Lộ trình không tồn tại' });
    }

    return { success: true, data: path };
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const path = await this.service.create(request.body);
    return { success: true, data: path };
  }
}
