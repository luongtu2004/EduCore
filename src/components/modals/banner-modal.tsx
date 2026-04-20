'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader2, ImageIcon, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { MediaPickerModal } from './media-picker-modal';
import { Plus } from 'lucide-react';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banner?: any;
}

export function BannerModal({ isOpen, onClose, onSuccess, banner }: BannerModalProps) {
  const [loading, setLoading] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        imageUrl: banner.imageUrl || banner.image || '',
        link: banner.link || '',
        order: banner.order || 0,
        isActive: banner.isActive ?? true,
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        imageUrl: '',
        link: '',
        order: 0,
        isActive: true,
      });
    }
  }, [banner, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (banner) {
        await api.put(`/cms/banners/${banner.id}`, formData);
        toast.success('Đã cập nhật banner!');
      } else {
        await api.post('/cms/banners', formData);
        toast.success('Đã thêm banner mới!');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Lỗi khi lưu Banner:', error);
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
              {banner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thiết kế giao diện trang chủ</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Tiêu đề Banner</label>
              <input
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="VD: Chào mừng đến với EduCore"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Phụ đề (Subtitle)</label>
              <input
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none transition-all"
                placeholder="VD: Nền tảng học tiếng Anh thông minh"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Hình ảnh Banner</label>
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    required
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-11 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="URL hình ảnh hoặc chọn từ thư viện..."
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
              {formData.imageUrl && (
                <div className="mt-3 relative aspect-[21/9] rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Link liên kết (Click action)</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  value={formData.link}
                  onChange={e => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-11 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="/courses/ielts-intensive"
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
                {formData.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
              </button>
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
               {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : banner ? 'CẬP NHẬT' : 'TẠO MỚI'}
             </Button>
          </div>
        </form>
      </motion.div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, imageUrl: url })}
      />
    </div>
  );
}
