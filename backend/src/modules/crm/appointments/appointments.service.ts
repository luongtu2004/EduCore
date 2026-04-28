import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

export class AppointmentsService {
  constructor(private server: FastifyInstance) {}

  private get db() {
    return (this.server.prisma as any) as PrismaClient;
  }

  async list(filters: any = {}) {
    const { startDate, endDate, assignedTo, status } = filters;
    const where: any = {};

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (assignedTo) where.assignedTo = assignedTo;
    if (status) where.status = status;

    return await this.db.appointment.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        // We might want to include lead or student info if needed
      }
    });
  }

  async create(data: any) {
    return await this.db.appointment.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      }
    });
  }

  async update(id: string, data: any) {
    const updateData = { ...data };
    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);

    return await this.db.appointment.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string) {
    return await this.db.appointment.delete({
      where: { id }
    });
  }

  async getById(id: string) {
    return await this.db.appointment.findUnique({
      where: { id }
    });
  }
}
