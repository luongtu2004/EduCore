import { FastifyReply, FastifyRequest } from 'fastify';
import { PostsService } from './posts.service';
import { CreatePostInput, CreateCategoryInput } from './posts.schema';

export class PostsController {
  constructor(private postsService: PostsService) {}

  async listPublic(request: FastifyRequest, reply: FastifyReply) {
    const posts = await this.postsService.getPublicPosts();
    return reply.send({ success: true, data: posts });
  }

  async getDetail(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    const post = await this.postsService.getPostBySlug(request.params.slug);
    if (!post) return reply.status(404).send({ success: false, message: 'Bài viết không tồn tại' });
    return reply.send({ success: true, data: post });
  }

  async create(request: FastifyRequest<{ Body: CreatePostInput }>, reply: FastifyReply) {
    const user = request.user as { id: string };
    const post = await this.postsService.createPost(request.body, user.id);
    return reply.status(201).send({ success: true, data: post });
  }

  async createCategory(request: FastifyRequest<{ Body: CreateCategoryInput }>, reply: FastifyReply) {
    const category = await this.postsService.createCategory(request.body);
    return reply.status(201).send({ success: true, data: category });
  }

  async listCategories(request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.postsService.getCategories();
    return reply.send({ success: true, data: categories });
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const posts = await this.postsService.getAllPosts();
    return reply.send({ success: true, data: posts });
  }
}
