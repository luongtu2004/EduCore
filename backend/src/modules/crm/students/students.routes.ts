import { FastifyInstance } from 'fastify';
import { MongoClient, ObjectId } from 'mongodb';

export async function studentRoutes(app: FastifyInstance) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  // GET All Students with Enrollment info
  app.get('', async (request, reply) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      
      const students = await db.collection('crm_students').aggregate([
        {
          $lookup: {
            from: 'crm_enrollments',
            localField: '_id',
            foreignField: 'studentId',
            as: 'enrollments'
          }
        },
        { $sort: { createdAt: -1 } }
      ]).toArray();

      // Simplified for now, just return students with basic info
      const studentsList = await db.collection('crm_students').find({}).sort({ createdAt: -1 }).toArray();
      
      return { success: true, data: studentsList.map(s => ({ ...s, id: s._id.toString() })) };
    } catch (error) {
      return { success: false, message: 'Lỗi tải danh sách học viên' };
    }
  });

  // DELETE Student
  app.delete('/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('crm_students').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Đã xóa học viên' };
    } catch (error) {
      return { success: false, message: 'Lỗi xóa học viên' };
    }
  });
  // UPDATE Student Status
  app.patch('/:id/status', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('crm_students').updateOne(
        { _id: new ObjectId(id) as any },
        { $set: { status, updatedAt: new Date() } }
      );
      return { success: true, message: 'Đã cập nhật trạng thái học viên' };
    } catch (error) {
      return { success: false, message: 'Lỗi cập nhật trạng thái' };
    }
  });
  // GET Student Detail
  app.get('/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const student = await db.collection('crm_students').findOne({ _id: new ObjectId(id) as any });
      
      if (!student) {
        return reply.status(404).send({ success: false, message: 'Không tìm thấy học viên' });
      }

      // Populate associated order & lead data if needed
      let orderInfo = null;
      if (student.sourceOrderId) {
        orderInfo = await db.collection('crm_orders').findOne({ _id: new ObjectId(student.sourceOrderId) as any });
      }

      return { success: true, data: { ...student, id: student._id.toString(), orderInfo } };
    } catch (error) {
      return { success: false, message: 'Lỗi tải chi tiết học viên' };
    }
  });
}
