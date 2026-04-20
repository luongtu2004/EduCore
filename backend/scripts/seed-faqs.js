const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db();

    console.log('--- Cleaning old FAQs ---');
    await db.collection('cms_faqs').deleteMany({});

    const faqs = [
      {
        question: 'EduCore có cam kết đầu ra bằng văn bản không?',
        answer: 'Có, tất cả học viên đăng ký lộ trình Intensive đều được ký cam kết đầu ra bằng văn bản. Nếu không đạt mục tiêu, học viên sẽ được hỗ trợ học lại hoàn toàn miễn phí.',
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'Tôi có thể đổi lịch học nếu bận việc đột xuất không?',
        answer: 'EduCore hỗ trợ bảo lưu và thay đổi lịch học linh hoạt. Bạn chỉ cần thông báo cho bộ phận giáo vụ trước 24h để được sắp xếp buổi học bù.',
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'Hệ thống AI của EduCore giúp ích gì cho việc học?',
        answer: 'Hệ thống AI sẽ phân tích lỗi sai trong quá trình làm bài, từ đó gợi ý các bài tập bổ trợ tập trung đúng vào điểm yếu của bạn, giúp tiết kiệm 30-50% thời gian học.',
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'Lớp học tại EduCore tối đa bao nhiêu học viên?',
        answer: 'Để đảm bảo chất lượng tương tác cao nhất, mỗi lớp học tại EduCore chỉ giới hạn từ 8-12 học viên đối với lớp Offline và tối đa 6 học viên đối với lớp Online.',
        order: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('cms_faqs').insertMany(faqs);
    console.log('--- FAQs seeded successfully ---');
  } catch (error) {
    console.error('Error seeding FAQs:', error);
  } finally {
    await client.close();
  }
}

seed();
