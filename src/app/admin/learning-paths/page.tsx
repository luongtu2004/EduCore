'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, Loader2,
  ChevronRight, Calendar, Eye, EyeOff, Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { LearningPathModal } from '@/components/modals/learning-path-modal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function LearningPathsPage() {
  const [paths, setPaths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<any>(null);

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/learning-paths?admin=true');
      if (response.success) {
        setPaths(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải lộ trình:', error);
      toast.error('Không thể tải danh sách lộ trình.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (path: any) => {
    try {
      const newStatus = !path.isActive;
      await api.patch(`/learning-paths/${path.id}/status`, { isActive: newStatus });
      setPaths(paths.map(p => p.id === path.id ? { ...p, isActive: newStatus } : p));
      toast.success(newStatus ? 'Đã kích hoạt lộ trình' : 'Đã ẩn lộ trình');
    } catch (error) {
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  const deletePath = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lộ trình này?')) return;
    try {
      await api.delete(`/learning-paths/${id}`);
      setPaths(paths.filter(p => p.id !== id));
      toast.success('Đã xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Lỗi khi xóa lộ trình.');
    }
  };

  const handleEdit = (path: any) => {
    setEditingPath(path);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPath(null);
    setIsModalOpen(true);
  };

  const filteredPaths = paths.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">QUẢN LÝ LỘ TRÌNH</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">LỘ TRÌNH HỌC</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">QUẢN LÝ CÁC CHƯƠNG TRÌNH ĐÀO TẠO</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="h-12 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/5 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> TẠO LỘ TRÌNH MỚI
        </Button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-10">
        <div className="relative group max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm kiếm lộ trình..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5f9] border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* PATHS LIST */}
      <div className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-white border border-slate-100 animate-pulse" />
          ))
        ) : filteredPaths.length > 0 ? (
          filteredPaths.map((path, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={path.id}
              className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all flex flex-col md:flex-row items-start md:items-center gap-8"
            >
              <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all shrink-0">
                <Map className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 uppercase">
                  {path.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 line-clamp-2 max-w-2xl">{path.description}</p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">
                    {path.steps?.length || 0} Giai đoạn
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Cập nhật: {new Date(path.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* ACTIONS SECTION */}
              <div className="flex items-center gap-2 shrink-0 md:pl-6 md:border-l border-slate-100 pt-4 md:pt-0">
                <Button
                  onClick={() => toggleStatus(path)}
                  variant="outline" 
                  className={cn(
                    "h-9 px-4 rounded-full font-black text-[9px] uppercase tracking-widest transition-all gap-1.5",
                    path.isActive 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100" 
                      : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                  )}
                >
                  {path.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {path.isActive ? 'Hoạt động' : 'Đang ẩn'}
                </Button>

                <div className="flex gap-1.5">
                  <Button
                    onClick={() => handleEdit(path)}
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-none"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deletePath(path.id)}
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all shadow-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Không có lộ trình nào</p>
          </div>
        )}
      </div>

      <LearningPathModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPaths}
        path={editingPath}
      />
    </div>
  );
}
