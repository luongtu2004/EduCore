import { FastifyReply, FastifyRequest } from 'fastify';
import { LearningPathService } from './learning-path.service';

export class LearningPathController {
  constructor(private service: LearningPathService) {}

  async list(request: FastifyRequest<{ Querystring: { admin?: string } }>, reply: FastifyReply) {
    const isAdmin = request.query.admin === 'true';
    const paths = await this.service.list(isAdmin);
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
    console.log('[LearningPathController] Creating new path:', JSON.stringify(request.body, null, 2));
    try {
      const path = await this.service.create(request.body);
      return { success: true, data: path };
    } catch (error: any) {
      console.error('[LearningPathController] create error:', error);
      return reply.status(400).send({ success: false, message: error.message || 'Lỗi tạo lộ trình' });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    console.log('[LearningPathController] Updating ID:', id);
    console.log('[LearningPathController] Body:', JSON.stringify(request.body, null, 2));
    try {
      const path = await this.service.update(id, request.body);
      return { success: true, data: path };
    } catch (error: any) {
      console.error('[LearningPathController] update error:', error);
      return reply.status(400).send({ success: false, message: error.message || 'Lỗi cập nhật lộ trình' });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      await this.service.delete(id);
      return { success: true, message: 'Xóa lộ trình thành công' };
    } catch (error) {
      return reply.status(400).send({ success: false, message: 'Lỗi xóa lộ trình' });
    }
  }

  async updateStatus(request: FastifyRequest<{ Params: { id: string }; Body: { isActive: boolean } }>, reply: FastifyReply) {
    const { id } = request.params;
    const { isActive } = request.body;
    try {
      await this.service.updateStatus(id, isActive);
      return { success: true, message: 'Cập nhật trạng thái thành công' };
    } catch (error) {
      return reply.status(400).send({ success: false, message: 'Lỗi cập nhật trạng thái' });
    }
  }
}
