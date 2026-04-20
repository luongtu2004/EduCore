'use client';

import { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, Plus, Trash2, 
  BookOpen, Clock, DollarSign, BarChart, Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

import { toast } from 'react-hot-toast';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course?: any; 
}

const levels = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

export function CourseModal({ isOpen, onClose, onSuccess, course }: CourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    duration: '',
    level: 'Beginner',
    thumbnail: '',
    isActive: true
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        slug: course.slug,
        description: course.description || '',
        price: course.price,
        duration: course.duration || '',
        level: course.level || 'Beginner',
        thumbnail: course.thumbnail || '',
        isActive: course.isActive
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        price: 0,
        duration: '',
        level: 'Beginner',
        thumbnail: '',
        isActive: true
      });
    }
  }, [course, isOpen]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (course) {
        await api.put(`/cms/courses/${course.id}`, formData);
        toast.success('Đã cập nhật khóa học!');
      } else {
        await api.post('/cms/courses', formData);
        toast.success('Đã thêm khóa học mới!');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Lỗi khi lưu khóa học:', error);
      // Because of axios interceptor, error might be the response data object
      const errorData = error.response?.data || error;
      const msg = errorData.message || (typeof errorData === 'string' ? errorData : '');
      
      if (msg.includes('duplicate key')) {
        toast.error('Lỗi: Slug bị trùng! Vui lòng thay đổi tên khóa học.');
      } else {
        toast.error(msg || 'Không thể lưu khóa học.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 pb-0 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              {course ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thiết lập chương trình đào tạo</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Tên khóa học</label>
              <input
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="VD: IELTS Intensive 6.5+"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Đường dẫn (Slug)</label>
              <input
                readOnly
                value={formData.slug}
                className="w-full bg-slate-100 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-400 outline-none cursor-not-allowed"
                placeholder="tu-dong-tao-slug"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Giá học phí (VNĐ)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-11 text-sm font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Thời lượng</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-11 text-sm font-bold focus:outline-none"
                  placeholder="VD: 3 tháng (48 buổi)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Trình độ</label>
              <select
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none appearance-none"
              >
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Trạng thái</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={cn(
                  "w-full p-4 rounded-2xl border text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2",
                  formData.isActive 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                    : "bg-slate-50 border-slate-100 text-slate-400"
                )}
              >
                {formData.isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {formData.isActive ? 'Đang tuyển sinh' : 'Tạm dừng'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mô tả khóa học</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-emerald-500/50 min-h-[100px] resize-none transition-all"
              placeholder="Nhập mô tả tóm tắt về khóa học..."
            />
          </div>

          <div className="pt-6 border-t border-slate-50 flex gap-3">
             <Button 
               type="button" 
               onClick={onClose}
               variant="outline" 
               className="flex-1 h-14 rounded-2xl border-slate-100 font-black text-xs uppercase tracking-widest text-slate-500"
             >
               Hủy bỏ
             </Button>
             <Button 
               disabled={loading}
               className="flex-[2] h-14 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest border-none shadow-xl shadow-slate-200"
             >
               {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : course ? 'CẬP NHẬT KHÓA HỌC' : 'TẠO KHÓA HỌC MỚI'}
             </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
