'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, Loader2,
  ChevronRight, ChevronLeft, Layers, Hash, Calendar, Home, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryModal } from '@/components/modals/category-modal';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/categories');
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      toast.error('Không thể tải danh sách danh mục.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const deleteCategory = async () => {
    const id = confirmDelete.id;
    try {
      await api.delete(`/cms/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Đã xóa danh mục thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Lỗi khi xóa danh mục.');
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">DANH MỤC NỘI DUNG</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">DANH MỤC NỘI DUNG</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">QUẢN LÝ PHÂN LOẠI BÀI VIẾT & KHÓA HỌC</p>
        </div>
        <Button
          onClick={handleAdd}
          className="h-12 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/5 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> THÊM DANH MỤC
        </Button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-10">
        <div className="relative group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm kiếm danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5f9] border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 rounded-[2rem] bg-white border border-slate-100 animate-pulse" />
          ))
        ) : paginatedCategories.length > 0 ? (
          paginatedCategories.map((cat, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={cat.id}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <Link href={`/admin/posts?category=${cat.id}`}>
                      <Button
                        variant="outline" size="icon" className="h-9 w-9 rounded-full border-slate-100 bg-white hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-600 text-slate-400 transition-all"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleEdit(cat)}
                      variant="outline" size="icon" className="h-9 w-9 rounded-full border-slate-100 bg-white hover:bg-slate-900 hover:border-slate-900 hover:text-white text-slate-400 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(cat.id)}
                      variant="outline" size="icon" className="h-9 w-9 rounded-full border-slate-100 bg-white hover:bg-red-500 hover:border-red-500 hover:text-white text-slate-400 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">{cat.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Hash className="h-3 w-3" /> {cat.slug}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {cat._count?.posts || 0} bài viết
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="h-3 w-3" />
                  <span className="text-[9px] font-bold uppercase">{new Date(cat.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Không tìm thấy danh mục nào</p>
          </div>
        )}
      </div>

      {/* PAGINATION BAR */}
      {totalPages > 1 && (
        <div className="mt-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-[#f1f5f9]/50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Hiển thị {paginatedCategories.length} / {filteredCategories.length} danh mục
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
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCategories}
        category={editingCategory}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
        onConfirm={deleteCategory}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các bài viết liên quan."
        confirmText="Xóa ngay"
        type="danger"
      />
    </div>
  );
}
