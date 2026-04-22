import { FastifyInstance } from 'fastify';
import { MongoClient, ObjectId } from 'mongodb';

export async function couponRoutes(app: FastifyInstance) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  // GET All Coupons
  app.get('', async (request, reply) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const coupons = await db.collection('cms_coupons').find({}).sort({ createdAt: -1 }).toArray();
      return { success: true, data: coupons.map(c => ({ ...c, id: c._id.toString() })) };
    } catch (error) {
      return { success: false, message: 'Lỗi tải danh sách mã giảm giá' };
    }
  });

  // VERIFY Coupon (Public)
  app.get('/verify/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const coupon = await db.collection('cms_coupons').findOne({ 
        code: code.toUpperCase(),
        isActive: true,
        expiry: { $gte: new Date() }
      });
      
      if (!coupon) {
        return reply.status(404).send({ success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' });
      }

      if (coupon.usageCount >= coupon.maxUsage) {
        return reply.status(400).send({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng' });
      }

      return { 
        success: true, 
        data: {
          code: coupon.code,
          type: coupon.type,
          discount: coupon.discount
        } 
      };
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Lỗi kiểm tra mã giảm giá' });
    }
  });

  // CREATE Coupon
  app.post('', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const body = request.body as any;
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      
      const newCoupon = {
        ...body,
        expiry: new Date(body.expiry),
        usageCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('cms_coupons').insertOne(newCoupon);
      return { success: true, data: { id: result.insertedId, ...newCoupon } };
    } catch (error) {
      return { success: false, message: 'Lỗi tạo mã giảm giá' };
    }
  });

  // UPDATE Coupon
  app.put('/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { id: _, _id, ...updateData } = request.body as any;
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      
      if (updateData.expiry) updateData.expiry = new Date(updateData.expiry);

      await db.collection('cms_coupons').updateOne(
        { _id: new ObjectId(id) as any },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      
      return { success: true, message: 'Đã cập nhật' };
    } catch (error) {
      return { success: false, message: 'Lỗi cập nhật mã giảm giá' };
    }
  });

  // DELETE Coupon
  app.delete('/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('cms_coupons').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Đã xóa' };
    } catch (error) {
      return { success: false, message: 'Lỗi xóa mã giảm giá' };
    }
  });
}
