import { FastifyInstance } from 'fastify';
import { CreatePostInput, CreateCategoryInput } from './posts.schema';
import { slugify } from '../../../utils/slugify';
import { MongoClient, ObjectId } from 'mongodb';

export class PostsService {
  private mongoClient: MongoClient;

  constructor(private server: FastifyInstance) {
    this.mongoClient = new MongoClient(process.env.DATABASE_URL || '');
  }

  // Helper to get DB
  private async getDb() {
    await this.mongoClient.connect();
    return this.mongoClient.db();
  }

  // Categories
  async createCategory(input: CreateCategoryInput) {
    const db = await this.getDb();
    const result = await db.collection('cms_categories').insertOne({
      name: input.name,
      slug: slugify(input.name),
      createdAt: new Date()
    });
    return this.server.prisma.category.findUnique({ where: { id: result.insertedId.toString() } });
  }

  async getCategories() {
    return this.server.prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    });
  }

  // Posts
  async createPost(input: CreatePostInput, authorId: string) {
    const db = await this.getDb();
    const result = await db.collection('cms_posts').insertOne({
      ...input,
      slug: input.slug || slugify(input.title),
      authorId: new ObjectId(authorId) as any,
      categoryId: new ObjectId(input.categoryId) as any,
      status: input.status || 'DRAFT',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return this.server.prisma.post.findUnique({ 
      where: { id: result.insertedId.toString() },
      include: { category: true }
    });
  }

  async updatePost(id: string, input: Partial<CreatePostInput>) {
    const db = await this.getDb();
    await db.collection('cms_posts').updateOne(
      { _id: new ObjectId(id) as any },
      { 
        $set: { 
          ...input,
          categoryId: input.categoryId ? new ObjectId(input.categoryId) as any : undefined,
          updatedAt: new Date()
        } 
      }
    );
    return this.server.prisma.post.findUnique({ 
      where: { id },
      include: { category: true } 
    });
  }

  async deletePost(id: string) {
    const db = await this.getDb();
    return db.collection('cms_posts').deleteOne({ _id: new ObjectId(id) as any });
  }

  async getPublicPosts(page: number = 1, limit: number = 12, categorySlug?: string) {
    const db = await this.getDb();
    const skip = (page - 1) * limit;
    
    let query: any = { status: 'PUBLISHED' };
    
    // If categorySlug provided, find categoryId first
    if (categorySlug && categorySlug !== 'all') {
      const category = await db.collection('cms_categories').findOne({ slug: categorySlug });
      if (category) {
        query.categoryId = category._id;
      } else {
        // If category not found, return empty
        return { posts: [], pagination: { total: 0, page, limit, totalPages: 0 } };
      }
    }

    const [posts, total] = await Promise.all([
      db.collection('cms_posts').aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'cms_categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author'
          }
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            id: '$_id',
            _id: 1,
            title: 1,
            slug: 1,
            summary: 1,
            thumbnail: 1,
            createdAt: 1,
            author: { fullName: 1, avatar: 1 },
            category: { name: 1, slug: 1 }
          }
        }
      ]).toArray(),
      db.collection('cms_posts').countDocuments(query)
    ]);

    return {
      posts: posts.map(p => ({ ...p, id: p._id.toString() })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
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
