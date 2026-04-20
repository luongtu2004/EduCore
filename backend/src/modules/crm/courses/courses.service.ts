import { FastifyInstance } from 'fastify';

export class CoursesService {
  constructor(private server: FastifyInstance) {}

  private get db() {
    return (this.server.prisma as any);
  }

  async list() {
    return await this.db.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getBySlug(slug: string) {
    return await this.db.course.findUnique({
      where: { slug }
    });
  }
}
