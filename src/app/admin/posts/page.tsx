'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  FileText, Plus, Search, Filter,
  MoreVertical, Edit2, Trash2, Eye,
  CheckCircle2, Clock, ChevronLeft, ChevronRight,
  ChevronDown, BookOpen, Sparkles, LayoutGrid, AlertCircle, Loader2, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PostModal } from '@/components/modals/create-post-modal';
import { PostDetailModal } from '@/components/modals/post-detail-modal';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { toast } from 'react-hot-toast';

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [viewingPost, setViewingPost] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: '' });

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<any[]>([]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response: any = await api.get('/cms/posts/categories');
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleView = (post: any) => {
    setViewingPost(post);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const deletePost = async () => {
    const id = confirmDelete.id;
    try {
      await api.delete(`/cms/posts/${id}`);
      toast.success('Đã xóa bài viết!');
      fetchPosts();
    } catch (error) {
      toast.error('Lỗi khi xóa bài viết.');
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || post.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">QUẢN LÝ BÀI VIẾT</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">QUẢN LÝ BÀI VIẾT</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">NỘI DUNG BLOG & TIN TỨC EDUCORE</p>
        </div>
        <Button
          onClick={handleAdd}
          className="h-12 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/5 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> THÊM BÀI VIẾT
        </Button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col lg:flex-row gap-3 mb-10">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm kiếm bài viết theo tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5f9] border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="relative group min-w-[220px]">
          <Filter className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-12 pl-12 pr-10 rounded-full bg-[#f1f5f9] hover:bg-white border-transparent hover:border-slate-100 border transition-all text-xs font-bold text-slate-600 shadow-sm shadow-transparent hover:shadow-md appearance-none outline-none cursor-pointer uppercase tracking-wider"
          >
            <option value="All">TẤT CẢ DANH MỤC</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>

      {/* LIST HEADERS */}
      <div className="grid grid-cols-12 px-8 mb-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
        <div className="col-span-6">TIÊU ĐỀ BÀI VIẾT</div>
        <div className="col-span-2 text-center">DANH MỤC</div>
        <div className="col-span-2 text-center">CẬP NHẬT</div>
        <div className="col-span-2 text-right">THAO TÁC</div>
      </div>

      {/* ARTICLES LIST - CARD BASED */}
      <div className="space-y-3 mb-10">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-slate-100" />
          ))
        ) : paginatedPosts.length > 0 ? (
          paginatedPosts.map((post, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={post.id}
              className="group bg-white rounded-xl p-5 shadow-sm border border-transparent hover:border-emerald-500/10 hover:shadow-lg hover:shadow-slate-200/30 transition-all grid grid-cols-12 items-center gap-4"
            >
              <div className="col-span-6 flex items-center gap-5">
                <div className="h-12 w-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#60a5fa] shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate mb-0.5">{post.title}</h3>
                  <p className="text-[11px] text-slate-400 font-medium tracking-tight">/{post.slug}</p>
                </div>
              </div>
              <div className="col-span-2 flex justify-center">
                <span className="px-3.5 py-1 rounded-md bg-[#dbeafe] text-[#1e40af] text-[9px] font-black uppercase tracking-widest">
                  {post.category?.name || 'KINH NGHIỆM HỌC TẬP'}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-sm font-bold text-slate-500">{new Date(post.updatedAt || post.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              </div>
              <div className="col-span-2 flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                <Button variant="ghost" size="icon" onClick={() => handleView(post)} className="h-9 w-9 rounded-full hover:bg-emerald-50 text-slate-400 hover:text-emerald-600">
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900">
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(post.id)} className="h-9 w-9 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-slate-200" />
            </div>
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Không tìm thấy bài viết nào</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-10">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          className="p-3 text-slate-400 hover:text-slate-900 disabled:opacity-10 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Trang</span>
          <span className="h-10 min-w-[40px] px-3 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-sm font-black text-slate-900 shadow-sm">{currentPage}</span>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">/</span>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{totalPages || 1}</span>
        </div>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          className="p-3 text-slate-400 hover:text-slate-900 disabled:opacity-10 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      <PostModal
        key={editingPost?.id || 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPosts}
        initialData={editingPost}
      />

      <PostDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        post={viewingPost}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
        onConfirm={deletePost}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này vĩnh viễn? Hành động này không thể hoàn tác."
        confirmText="Xóa vĩnh viễn"
        type="danger"
      />
    </div>
  );
}
