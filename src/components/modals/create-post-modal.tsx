'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Type, Link as LinkIcon, FolderTree, AlignLeft, CheckCircle2, Loader2, PenTool, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

import { MediaPickerModal } from './media-picker-modal';
import { ImageIcon } from 'lucide-react';

export function PostModal({ isOpen, onClose, onSuccess, initialData }: PostModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categoryId: '',
    content: '',
    thumbnail: '',
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
  });

  // Fetch categories and set initial data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await api.get('/cms/posts/categories');
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    if (isOpen) {
      fetchCategories();
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          slug: initialData.slug || '',
          categoryId: initialData.categoryId || '',
          content: initialData.content || '',
          thumbnail: initialData.thumbnail || '',
          status: initialData.status || 'DRAFT',
          seoTitle: initialData.seoTitle || '',
          seoDescription: initialData.seoDescription || '',
        });
      } else {
        setFormData({ 
          title: '', 
          slug: '', 
          categoryId: '', 
          content: '', 
          thumbnail: '',
          status: 'DRAFT',
          seoTitle: '',
          seoDescription: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        summary: formData.content.substring(0, 160),
      };

      let response: any;
      if (initialData?.id || initialData?._id) {
        // Edit existing post
        const id = initialData.id || initialData._id;
        response = await api.patch(`/cms/posts/${id}`, payload);
      } else {
        // Create new post
        response = await api.post('/cms/posts', payload);
      }
      
      if (response.success || response.data) {
        setIsSubmitted(true);
        toast.success(initialData ? 'Đã cập nhật bài viết!' : 'Đã tạo bài viết mới!');
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      const msg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Tự động tạo slug từ tiêu đề (chỉ khi tạo mới)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    let updates: any = { title };
    
    if (!initialData) {
      const slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      updates.slug = slug;
    }
      
    setFormData({ ...formData, ...updates });
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
              <div className="p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                    <PenTool className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                      {initialData ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {initialData ? 'Cập nhật nội dung cho EduCore' : 'Khởi tạo nội dung ấn tượng cho EduCore'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Thumbnail Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Ảnh đại diện bài viết</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1 group">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          required
                          value={formData.thumbnail}
                          onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all outline-none"
                          placeholder="URL ảnh hoặc chọn từ thư viện..."
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="h-[54px] px-6 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 font-bold text-[10px] uppercase tracking-widest transition-all"
                      >
                        <Plus className="h-4 w-4 mr-2" /> THƯ VIỆN
                      </Button>
                    </div>
                    {formData.thumbnail && (
                      <div className="mt-3 relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    )}
                  </div>

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
                           {categories.length > 0 ? (
                             categories.map(cat => (
                               <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                             ))
                           ) : (
                             <option disabled>Đang tải danh mục...</option>
                           )}
                        </select>
                     </div>
                  </div>

                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Nội dung chi tiết của bài viết..."
                      rows={10}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-3xl py-4 pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none resize-none"
                    />
                  </div>

                  {/* STATUS & SEO */}
                  <div className="pt-6 border-t border-slate-100 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Trạng thái bài viết</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Quyết định việc hiển thị nội dung</p>
                      </div>
                      <div className="flex bg-slate-100 p-1 rounded-2xl">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, status: 'DRAFT' })}
                          className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.status === 'DRAFT' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          Bản nháp
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, status: 'PUBLISHED' })}
                          className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.status === 'PUBLISHED' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          Xuất bản
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Tùy chỉnh SEO (Không bắt buộc)
                      </p>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                        placeholder="SEO Title (Tiêu đề hiển thị trên Google)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-all"
                      />
                      <textarea
                        value={formData.seoDescription}
                        onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                        placeholder="SEO Description (Mô tả hiển thị trên Google)"
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all resize-none"
                      />
                    </div>
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
                    setFormData({ 
                      title: '', 
                      slug: '', 
                      categoryId: '', 
                      content: '', 
                      thumbnail: '',
                      status: 'DRAFT',
                      seoTitle: '',
                      seoDescription: ''
                    });
                    onClose();
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] tracking-widest uppercase px-10 py-6 rounded-2xl border-none shadow-lg shadow-slate-200"
                >
                  QUAY LẠI DANH SÁCH
                </Button>
              </div>
            )}
          </motion.div>

          <MediaPickerModal
            isOpen={isMediaPickerOpen}
            onClose={() => setIsMediaPickerOpen(false)}
            onSelect={(url) => setFormData({ ...formData, thumbnail: url })}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
