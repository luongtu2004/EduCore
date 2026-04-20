import { FastifyInstance } from 'fastify';
import { createBannerSchema, updateBannerSchema } from './banners.schema';
import { MongoClient, ObjectId } from 'mongodb';

export async function bannerRoutes(app: FastifyInstance) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  app.get('/', async (request, reply) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const banners = await db.collection('cms_banners').find({}).sort({ order: 1 }).toArray();
      return { success: true, data: banners.map(b => ({ ...b, id: b._id.toString() })) };
    } catch (error) {
      return { success: false, message: 'Internal Server Error' };
    }
  });
  
  app.post('/', {
    schema: { body: createBannerSchema },
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const body = request.body as any;
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const result = await db.collection('cms_banners').insertOne({
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
    schema: { body: updateBannerSchema },
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('cms_banners').updateOne(
        { _id: new ObjectId(id) as any },
        { $set: { ...body, updatedAt: new Date() } }
      );
      return { success: true, message: 'Updated' };
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
      await db.collection('cms_banners').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Deleted' };
    } catch (error) {
      return { success: false, message: 'Error' };
    }
  });
}
