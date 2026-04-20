import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const uri = process.env.DATABASE_URL || "";

async function main() {
  console.log('Đang gieo dữ liệu bằng MongoDB Driver gốc (Tương thích 100%)...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();

    // 1. Tạo Lộ trình (Learning Path)
    const pathsCollection = db.collection('learning_paths');
    const stepsCollection = db.collection('learning_path_steps');

    const existingPath = await pathsCollection.findOne({ slug: 'ielts-mastery-path' });
    
    if (!existingPath) {
      const pathId = new ObjectId();
      await pathsCollection.insertOne({
        _id: pathId,
        title: 'IELTS Mastery Path',
        slug: 'ielts-mastery-path',
        description: 'Hành trình từ con số 0 đến bậc thầy IELTS được thiết kế bởi chuyên gia.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const steps = [
        {
          learningPathId: pathId,
          order: 1,
          title: 'Giai đoạn 1: Foundation (0 - 3.0)',
          description: 'Lấy lại căn bản, tập trung vào phát âm chuẩn IPA và ngữ pháp cốt lõi.',
          target: 'Band 3.0+',
          color: 'emerald',
          features: ['Phát âm chuẩn IPA 44 âm', 'Ngữ pháp 12 thì cơ bản', '1000 từ vựng thông dụng'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          learningPathId: pathId,
          order: 2,
          title: 'Giai đoạn 2: Pre-IELTS (3.0 - 4.5)',
          description: 'Bắt đầu làm quen với định dạng đề thi và các dạng câu hỏi cơ bản.',
          target: 'Band 4.5+',
          color: 'blue',
          features: ['Kỹ năng Listening cơ bản', 'Reading (Skimming/Scanning)', 'Speaking Part 1'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          learningPathId: pathId,
          order: 3,
          title: 'Giai đoạn 3: IELTS Intensive (4.5 - 6.0)',
          description: 'Luyện tập chuyên sâu các kỹ năng, tập trung vào chiến thuật làm bài.',
          target: 'Band 6.0+',
          color: 'purple',
          features: ['Writing Task 1 (All types)', 'Speaking Part 2 & 3', 'Reading nâng cao'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          learningPathId: pathId,
          order: 4,
          title: 'Giai đoạn 4: IELTS Advanced (6.0 - 7.5+)',
          description: 'Tối ưu hóa điểm số, rèn luyện kỹ thuật đạt điểm cao trong Writing và Speaking.',
          target: 'Band 7.5+',
          color: 'orange',
          features: ['Writing Task 2 chuyên sâu', 'Mẹo đạt điểm 9.0 Reading', 'Speaking phản xạ tự nhiên'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await stepsCollection.insertMany(steps);
      console.log('Đã tạo Lộ trình IELTS thành công!');
    }

    // 2. Tạo Khóa học (Courses) - Kiểm tra từng khóa học
    const coursesCollection = db.collection('courses');
    const courses = [
      {
        title: 'IELTS Foundation',
        slug: 'ielts-foundation',
        description: 'Khóa học dành cho người mới bắt đầu hoặc mất gốc tiếng Anh.',
        price: 4500000,
        duration: '3 tháng',
        isActive: true,
        content: 'Lấy lại căn bản, luyện phát âm chuẩn, tăng vốn từ vựng.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'IELTS Intensive',
        slug: 'ielts-intensive',
        description: 'Luyện tập cường độ cao, tập trung vào chiến thuật làm bài 4 kỹ năng.',
        price: 6800000,
        duration: '4 tháng',
        isActive: true,
        content: 'Luyện đề thực tế, sửa bài Writing 1-1, cam kết đầu ra.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'IELTS Mastery',
        slug: 'ielts-mastery',
        description: 'Chinh phục Band điểm 7.5+ với các chuyên gia hàng đầu.',
        price: 9500000,
        duration: '3 tháng',
        isActive: true,
        content: 'Kỹ năng Speaking nâng cao, chiến thuật đạt 8.0+, học cùng chuyên gia.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Tiếng Anh giao tiếp',
        slug: 'tieng-anh-giao-tiep',
        description: 'Tự tin giao tiếp trong môi trường công việc và đời sống.',
        price: 3200000,
        duration: '2 tháng',
        isActive: true,
        content: 'Phản xạ tự nhiên, môi trường 100% tiếng Anh, chủ đề thực dụng.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'TOEIC Bứt phá 750+',
        slug: 'toeic-but-pha-750',
        description: 'Khóa học tập trung vào kỹ thuật làm đề và từ vựng chuyên sâu cho kỳ thi TOEIC.',
        price: 3800000,
        duration: '3 tháng',
        isActive: true,
        content: 'Mẹo làm bài Part 5, 6, 7; Luyện nghe cường độ cao.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Giao tiếp công sở (Business English)',
        slug: 'business-english',
        description: 'Dành cho người đi làm muốn nâng cao kỹ năng thuyết trình, viết email và đàm phán.',
        price: 5500000,
        duration: '3 tháng',
        isActive: true,
        content: 'Kỹ năng họp hành, viết báo cáo chuyên nghiệp bằng tiếng Anh.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const course of courses) {
      const exists = await coursesCollection.findOne({ slug: course.slug });
      if (!exists) {
        await coursesCollection.insertOne(course);
        console.log(`Đã thêm khóa học: ${course.title}`);
      }
    }

    console.log('Gieo dữ liệu thành công!');
  } finally {
    await client.close();
  }
}

main().catch(console.error);
