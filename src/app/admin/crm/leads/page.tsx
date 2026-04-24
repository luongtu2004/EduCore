'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ClipboardList, Search, Filter, Plus,
  Phone, Mail, MessageSquare, Edit, Trash2,
  ChevronLeft, ChevronRight as ChevronRightIcon, Clock, Sparkles,
  BookOpen, LayoutGrid, CheckCircle2, AlertCircle,
  X, ChevronDown, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { useSocket } from '@/lib/socket-provider';

export default function CRMLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeSource, setActiveSource] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: '' });
  const [sortField, setSortField] = useState<'createdAt' | 'fullName'>('createdAt');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const itemsPerPage = 10;
  const { socket } = useSocket();

  const toggleSort = (field: 'createdAt' | 'fullName') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response: any = await api.get('/crm/leads');
        if (response.success) {
          setLeads(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải leads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();

    if (socket) {
      socket.on('newLead', (newLeadData) => {
        setLeads((prev) => {
          // Check if it already exists to prevent duplicate
          if (prev.find(l => l.id === newLeadData.id)) return prev;
          return [newLeadData, ...prev];
        });
      });

      return () => {
        socket.off('newLead');
      };
    }
  }, [socket]);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete({ isOpen: true, id });
  };

  const executeDelete = async () => {
    const id = confirmDelete.id;
    try {
      const res: any = await api.delete(`/crm/leads/${id}`);
      if (res.success) {
        setLeads(prev => prev.filter(l => l.id !== id));
        toast.success('Đã xóa khách hàng thành công');
      } else {
        toast.error('Không thể xóa khách hàng');
      }
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Có lỗi xảy ra khi xóa');
    } finally {
      setConfirmDelete({ isOpen: false, id: '' });
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch =
        lead.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery);

      const matchesTab =
        activeTab === 'ALL' ||
        (activeTab === 'NEW' && (lead.status?.toUpperCase() === 'NEW' || lead.status?.toUpperCase() === 'MỚI')) ||
        (activeTab === 'PROCESSING' && ['CONTACTED', 'CONSULTING', 'TRIAL_LEARNING', 'IN_PROGRESS'].includes(lead.status?.toUpperCase() || ''));

      const matchesSource = 
        activeSource === 'ALL' || 
        (lead.source?.toUpperCase() === activeSource.toUpperCase());

      return matchesSearch && matchesTab && matchesSource;
    }).sort((a, b) => {
      if (sortField === 'fullName') {
        return sortDir === 'asc'
          ? (a.fullName || '').localeCompare(b.fullName || '')
          : (b.fullName || '').localeCompare(a.fullName || '');
      }
      // createdAt
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortDir === 'asc' ? da - db : db - da;
    });
  }, [leads, searchQuery, activeTab, activeSource, sortField, sortDir]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, activeSource]);

  const STATUS_MAP: Record<string, { label: string; className: string }> = {
    NEW:             { label: 'Mới đăng ký',     className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    CONTACTED:       { label: 'Đã liên hệ',      className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    CONSULTING:      { label: 'Đang tư vấn',     className: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
    TRIAL_LEARNING:  { label: 'Học thử',         className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    WON:             { label: 'Đã đăng ký HV',    className: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    IN_PROGRESS:     { label: 'Đang xử lý',     className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    LOST:            { label: 'Không tiếp cận',  className: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
    CONVERTED:       { label: 'Đã chuyển đổi',    className: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  };

  const getStatus = (status: string) =>
    STATUS_MAP[status?.toUpperCase()] ||
    STATUS_MAP[status] ||
    { label: status || 'Mới', className: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-400 p-8">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
          <Home className="h-3 w-3" /> Dashboard
        </Link>
        <ChevronRightIcon className="h-3 w-3 opacity-30" />
        <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors">
          CRM
        </Link>
        <ChevronRightIcon className="h-3 w-3 opacity-30" />
        <span className="text-white">Khách hàng tiềm năng</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-12 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Khách hàng tiềm năng</h1>
            <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest leading-none">Theo dõi và chuyển đổi đơn đăng ký thành học viên</p>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col lg:flex-row items-center gap-4 mb-10 relative">
        <div className="flex-1 relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-white/10 focus:bg-slate-950 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-200 placeholder:text-slate-600 outline-none shadow-inner"
          />
        </div>

        <div className="relative w-full lg:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-12 px-6 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2.5 text-sm font-bold whitespace-nowrap w-full lg:w-auto shadow-sm backdrop-blur-sm",
              showFilters
                ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/30"
                : "bg-slate-950/50 border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10"
            )}
          >
            <Filter className="h-4 w-4" />
            Bộ lọc nâng cao
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showFilters ? "rotate-180" : "")} />
          </button>

          {/* ADVANCED FILTERS POPOVER */}
          <AnimatePresence>
            {showFilters && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-14 w-full md:w-72 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl p-5 z-20"
                >
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Trạng thái khách hàng</p>
                      <div className="flex flex-col bg-white/5 rounded-xl p-1 gap-1">
                        {[
                          { id: 'ALL', label: 'Tất cả' },
                          { id: 'NEW', label: 'Mới đăng ký' },
                          { id: 'PROCESSING', label: 'Đang xử lý (Tư vấn/Học thử)' }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setShowFilters(false); }}
                            className={cn(
                              "px-4 py-2.5 rounded-lg text-xs font-bold text-left transition-all",
                              activeTab === tab.id
                                ? "bg-emerald-500 text-white shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Nguồn khách hàng</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['ALL', 'Website', 'Facebook', 'Referral', 'AI_TEST'].map(source => (
                          <button 
                            key={source} 
                            onClick={() => { setActiveSource(source); setShowFilters(false); }}
                            className={cn(
                              "px-3 py-2 rounded-xl border text-[10px] font-black transition-all uppercase tracking-tighter",
                              activeSource === source
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                : "bg-white/5 border-white/5 text-gray-500 hover:text-white"
                            )}
                          >
                            {source === 'ALL' ? 'Tất cả' : source === 'AI_TEST' ? 'Test AI' : source}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => { setActiveTab('ALL'); setActiveSource('ALL'); setSearchQuery(''); setShowFilters(false); }}
                      variant="ghost"
                      className="w-full text-[10px] font-black text-red-500/70 hover:text-red-500 hover:bg-red-500/5 uppercase tracking-widest pt-2"
                    >
                      Làm mới bộ lọc
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th
                className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] cursor-pointer hover:text-emerald-400 transition-colors select-none"
                onClick={() => toggleSort('fullName')}
              >
                Khách hàng & Khóa học {sortField === 'fullName' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Kết quả AI</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Liên hệ</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Trạng thái</th>
              <th
                className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] cursor-pointer hover:text-emerald-400 transition-colors select-none"
                onClick={() => toggleSort('createdAt')}
              >
                Ngày tạo {sortField === 'createdAt' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <tr key="loading">
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-black uppercase tracking-widest text-gray-500">Đang đồng bộ...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.02 }}
                    key={lead.id}
                    className="group hover:bg-white/[0.03] transition-all cursor-pointer relative"
                  >
                    <td className="px-8 py-6 relative">
                      {/* HOVER INDICATOR BAR */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-center gap-4">
                        {/* Avatar - green border for paid, amber for consult, default for test */}
                        <div className={cn(
                          "h-12 w-12 rounded-xl border flex items-center justify-center font-black text-sm uppercase transition-all",
                          lead.paymentMethod === 'TRANSFER' ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" :
                          lead.paymentMethod === 'CONSULT' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                          "bg-white/5 border-white/5 text-gray-500 group-hover:text-emerald-500"
                        )}>
                          {lead.fullName?.split(' ').pop()?.charAt(0) || 'K'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white leading-none">{lead.fullName}</p>
                          <div className="flex flex-col gap-1.5 mt-2">
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter flex items-center gap-1.5 bg-emerald-500/5 px-2 py-0.5 rounded w-fit">
                              <BookOpen className="h-3 w-3" /> {lead.courseName || 'Chưa xác định khóa học'}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {lead.source === 'AI_TEST' && (
                                <span className="text-[9px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded uppercase tracking-wider">🤖 Từ Test AI</span>
                              )}
                              {lead.couponCode && (
                                <span className="text-[9px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded uppercase tracking-wider">🎫 {lead.couponCode}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {lead.paymentMethod === 'TRANSFER' ? (
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 rounded-lg uppercase tracking-wider block w-fit">✅ Đã chuyển khoản</span>
                          {lead.finalPrice && <p className="text-base font-black text-white mt-1">{Number(lead.finalPrice).toLocaleString()}<span className="text-[10px] text-slate-500 font-bold">đ</span></p>}
                        </div>
                      ) : lead.paymentMethod === 'CONSULT' ? (
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg uppercase tracking-wider block w-fit">📞 Chờ tư vấn</span>
                          {lead.finalPrice && <p className="text-base font-black text-white mt-1">{Number(lead.finalPrice).toLocaleString()}<span className="text-[10px] text-slate-500 font-bold">đ</span></p>}
                        </div>
                      ) : lead.quizResult ? (
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{lead.quizResult.level}</p>
                          <p className="text-[8px] font-bold text-slate-500">ĐIỂM: {lead.quizResult.score}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-700">—</span>
                      )}
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
                          <Mail className="h-3.5 w-3.5 text-gray-700" /> {lead.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-600/80 group-hover:text-emerald-500 transition-colors">
                          <Phone className="h-3.5 w-3.5 text-gray-700" /> {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {(() => { const s = getStatus(lead.status); return (
                        <span className={cn(
                          "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border inline-flex items-center gap-1.5",
                          s.className
                        )}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                          {s.label}
                        </span>
                      );})()
                      }
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-bold">{new Date(lead.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <a href={`tel:${lead.phone}`}
                          title={`Gọi ${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="h-9 w-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 flex items-center justify-center transition-all z-10 relative"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <Link href={`/admin/crm/leads/${lead.id}`} onClick={(e) => e.stopPropagation()} className="z-10 relative">
                          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-white/5 bg-white/5 hover:bg-white/10 text-gray-500">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={(e) => handleDeleteClick(lead.id, e)}
                          className="h-9 w-9 rounded-full border-white/5 bg-white/5 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/20 text-gray-500 transition-all z-10 relative"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr key="empty">
                  <td colSpan={5} className="px-8 py-32 text-center opacity-30">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Không tìm thấy dữ liệu</p>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="px-8 py-6 bg-white/5 flex items-center justify-between border-t border-white/5">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
            Hiển thị {paginatedLeads.length} / {filteredLeads.length} dữ liệu
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" size="icon" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="h-9 w-9 rounded-full border-white/5 bg-white/5 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" size="icon"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="h-9 w-9 rounded-full border-white/5 bg-white/5 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
        onConfirm={executeDelete}
        title="Xóa khách hàng tiềm năng"
        message="Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác và mọi dữ liệu liên quan sẽ bị xóa."
        confirmText="Xóa ngay"
        type="danger"
      />
    </div>
  );
}
