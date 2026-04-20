import { FastifyInstance } from 'fastify';
import { CreateLeadInput, UpdateLeadStatusInput } from './leads.schema';

export class LeadsService {
  constructor(private server: FastifyInstance) {}

  async getAllLeads() {
    return this.server.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLead(input: CreateLeadInput) {
    const lead = await this.server.prisma.lead.create({
      data: {
        fullName: input.fullName,
        email: input.email || null,
        phone: input.phone,
        source: input.source || 'WEBSITE',
        status: 'NEW',
        note: input.note,
      },
    });

    await this.server.prisma.activityLog.create({
      data: {
        leadId: lead.id,
        type: 'CREATED',
        content: `Lead mới đăng ký từ ${lead.source}`,
      },
    });

    return lead;
  }

  async updateStatus(leadId: string, input: UpdateLeadStatusInput, consultantId: string) {
    const oldLead = await this.server.prisma.lead.findUnique({ where: { id: leadId } });
    
    const updatedLead = await this.server.prisma.lead.update({
      where: { id: leadId },
      data: { 
        status: input.status, 
        consultantId 
      },
    });

    await this.server.prisma.activityLog.create({
      data: {
        leadId,
        type: 'STATUS_CHANGE',
        content: `Cập nhật trạng thái: ${oldLead?.status} -> ${input.status}. Ghi chú: ${input.note || 'Không có'}`,
      },
    });

    return updatedLead;
  }
}
