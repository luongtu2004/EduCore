'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, Loader2,
  ChevronRight, ImageIcon, FileText, Trash2, 
  Copy, Download, ExternalLink, Grid, List as ListIcon,
  Upload, Check, X, File, Image as LucideImage
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function MediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; fileName: string }>({ isOpen: false, fileName: '' });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/media');
      if (response.success) {
        setMedia(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải media:', error);
      toast.error('Không thể tải danh sách tệp tin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response: any = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.success) {
        toast.success('Tải tệp lên thành công!');
        fetchMedia();
      }
    } catch (error) {
      console.error('Lỗi upload:', error);
      toast.error('Lỗi khi tải tệp lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (fileName: string) => {
    setConfirmDelete({ isOpen: true, fileName });
  };

  const deleteMedia = async () => {
    const fileName = confirmDelete.fileName;
    try {
      await api.delete(`/media/${fileName}`);
      setMedia(media.filter(m => m.fileName !== fileName));
      toast.success('Đã xóa tệp tin!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Lỗi khi xóa tệp.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép đường dẫn!');
  };

  const filteredMedia = media.filter(m => 
    m.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">THƯ VIỆN MEDIA</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">THƯ VIỆN MEDIA</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">QUẢN LÝ TẬP TRUNG HÌNH ẢNH & TÀI LIỆU</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-xl border border-slate-100 p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
          
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            <div className={cn(
              "h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-black text-[11px] transition-all flex items-center gap-2.5 shadow-lg shadow-emerald-900/10 uppercase tracking-wider",
              isUploading && "opacity-50 cursor-not-allowed"
            )}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploading ? 'ĐANG TẢI LÊN...' : 'TẢI TỆP MỚI'}
            </div>
          </label>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="mb-10 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative group flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm kiếm tệp tin theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-5 rounded-2xl bg-white border border-slate-100 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold outline-none placeholder:text-slate-400 shadow-sm shadow-slate-200/50"
          />
        </div>
      </div>

      {/* MEDIA GRID/LIST */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="aspect-square rounded-[2rem] bg-white border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredMedia.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <AnimatePresence>
              {filteredMedia.map((item, idx) => {
                const isImage = item.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)/i) || 
                                item.fileName.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)/i) ||
                                item.url.includes('unsplash.com') ||
                                item.url.includes('images.pexels.com') ||
                                item.url.includes('picsum.photos');
                const fullUrl = item.url.startsWith('http') 
                  ? item.url 
                  : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
                
                return (
                  <motion.div
                    key={item.url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.02 }}
                    className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all overflow-hidden flex flex-col"
                  >
                    <div className="aspect-square relative bg-slate-50 flex items-center justify-center overflow-hidden">
                      {isImage ? (
                        <img src={fullUrl} alt={item.fileName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <FileText className="h-12 w-12 text-slate-300" />
                      )}
                      
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                        <button onClick={() => copyToClipboard(fullUrl)} className="p-2.5 rounded-xl bg-white text-slate-900 hover:bg-emerald-500 hover:text-white transition-all">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(item.fileName)} className="p-2.5 rounded-xl bg-white text-slate-900 hover:bg-rose-500 hover:text-white transition-all shadow-lg">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 border-t border-slate-50 flex-1 flex flex-col justify-between">
                      <p className="text-[10px] font-black text-slate-900 truncate mb-2 uppercase tracking-tighter" title={item.fileName}>
                        {item.fileName.split('-').slice(1).join('-') || item.fileName}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">{formatSize(item.size)}</span>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                          isImage ? "text-emerald-600 bg-emerald-50" : "text-blue-600 bg-blue-50"
                        )}>{isImage ? 'IMAGE' : 'DOC'}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-50 bg-slate-50/50">
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên tệp tin</th>
                   <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại</th>
                   <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dung lượng</th>
                   <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tải lên</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {filteredMedia.map((item) => {
                   const isImage = item.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)/i) || 
                                   item.fileName.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)/i) ||
                                   item.url.includes('unsplash.com') ||
                                   item.url.includes('images.pexels.com') ||
                                   item.url.includes('picsum.photos');
                   const fullUrl = item.url.startsWith('http') 
                     ? item.url 
                     : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
                   return (
                    <tr key={item.url} className="group hover:bg-slate-50/80 transition-all">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {isImage ? <img src={fullUrl} className="w-full h-full object-cover" /> : <File className="h-5 w-5 text-blue-500" />}
                          </div>
                          <span className="text-xs font-black text-slate-900 truncate max-w-[300px]" title={item.fileName}>
                            {item.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {isImage ? 'HÌNH ẢNH' : 'TÀI LIỆU'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{formatSize(item.size)}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => copyToClipboard(fullUrl)} className="h-9 w-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:shadow-md">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteClick(item.fileName)} className="h-9 w-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:shadow-md">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                   );
                 })}
               </tbody>
             </table>
          </div>
        )
      ) : (
        <div className="py-40 text-center bg-white rounded-[3.5rem] border border-dashed border-slate-200 shadow-sm shadow-slate-100">
           <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
             <ImageIcon className="h-12 w-12 text-slate-200" />
           </div>
           <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Thư viện đang trống</p>
           <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Hãy bắt đầu bằng cách tải lên tệp tin đầu tiên của bạn</p>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
        onConfirm={deleteMedia}
        title="Xóa tệp tin"
        message="Bạn có chắc chắn muốn xóa tệp này vĩnh viễn? Hành động này không thể hoàn tác và tệp sẽ không còn khả dụng trên các bài viết liên quan."
        confirmText="Xóa vĩnh viễn"
        type="danger"
      />
    </div>
  );
}
