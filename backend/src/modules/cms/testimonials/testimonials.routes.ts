import { FastifyInstance } from 'fastify';
import { createTestimonialSchema, updateTestimonialSchema } from './testimonials.schema';
import { MongoClient, ObjectId } from 'mongodb';

export async function testimonialRoutes(app: FastifyInstance) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  app.get('/', async (request, reply) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const testimonials = await db.collection('cms_testimonials').find({}).sort({ order: 1, createdAt: -1 }).toArray();
      return { success: true, data: testimonials.map(t => ({ ...t, id: t._id.toString() })) };
    } catch (error) {
      return { success: false, message: 'Internal Server Error' };
    }
  });
  
  app.post('/', {
    schema: { body: createTestimonialSchema },
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const body = request.body as any;
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const result = await db.collection('cms_testimonials').insertOne({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, data: { id: result.insertedId, ...body } };
    } catch (error) {
      return { success: false, message: 'Error' };
    }
  });

  app.put('/:id', {
    schema: { body: updateTestimonialSchema },
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('cms_testimonials').updateOne(
        { _id: new ObjectId(id) as any },
        { $set: { ...body, updatedAt: new Date() } }
      );
      return { success: true, message: 'Updated' };
    } catch (error) {
      return { success: false, message: 'Error' };
    }
  });

  app.patch('/:id/status', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isActive } = request.body as { isActive: boolean };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('cms_testimonials').updateOne(
        { _id: new ObjectId(id) as any },
        { $set: { isActive, updatedAt: new Date() } }
      );
      return { success: true, message: 'Status updated' };
    } catch (error) {
      return { success: false, message: 'Error' };
    }
  });

  app.delete('/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('cms_testimonials').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Deleted' };
    } catch (error) {
      return { success: false, message: 'Error' };
    }
  });
}
