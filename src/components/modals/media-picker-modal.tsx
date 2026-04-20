'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, Image as ImageIcon, Check, MousePointer2 } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaPickerModal({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/media');
      if (response.success) {
        setMedia(response.data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedia = media.filter(m => 
    m.fileName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    m.fileName.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) // Only images for picker
  );

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Chọn từ Thư viện</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sử dụng tài nguyên đã tải lên hệ thống</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 bg-slate-50/50 border-b border-slate-100">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="search"
              placeholder="Tìm kiếm hình ảnh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-5 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500/50 transition-all text-sm font-bold outline-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang kết nối thư viện...</p>
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => {
                const fullUrl = item.url.startsWith('http') 
                  ? item.url 
                  : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
                const isSelected = selectedUrl === fullUrl;

                return (
                  <button
                    key={item.url}
                    onClick={() => setSelectedUrl(fullUrl)}
                    className={cn(
                      "group relative aspect-square rounded-2xl overflow-hidden border-4 transition-all",
                      isSelected ? "border-emerald-500 shadow-xl shadow-emerald-100" : "border-transparent hover:border-slate-100"
                    )}
                  >
                    <img src={fullUrl} className="w-full h-full object-cover" alt={item.fileName} />
                    <div className={cn(
                      "absolute inset-0 bg-emerald-500/10 flex items-center justify-center transition-all",
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                      {isSelected ? (
                        <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-in zoom-in-50">
                          <Check className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                          <MousePointer2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Không tìm thấy hình ảnh nào</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {selectedUrl ? 'Đã chọn 1 hình ảnh' : 'Vui lòng chọn một hình ảnh để tiếp tục'}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="h-12 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest">
              Hủy
            </Button>
            <Button
              disabled={!selectedUrl}
              onClick={handleConfirm}
              className="h-12 rounded-xl px-8 bg-slate-900 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest border-none shadow-xl shadow-slate-200"
            >
              XÁC NHẬN CHỌN
            </Button>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
      `}</style>
    </div>
  );
}
