const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function seedAll() {
  const client = new MongoClient(process.env.DATABASE_URL || "mongodb://localhost:27017/EduCore?directConnection=true");
  try {
    await client.connect();
    const db = client.db();
    
    // 1. Ensure all categories exist
    const categories = [
      { name: 'Kinh nghiệm học tập', slug: 'kinh-nghiem-hoc-tap' },
      { name: 'Tin tức sự kiện', slug: 'tin-tuc-su-kien' },
      { name: 'Góc học viên', slug: 'goc-hoc-vien' },
      { name: 'Kỹ năng Listening', slug: 'ky-nang-listening' },
      { name: 'Kỹ năng Reading', slug: 'ky-nang-reading' },
      { name: 'Kỹ năng Writing', slug: 'ky-nang-writing' },
      { name: 'Kỹ năng Speaking', slug: 'ky-nang-speaking' },
      { name: 'Tài liệu miễn phí', slug: 'tai-lieu-mien-phi' },
      { name: 'Thông tin du học', slug: 'thong-tin-du-hoc' }
    ];

    for (const cat of categories) {
      await db.collection('cms_categories').updateOne(
        { slug: cat.slug },
        { $setOnInsert: { ...cat, createdAt: new Date() } },
        { upsert: true }
      );
    }

    const allCats = await db.collection('cms_categories').find({}).toArray();
    const catMap = {};
    allCats.forEach(c => catMap[c.slug] = c._id);

    // 2. Prepare sample posts
    const authorId = new ObjectId("69e160a7479421f1d113670c"); // Mock admin ID
    const posts = [];

    const sampleData = [
      { slug: 'ky-nang-listening', title: '5 Nguồn nghe IELTS chuẩn nhất 2026', summary: 'Từ BBC đến TED-IELTS, đâu là nguồn nghe giúp bạn bứt phá band điểm?' },
      { slug: 'ky-nang-listening', title: 'Phương pháp Dictation: Nghe chép chính tả hiệu quả', summary: 'Đừng chỉ nghe thụ động, hãy thử thách đôi tai của bạn với kỹ thuật chép chính tả.' },
      
      { slug: 'ky-nang-reading', title: 'Mẹo làm dạng bài Matching Headings không bao giờ sai', summary: 'Dạng bài khó nhất Reading giờ đây sẽ trở nên đơn giản với 3 bước phân tích.' },
      { slug: 'ky-nang-reading', title: 'Cách quản lý thời gian trong phòng thi Reading', summary: '60 phút cho 3 bài đọc dài, bạn cần một chiến thuật phân bổ thời gian thông minh.' },

      { slug: 'ky-nang-writing', title: 'Cấu trúc bài viết Task 2 ghi điểm tuyệt đối', summary: 'Bố cục 4 đoạn chuẩn mực giúp bạn trình bày ý tưởng mạch lạc và logic.' },
      { slug: 'ky-nang-writing', title: '10 Cấu trúc ngữ pháp ăn điểm cho Writing 7.0+', summary: 'Nâng tầm bài viết với những cấu trúc phức hợp nhưng vẫn tự nhiên.' },

      { slug: 'ky-nang-speaking', title: 'Bí quyết tự tin Speaking với phương pháp Mirroring', summary: 'Luyện nói trước gương giúp bạn cải thiện khẩu hình và phong thái tự tin.' },
      { slug: 'ky-nang-speaking', title: 'Bộ câu hỏi Speaking Part 1 mới nhất quý 2/2026', summary: 'Tổng hợp và gợi ý trả lời cho các chủ đề hot nhất hiện nay.' },

      { slug: 'tai-lieu-mien-phi', title: 'Download trọn bộ Cambridge IELTS 1-20', summary: 'Kho tài liệu ôn thi kinh điển không thể thiếu cho mọi sĩ tử IELTS.' },
      { slug: 'tai-lieu-mien-phi', title: 'Ebook: 1000 Từ vựng IELTS theo chủ đề', summary: 'Học từ vựng một cách hệ thống giúp bạn nhớ lâu và ứng dụng linh hoạt.' },

      { slug: 'thong-tin-du-hoc', title: 'Học bổng du học Úc 100% cho sinh viên Việt Nam', summary: 'Cơ hội vàng để hiện thực hóa giấc mơ du học tại xứ sở Kangaroo.' },
      { slug: 'thong-tin-du-hoc', title: 'Cần chuẩn bị những gì khi đi du học Canada?', summary: 'Từ visa, nhà ở đến tâm lý, hãy cùng EduCore lên danh sách chuẩn bị chu đáo.' }
    ];

    // Create 30 posts to test pagination
    for (let i = 1; i <= 30; i++) {
      const data = sampleData[i % sampleData.length];
      posts.push({
        title: `${data.title} - Phần ${i}`,
        slug: `${data.slug}-post-${i}`,
        summary: data.summary,
        content: `Đây là nội dung chi tiết của bài viết số ${i}. Chúc các bạn học tập tốt cùng EduCore!`,
        thumbnail: `https://picsum.photos/seed/${i + 100}/800/500`,
        status: 'PUBLISHED',
        authorId: authorId,
        categoryId: catMap[data.slug],
        views: Math.floor(Math.random() * 1000),
        createdAt: new Date(Date.now() - i * 3600000), // Staggered time
        updatedAt: new Date()
      });
    }

    await db.collection('cms_posts').insertMany(posts);
    console.log('Seeded 30 posts for all categories successfully!');
  } finally {
    await client.close();
  }
}

seedAll();
