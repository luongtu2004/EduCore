'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Type, Link as LinkIcon, FolderTree, AlignLeft, CheckCircle2, Loader2, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categoryId: '',
    excerpt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create new post via API
      const response = await api.post('/cms/posts', {
        ...formData,
        status: 'DRAFT', // Default to draft for newly created via modal
      });
      
      if (response.success || response.data) {
        setIsSubmitted(true);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Tự động tạo slug từ tiêu đề
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
      
    setFormData({ ...formData, title, slug });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10 bg-slate-50 hover:bg-slate-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted ? (
              <div className="p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                    <PenTool className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Viết bài mới</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Khởi tạo nội dung ấn tượng cho EduCore</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="relative md:col-span-2">
                       <Type className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                       <input
                         required
                         type="text"
                         value={formData.title}
                         onChange={handleTitleChange}
                         placeholder="Tiêu đề bài viết..."
                         className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                       />
                     </div>
                     
                     <div className="relative">
                       <LinkIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                       <input
                         required
                         type="text"
                         value={formData.slug}
                         onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                         placeholder="duong-dan-bai-viet"
                         className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                       />
                     </div>

                     <div className="relative">
                       <FolderTree className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                       <select
                         required
                         value={formData.categoryId}
                         onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none appearance-none cursor-pointer"
                       >
                          <option value="" disabled>Chọn danh mục</option>
                          <option value="1">Kinh nghiệm học tập</option>
                          <option value="2">Tin tức sự kiện</option>
                          <option value="3">Góc học viên</option>
                       </select>
                     </div>
                  </div>

                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <textarea
                      required
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Mô tả ngắn gọn về bài viết..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                     <Button
                       type="button"
                       onClick={onClose}
                       variant="outline"
                       className="w-1/3 bg-white border-slate-200 text-slate-600 font-black text-xs tracking-widest uppercase py-7 rounded-2xl hover:bg-slate-50 transition-all"
                     >
                       Hủy
                     </Button>
                     <Button
                       type="submit"
                       disabled={loading}
                       className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs tracking-[0.2em] uppercase py-7 rounded-2xl shadow-xl shadow-emerald-200 transition-all border-none disabled:opacity-50 gap-3"
                     >
                       {loading ? (
                         <>ĐANG XỬ LÝ... <Loader2 className="h-4 w-4 animate-spin" /></>
                       ) : (
                         <>LƯU BÀI VIẾT <Send className="h-4 w-4" /></>
                       )}
                     </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="h-24 w-24 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-sm">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-4">Lưu thành công!</h2>
                <p className="text-slate-500 font-bold leading-relaxed mb-10 text-sm">
                  Bài viết mới đã được tạo thành công trên hệ thống. Bạn có thể tiếp tục chỉnh sửa nội dung chi tiết.
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ title: '', slug: '', categoryId: '', excerpt: '' });
                    onClose();
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] tracking-widest uppercase px-10 py-6 rounded-2xl border-none shadow-lg shadow-slate-200"
                >
                  QUAY LẠI DANH SÁCH
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
