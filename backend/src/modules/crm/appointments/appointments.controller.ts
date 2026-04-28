import { FastifyReply, FastifyRequest } from 'fastify';
import { AppointmentsService } from './appointments.service';

export class AppointmentsController {
  constructor(private service: AppointmentsService) {}

  async list(request: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) {
    const appointments = await this.service.list(request.query);
    return { success: true, data: appointments };
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const appointment = await this.service.create(request.body);
    return { success: true, data: appointment };
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const appointment = await this.service.update(id, request.body);
    return { success: true, data: appointment };
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    await this.service.delete(id);
    return { success: true, message: 'Xóa lịch hẹn thành công' };
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const appointment = await this.service.getById(id);
    if (!appointment) {
      return reply.status(404).send({ success: false, message: 'Không tìm thấy lịch hẹn' });
    }
    return { success: true, data: appointment };
  }
}
