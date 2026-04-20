import { PrismaClient } from '@prisma/client';
import { CreateBannerInput, UpdateBannerInput } from './banners.schema';

export class BannersService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });
  }

  async create(data: CreateBannerInput) {
    return this.prisma.banner.create({
      data
    });
  }

  async update(id: string, data: UpdateBannerInput) {
    return this.prisma.banner.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.banner.delete({
      where: { id }
    });
  }
}
