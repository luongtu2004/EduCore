const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db();

    console.log('--- Cleaning old curriculum data ---');
    await db.collection('course_chapters').deleteMany({});
    await db.collection('course_lessons').deleteMany({});

    const courses = await db.collection('courses').find({}).toArray();
    
    if (courses.length === 0) {
      console.log('No courses found to seed curriculum.');
      return;
    }

    for (const course of courses) {
      console.log(`Seeding curriculum for: ${course.title}`);
      
      let chapters = [];
      if (course.title.includes('IELTS')) {
        chapters = [
          { title: 'Chặng 1: Nền tảng Writing & Speaking', order: 1 },
          { title: 'Chặng 2: Kỹ thuật Reading & Listening chuyên sâu', order: 2 },
          { title: 'Chặng 3: Luyện đề & Chiến thuật phòng thi', order: 3 },
        ];
      } else if (course.title.includes('TOEIC')) {
        chapters = [
          { title: 'Phần 1: Ngữ pháp & Từ vựng trọng tâm', order: 1 },
          { title: 'Phần 2: Kỹ năng nghe hiểu Part 1-4', order: 2 },
          { title: 'Phần 3: Đọc hiểu Part 5-7', order: 3 },
        ];
      } else {
        chapters = [
          { title: 'Giới thiệu tổng quan', order: 1 },
          { title: 'Kỹ năng giao tiếp cơ bản', order: 2 },
        ];
      }

      for (const chData of chapters) {
        const chapterResult = await db.collection('course_chapters').insertOne({
          title: chData.title,
          order: chData.order,
          courseId: course._id,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const chapterId = chapterResult.insertedId;

        // Seed lessons for this chapter
        const lessonsCount = Math.floor(Math.random() * 3) + 2; // 2-4 lessons
        for (let i = 1; i <= lessonsCount; i++) {
          await db.collection('course_lessons').insertOne({
            title: `Bài học ${i}: ${chData.title} - Phần ${i}`,
            content: 'Nội dung chi tiết của bài học đang được biên soạn bởi các chuyên gia tại EduCore.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
            duration: `${15 + i * 5}:00`,
            order: i,
            chapterId: chapterId,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    console.log('--- Seeding completed successfully ---');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seed();
