import { FastifyInstance } from 'fastify';
import { ConvertLeadToStudentInput } from './students.schema';
import { AppError } from '../../../common/errors/AppError';

export class StudentsService {
  constructor(private server: FastifyInstance) {}

  async convertLead(input: ConvertLeadToStudentInput) {
    const lead = await this.server.prisma.lead.findUnique({
      where: { id: input.leadId },
    });

    if (!lead) throw new AppError(404, 'Lead không tồn tại');

    const count = await this.server.prisma.student.count();
    const studentCode = `EC-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

    return this.server.prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          leadId: lead.id,
          fullName: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          studentCode,
        },
      });

      await tx.lead.update({
        where: { id: lead.id },
        data: { status: 'WON' },
      });

      if (input.courseId) {
        await tx.enrollment.create({
          data: {
            studentId: student.id,
            courseId: input.courseId,
            paidAmount: input.paidAmount || 0,
          },
        });
      }

      await tx.activityLog.create({
        data: {
          leadId: lead.id,
          type: 'CONVERTED',
          content: `Đã chuyển đổi thành học viên: ${studentCode}`,
        },
      });

      return student;
    });
  }

  async getStudents() {
    return this.server.prisma.student.findMany({
      include: {
        enrollments: { include: { course: true } },
      },
    });
  }
}
