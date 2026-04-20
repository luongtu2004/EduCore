const { MongoClient, ObjectId } = require('mongodb');

const questions = [
  {
    text: "Trình độ tiếng Anh hiện tại của bạn đang ở mức nào?",
    section: 'foundation',
    options: ["Mất gốc / Bắt đầu từ đầu", "Biết cơ bản nhưng chưa nói được", "Giao tiếp được cơ bản", "Đã từng ôn luyện IELTS"],
    weights: [0, 1, 2, 3],
    order: 1,
    isActive: true
  },
  {
    text: "Chọn câu đúng: 'If I ___ you, I would apply for that scholarship.'",
    section: 'foundation',
    options: ["am", "was", "were", "be"],
    weights: [0, 0, 2, 0],
    order: 2,
    isActive: true
  },
  {
    text: "Từ 'Metamorphosis' có nghĩa gần nhất với từ nào?",
    section: 'foundation',
    options: ["Movement", "Transformation", "Growth", "Death"],
    weights: [0, 3, 1, 0],
    order: 3,
    isActive: true
  },
  {
    text: "Bạn có thể nghe hiểu các video tiếng Anh (không sub) ở mức độ nào?",
    section: 'skills',
    options: ["Không hiểu gì", "Hiểu khoảng 30-50%", "Hiểu khoảng 70-80%", "Hiểu hầu hết nội dung"],
    weights: [0, 1, 2, 3],
    order: 4,
    isActive: true
  },
  {
    text: "Khi nói tiếng Anh, rào cản lớn nhất của bạn là gì?",
    section: 'skills',
    options: ["Thiếu từ vựng / Ngữ pháp", "Phát âm chưa chuẩn", "Ngại ngùng / Sợ sai", "Phản xạ chậm"],
    weights: [1, 1, 1, 1],
    order: 5,
    isActive: true
  },
  {
    text: "Bạn đã từng viết một bài luận tiếng Anh dài trên 250 chữ chưa?",
    section: 'skills',
    options: ["Chưa bao giờ", "Đã từng nhưng rất khó khăn", "Có thể viết được nhưng sai nhiều", "Tự tin viết tốt"],
    weights: [0, 1, 2, 3],
    order: 6,
    isActive: true
  },
  {
    text: "Lý do quan trọng nhất khiến bạn muốn học IELTS là gì?",
    section: 'goal',
    options: ["Du học / Định cư", "Yêu cầu ra trường", "Cơ hội việc làm", "Sở thích cá nhân"],
    weights: [1, 1, 1, 1],
    order: 7,
    isActive: true
  },
  {
    text: "Mục tiêu điểm số IELTS bạn mong muốn đạt được?",
    section: 'goal',
    options: ["5.5 - 6.0", "6.5 - 7.0", "7.5 - 8.0", "8.5+"],
    weights: [1, 2, 3, 4],
    order: 8,
    isActive: true
  },
  {
    text: "Bạn có thể dành bao nhiêu thời gian học tập trung mỗi ngày?",
    section: 'goal',
    options: ["Dưới 1 tiếng", "1 - 2 tiếng", "2 - 3 tiếng", "Trên 3 tiếng"],
    weights: [0, 1, 2, 3],
    order: 9,
    isActive: true
  },
  {
    text: "Bạn cần đạt được mục tiêu này trong bao lâu?",
    section: 'goal',
    options: ["Dưới 3 tháng (Cần gấp)", "3 - 6 tháng", "6 - 12 tháng", "Không quá vội"],
    weights: [3, 2, 1, 0],
    order: 10,
    isActive: true
  }
];

async function main() {
  const uri = "mongodb://localhost:27017/EduCore?directConnection=true";
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('EduCore');
    
    // Clear existing questions
    await db.collection('cms_quiz_questions').deleteMany({});
    
    // Insert new questions
    const now = new Date();
    const questionsWithTimestamps = questions.map(q => ({
      ...q,
      createdAt: now,
      updatedAt: now
    }));
    
    await db.collection('cms_quiz_questions').insertMany(questionsWithTimestamps);
    console.log(`Successfully seeded ${questions.length} quiz questions.`);
    
  } catch (error) {
    console.error("Error seeding quiz questions:", error);
  } finally {
    await client.close();
  }
}

main();
