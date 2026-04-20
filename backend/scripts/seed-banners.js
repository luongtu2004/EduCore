const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db();

    console.log('--- Cleaning old banners ---');
    await db.collection('cms_banners').deleteMany({});

    const banners = [
      {
        title: 'Chinh phục IELTS 8.5 cùng EduCore',
        subtitle: 'Lộ trình cá nhân hóa bằng AI, cam kết đầu ra bằng văn bản.',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
        link: '/courses',
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Bứt phá TOEIC 750+ chỉ sau 2 tháng',
        subtitle: 'Hệ thống luyện thi thông minh, tiết kiệm 50% thời gian học.',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
        link: '/courses',
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Tiếng Anh Giao Tiếp Cho Người Đi Làm',
        subtitle: 'Tự tin thuyết trình, đàm phán và thăng tiến trong sự nghiệp.',
        imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1949&auto=format&fit=crop',
        link: '/courses',
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('cms_banners').insertMany(banners);
    console.log('--- Banners seeded successfully ---');
  } catch (error) {
    console.error('Error seeding banners:', error);
  } finally {
    await client.close();
  }
}

seed();
