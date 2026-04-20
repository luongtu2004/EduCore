'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, Loader2,
  ChevronRight, Star, Quote, Calendar, Home,
  Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { TestimonialModal } from '../../../components/modals/testimonial-modal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/testimonials');
      if (response.success) {
        setTestimonials(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải cảm nghĩ:', error);
      toast.error('Không thể tải danh sách cảm nghĩ.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cảm nghĩ này?')) return;
    try {
      await api.delete(`/cms/testimonials/${id}`);
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast.success('Đã xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Lỗi khi xóa cảm nghĩ.');
    }
  };

  const toggleStatus = async (testimonial: any) => {
    try {
      const newStatus = !testimonial.isActive;
      await api.patch(`/cms/testimonials/${testimonial.id}/status`, { isActive: newStatus });
      setTestimonials(testimonials.map(t => t.id === testimonial.id ? { ...t, isActive: newStatus } : t));
      toast.success(newStatus ? 'Đã hiển thị cảm nghĩ' : 'Đã ẩn cảm nghĩ');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleEdit = (t: any) => {
    setEditingTestimonial(t);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const filtered = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">CÂU CHUYỆN THÀNH CÔNG</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">CẢM NGHĨ HỌC VIÊN</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">QUẢN LÝ CÁC CÂU CHUYỆN THÀNH CÔNG NGOÀI TRANG CHỦ</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="h-12 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/5 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> THÊM CẢM NGHĨ
        </Button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-10">
        <div className="relative group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm theo tên học viên hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5f9] border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-48 rounded-[2.5rem] bg-white border border-slate-100 animate-pulse" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item.id}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all flex flex-col gap-6 relative"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 overflow-hidden border-4 border-slate-50">
                    <img src={item.image || 'https://ui-avatars.com/api/?name=' + item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest">{item.score}</span>
                       <div className="flex text-yellow-400">
                          <Star className="h-3 w-3 fill-current" />
                          <Star className="h-3 w-3 fill-current" />
                          <Star className="h-3 w-3 fill-current" />
                          <Star className="h-3 w-3 fill-current" />
                          <Star className="h-3 w-3 fill-current" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <Button
                    onClick={() => toggleStatus(item)}
                    variant="outline"
                    className={cn(
                      "h-9 px-4 rounded-full font-black text-[9px] uppercase tracking-widest transition-all gap-1.5",
                      item.isActive 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100" 
                        : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                    )}
                  >
                    {item.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {item.isActive ? 'Hoạt động' : 'Đang ẩn'}
                  </Button>
                  <Button
                    onClick={() => handleEdit(item)}
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-none"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteTestimonial(item.id)}
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all shadow-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-slate-50 -z-0" />
                <p className="text-sm font-bold text-slate-500 leading-relaxed italic relative z-10 line-clamp-3">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Thứ tự: {item.order}</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase">Cập nhật: {new Date(item.updatedAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Không có dữ liệu cảm nghĩ</p>
          </div>
        )}
      </div>

      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTestimonials}
        testimonial={editingTestimonial}
      />
    </div>
  );
}
