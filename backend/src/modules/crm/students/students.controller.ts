import { FastifyReply, FastifyRequest } from 'fastify';
import { StudentsService } from './students.service';
import { ConvertLeadToStudentInput } from './students.schema';

export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    const students = await this.studentsService.getStudents();
    return reply.send({ success: true, data: students });
  }

  async convert(request: FastifyRequest<{ Body: ConvertLeadToStudentInput }>, reply: FastifyReply) {
    const student = await this.studentsService.convertLead(request.body);
    return reply.status(201).send({ success: true, data: student });
  }
}
