import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const uri = process.env.DATABASE_URL || "";

async function main() {
  console.log('--- Đang gieo dữ liệu toàn diện (Full Seeding)...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();

    // 1. Seed Users (Admin & Staff)
    console.log('--- Seeding Users...');
    const usersCollection = db.collection('users');
    const existingAdmin = await usersCollection.findOne({ role: 'ADMIN' });
    
    let adminId;
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const result = await usersCollection.insertOne({
        email: '0354168798',
        fullName: 'EduCore Admin',
        password: hashedPassword,
        phone: '0354168798',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      adminId = result.insertedId;
      console.log('+ Đã tạo tài khoản Admin: 0354168798 / 123456');
    } else {
      adminId = existingAdmin._id;
    }

    // 2. Seed Categories
    console.log('--- Seeding Categories...');
    const categoriesCollection = db.collection('cms_categories');
    const categories = [
      { name: 'Tin tức giáo dục', slug: 'tin-tuc-giao-duc', createdAt: new Date() },
      { name: 'Kỹ năng học tập', slug: 'ky-nang-hoc-tap', createdAt: new Date() },
      { name: 'Kinh nghiệm thi cử', slug: 'kinh-nghiem-thi-cu', createdAt: new Date() },
      { name: 'Thông báo hệ thống', slug: 'thong-bao-he-thong', createdAt: new Date() },
      { name: 'Góc học viên', slug: 'goc-hoc-vien', createdAt: new Date() },
    ];
    
    for (const cat of categories) {
      const exists = await categoriesCollection.findOne({ slug: cat.slug });
      if (!exists) {
        await categoriesCollection.insertOne(cat);
      }
    }
    const allCats = await categoriesCollection.find().toArray();

    // 3. Seed Posts
    console.log('--- Seeding Posts...');
    const postsCollection = db.collection('cms_posts');
    await postsCollection.deleteMany({}); // Reset posts to have fresh recent data
    const posts = [
      {
        title: 'Bí quyết đạt IELTS 8.0 chỉ trong 6 tháng',
        slug: 'bi-quyet-dat-ielts-8-0',
        summary: 'Chia sẻ lộ trình học tập chi tiết từ các chuyên gia hàng đầu.',
        content: 'Nội dung bài viết chi tiết về lộ trình học IELTS...',
        authorId: adminId,
        categoryId: allCats[2]._id,
        status: 'PUBLISHED',
        views: 1250,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Top 5 website học từ vựng tiếng Anh hiệu quả nhất 2026',
        slug: 'top-5-website-hoc-tu-vung',
        summary: 'Tổng hợp các công cụ hỗ trợ học tập tốt nhất hiện nay.',
        content: 'Chi tiết về các website như Quizlet, Memrise...',
        authorId: adminId,
        categoryId: allCats[1]._id,
        status: 'PUBLISHED',
        views: 850,
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        title: 'Thông báo lịch nghỉ lễ Quốc tế Lao động 2026',
        slug: 'thong-bao-nghi-le-2026',
        summary: 'Thông tin chi tiết về lịch nghỉ lễ của trung tâm.',
        content: 'Học viên sẽ được nghỉ từ ngày 30/4 đến hết ngày 3/5...',
        authorId: adminId,
        categoryId: allCats[3]._id,
        status: 'PUBLISHED',
        views: 420,
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000)
      },
      {
        title: 'Cảm nhận của học viên về khóa học IELTS Mastery',
        slug: 'cam-nhan-hoc-vien-ielts-mastery',
        summary: 'Những câu chuyện thành công đầy cảm hứng.',
        content: 'Học viên Nguyễn Văn A đã bứt phá từ 5.0 lên 7.5...',
        authorId: adminId,
        categoryId: allCats[4]._id,
        status: 'PUBLISHED',
        views: 630,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      }
    ];
    await postsCollection.insertMany(posts);

    // 4. Seed Leads (Tiềm năng)
    console.log('--- Seeding Leads...');
    const leadsCollection = db.collection('crm_leads');
    await leadsCollection.deleteMany({});
    const leads = [
      { fullName: 'Nguyễn Văn Mạnh', email: 'manh@gmail.com', phone: '0988000111', source: 'FACEBOOK', status: 'NEW', createdAt: new Date() },
      { fullName: 'Trần Thu Thủy', email: 'thuy@gmail.com', phone: '0912000222', source: 'GOOGLE', status: 'IN_PROGRESS', createdAt: new Date() },
      { fullName: 'Lê Minh Tuấn', email: 'tuan@gmail.com', phone: '0977000333', source: 'WEBSITE', status: 'CONVERTED', createdAt: new Date() },
      { fullName: 'Phạm Hồng Nhung', email: 'nhung@gmail.com', phone: '0933000444', source: 'REFERRAL', status: 'NEW', createdAt: new Date() },
    ];
    await leadsCollection.insertMany(leads);

    // 5. Seed Students
    console.log('--- Seeding Students...');
    const studentsCollection = db.collection('crm_students');
    await studentsCollection.deleteMany({});
    const students = [
      { fullName: 'Nguyễn Văn A', email: 'student.a@gmail.com', phone: '0988123456', studentCode: 'EC-001', status: 'ACTIVE', leadId: new ObjectId(), createdAt: new Date() },
      { fullName: 'Trần Thị B', email: 'student.b@gmail.com', phone: '0912111222', studentCode: 'EC-002', status: 'ACTIVE', leadId: new ObjectId(), createdAt: new Date() },
      { fullName: 'Lê Văn C', email: 'student.c@gmail.com', phone: '0977333444', studentCode: 'EC-003', status: 'ACTIVE', leadId: new ObjectId(), createdAt: new Date() },
    ];
    await studentsCollection.insertMany(students);

    console.log('--- Đã hoàn tất Seeding toàn diện!');
  } finally {
    await client.close();
  }
}

main().catch(console.error);
