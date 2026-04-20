'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader2, Star, User, MessageSquare, Image as ImageIcon, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  testimonial?: any;
}

export function TestimonialModal({ isOpen, onClose, onSuccess, testimonial }: TestimonialModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    score: '',
    text: '',
    image: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        score: testimonial.score,
        text: testimonial.text,
        image: testimonial.image || '',
        isActive: testimonial.isActive ?? true,
        order: testimonial.order || 0,
      });
    } else {
      setFormData({
        name: '',
        score: '',
        text: '',
        image: '',
        isActive: true,
        order: 0,
      });
    }
  }, [testimonial, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (testimonial) {
        await api.put(`/cms/testimonials/${testimonial.id}`, formData);
        toast.success('Đã cập nhật cảm nghĩ!');
      } else {
        await api.post('/cms/testimonials', formData);
        toast.success('Đã thêm cảm nghĩ mới!');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Lỗi khi lưu cảm nghĩ:', error);
      toast.error('Không thể lưu thông tin.');
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
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-10 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <Star className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                {testimonial ? 'Chỉnh sửa cảm nghĩ' : 'Thêm cảm nghĩ mới'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Câu chuyện học viên thành công</p>
            </div>
          </div>
          <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors border border-slate-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                 <User className="h-3 w-3" /> Tên học viên
              </label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all outline-none"
                placeholder="VD: Nguyễn Thu Trang"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                 <Type className="h-3 w-3" /> Điểm số / Chứng chỉ
              </label>
              <input
                required
                value={formData.score}
                onChange={e => setFormData({ ...formData, score: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all outline-none"
                placeholder="VD: 8.0 IELTS"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
               <ImageIcon className="h-3 w-3" /> Link ảnh đại diện
            </label>
            <input
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
               <MessageSquare className="h-3 w-3" /> Nội dung cảm nghĩ
            </label>
            <textarea
              required
              value={formData.text}
              onChange={e => setFormData({ ...formData, text: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-bold focus:outline-none focus:border-emerald-500/50 min-h-[120px] resize-none transition-all outline-none leading-relaxed italic"
              placeholder="Nhập cảm nghĩ của học viên về EduCore..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Thứ tự ưu tiên</label>
              <input
                type="number"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Trạng thái hiển thị</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={cn(
                  "w-full h-[54px] rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                  formData.isActive 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm" 
                    : "bg-slate-50 border-slate-100 text-slate-400"
                )}
              >
                {formData.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {formData.isActive ? 'ĐANG HIỂN THỊ' : 'ĐANG ẨN'}
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex gap-4">
             <Button 
               type="button" 
               onClick={onClose}
               variant="outline" 
               className="flex-1 h-16 rounded-2xl border-slate-100 font-black text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50"
             >
               HỦY BỎ
             </Button>
             <Button 
               disabled={loading}
               className="flex-[2] h-16 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.2em] border-none shadow-2xl shadow-slate-200 transition-all"
             >
               {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : testimonial ? 'CẬP NHẬT CẢM NGHĨ' : 'TẠO CẢM NGHĨ MỚI'}
             </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
