'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, Loader2,
  ChevronRight, ImageIcon, ExternalLink, Calendar,
  MoveUp, MoveDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BannerModal } from '@/components/modals/banner-modal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/banners');
      if (response.success) {
        setBanners(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải banners:', error);
      toast.error('Không thể tải danh sách banners.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    try {
      await api.delete(`/cms/banners/${id}`);
      setBanners(banners.filter(b => b.id !== id));
      toast.success('Đã xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Lỗi khi xóa banner.');
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">QUẢN LÝ BANNERS</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">QUẢN LÝ BANNERS</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">QUẢN LÝ HÌNH ẢNH QUẢNG CÁO TRANG CHỦ</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="h-12 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/5 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> THÊM BANNER
        </Button>
      </div>

      {/* BANNERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-64 rounded-[2.5rem] bg-white border border-slate-100 animate-pulse" />
          ))
        ) : banners.length > 0 ? (
          banners.map((banner, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={banner.id}
              className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
            >
              {/* IMAGE PREVIEW */}
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img 
                  src={banner.imageUrl || banner.image} 
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <h3 className="text-xl font-black text-white leading-tight mb-1">{banner.title}</h3>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest truncate">{banner.subtitle}</p>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-6 left-8">
                  {banner.isActive ? (
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30">Active</span>
                  ) : (
                    <span className="bg-slate-400 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">Inactive</span>
                  )}
                </div>
              </div>

              {/* CONTENT & ACTIONS */}
              <div className="p-8 flex items-center justify-between bg-white">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Thứ tự</p>
                    <p className="text-xl font-black text-slate-900">{String(banner.order).padStart(2, '0')}</p>
                  </div>
                  <div className="h-10 w-[1px] bg-slate-100" />
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Liên kết</p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate max-w-[120px]">{banner.link || 'Không có'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(banner)}
                    variant="outline" className="h-11 px-4 rounded-xl border-slate-100 font-bold text-xs gap-2 hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <Edit className="h-3.5 w-3.5" /> SỬA
                  </Button>
                  <Button
                    onClick={() => deleteBanner(banner.id)}
                    variant="outline" className="h-11 px-4 rounded-xl border-slate-100 font-bold text-xs gap-2 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all text-rose-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> XÓA
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Chưa có banner nào</p>
          </div>
        )}
      </div>

      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBanners}
        banner={editingBanner}
      />
    </div>
  );
}
