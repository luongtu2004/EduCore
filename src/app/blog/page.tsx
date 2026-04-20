'use client';

import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import api from '@/lib/axios';
import { useState, useEffect } from 'react';

const mockPosts = [
  { 
    id: '1', 
    title: '5 Bí quyết đạt IELTS 8.0 cho người bận rộn', 
    slug: '5-bi-quyet-dat-ielts-8-0', 
    summary: 'Học IELTS không chỉ là học tiếng Anh, đó là một hành trình rèn luyện kỷ luật...', 
    author: 'Admin', 
    createdAt: '2026-04-20',
    thumbnail: '/blog-1.png' 
  },
  { 
    id: '2', 
    title: 'Lộ trình học tiếng Anh từ con số 0 lên 6.5', 
    slug: 'lo-trinh-hoc-tieng-anh-tu-con-so-0', 
    summary: 'Nếu bạn mới bắt đầu, đây là tấm bản đồ chi tiết nhất giúp bạn về đích...', 
    author: 'Editor 1', 
    createdAt: '2026-04-18',
    thumbnail: '/blog-2.png' 
  },
  { 
    id: '3', 
    title: 'Kinh nghiệm du học Úc năm 2026: Những điều cần biết', 
    slug: 'kinh-nghiem-du-hoc-uc-2026', 
    summary: 'Úc vẫn luôn là điểm đến hấp dẫn, nhưng điều kiện xin visa đang có nhiều thay đổi...', 
    author: 'Admin', 
    createdAt: '2026-04-15',
    thumbnail: '/blog-3.png' 
  },
  { 
    id: '4', 
    title: 'Phương pháp ghi nhớ 3000 từ vựng cốt lõi', 
    slug: 'phuong-phap-ghi-nho-tu-vung', 
    summary: 'Đừng học vẹt nữa. Hãy áp dụng phương pháp Spaced Repetition để nhớ từ vựng vĩnh viễn...', 
    author: 'Teacher Sarah', 
    createdAt: '2026-04-12',
    thumbnail: '/blog-4.png' 
  },
  { 
    id: '5', 
    title: 'Phân biệt IELTS và TOEFL: Bạn nên chọn cái nào?', 
    slug: 'phan-biet-ielts-va-toefl', 
    summary: 'Cả hai đều là chứng chỉ quốc tế uy tín, nhưng cấu trúc bài thi lại hoàn toàn khác biệt...', 
    author: 'Counselor', 
    createdAt: '2026-04-10',
    thumbnail: '/blog-5.png' 
  },
  { 
    id: '6', 
    title: 'Top 5 chứng chỉ tiếng Anh quan trọng nhất hiện nay', 
    slug: 'top-5-chung-chi-tieng-anh', 
    summary: 'Tùy vào mục tiêu đi làm hay đi học mà bạn cần chọn cho mình một chứng chỉ phù hợp...', 
    author: 'Admin', 
    createdAt: '2026-04-08',
    thumbnail: '/blog-6.png' 
  }
];

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>(mockPosts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/cms/posts/public');
        if (response.data?.length > 0) {
          setPosts(response.data);
        } else {
          // fallback to /cms/posts if public fails or empty
          const fallback = await api.get('/cms/posts');
          if (fallback.data?.length > 0) {
             setPosts(fallback.data);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải bài viết từ API:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 bg-white">
        <section className="bg-slate-50 py-20 pt-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 md:text-5xl">EduCore Blog</h1>
            <p className="mt-4 text-lg text-slate-600">Chia sẻ kinh nghiệm học tập, lộ trình IELTS và tin tức giáo dục mới nhất.</p>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id || post._id} className="group cursor-pointer">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-200">
                      <Image 
                        src={post.thumbnail || post.image || '/blog-1.png'} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </Link>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.createdAt || post.date || new Date()).toLocaleDateString('vi-VN')}</div>
                      <div className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author?.fullName || post.author || 'Admin'}</div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {post.summary || post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600">
                      Đọc thêm <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
