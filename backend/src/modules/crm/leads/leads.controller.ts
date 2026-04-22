import { FastifyReply, FastifyRequest } from 'fastify';
import { LeadsService } from './leads.service';
import { CreateLeadInput, UpdateLeadStatusInput } from './leads.schema';

export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    const leads = await this.leadsService.getAllLeads();
    return reply.send({ success: true, data: leads });
  }

  async create(request: FastifyRequest<{ Body: CreateLeadInput }>, reply: FastifyReply) {
    const lead = await this.leadsService.createLead(request.body);
    return reply.status(201).send({ success: true, data: lead });
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const user = request.user as any;
    const result = await this.leadsService.updateStatus(id, body, user.id);
    return { success: true, data: result };
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await this.leadsService.getById(id);
    return { success: true, data: result };
  }

  async assignLead(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const user = request.user as any;
    const result = await this.leadsService.assignLead(id, body, user.id);
    return { success: true, data: result };
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const success = await this.leadsService.deleteLead(id);
    if (!success) {
      return reply.status(404).send({ success: false, message: 'Not found' });
    }
    return { success: true };
  }
}
