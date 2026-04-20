import { FastifyInstance } from 'fastify';

export class LearningPathService {
  constructor(private server: FastifyInstance) {}

  private get db() {
    return (this.server.prisma as any);
  }

  async list() {
    return await this.db.learningPath.findMany({
      where: { isActive: true },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getBySlug(slug: string) {
    return await this.db.learningPath.findUnique({
      where: { slug },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  async create(data: any) {
    const { steps, ...pathData } = data;
    return await this.db.learningPath.create({
      data: {
        ...pathData,
        steps: {
          create: steps || []
        }
      },
      include: { steps: true }
    });
  }
}
