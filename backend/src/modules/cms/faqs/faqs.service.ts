import { PrismaClient } from '@prisma/client';
import { CreateFAQInput, UpdateFAQInput } from './faqs.schema';

export class FAQsService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.fAQ.findMany({
      orderBy: { order: 'asc' }
    });
  }

  async create(data: CreateFAQInput) {
    return this.prisma.fAQ.create({
      data
    });
  }

  async update(id: string, data: UpdateFAQInput) {
    return this.prisma.fAQ.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.fAQ.delete({
      where: { id }
    });
  }
}
