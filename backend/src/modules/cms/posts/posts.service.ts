import { FastifyInstance } from 'fastify';
import { CreatePostInput, CreateCategoryInput } from './posts.schema';
import { slugify } from '../../../utils/slugify';

export class PostsService {
  constructor(private server: FastifyInstance) {}

  // Categories
  async createCategory(input: CreateCategoryInput) {
    return this.server.prisma.category.create({
      data: {
        name: input.name,
        slug: slugify(input.name),
      },
    });
  }

  async getCategories() {
    return this.server.prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    });
  }

  // Posts
  async createPost(input: CreatePostInput, authorId: string) {
    return this.server.prisma.post.create({
      data: {
        ...input,
        slug: slugify(input.title),
        authorId,
      },
    });
  }

  async getPublicPosts() {
    return this.server.prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: { select: { fullName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPostBySlug(slug: string) {
    return this.server.prisma.post.findUnique({
      where: { slug },
      include: { category: true, author: true },
    });
  }

  async getAllPosts() {
    return this.server.prisma.post.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
