const { MongoClient, ObjectId } = require('mongodb');

async function seedData() {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/EduCore?directConnection=true';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    console.log('Seeding Contacts...');
    await db.collection('cms_contacts').insertMany([
      {
        name: 'Trần Văn Lực',
        email: 'luc.tran@example.com',
        phone: '0901234567',
        message: 'Mình muốn tìm hiểu thêm về khóa học Tiếng Anh Giao Tiếp.',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nguyễn Thị Hoa',
        email: 'hoa.nguyen@example.com',
        phone: '0987654321',
        message: 'Bên trung tâm có khóa luyện thi IELTS cho người mất gốc không ạ?',
        status: 'CONTACTED',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(),
      },
      {
        name: 'Lê Minh Khang',
        email: 'khang.le@example.com',
        phone: '0912345678',
        message: 'Chi phí khóa học Front-end là bao nhiêu?',
        status: 'RESOLVED',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000),
      }
    ]);

    console.log('Contacts seeded successfully!');

    console.log('Seeding Appointments...');
    // We'll create some appointments for today and tomorrow
    const today = new Date();
    today.setHours(9, 0, 0, 0); // Today at 09:00

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 30, 0, 0); // Tomorrow at 14:30

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(10, 0, 0, 0);

    await db.collection('crm_appointments').insertMany([
      {
        title: 'Tư vấn lộ trình học IELTS',
        startTime: today,
        endTime: new Date(today.getTime() + 60 * 60 * 1000), // +1 hour
        type: 'CONSULTATION',
        status: 'SCHEDULED',
        notes: 'Học sinh lớp 11, mục tiêu 6.5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Học thử lập trình cơ bản',
        startTime: new Date(today.getTime() + 4 * 60 * 60 * 1000), // Today 13:00
        endTime: new Date(today.getTime() + 6 * 60 * 60 * 1000), // Today 15:00
        type: 'TRIAL_LEARNING',
        status: 'COMPLETED',
        notes: 'Học sinh rất thích, hẹn đăng ký vào tuần sau',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Giải đáp thắc mắc hợp đồng',
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 30 * 60 * 1000), // +30 mins
        type: 'FEEDBACK',
        status: 'SCHEDULED',
        notes: 'Phụ huynh thắc mắc về điều khoản hoàn phí',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Tư vấn khóa Fullstack',
        startTime: nextWeek,
        endTime: new Date(nextWeek.getTime() + 60 * 60 * 1000),
        type: 'CONSULTATION',
        status: 'SCHEDULED',
        notes: 'Sinh viên IT năm 3',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);

    console.log('Appointments seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seedData();
