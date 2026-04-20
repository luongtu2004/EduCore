const { MongoClient, ObjectId } = require('mongodb');

const contentIELTS = `
  <p class="lead">Chinh phục IELTS 8.0 không phải là điều không tưởng, ngay cả với những người cực kỳ bận rộn. Chìa khóa nằm ở việc tối ưu hóa từng phút giây và áp dụng các phương pháp học tập thông minh thay vì học nhồi nhét.</p>
  
  <h2>1. Tận dụng thời gian "chết" để luyện nghe</h2>
  <p>Thay vì nghe nhạc khi đi làm hoặc nấu ăn, hãy bật các podcast tiếng Anh. Việc nghe thụ động giúp tai bạn quen với ngữ điệu và tốc độ của người bản xứ mà không tốn thêm quỹ thời gian quý báu.</p>

  <div class="bg-blue-50 p-8 rounded-3xl border-l-8 border-blue-500 my-10">
    <p class="italic text-blue-900 font-medium">"Đừng đợi đến khi có 2-3 tiếng rảnh rỗi mới học. Hãy học trong 15 phút chờ xe bus, 10 phút nghỉ trưa. Những khoảng thời gian nhỏ này cộng lại sẽ tạo nên kết quả lớn."</p>
  </div>

  <h2>2. Tập trung vào các từ vựng theo chủ đề</h2>
  <p>Đừng học từ vựng rời rạc. Hãy học theo cụm từ (collocations) và theo các chủ đề thường gặp trong IELTS như Environment, Education, Technology. Cách này giúp bạn ghi nhớ nhanh hơn và áp dụng được vào cả Speaking và Writing.</p>

  <h3>Lộ trình cụ thể cho người đi làm:</h3>
  <ul>
    <li>Sáng: Nghe podcast 20 phút trên đường đi làm.</li>
    <li>Trưa: Đọc 1 bài báo trên BBC hoặc CNN trong 15 phút.</li>
    <li>Tối: Luyện viết 1 đoạn văn ngắn hoặc luyện nói trước gương 20 phút.</li>
  </ul>
`;

const contentStudyAbroad = `
  <p class="lead">Năm 2026 hứa hẹn sẽ là một năm đầy bùng nổ cho du học sinh Việt Nam tại Úc. Tuy nhiên, các chính sách visa mới cũng đòi hỏi sự chuẩn bị kỹ lưỡng và sớm hơn bao giờ hết.</p>
  
  <h2>Những thay đổi mới nhất về chính sách Visa</h2>
  <p>Chính phủ Úc đang tập trung vào việc thu hút lao động có tay nghề cao. Do đó, các ngành học về Công nghệ thông tin, Điều dưỡng và Kỹ thuật đang được ưu tiên hàng đầu trong việc cấp xét visa và cơ hội định cư.</p>

  <div class="bg-amber-50 p-8 rounded-3xl border-l-8 border-amber-500 my-10">
    <p class="italic text-amber-900 font-medium">Lưu ý: Chứng chỉ IELTS hiện nay là yêu cầu bắt buộc và điểm số tối thiểu đã tăng lên so với các năm trước. Hãy đảm bảo bạn có ít nhất 6.0 - 6.5 trước khi nộp hồ sơ.</p>
  </div>

  <h2>Tại sao nên chọn Úc trong năm 2026?</h2>
  <ul>
    <li>Môi trường sống an toàn và đa văn hóa.</li>
    <li>Cơ hội làm thêm với mức lương hấp dẫn.</li>
    <li>Bằng cấp được công nhận trên toàn thế giới.</li>
    <li>Chính sách hỗ trợ sinh viên quốc tế sau đại dịch rất tốt.</li>
  </ul>
`;

const contentMethod = `
  <p class="lead">Bạn đã bao giờ tự hỏi tại sao mình học từ vựng hôm trước mà hôm sau đã quên sạch? Câu trả lời nằm ở cơ chế hoạt động của não bộ và cách bạn tiếp nhận thông tin.</p>
  
  <h2>Phương pháp Spaced Repetition (Lặp lại ngắt quãng)</h2>
  <p>Đây là kỹ thuật ghi nhớ dựa trên việc ôn tập lại kiến thức vào những khoảng thời gian tăng dần. Thay vì học 100 từ trong 1 ngày, hãy học 10 từ mỗi ngày và lặp lại chúng vào ngày thứ 1, ngày thứ 3, ngày thứ 7 và ngày thứ 30.</p>

  <div class="bg-emerald-50 p-8 rounded-3xl border-l-8 border-emerald-500 my-10">
    <p class="italic text-emerald-900 font-medium">Mẹo: Sử dụng các ứng dụng như Anki hoặc Quizlet để tự động hóa quá trình lặp lại ngắt quãng này. Bạn sẽ ngạc nhiên về khả năng ghi nhớ của mình!</p>
  </div>

  <h2>Học qua ngữ cảnh thực tế</h2>
  <p>Đừng chỉ nhìn vào nghĩa tiếng Việt. Hãy đặt câu với từ đó, tìm các ví dụ trên mạng hoặc xem các video ngắn có chứa từ vựng đó. Việc gắn liền từ vựng với một cảm xúc hoặc hình ảnh sẽ giúp não bộ lưu trữ thông tin sâu hơn.</p>
`;

const contentSpeaking = `
  <p class="lead">Nhiều học viên có vốn từ vựng và ngữ pháp rất tốt nhưng lại gặp khó khăn khi giao tiếp thực tế. Vấn đề thường nằm ở tâm lý và sự thiếu hụt trong việc luyện tập phản xạ.</p>
  
  <h2>Bí quyết 1: Luyện nói theo phương pháp Shadowing</h2>
  <p>Hãy chọn một đoạn video của người bản xứ, nghe và lặp lại y hệt những gì họ nói: từ ngữ điệu, cách ngắt nghỉ đến cảm xúc. Đây là cách nhanh nhất để cải thiện phát âm và ngữ điệu tự nhiên.</p>

  <div class="bg-purple-50 p-8 rounded-3xl border-l-8 border-purple-500 my-10">
    <p class="italic text-purple-900 font-medium">Ghi âm lại chính giọng nói của mình là cách tốt nhất để nhận ra những lỗi sai mà bạn thường mắc phải nhưng không hề hay biết.</p>
  </div>

  <h2>Bí quyết 2: Đừng quá quan trọng về ngữ pháp khi nói</h2>
  <p>Trong giao tiếp thực tế, sự trôi chảy (Fluency) và khả năng truyền đạt ý tưởng quan trọng hơn việc đúng hoàn toàn 100% ngữ pháp. Hãy tự tin nói ra ý nghĩ của mình trước, sau đó mới dần dần sửa lỗi.</p>
`;

async function main() {
  const uri = "mongodb://localhost:27017/EduCore?directConnection=true";
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db('EduCore');
    
    let user = await db.collection('users').findOne({});
    let category = await db.collection('cms_categories').findOne({});

    const postsToSeed = [
      { 
        slug: '5-bi-quyet-dat-ielts-8-0', 
        content: contentIELTS,
        tags: ['IELTS', 'Mẹo học tập', 'Kinh nghiệm']
      },
      { 
        slug: 'lo-trinh-hoc-tieng-anh-tu-con-so-0', 
        content: contentIELTS,
        tags: ['Lộ trình', 'Cơ bản', 'Học thuật']
      },
      { 
        slug: 'kinh-nghiem-du-hoc-uc-2026', 
        content: contentStudyAbroad,
        tags: ['Du học', 'Úc', 'Visa']
      },
      { 
        slug: 'phuong-phap-ghi-nho-tu-vung', 
        content: contentMethod,
        tags: ['Từ vựng', 'Ghi nhớ', 'Phương pháp']
      },
      { 
        slug: 'phan-biet-ielts-va-toefl', 
        content: contentIELTS,
        tags: ['IELTS', 'TOEFL', 'So sánh']
      },
      { 
        slug: 'top-5-chung-chi-tieng-anh', 
        content: contentMethod,
        tags: ['Chứng chỉ', 'Sự nghiệp', 'Top 5']
      },
      { 
        slug: '10-meo-speaking-ielts', 
        content: contentSpeaking,
        tags: ['Speaking', 'Mẹo thi', 'Phát âm']
      },
      { 
        slug: 'chien-thuat-reading-ielts', 
        content: contentIELTS,
        tags: ['Reading', 'Chiến thuật', 'IELTS']
      },
      { 
        slug: 'tai-lieu-ielts-mien-phi-2026', 
        content: contentMethod,
        tags: ['Tài liệu', 'Miễn phí', 'Download']
      },
      { 
        slug: 'tai-sao-chon-educore', 
        content: contentIELTS,
        tags: ['EduCore', 'Tại sao chọn', 'Chất lượng']
      },
      { 
        slug: 'hoc-vien-educore-thanh-cong', 
        content: contentSpeaking,
        tags: ['Thành công', 'Review', 'Học viên']
      },
      { 
        slug: 'bi-mat-listening-diem-tuyet-doi', 
        content: contentSpeaking,
        tags: ['Listening', 'Bí mật', 'Điểm cao']
      }
    ];

    for (const post of postsToSeed) {
      await db.collection('cms_posts').updateOne(
        { slug: post.slug },
        { $set: { content: post.content, tags: post.tags } }
      );
      console.log('Updated unique content for:', post.slug);
    }
  } catch (error) {
    console.error("Error seeding DB:", error);
  } finally {
    await client.close();
  }
}

main();
