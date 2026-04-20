import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { MongoClient, ObjectId } from 'mongodb';

interface ExtendedApp extends FastifyInstance {
  prisma: PrismaClient;
}

export async function quizManagementRoutes(app: ExtendedApp) {
  // Use Native Mongo Client for updates to bypass Replica Set requirement
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  // Get all questions (Admin)
  app.get('/', async (request, reply) => {
    const questions = await app.prisma.quizQuestion.findMany({
      orderBy: { order: 'asc' },
    });
    return { success: true, data: questions };
  });

  // Create question
  app.post('/', async (request, reply) => {
    const schema = z.object({
      text: z.string().min(1),
      section: z.string().min(1),
      options: z.array(z.string()),
      weights: z.array(z.number()),
      order: z.number().default(0),
      isActive: z.boolean().default(true),
    });

    const body = schema.parse(request.body);
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const result = await db.collection('cms_quiz_questions').insertOne({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const question = await app.prisma.quizQuestion.findUnique({ 
        where: { id: result.insertedId.toString() } 
      });
      return { success: true, data: question };
    } finally {}
  });

  // Update question
  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const schema = z.object({
      text: z.string().optional(),
      section: z.string().optional(),
      options: z.array(z.string()).optional(),
      weights: z.array(z.number()).optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
    });

    const body = schema.parse(request.body);
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('cms_quiz_questions').updateOne(
        { _id: new ObjectId(id) as any },
        { 
          $set: { 
            ...body,
            updatedAt: new Date()
          } 
        }
      );
      
      const question = await app.prisma.quizQuestion.findUnique({ where: { id } });
      return { success: true, data: question };
    } finally {}
  });

  // Delete question
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('cms_quiz_questions').deleteOne({
        _id: new ObjectId(id) as any
      });
      return { success: true, message: 'Đã xóa câu hỏi' };
    } finally {}
  });
}
