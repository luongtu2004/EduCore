'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X, CheckCircle2, ChevronRight, User, Phone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConsultationModal } from '@/components/modals/consultation-modal';

export function FloatingAction() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Show a popup message after 5 seconds to catch attention
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[90] flex flex-col items-end gap-4">
        {/* Chat / Contact Popup */}
        <AnimatePresence>
          {showPopup && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white p-5 rounded-[2rem] shadow-2xl border border-emerald-50 mb-4 max-w-[280px] relative group"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute -top-2 -right-2 h-6 w-6 bg-slate-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight">AI Assistant</span>
              </div>
              <p className="text-sm font-bold text-slate-600 leading-relaxed mb-4">
                Bạn muốn biết trình độ IELTS hiện tại? Thử ngay bài Test nhanh từ AI!
              </p>
              <Button 
                onClick={() => {
                   setIsOpen(true);
                   setShowPopup(false);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] tracking-widest uppercase py-5 rounded-xl border-none"
              >
                THỬ NGAY <Zap className="h-3 w-3 ml-2 fill-yellow-400 text-yellow-400" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 mb-4 w-72 space-y-2 overflow-hidden"
            >
               <button 
                onClick={() => setIsConsultOpen(true)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-emerald-50 transition-all text-left group"
               >
                 <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                   <MessageCircle className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="text-xs font-black text-slate-900 uppercase">Tư vấn 1:1</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Nhận lộ trình miễn phí</p>
                 </div>
               </button>

               <Link href="/test-trinh-do" className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-yellow-50 transition-all text-left group">
                 <div className="h-10 w-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-white transition-all">
                   <Sparkles className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="text-xs font-black text-slate-900 uppercase">Test trình độ AI</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Kết quả sau 5 phút</p>
                 </div>
               </Link>

               <a href="https://zalo.me/0354168798" target="_blank" className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 transition-all text-left group">
                 <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                   <Zap className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="text-xs font-black text-slate-900 uppercase">Chat Zalo</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Hỗ trợ 24/7</p>
                 </div>
               </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-emerald-600 text-white'
          }`}
        >
          {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
          
          {!isOpen && (
             <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white text-[10px] items-center justify-center font-bold">1</span>
            </span>
          )}
        </button>
      </div>

      <ConsultationModal 
        isOpen={isConsultOpen} 
        onClose={() => setIsConsultOpen(false)} 
      />
    </>
  );
}

// Helper to handle client-side only imports if needed
import dynamic from 'next/dynamic';
const Link = dynamic(() => import('next/link'), { ssr: false });
