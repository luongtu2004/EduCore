import { PrismaClient } from '@prisma/client';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schema';
import { MongoClient, ObjectId } from 'mongodb';

export class CategoriesService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
  }

  async getById(id: string) {
    const client = new MongoClient(process.env.DATABASE_URL || '');
    try {
      await client.connect();
      const db = client.db();
      const category = await db.collection('cms_categories').findOne({ _id: new ObjectId(id) });
      return category ? { ...category, id: category._id.toString() } : null;
    } finally {
      await client.close();
    }
  }

  async create(data: CreateCategoryInput) {
    const client = new MongoClient(process.env.DATABASE_URL || '');
    try {
      await client.connect();
      const db = client.db();
      const result = await db.collection('cms_categories').insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: result.insertedId, ...data };
    } finally {
      await client.close();
    }
  }

  async update(id: string, data: UpdateCategoryInput) {
    const client = new MongoClient(process.env.DATABASE_URL || '');
    try {
      await client.connect();
      const db = client.db();
      await db.collection('cms_categories').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date() } }
      );
      return { id, ...data };
    } finally {
      await client.close();
    }
  }

  async delete(id: string) {
    const client = new MongoClient(process.env.DATABASE_URL || '');
    try {
      await client.connect();
      const db = client.db();
      
      // Cascade delete posts
      await db.collection('cms_posts').deleteMany({ categoryId: id });
      
      // Delete category
      return await db.collection('cms_categories').deleteOne({ _id: new ObjectId(id) });
    } finally {
      await client.close();
    }
  }
}
