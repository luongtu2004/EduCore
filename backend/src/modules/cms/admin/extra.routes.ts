import { FastifyInstance } from 'fastify';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function orderRoutes(app: FastifyInstance) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  // GET All Orders
  app.get('', async (request, reply) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const orders = await db.collection('crm_orders').find({}).sort({ createdAt: -1 }).toArray();
      // map _id to id, but keep the original id string if it exists (for seeded ORD-xxx)
      return { success: true, data: orders.map(o => ({ ...o, _id: o._id.toString(), dbId: o._id.toString() })) };
    } catch (error) {
      return { success: false, message: 'Lỗi tải danh sách đơn hàng' };
    }
  });

  // GET Order by ID
  app.get('/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      let query = {};
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) as any }, { id: id }] };
      } else {
        query = { id: id };
      }
      const order = await db.collection('crm_orders').findOne(query);
      if (!order) return { success: false, message: 'Không tìm thấy đơn hàng' };
      
      // If it's linked to a lead, maybe fetch lead info? No need for now, just return order
      let leadInfo = null;
      if (order.leadId) {
        leadInfo = await db.collection('crm_leads').findOne({ _id: new ObjectId(order.leadId) as any });
      }

      return { success: true, data: { ...order, _id: order._id.toString(), dbId: order._id.toString(), lead: leadInfo ? { ...leadInfo, _id: leadInfo._id.toString() } : null } };
    } catch (error) {
      return { success: false, message: 'Lỗi lấy thông tin đơn hàng' };
    }
  });

  // DELETE Order
  app.delete('/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('crm_orders').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Đã xóa đơn hàng' };
    } catch (error) {
      return { success: false, message: 'Lỗi xóa đơn hàng' };
    }
  });

  // UPDATE Order Status
  app.patch('/:id/status', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      
      let query = {};
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) as any }, { id: id }] };
      } else {
        query = { id: id };
      }
      
      const order = await db.collection('crm_orders').findOne(query);

      if (!order) return { success: false, message: 'Lỗi cập nhật đơn hàng' };

      await db.collection('crm_orders').updateOne(
        { _id: order._id },
        { $set: { status, updatedAt: new Date() } }
      );

      // Nếu đơn hàng được xác nhận ĐÃ THANH TOÁN (PAID), tự động tạo học viên
      if (status === 'PAID') {
        // Kiểm tra xem học viên này đã tồn tại chưa (dựa theo orderId hoặc email)
        const existingStudent = await db.collection('crm_students').findOne({
          $or: [
            { sourceOrderId: order._id.toString() },
            { originalOrderId: order.id }
          ]
        });

        if (!existingStudent) {
          // Lấy thêm thông tin lead để có email/phone
          let email = '';
          let phone = '';
          if (order.leadId) {
            const lead = await db.collection('crm_leads').findOne({ _id: new ObjectId(order.leadId) as any });
            if (lead) {
              email = lead.email || '';
              phone = lead.phone || '';
              
              // Tự động chuyển Lead sang WON (Đã đăng ký HV)
              await db.collection('crm_leads').updateOne(
                { _id: lead._id },
                { $set: { status: 'WON', updatedAt: new Date() } }
              );
            }
          }

          const newStudent = {
            fullName: order.studentName,
            email: email,
            phone: phone,
            courseName: order.courseName,
            status: 'ACTIVE',
            sourceOrderId: order._id.toString(),
            originalOrderId: order.id,
            leadId: order.leadId,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          const studentResult = await db.collection('crm_students').insertOne(newStudent);

          // Tự động tạo tài khoản Học viên bên hệ thống CMS nếu có email
          if (email) {
            const existingUser = await db.collection('users').findOne({ email: email });
            if (!existingUser) {
              const defaultPassword = 'Hocvien@123'; // Mật khẩu mặc định
              const hashedPassword = await bcrypt.hash(defaultPassword, 10);
              
              await db.collection('users').insertOne({
                fullName: order.studentName,
                email: email,
                phone: phone,
                password: hashedPassword,
                role: 'STUDENT',
                studentId: studentResult.insertedId.toString(),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }
          }
        }
      }

      return { success: true, message: 'Đã cập nhật trạng thái đơn hàng' };
    } catch (error) {
      return { success: false, message: 'Lỗi cập nhật đơn hàng' };
    }
  });
}

export async function contactRoutes(app: FastifyInstance) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  // GET All Contacts
  app.get('', async (request, reply) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      const contacts = await db.collection('cms_contacts').find({}).sort({ createdAt: -1 }).toArray();
      return { success: true, data: contacts.map(c => ({ ...c, id: c._id.toString() })) };
    } catch (error) {
      return { success: false, message: 'Lỗi tải danh sách liên hệ' };
    }
  });

  // DELETE Contact
  app.delete('/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('cms_contacts').deleteOne({ _id: new ObjectId(id) as any });
      return { success: true, message: 'Đã xóa' };
    } catch (error) {
      return { success: false, message: 'Lỗi xóa liên hệ' };
    }
  });

  // UPDATE Contact Status
  app.put('/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };
    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      await db.collection('cms_contacts').updateOne(
        { _id: new ObjectId(id) as any },
        { $set: { status, updatedAt: new Date() } }
      );
      return { success: true, message: 'Đã cập nhật trạng thái' };
    } catch (error) {
      return { success: false, message: 'Lỗi cập nhật liên hệ' };
    }
  });
}
