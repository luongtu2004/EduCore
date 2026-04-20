'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Tag, Eye, Clock, Share2, Printer, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

export function PostDetailModal({ isOpen, onClose, post }: PostDetailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && post && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header / Actions Bar */}
            <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="px-5 py-2 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                  {post.status || 'ĐÃ XUẤT BẢN'}
                </span>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <Eye className="h-4 w-4" />
                  {post.views || 0} LƯỢT XEM
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-3 text-slate-400 hover:text-slate-900 transition-all bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-10 md:p-20 custom-scrollbar scroll-smooth">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-emerald-100">
                    {post.author?.fullName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Biên tập bởi</p>
                    <p className="text-xs font-black text-slate-900">{post.author?.fullName || 'Hệ thống EduCore'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Thời gian</p>
                    <p className="text-xs font-black text-slate-900">{new Date(post.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <Tag className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Chuyên mục</p>
                    <p className="text-xs font-black text-slate-900">{post.category?.name || 'Tin tức & Sự kiện'}</p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-12 uppercase italic">
                {post.title}
              </h1>

              {/* Thumbnail */}
              {post.thumbnail && (
                <div className="w-full aspect-video rounded-[3rem] overflow-hidden mb-16 border-8 border-slate-50 shadow-2xl">
                   <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Body Content */}
              <div className="prose prose-slate prose-xl max-w-none">
                <div 
                  className="text-slate-700 leading-relaxed text-xl whitespace-pre-wrap font-medium"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Footer Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <Bookmark className="h-4 w-4" />
                  </div>
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="px-4 py-2 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-10 bg-slate-900 flex items-center justify-between">
               <div className="flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-inner">
                   <Clock className="h-7 w-7" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chế độ xem</p>
                   <p className="text-sm font-bold text-white uppercase tracking-tighter italic">Preview Mode • Standard Layout</p>
                 </div>
               </div>
               <Button 
                onClick={onClose}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs tracking-widest uppercase px-12 py-8 rounded-[2rem] border-none shadow-2xl shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95"
               >
                 ĐÓNG CỬA SỔ
               </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
