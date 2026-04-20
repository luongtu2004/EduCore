import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Find or create a user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@educore.com',
        password: 'password123',
        fullName: 'Admin',
        role: 'ADMIN'
      }
    });
  }

  // Find or create a category
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Kinh nghiệm học tập',
        slug: 'kinh-nghiem-hoc-tap'
      }
    });
  }

  const postsToSeed = [
    { 
      title: '5 Bí quyết đạt IELTS 8.0 cho người bận rộn', 
      slug: '5-bi-quyet-dat-ielts-8-0', 
      summary: 'Học IELTS không chỉ là học tiếng Anh, đó là một hành trình rèn luyện kỷ luật...', 
      content: '<p>Nội dung chi tiết bài viết 1</p>',
      thumbnail: '/blog-1.png',
      status: 'PUBLISHED',
      authorId: user.id,
      categoryId: category.id
    },
    { 
      title: 'Lộ trình học tiếng Anh từ con số 0 lên 6.5', 
      slug: 'lo-trinh-hoc-tieng-anh-tu-con-so-0', 
      summary: 'Nếu bạn mới bắt đầu, đây là tấm bản đồ chi tiết nhất giúp bạn về đích...', 
      content: '<p>Nội dung chi tiết bài viết 2</p>',
      thumbnail: '/blog-2.png',
      status: 'PUBLISHED',
      authorId: user.id,
      categoryId: category.id
    },
    { 
      title: 'Kinh nghiệm du học Úc năm 2026: Những điều cần biết', 
      slug: 'kinh-nghiem-du-hoc-uc-2026', 
      summary: 'Úc vẫn luôn là điểm đến hấp dẫn, nhưng điều kiện xin visa đang có nhiều thay đổi...', 
      content: '<p>Nội dung chi tiết bài viết 3</p>',
      thumbnail: '/blog-3.png',
      status: 'PUBLISHED',
      authorId: user.id,
      categoryId: category.id
    },
    { 
      title: 'Phương pháp ghi nhớ 3000 từ vựng cốt lõi', 
      slug: 'phuong-phap-ghi-nho-tu-vung', 
      summary: 'Đừng học vẹt nữa. Hãy áp dụng phương pháp Spaced Repetition để nhớ từ vựng vĩnh viễn...', 
      content: '<p>Nội dung chi tiết bài viết 4</p>',
      thumbnail: '/blog-4.png',
      status: 'PUBLISHED',
      authorId: user.id,
      categoryId: category.id
    },
    { 
      title: 'Phân biệt IELTS và TOEFL: Bạn nên chọn cái nào?', 
      slug: 'phan-biet-ielts-va-toefl', 
      summary: 'Cả hai đều là chứng chỉ quốc tế uy tín, nhưng cấu trúc bài thi lại hoàn toàn khác biệt...', 
      content: '<p>Nội dung chi tiết bài viết 5</p>',
      thumbnail: '/blog-5.png',
      status: 'PUBLISHED',
      authorId: user.id,
      categoryId: category.id
    },
    { 
      title: 'Top 5 chứng chỉ tiếng Anh quan trọng nhất hiện nay', 
      slug: 'top-5-chung-chi-tieng-anh', 
      summary: 'Tùy vào mục tiêu đi làm hay đi học mà bạn cần chọn cho mình một chứng chỉ phù hợp...', 
      content: '<p>Nội dung chi tiết bài viết 6</p>',
      thumbnail: '/blog-6.png',
      status: 'PUBLISHED',
      authorId: user.id,
      categoryId: category.id
    }
  ];

  for (const post of postsToSeed) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (!existing) {
      await prisma.post.create({ data: post });
      console.log('Created post:', post.title);
    } else {
      await prisma.post.update({
        where: { slug: post.slug },
        data: post
      });
      console.log('Updated post:', post.title);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
