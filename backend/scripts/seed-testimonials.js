const { MongoClient } = require('mongodb');
require('dotenv').config();

async function seedTestimonials() {
  const client = new MongoClient(process.env.DATABASE_URL || "mongodb://localhost:27017/EduCore?directConnection=true");
  try {
    await client.connect();
    const db = client.db();
    
    const testimonials = [
      {
        name: 'Nguyễn Thu Trang',
        score: '8.0 IELTS',
        text: 'Nhờ lộ trình cá nhân hóa, mình đã vượt qua nỗi sợ Speaking và đạt điểm số mong đợi chỉ sau 3 tháng.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
        isActive: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Trần Minh Quân',
        score: '7.5 IELTS',
        text: 'Hệ thống học tập cực kỳ hiện đại, đội ngũ giáo viên nhiệt tình và luôn hỗ trợ kịp thời.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop',
        isActive: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lê Thảo Vy',
        score: '8.5 IELTS',
        text: 'Chưa từng nghĩ mình có thể đạt 8.5 Listening. Bí quyết Shadowing từ EduCore thực sự thần kỳ!',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2574&auto=format&fit=crop',
        isActive: true,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('cms_testimonials').deleteMany({});
    await db.collection('cms_testimonials').insertMany(testimonials);
    console.log('Seeded testimonials successfully!');
  } finally {
    await client.close();
  }
}

seedTestimonials();
