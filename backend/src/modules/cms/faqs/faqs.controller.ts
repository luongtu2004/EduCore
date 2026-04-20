import { FastifyReply, FastifyRequest } from 'fastify';
import { FAQsService } from './faqs.service';
import { CreateFAQInput, UpdateFAQInput } from './faqs.schema';

export class FAQsController {
  constructor(private faqsService: FAQsService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const faqs = await this.faqsService.getAll();
    return reply.send({ success: true, data: faqs });
  }

  async create(request: FastifyRequest<{ Body: CreateFAQInput }>, reply: FastifyReply) {
    const faq = await this.faqsService.create(request.body);
    return reply.status(201).send({ success: true, data: faq });
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateFAQInput }>, reply: FastifyReply) {
    const { id } = request.params;
    const faq = await this.faqsService.update(id, request.body);
    return reply.send({ success: true, data: faq });
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    await this.faqsService.delete(id);
    return reply.send({ success: true, message: 'Deleted successfully' });
  }
}
