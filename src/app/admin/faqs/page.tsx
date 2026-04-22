'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, Loader2,
  ChevronRight, HelpCircle, Calendar, Home,
  ChevronUp, ChevronDown, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQModal } from '@/components/modals/faq-modal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);

  const toggleFAQStatus = async (faq: any) => {
    try {
      const newStatus = !faq.isActive;
      await api.patch(`/cms/faqs/${faq.id}/status`, { isActive: newStatus });
      setFaqs(faqs.map(f => f.id === faq.id ? { ...f, isActive: newStatus } : f));
      toast.success(newStatus ? 'Đã hiển thị câu hỏi' : 'Đã ẩn câu hỏi');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/faqs');
      if (response.success) {
        setFaqs(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải FAQs:', error);
      toast.error('Không thể tải danh sách FAQs.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    try {
      await api.delete(`/cms/faqs/${id}`);
      setFaqs(faqs.filter(f => f.id !== id));
      toast.success('Đã xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Lỗi khi xóa câu hỏi.');
    }
  };

  const handleEdit = (faq: any) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingFaq(null);
    setIsModalOpen(true);
  };

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">QUẢN LÝ FAQS</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">CÂU HỎI THƯỜNG GẶP</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">QUẢN LÝ NỘI DUNG GIẢI ĐÁP THẮC MẮC HỌC VIÊN</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="h-12 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/5 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> THÊM CÂU HỎI
        </Button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-10">
        <div className="relative group max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm kiếm trong FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5f9] border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* FAQS LIST */}
      <div className="space-y-4">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-24 rounded-3xl bg-white border border-slate-100 animate-pulse" />
          ))
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={faq.id}
              className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all flex items-center gap-8"
            >
              <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all shrink-0">
                <span className="text-sm font-black leading-none">{String(faq.order).padStart(2, '0')}</span>
                <HelpCircle className="h-5 w-5 mt-1.5 opacity-40" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 uppercase">
                  {faq.question}
                </h3>
                <p className="text-sm font-medium text-slate-500 line-clamp-2">{faq.answer}</p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Cập nhật: {new Date(faq.updatedAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              {/* ACTIONS SECTION - VISIBLE ON HOVER */}
              <div className="flex items-center gap-2 shrink-0 pl-6 border-l border-slate-100 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <Button
                  onClick={() => toggleFAQStatus(faq)}
                  variant="outline" 
                  className={cn(
                    "h-9 px-4 rounded-full font-black text-[9px] uppercase tracking-widest transition-all gap-1.5",
                    faq.isActive 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100" 
                      : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                  )}
                >
                  {faq.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {faq.isActive ? 'Hoạt động' : 'Đang ẩn'}
                </Button>

                <div className="flex gap-1.5">
                  <Button
                    onClick={() => handleEdit(faq)}
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-none"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteFaq(faq.id)}
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all shadow-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Không có câu hỏi nào</p>
          </div>
        )}
      </div>

      <FAQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchFaqs}
        faq={editingFaq}
      />
    </div>
  );
}
