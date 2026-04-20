'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  FileText, Plus, Search, Filter,
  MoreVertical, Edit2, Trash2, Eye,
  CheckCircle2, Clock, ChevronLeft, ChevronRight,
  ChevronDown, BookOpen, Sparkles, LayoutGrid, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CreatePostModal } from '@/components/modals/create-post-modal';

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/cms/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Lỗi khi tải bài viết:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-400 p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Quản lý Bài viết</h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Danh sách bài viết Blog trên hệ thống EduCore</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-12 rounded-xl bg-emerald-600 text-white px-8 font-black text-xs shadow-lg shadow-emerald-900/20 hover:scale-105 transition-all border-none gap-2"
        >
          <Plus className="h-4 w-4" /> THÊM BÀI VIẾT
        </Button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col lg:flex-row items-center gap-4 mb-10 relative">
        <div className="flex-1 relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-white/10 focus:bg-slate-950 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-200 placeholder:text-slate-600 outline-none shadow-inner"
          />
        </div>

        <div className="relative w-full lg:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-12 px-6 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2.5 text-sm font-bold whitespace-nowrap w-full lg:w-auto shadow-sm backdrop-blur-sm",
              showFilters
                ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/30"
                : "bg-slate-950/50 border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10"
            )}
          >
            <Filter className="h-4 w-4" />
            Bộ lọc nâng cao
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showFilters ? "rotate-180" : "")} />
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Bài viết</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Danh mục</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cập nhật lần cuối</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <tr key="loading">
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-5">
                      <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-sm" />
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedPosts.length > 0 ? (
                paginatedPosts.map((post, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.02 }}
                    key={post.id}
                    className="group hover:bg-white/[0.03] transition-all cursor-pointer relative"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-emerald-500 transition-all">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors leading-none line-clamp-1">{post.title}</p>
                          <div className="flex flex-col gap-2 mt-2.5">
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 opacity-70 ml-1">
                              Slug: {post.slug}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        {post.category?.name || 'Kinh nghiệm học tập'}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span className="text-[11px] font-bold text-gray-400">{new Date().toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-white/5 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-500 text-gray-500 transition-transform hover:scale-105">
                          <Eye className="h-4.5 w-4.5" />
                        </Button>
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-white/5 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-500 text-gray-500 transition-transform hover:scale-105">
                            <Edit2 className="h-4.5 w-4.5" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 text-gray-500 transition-transform hover:scale-105">
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr key="empty">
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="opacity-40 flex flex-col items-center">
                      <AlertCircle className="h-20 w-20 mb-5 text-slate-400" />
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Không tìm thấy bài viết</p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="px-8 py-6 bg-white/5 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Trang {currentPage} / {totalPages || 1}
            </p>
            <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              {paginatedPosts.length} / {filteredPosts.length} Bài viết
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-white/5 bg-white/5 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-white/5 bg-white/5 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
