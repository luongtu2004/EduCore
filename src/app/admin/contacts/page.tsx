'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Filter, Trash2, 
  ChevronRight, Home, Mail, Phone,
  Clock, CheckCircle2, User, Eye, Loader2, X,
  Reply, ShieldCheck, Inbox, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/contacts');
      if (response.success) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải liên hệ:', error);
      toast.error('Không thể tải danh sách liên hệ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = (contact: any) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
    if (contact.status === 'NEW') {
        updateStatus(contact.id, 'READ');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response: any = await api.put(`/cms/contacts/${id}`, { status });
      if (response.success) {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        if (selectedContact?.id === id) {
          setSelectedContact((prev: any) => ({ ...prev, status }));
        }
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) return;
    try {
      const response: any = await api.delete(`/cms/contacts/${id}`);
      if (response.success) {
        toast.success('Đã xóa liên hệ thành công');
        setContacts(prev => prev.filter(c => c.id !== id));
        if (selectedContact?.id === id) setIsModalOpen(false);
      }
    } catch (error) {
      toast.error('Lỗi khi xóa liên hệ');
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || c.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const newMessagesCount = contacts.filter(c => c.status === 'NEW').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-widest border border-rose-100 animate-pulse">Tin mới</span>;
      case 'READ':
        return <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-100">Đã xem</span>;
      case 'REPLIED':
        return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">Đã phản hồi</span>;
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">LIÊN HỆ KHÁCH HÀNG</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Liên hệ</h1>
            {newMessagesCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg shadow-rose-200">
                    {newMessagesCount} TIN MỚI
                </span>
            )}
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Hệ thống quản lý yêu cầu và tư vấn</p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-100">
            {['ALL', 'NEW', 'READ', 'REPLIED'].map((f) => (
                <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activeFilter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    {f === 'ALL' ? 'Tất cả' : f === 'NEW' ? 'Chưa đọc' : f === 'READ' ? 'Đã xem' : 'Đã phản hồi'}
                </button>
            ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-8 relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
        <input 
            type="text" 
            placeholder="Tìm theo tên người gửi hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white border border-slate-100 focus:border-emerald-500/50 focus:ring-8 focus:ring-emerald-500/5 transition-all text-sm font-bold outline-none shadow-sm"
        />
      </div>

      {/* DATA LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-24 text-center bg-white rounded-[2rem] border border-slate-100">
             <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto opacity-20" />
          </div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((contact, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={contact.id}
              className={cn(
                "group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden",
                contact.status === 'NEW' && "ring-1 ring-rose-100"
              )}
            >
              {/* HOVER INDICATOR BAR */}
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-y-50 group-hover:scale-y-100" />

              <div className="flex items-center gap-6 shrink-0 md:w-64">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all",
                  contact.status === 'NEW' ? "bg-rose-50 text-rose-500 shadow-lg shadow-rose-100" : "bg-slate-50"
                )}>
                  <User className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate uppercase tracking-wider">{contact.name}</p>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5"><Mail className="h-3 w-3" /> {contact.email}</p>
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5"><Phone className="h-3 w-3" /> {contact.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(contact.status)}
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">{contact.subject}</h3>
                <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">{contact.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300">
                <Button 
                    onClick={() => handleOpenDetail(contact)}
                    className="h-10 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white px-5 font-black text-[10px] uppercase tracking-widest gap-2"
                >
                    <Eye className="h-3.5 w-3.5" /> Chi tiết
                </Button>
                {contact.status !== 'REPLIED' && (
                    <Button 
                        onClick={() => updateStatus(contact.id, 'REPLIED')}
                        size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                    >
                        <Reply className="h-4 w-4" />
                    </Button>
                )}
                <Button 
                  onClick={() => handleDelete(contact.id)}
                  size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
                <Inbox className="h-10 w-10" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">Không tìm thấy kết quả phù hợp</p>
            <Button 
                variant="ghost" 
                onClick={() => { setSearchQuery(''); setActiveFilter('ALL'); }}
                className="mt-4 text-[10px] font-black text-emerald-600 hover:bg-emerald-50 uppercase tracking-widest"
            >
                Đặt lại bộ lọc
            </Button>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-[1.8rem] bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <MessageSquare className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">Chi tiết liên hệ</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SLA Xử lý: 24 Giờ</p>
                    </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 w-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                 {/* SENDER INFO */}
                 <div className="grid grid-cols-2 gap-8 p-8 bg-[#fdfdfd] rounded-[2.5rem] border border-slate-50">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</p>
                        <p className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                            {selectedContact.name}
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian nhận</p>
                        <p className="text-sm font-bold text-slate-600">{new Date(selectedContact.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Mail className="h-3 w-3 text-emerald-500" /> Email</p>
                        <p className="text-sm font-bold text-emerald-600 underline underline-offset-4 decoration-emerald-200">{selectedContact.email}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Phone className="h-3 w-3 text-emerald-500" /> Hotline cá nhân</p>
                        <p className="text-sm font-bold text-slate-900">{selectedContact.phone}</p>
                    </div>
                 </div>

                 {/* MESSAGE CONTENT */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Yêu cầu từ khách hàng</p>
                        {getStatusBadge(selectedContact.status)}
                    </div>
                    <div className="p-10 bg-white border-2 border-slate-50 rounded-[3rem] shadow-sm relative group">
                        <div className="absolute -left-1 top-10 w-1 h-12 bg-emerald-500 rounded-full" />
                        <h4 className="text-lg font-black text-slate-900 mb-4">{selectedContact.subject}</h4>
                        <p className="text-sm font-medium text-slate-600 leading-[1.8] whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                 </div>

                 {/* ACTIONS */}
                 <div className="flex items-center gap-4 pt-4">
                    <Button 
                        onClick={() => updateStatus(selectedContact.id, 'REPLIED')}
                        disabled={selectedContact.status === 'REPLIED'}
                        className={cn(
                            "flex-1 h-16 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest gap-3 shadow-xl transition-all",
                            selectedContact.status === 'REPLIED' 
                            ? "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed" 
                            : "bg-slate-900 hover:bg-emerald-600 text-white shadow-emerald-900/10"
                        )}
                    >
                        {selectedContact.status === 'REPLIED' ? (
                            <> <CheckCircle2 className="h-4 w-4" /> ĐÃ PHẢN HỒI XONG </>
                        ) : (
                            <> <Reply className="h-4 w-4" /> XÁC NHẬN ĐÃ PHẢN HỒI </>
                        )}
                    </Button>
                    <Button 
                        onClick={() => handleDelete(selectedContact.id)}
                        variant="ghost" className="h-16 w-16 rounded-[1.8rem] bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all p-0 border border-rose-100"
                    >
                        <Trash2 className="h-6 w-6" />
                    </Button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
