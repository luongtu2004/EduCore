import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CoursesService } from './courses.service';

import { MongoClient, ObjectId } from 'mongodb';

export const courseRoutes: FastifyPluginAsyncZod = async (server) => {
  const service = new CoursesService(server as any);
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  server.get('/', async (request, reply) => {
    const courses = await service.list();
    return { success: true, data: courses };
  });

  server.get('/:slug', async (request: any, reply) => {
    const { slug } = request.params;
    
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      
      const course = await db.collection('courses').findOne({ slug });
      if (!course) return reply.status(404).send({ success: false, message: 'Khóa học không tồn tại' });

      const courseId = course._id.toString();

      // Fetch chapters
      const chapters = await db.collection('course_chapters')
        .find({ courseId: new ObjectId(courseId) as any })
        .sort({ order: 1 })
        .toArray();

      // Fetch lessons for each chapter
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

      return { 
        success: true, 
        data: { 
          ...course, 
          id: courseId,
          chapters: chaptersWithLessons 
        } 
      };
    } catch (error) {
      console.error('Error fetching public course detail:', error);
      return reply.status(500).send({ success: false, message: 'Internal Server Error' });
    }
  });
};
