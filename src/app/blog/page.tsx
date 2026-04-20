'use client';

import { Calendar, User, ArrowRight, Tag, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import api from '@/lib/axios';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetchPosts();
  }, [currentPage, activeCategory]);

  useEffect(() => {
    // Reset to page 1 when category changes
    setCurrentPage(1);
  }, [activeCategory]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/posts/public', {
        params: {
          page: currentPage,
          limit,
          category: activeCategory
        }
      });
      
      if (response.success) {
        setPosts(response.posts);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catsRes: any = await api.get('/cms/categories');
        if (catsRes.success) setCategories(catsRes.data);
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  // Drag to scroll logic
  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;
    
    slider.classList.add('active');
    const startX = e.pageX - slider.offsetLeft;
    const scrollLeft = slider.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      slider.classList.remove('active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-slate-900 pt-40 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="mx-auto max-w-7xl px-6 relative z-10 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-emerald-400 font-black text-xs tracking-[0.4em] uppercase mb-4 block">Knowledge Hub</span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                EduCore <span className="text-emerald-500">Insights</span>
              </h1>
              <p className="text-lg text-slate-400 font-bold max-w-2xl leading-relaxed italic">
                Chia sẻ kinh nghiệm học tập, lộ trình IELTS cá nhân hóa và những câu chuyện thành công từ cộng đồng học viên EduCore.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CATEGORY BAR */}
        <section className="bg-white border-b border-slate-100 relative z-10">
          <div className="mx-auto max-w-7xl px-6">
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar { height: 4px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
              .active { cursor: grabbing !important; }
            `}</style>
            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              className="flex items-center justify-start gap-2 overflow-x-auto custom-scrollbar pt-6 pb-2 cursor-grab select-none"
            >
              <button
                onClick={() => setActiveCategory('all')}
                className={cn(
                  "relative px-6 pb-6 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeCategory === 'all' ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"
                )}
              >
                Tất cả bài viết
                {activeCategory === 'all' && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-6 right-6 h-1 bg-emerald-600 rounded-full"
                  />
                )}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={cn(
                    "relative px-6 pb-6 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    activeCategory === cat.slug ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"
                  )}
                >
                  {cat.name}
                  {activeCategory === cat.slug && (
                    <motion.div 
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-6 right-6 h-1 bg-emerald-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* BLOG GRID */}
        <section className="py-20 bg-slate-50/50 min-h-[600px]">
          <div className="mx-auto max-w-7xl px-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Đang tải kho tri thức...</p>
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <AnimatePresence mode="popLayout">
                    {posts.map((post, idx) => (
                      <motion.article 
                        key={post.id || post._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="group flex flex-col h-full"
                      >
                        <Link href={`/blog/${post.slug}`} className="flex-1 flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <Image 
                              src={post.thumbnail || post.image || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2573&auto=format&fit=crop'} 
                              alt={post.title} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />
                            <div className="absolute top-6 left-6">
                              <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                                {post.category?.name || 'EduCore'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                              <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
                              <div className="flex items-center gap-1.5"><User className="h-3 w-3" /> {post.author?.fullName || 'Admin'}</div>
                            </div>
                            <h2 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 uppercase italic leading-tight mb-4">
                              {post.title}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 line-clamp-3 leading-relaxed mb-8">
                              {post.summary}
                            </p>
                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                              <span className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest group-hover:gap-4 transition-all">
                                Đọc bài viết <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-20 flex justify-center items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className={cn(
                          "h-12 w-12 rounded-2xl text-sm font-black transition-all",
                          currentPage === i + 1
                            ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-110"
                            : "bg-white text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="py-40 text-center bg-white rounded-[3.5rem] border border-dashed border-slate-200">
                <Tag className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Chưa có bài viết trong mục này</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <PublicFooter />
    </div>
  );
}
