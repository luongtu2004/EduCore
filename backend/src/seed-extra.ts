import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/EduCore?directConnection=true";
const client = new MongoClient(uri);

async function seedAll() {
  try {
    await client.connect();
    const db = client.db();

    // 1. Seed Orders
    console.log('--- Seeding Orders...');
    const ordersCollection = db.collection('crm_orders');
    await ordersCollection.deleteMany({});
    const orders = [
      { id: 'ORD-001', studentName: 'Nguyễn Văn A', courseName: 'IELTS Mastery 7.5+', amount: 4500000, status: 'PAID', createdAt: new Date() },
      { id: 'ORD-002', studentName: 'Trần Thị B', courseName: 'Toeic 650+ Online', amount: 2200000, status: 'PENDING', createdAt: new Date() },
      { id: 'ORD-003', studentName: 'Lê Văn C', courseName: 'Giao tiếp tiếng Anh cơ bản', amount: 3500000, status: 'CANCELLED', createdAt: new Date() },
      { id: 'ORD-004', studentName: 'Phạm Minh D', courseName: 'IELTS Mastery 7.5+', amount: 4500000, status: 'PAID', createdAt: new Date() },
    ];
    await ordersCollection.insertMany(orders);

    // 2. Seed Contacts
    console.log('--- Seeding Contacts...');
    const contactsCollection = db.collection('cms_contacts');
    await contactsCollection.deleteMany({});
    const contacts = [
      { name: 'Nguyễn Hoàng Nam', email: 'nam@gmail.com', phone: '0988111222', subject: 'Tư vấn khóa học IELTS', message: 'Tôi muốn tìm hiểu lộ trình học IELTS từ 0 lên 6.5 trong 6 tháng...', status: 'NEW', createdAt: new Date() },
      { name: 'Trần Minh Tâm', email: 'tam.tran@gmail.com', phone: '0912333444', subject: 'Hợp tác đào tạo doanh nghiệp', message: 'Công ty chúng tôi đang cần đào tạo tiếng Anh giao tiếp cho 50 nhân viên...', status: 'READ', createdAt: new Date() },
      { name: 'Lê Thu Hà', email: 'ha.le@outlook.com', phone: '0977444555', subject: 'Hỏi về học phí khóa Toeic', message: 'Cho mình hỏi học phí khóa Toeic 650+ online là bao nhiêu ạ?', status: 'REPLIED', createdAt: new Date() },
    ];
    await contactsCollection.insertMany(contacts);

    console.log('--- Seeded Orders and Contacts successfully!');
  } catch (error) {
    console.error('!!! Seed error:', error);
  } finally {
    await client.close();
  }
}

seedAll();
