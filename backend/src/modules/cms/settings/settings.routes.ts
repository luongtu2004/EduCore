import { FastifyInstance } from 'fastify';
import { MongoClient } from 'mongodb';

export async function settingsRoutes(app: FastifyInstance) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  // GET Settings
  app.get('', async (request, reply) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      let settings = await db.collection('system_settings').findOne({});
      
      if (!settings) {
        // Create default settings if not exists
        const defaultSettings = {
          siteName: 'EduCore Academy',
          siteTagline: 'Intelligence Education System',
          phone: '0988 123 456',
          email: 'support@educore.vn',
          address: 'Số 123, Đường Láng, Đống Đa, Hà Nội',
          seoTitle: 'EduCore - Hệ thống quản lý giáo dục toàn diện',
          seoDescription: 'EduCore cung cấp giải pháp quản trị trung tâm đào tạo, LMS và CRM tích hợp AI.',
          updatedAt: new Date()
        };
        const result = await db.collection('system_settings').insertOne(defaultSettings);
        settings = { ...defaultSettings, _id: result.insertedId };
      }
      
      return { success: true, data: { ...settings, id: settings._id.toString() } };
    } catch (error) {
      return { success: false, message: 'Lỗi tải cài đặt' };
    }
  });

  // UPDATE Settings
  app.put('', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id, _id, ...updateData } = request.body as any;
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      
      const result = await db.collection('system_settings').findOneAndUpdate(
        {},
        { $set: { ...updateData, updatedAt: new Date() } },
        { upsert: true, returnDocument: 'after' }
      );
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Update Error:', error);
      return reply.status(500).send({ success: false, message: 'Lỗi cập nhật cài đặt' });
    }
  });
}
