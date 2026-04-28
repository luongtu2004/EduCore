import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { MongoClient, ObjectId } from 'mongodb';

interface ExtendedApp extends FastifyInstance {
  prisma: PrismaClient;
}

const createCourseSchema = z.object({
  title: z.string().min(1, 'Tên khóa học không được để trống'),
  slug: z.string().min(1, 'Slug không được để trống'),
  description: z.string().optional().nullable(),
  price: z.number().min(0, 'Giá không hợp lệ'),
  duration: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

const updateCourseSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  price: z.number().optional(),
  duration: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// Helper: map Prisma course record to clean object
function mapCourse(c: any) {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description ?? null,
    price: c.price,
    duration: c.duration ?? null,
    level: c.level ?? null,
    thumbnail: c.thumbnail ?? null,
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export async function courseManagementRoutes(app: ExtendedApp) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  // ─── GET ALL COURSES ────────────────────────────────────────────────────────
  app.get('/', async (request, reply) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const courses = await db.collection('courses').find().sort({ createdAt: -1 }).toArray();
      return { success: true, data: courses.map(c => ({...c, id: c._id.toString(), _id: undefined})) };
    } catch (error: any) {
      console.error('[Courses] GET / error:', error);
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  // ─── GET SINGLE COURSE ──────────────────────────────────────────────────────
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const course = await db.collection('courses').findOne({ 
        $or: [
          { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
          { slug: id }
        ].filter(Boolean) as any
      });

      if (!course) {
        return reply.status(404).send({ success: false, message: 'Khóa học không tồn tại' });
      }

      // Fetch chapters and lessons
      const chapters = await db.collection('course_chapters')
        .find({ courseId: course._id.toString() })
        .sort({ order: 1 })
        .toArray();
      
      const chaptersWithLessons = await Promise.all(chapters.map(async (ch) => {
        const lessons = await db.collection('course_lessons')
          .find({ chapterId: ch._id.toString() })
          .sort({ order: 1 })
          .toArray();
        return {
          ...ch,
          id: ch._id.toString(),
          _id: undefined,
          lessons: lessons.map(l => ({ ...l, id: l._id.toString(), _id: undefined }))
        };
      }));

      return reply.send({
        success: true,
        data: {
          ...course,
          id: course._id.toString(),
          _id: undefined,
          chapters: chaptersWithLessons,
        },
      });
    } catch (error: any) {
      console.error('[Courses] GET /:id error:', error);
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  // ─── CREATE COURSE ──────────────────────────────────────────────────────────
  app.post('/', async (request, reply) => {
    try {
      const body = createCourseSchema.parse(request.body);
      await mongoClient.connect();
      const db = mongoClient.db();

      // Check duplicate slug
      const existing = await db.collection('courses').findOne({ slug: body.slug });
      if (existing) {
        return reply.status(400).send({ success: false, message: 'Slug này đã tồn tại, vui lòng đổi tên khóa học.' });
      }

      const newCourse = {
        title: body.title,
        slug: body.slug,
        description: body.description ?? null,
        price: body.price,
        level: body.level ?? null,
        duration: body.duration ?? null,
        isActive: body.isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('courses').insertOne(newCourse);

      return reply.status(201).send({ success: true, data: { id: result.insertedId.toString(), ...newCourse } });
    } catch (error: any) {
      console.error('[Courses] POST / error:', error);
      if (error.name === 'ZodError') {
        return reply.status(400).send({ success: false, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' });
      }
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  // ─── UPDATE COURSE ──────────────────────────────────────────────────────────
  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const body = updateCourseSchema.parse(request.body);
      await mongoClient.connect();
      const db = mongoClient.db();
      const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;

      // Check course exists
      const existing = await db.collection('courses').findOne({ _id: objectId as any });
      if (!existing) {
        return reply.status(404).send({ success: false, message: 'Khóa học không tồn tại' });
      }

      // Check slug conflict (only if slug is being changed)
      if (body.slug && body.slug !== existing.slug) {
        const slugConflict = await db.collection('courses').findOne({ slug: body.slug });
        if (slugConflict) {
          return reply.status(400).send({ success: false, message: 'Slug này đã được sử dụng.' });
        }
      }

      const updateData: any = { updatedAt: new Date() };
      if (body.title !== undefined) updateData.title = body.title;
      if (body.slug !== undefined) updateData.slug = body.slug;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.price !== undefined) updateData.price = body.price;
      if (body.level !== undefined) updateData.level = body.level;
      if (body.duration !== undefined) updateData.duration = body.duration;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;

      await db.collection('courses').updateOne({ _id: objectId as any }, { $set: updateData });
      
      const updated = await db.collection('courses').findOne({ _id: objectId as any });

      return { success: true, data: { ...updated, id: updated?._id.toString(), _id: undefined } };
    } catch (error: any) {
      console.error('[Courses] PUT /:id error:', error);
      if (error.name === 'ZodError') {
        return reply.status(400).send({ success: false, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' });
      }
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  // ─── DELETE COURSE ──────────────────────────────────────────────────────────
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await mongoClient.connect();
      const db = mongoClient.db();

      const chapters = await db.collection('course_chapters')
        .find({ courseId: new ObjectId(id) as any })
        .toArray();
      const chapterIds = chapters.map((c) => c._id);

      if (chapterIds.length > 0) {
        await db.collection('course_lessons').deleteMany({ chapterId: { $in: chapterIds } });
      }
      await db.collection('course_chapters').deleteMany({ courseId: new ObjectId(id) as any });
      await db.collection('courses').deleteOne({ _id: new ObjectId(id) as any });

      return { success: true, message: 'Đã xóa khóa học và toàn bộ nội dung' };
    } catch (error: any) {
      console.error('[Courses] DELETE /:id error:', error);
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  // ─── CHAPTERS ───────────────────────────────────────────────────────────────

  app.post('/:courseId/chapters', async (request, reply) => {
    const { courseId } = request.params as { courseId: string };
    const { title, order } = request.body as any;

    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const result = await db.collection('course_chapters').insertOne({
        title,
        order: order ?? 0,
        courseId: new ObjectId(courseId) as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { success: true, data: { id: result.insertedId.toString(), title, order } };
    } catch (error: any) {
      console.error('[Courses] POST /:courseId/chapters error:', error);
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  app.put('/chapters/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { title, order } = request.body as any;

    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('course_chapters').updateOne(
        { _id: new ObjectId(id) as any },
        { $set: { title, order, updatedAt: new Date() } }
      );
      return { success: true, message: 'Đã cập nhật chương' };
    } catch (error: any) {
      console.error('[Courses] PUT /chapters/:id error:', error);
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  app.delete('/chapters/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('course_lessons').deleteMany({ chapterId: new ObjectId(id) as any });
      await db.collection('course_chapters').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Đã xóa chương và bài học' };
    } catch (error: any) {
      console.error('[Courses] DELETE /chapters/:id error:', error);
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  // ─── LESSONS ─────────────────────────────────────────────────────────────────

  app.post('/chapters/:chapterId/lessons', async (request, reply) => {
    const { chapterId } = request.params as { chapterId: string };
    const body = request.body as any;

    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const result = await db.collection('course_lessons').insertOne({
        ...body,
        order: body.order ?? 0,
        chapterId: new ObjectId(chapterId) as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { success: true, data: { id: result.insertedId.toString(), ...body } };
    } catch (error: any) {
      console.error('[Courses] POST /chapters/:chapterId/lessons error:', error);
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  app.put('/lessons/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('course_lessons').updateOne(
        { _id: new ObjectId(id) as any },
        { $set: { ...body, updatedAt: new Date() } }
      );
      return { success: true, message: 'Đã cập nhật bài học' };
    } catch (error: any) {
      console.error('[Courses] PUT /lessons/:id error:', error);
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });

  app.delete('/lessons/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('course_lessons').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Đã xóa bài học' };
    } catch (error: any) {
      console.error('[Courses] DELETE /lessons/:id error:', error);
      return reply.status(500).send({ success: false, message: error.message || 'Lỗi hệ thống' });
    }
  });
}
