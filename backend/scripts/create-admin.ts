import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.DATABASE_URL || '';

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const hash = await bcrypt.hash('123456', 10);

  const existing = await db.collection('users').findOne({ email: 'admin@gmail.com' });
  if (existing) {
    await db.collection('users').updateOne(
      { email: 'admin@gmail.com' },
      { $set: { password: hash, role: 'ADMIN', isActive: true, updatedAt: new Date() } }
    );
    console.log('✅ Đã cập nhật mật khẩu admin@gmail.com => 123456');
  } else {
    await db.collection('users').insertOne({
      email: 'admin@gmail.com',
      fullName: 'EduCore Admin',
      phone: '0354168798',
      password: hash,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Đã tạo tài khoản: admin@gmail.com / 123456');
  }

  await client.close();
}

run().catch(console.error);
