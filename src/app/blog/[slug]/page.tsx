'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Share2, Facebook, Twitter, User, Calendar, Tag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import Image from 'next/image';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/cms/posts/public/${params.slug}`);
        if (response.data) {
          setPost(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết bài viết:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.slug) fetchPost();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Không tìm thấy bài viết</h1>
        <Button onClick={() => router.push('/blog')}>Quay lại blog</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 bg-white pb-24 pt-32">
        <article className="mx-auto max-w-4xl px-6">
          <Button variant="ghost" className="mb-8 gap-2 pl-0 text-slate-500 hover:text-emerald-600 transition-colors" onClick={() => router.push('/blog')}>
            <ArrowLeft className="h-4 w-4" /> Quay lại blog
          </Button>

          <header className="space-y-6">
            <div className="inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-black text-emerald-700 uppercase tracking-widest">
              {post.category?.name || 'KINH NGHIỆM HỌC TẬP'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
              {post.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-y border-slate-100 py-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                  {post.author?.avatar ? (
                    <Image src={post.author.avatar} alt="Author" width={48} height={48} className="object-cover" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{post.author?.fullName || 'Admin EduCore'}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 5 phút đọc</span>
                    <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {post.views || 0} lượt xem</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"><Facebook className="h-4.5 w-4.5" /></Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"><Twitter className="h-4.5 w-4.5" /></Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"><Share2 className="h-4.5 w-4.5" /></Button>
              </div>
            </div>

            {/* TAGS */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="mt-10 relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-12">
            <Image 
              src={post.thumbnail || '/blog-1.png'} 
              alt={post.title} 
              fill 
              className="object-cover"
            />
          </div>

          <div 
            className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-a:text-emerald-600 prose-img:rounded-3xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}
