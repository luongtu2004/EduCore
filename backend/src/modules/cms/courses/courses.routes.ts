import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { MongoClient, ObjectId } from 'mongodb';

interface ExtendedApp extends FastifyInstance {
  prisma: PrismaClient;
}

export async function courseManagementRoutes(app: ExtendedApp) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  // Get all courses
  app.get('/', async (request, reply) => {
    const courses = await app.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: courses };
  });

  // Get course by ID with curriculum (Using MongoClient to bypass Prisma Client out-of-sync issues)
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      
      const course = await db.collection('courses').findOne({ _id: new ObjectId(id) as any });
      if (!course) return reply.status(404).send({ success: false, message: 'Khóa học không tồn tại' });

      // Fetch chapters - Ensure courseId is queried as ObjectId
      const chapters = await db.collection('course_chapters')
        .find({ courseId: new ObjectId(id) as any })
        .sort({ order: 1 })
        .toArray();

      // Fetch lessons for each chapter - Ensure chapterId is queried as ObjectId
      const chaptersWithLessons = await Promise.all(chapters.map(async (chapter) => {
        const lessons = await db.collection('course_lessons')
          .find({ chapterId: chapter._id })
          .sort({ order: 1 })
          .toArray();
        
        return {
          ...chapter,
          id: chapter._id.toString(),
          lessons: lessons.map(l => ({ ...l, id: l._id.toString() }))
        };
      }));

      return reply.send({ 
        success: true, 
        data: { 
          ...course, 
          id: course._id.toString(),
          chapters: chaptersWithLessons 
        } 
      });
    } catch (error) {
      console.error('Error fetching curriculum:', error);
      return reply.status(500).send({ success: false, message: 'Internal Server Error' });
    }
  });

  // Create course
  app.post('/', async (request, reply) => {
    const schema = z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      price: z.number().min(0),
      duration: z.string().optional(),
      level: z.string().optional(),
      thumbnail: z.string().optional(),
      isActive: z.boolean().default(true),
    });

    const body = schema.parse(request.body);
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const result = await db.collection('courses').insertOne({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { success: true, data: { id: result.insertedId, ...body } };
    } finally {}
  });

  // Update course
  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const schema = z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      duration: z.string().optional(),
      level: z.string().optional(),
      thumbnail: z.string().optional(),
      isActive: z.boolean().optional(),
    });

    const body = schema.parse(request.body);
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('courses').updateOne(
        { _id: new ObjectId(id) as any },
        { 
          $set: { 
            ...body,
            updatedAt: new Date()
          } 
        }
      );
      
      return { success: true, message: 'Updated course' };
    } finally {}
  });

  // Delete course
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      // Cascade delete: Chapters and Lessons
      const chapters = await db.collection('course_chapters').find({ courseId: new ObjectId(id) as any }).toArray();
      const chapterIds = chapters.map(c => c._id);
      
      await db.collection('course_lessons').deleteMany({ chapterId: { $in: chapterIds } });
      await db.collection('course_chapters').deleteMany({ courseId: new ObjectId(id) as any });
      await db.collection('courses').deleteOne({ _id: new ObjectId(id) as any });
      
      return { success: true, message: 'Deleted course and curriculum' };
    } finally {}
  });

  // --- CHAPTERS ---
  app.post('/:courseId/chapters', async (request, reply) => {
    const { courseId } = request.params as { courseId: string };
    const { title, order } = request.body as any;
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const result = await db.collection('course_chapters').insertOne({
        title,
        order: order || 0,
        courseId: new ObjectId(courseId) as any,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, data: { id: result.insertedId, title, order } };
    } finally {}
  });

  app.put('/chapters/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { title, order } = request.body as any;
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('course_chapters').updateOne(
        { _id: new ObjectId(id) as any },
        { 
          $set: { 
            title, 
            order,
            updatedAt: new Date()
          } 
        }
      );
      return { success: true, message: 'Updated' };
    } finally {}
  });

  app.delete('/chapters/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      // Also delete lessons in this chapter
      await db.collection('course_lessons').deleteMany({ chapterId: new ObjectId(id) as any });
      await db.collection('course_chapters').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Deleted chapter' };
    } finally {}
  });

  // --- LESSONS ---
  app.post('/chapters/:chapterId/lessons', async (request, reply) => {
    const { chapterId } = request.params as { chapterId: string };
    const body = request.body as any;
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const result = await db.collection('course_lessons').insertOne({
        ...body,
        order: body.order || 0,
        chapterId: new ObjectId(chapterId) as any,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, data: { id: result.insertedId, ...body } };
    } finally {}
  });

  app.put('/lessons/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('course_lessons').updateOne(
        { _id: new ObjectId(id) as any },
        { 
          $set: { 
            ...body,
            updatedAt: new Date()
          } 
        }
      );
      return { success: true, message: 'Updated lesson' };
    } finally {}
  });

  app.delete('/lessons/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('course_lessons').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Deleted lesson' };
    } finally {}
  });
}
