'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader2, PlayCircle, Clock, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  chapterId: string;
  lesson?: any;
}

export function LessonModal({ isOpen, onClose, onSuccess, chapterId, lesson }: LessonModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    duration: '',
    order: 0,
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        content: lesson.content || '',
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration || '',
        order: lesson.order || 0,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        videoUrl: '',
        duration: '',
        order: 0,
      });
    }
  }, [lesson, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (lesson) {
        await api.put(`/cms/courses/lessons/${lesson.id}`, formData);
        toast.success('Đã cập nhật bài học!');
      } else {
        await api.post(`/cms/courses/chapters/${chapterId}/lessons`, formData);
        toast.success('Đã thêm bài học mới!');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Lỗi khi lưu bài học:', error);
      toast.error('Không thể lưu bài học.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 pb-0 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              {lesson ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nội dung chi tiết bài giảng</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Tiêu đề bài học</label>
              <input
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="VD: Introduction to IELTS Speaking"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Video URL (Youtube/Vimeo)</label>
              <div className="relative">
                <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-11 text-sm font-bold focus:outline-none"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Thời lượng</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-11 text-sm font-bold focus:outline-none"
                  placeholder="VD: 15:30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Thứ tự</label>
              <input
                type="number"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nội dung văn bản (Tùy chọn)</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none min-h-[120px] resize-none"
                placeholder="Nhập ghi chú hoặc nội dung bài học..."
              />
            </div>
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
               {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : lesson ? 'CẬP NHẬT' : 'TẠO BÀI HỌC'}
             </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
