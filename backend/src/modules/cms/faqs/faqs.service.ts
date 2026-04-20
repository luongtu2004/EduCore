import { PrismaClient } from '@prisma/client';
import { CreateFAQInput, UpdateFAQInput } from './faqs.schema';

export class FAQsService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.faq.findMany({
      orderBy: { order: 'asc' }
    });
  }

  async create(data: CreateFAQInput) {
    return this.prisma.faq.create({
      data
    });
  }

  async update(id: string, data: UpdateFAQInput) {
    return this.prisma.faq.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.faq.delete({
      where: { id }
    });
  }
}
