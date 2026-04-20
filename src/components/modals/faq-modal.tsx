'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  faq?: any;
}

export function FAQModal({ isOpen, onClose, onSuccess, faq }: FAQModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        order: faq.order || 0,
        isActive: faq.isActive ?? true,
      });
    } else {
      setFormData({
        question: '',
        answer: '',
        order: 0,
        isActive: true,
      });
    }
  }, [faq, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (faq) {
        await api.put(`/cms/faqs/${faq.id}`, formData);
        toast.success('Đã cập nhật câu hỏi!');
      } else {
        await api.post('/cms/faqs', formData);
        toast.success('Đã thêm câu hỏi mới!');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Lỗi khi lưu FAQ:', error);
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
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 pb-0 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              {faq ? 'Chỉnh sửa FAQ' : 'Thêm FAQ mới'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quản lý câu hỏi thường gặp</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Câu hỏi</label>
              <input
                required
                value={formData.question}
                onChange={e => setFormData({ ...formData, question: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="VD: Khóa học IELTS kéo dài bao lâu?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Câu trả lời</label>
              <textarea
                required
                value={formData.answer}
                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 min-h-[150px] resize-none transition-all"
                placeholder="Nhập nội dung câu trả lời chi tiết..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Trạng thái</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={cn(
                    "w-full h-[54px] rounded-2xl border text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2",
                    formData.isActive 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                      : "bg-slate-50 border-slate-100 text-slate-400"
                  )}
                >
                  {formData.isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {formData.isActive ? 'Đang hiển thị' : 'Ẩn câu hỏi'}
                </button>
              </div>
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
               {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : faq ? 'CẬP NHẬT' : 'TẠO MỚI'}
             </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
