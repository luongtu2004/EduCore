const { MongoClient, ObjectId } = require('mongodb');

async function main() {
  const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/educore';
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db();
    
    // Tìm LearningPath
    let path = await db.collection('learning_paths').findOne({ title: { $regex: /IELTS MASTERY PATH/i } });
    
    if (!path) {
      console.log('Path not found! Creating it...');
      const insertResult = await db.collection('learning_paths').insertOne({
        title: 'IELTS Mastery Path',
        slug: 'ielts-mastery-path',
        description: 'Hành trình từ con số 0 đến bậc thầy IELTS được thiết kế bởi chuyên gia.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      path = { _id: insertResult.insertedId, title: 'IELTS Mastery Path' };
    }
    
    const pathIdString = path._id.toString();
    console.log('Found/Created path:', path.title, 'with string ID:', pathIdString);
    
    // Xóa các bước cũ
    await db.collection('learning_path_steps').deleteMany({ 
      $or: [
        { learningPathId: path._id },
        { learningPathId: pathIdString }
      ]
    });

    // Thêm các bước mới với learningPathId LÀ STRING (vì backend query bằng string)
    const stepsToCreate = [
      {
        learningPathId: pathIdString, // Must be STRING!
        order: 1,
        title: 'Giai đoạn 1: Khởi động (0 - 3.5)',
        description: 'Xây dựng nền tảng từ vựng, ngữ pháp và phát âm chuẩn quốc tế. Làm quen với tiếng Anh qua các chủ đề đời sống.',
        target: 'Nắm vững 1500 từ vựng cốt lõi & Ngữ pháp căn bản.',
        features: ['10 buổi học phát âm chuẩn IPA', '15 chuyên đề ngữ pháp trọng điểm', 'Từ vựng theo chủ đề'],
        color: 'slate',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        learningPathId: pathIdString,
        order: 2,
        title: 'Giai đoạn 2: Vượt chướng ngại vật (3.5 - 5.0)',
        description: 'Làm quen với 4 kỹ năng Nghe - Nói - Đọc - Viết trong format bài thi IELTS. Rèn luyện tư duy logic bằng tiếng Anh.',
        target: 'Đạt điểm 5.0 ở cả 4 kỹ năng.',
        features: ['Kỹ năng Đọc hiểu Skimming/Scanning', 'Viết câu đơn & ghép cơ bản', 'Nghe bắt keyword'],
        color: 'blue',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        learningPathId: pathIdString,
        order: 3,
        title: 'Giai đoạn 3: Tăng tốc (5.0 - 6.5)',
        description: 'Luyện đề chuyên sâu và chiến thuật làm bài cho từng dạng câu hỏi khó. Bổ sung từ vựng học thuật (Academic).',
        target: 'Chinh phục band 6.5 tổng thể.',
        features: ['Luyện đề thực chiến', 'Chiến thuật phòng thi', 'Chấm chữa Writing chi tiết'],
        color: 'emerald',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        learningPathId: pathIdString,
        order: 4,
        title: 'Giai đoạn 4: Về đích (6.5 - 8.0+)',
        description: 'Sử dụng ngôn ngữ linh hoạt, tự nhiên như người bản xứ. Hoàn thiện các kỹ năng phân tích và lập luận phức tạp.',
        target: 'Đạt IELTS 7.5 - 8.0+ tự tin apply học bổng.',
        features: ['Thi thử mô phỏng 100%', 'Speaking 1-1 với Giám khảo Mock Test', 'Collocations & Idioms nâng cao'],
        color: 'purple',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('learning_path_steps').insertMany(stepsToCreate);
    
    console.log('Successfully added 4 steps to path with STRING learningPathId!');

  } finally {
    await client.close();
  }
}

require('dotenv').config();
main().catch(console.error);
