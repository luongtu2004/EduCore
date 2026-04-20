import { FastifyReply, FastifyRequest } from 'fastify';
import { BannersService } from './banners.service';
import { CreateBannerInput, UpdateBannerInput } from './banners.schema';

export class BannersController {
  constructor(private bannersService: BannersService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const banners = await this.bannersService.getAll();
    return reply.send({ success: true, data: banners });
  }

  async create(request: FastifyRequest<{ Body: CreateBannerInput }>, reply: FastifyReply) {
    const banner = await this.bannersService.create(request.body);
    return reply.status(201).send({ success: true, data: banner });
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateBannerInput }>, reply: FastifyReply) {
    const { id } = request.params;
    const banner = await this.bannersService.update(id, request.body);
    return reply.send({ success: true, data: banner });
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    await this.bannersService.delete(id);
    return reply.send({ success: true, message: 'Deleted successfully' });
  }
}
