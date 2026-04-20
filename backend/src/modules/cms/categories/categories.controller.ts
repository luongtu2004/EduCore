import { FastifyReply, FastifyRequest } from 'fastify';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schema';

export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.categoriesService.getAll();
    return reply.send({ success: true, data: categories });
  }

  async create(request: FastifyRequest<{ Body: CreateCategoryInput }>, reply: FastifyReply) {
    const category = await this.categoriesService.create(request.body);
    return reply.status(201).send({ success: true, data: category });
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateCategoryInput }>, reply: FastifyReply) {
    const { id } = request.params;
    const category = await this.categoriesService.update(id, request.body);
    return reply.send({ success: true, data: category });
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    await this.categoriesService.delete(id);
    return reply.send({ success: true, message: 'Deleted successfully' });
  }
}
