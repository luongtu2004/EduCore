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

  async updateStatus(request: FastifyRequest<{ Params: { id: string }, Body: UpdateLeadStatusInput }>, reply: FastifyReply) {
    const user = request.user as { id: string };
    const lead = await this.leadsService.updateStatus(request.params.id, request.body, user.id);
    return reply.send({ success: true, data: lead });
  }
}
