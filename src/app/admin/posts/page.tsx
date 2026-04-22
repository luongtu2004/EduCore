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
      {/* DATA TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-[#f1f5f9]/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bài viết</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Danh mục</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Cập nhật</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-6 h-20 bg-slate-50/20" />
                  </tr>
                ))
              ) : paginatedPosts.length > 0 ? (
                paginatedPosts.map((post, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={post.id}
                    className="group hover:bg-slate-50 transition-all cursor-pointer relative"
                  >
                    <td className="px-8 py-6 relative">
                      {/* HOVER INDICATOR BAR */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-105 transition-transform shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight mb-1">{post.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-70">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100/50">
                        {post.category?.name || 'BLOG'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-sm font-black text-slate-600">{new Date(post.updatedAt || post.createdAt).toLocaleDateString('vi-VN')}</p>
                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">NGÀY ĐĂNG</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleView(post)}
                          className="h-9 w-9 rounded-full hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 shadow-sm transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleEdit(post)}
                          className="h-9 w-9 rounded-full hover:bg-slate-900 hover:text-white text-slate-400 shadow-sm transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleDeleteClick(post.id)}
                          className="h-9 w-9 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 shadow-sm transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center opacity-30">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Không tìm thấy bài viết</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-8 py-6 bg-[#f1f5f9]/50 flex items-center justify-between border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Hiển thị {paginatedPosts.length} / {filteredPosts.length} bài viết
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline" size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="h-9 w-9 rounded-full border-slate-200 bg-white text-slate-400 hover:text-emerald-600 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" size="icon"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="h-9 w-9 rounded-full border-slate-200 bg-white text-slate-400 hover:text-emerald-600 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
