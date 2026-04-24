'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare, Search, Trash2, ChevronRight, ChevronLeft,
  Home, Loader2, Phone, Mail, Calendar, CheckCircle2, Clock, Eye, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/modals/confirm-modal';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Chờ xử lý', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  CONTACTED: { label: 'Đã liên hệ', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  RESOLVED: { label: 'Đã xử lý', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  CLOSED: { label: 'Đã đóng', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

export default function CRMContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: '' });
  const itemsPerPage = 10;

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/contacts');
      if (response.success) setContacts(response.data);
    } catch {
      toast.error('Không thể tải danh sách liên hệ.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res: any = await api.put(`/cms/contacts/${id}`, { status });
      if (res.success) {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }));
        toast.success('Đã cập nhật trạng thái');
      }
    } catch { toast.error('Lỗi cập nhật'); }
  };

  const deleteContact = async (id: string) => {
    try {
      const res: any = await api.delete(`/cms/contacts/${id}`);
      if (res.success) {
        setContacts(prev => prev.filter(c => c.id !== id));
        if (selected?.id === id) setSelected(null);
        toast.success('Đã xóa liên hệ');
      }
    } catch { toast.error('Lỗi xóa liên hệ'); }
    finally { setConfirmDelete({ isOpen: false, id: '' }); }
  };

  const filtered = contacts.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery);
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pendingCount = contacts.filter(c => c.status === 'PENDING' || !c.status).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-400 p-8">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5"><Home className="h-3 w-3" /> Dashboard</Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors">CRM</Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <span className="text-white">Tin nhắn tư vấn</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Tin nhắn tư vấn</h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Form liên hệ từ website</p>
              {pendingCount > 0 && (
                <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">
                  {pendingCount} chờ xử lý
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-950/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-200 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-12 px-5 rounded-xl bg-slate-950/50 border border-white/5 text-xs font-bold text-slate-400 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer uppercase tracking-widest"
        >
          <option value="All">Tất cả</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="CONTACTED">Đã liên hệ</option>
          <option value="RESOLVED">Đã xử lý</option>
          <option value="CLOSED">Đã đóng</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LIST */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Người liên hệ</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Ngày gửi</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr><td colSpan={4} className="py-24 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto opacity-20" />
                  </td></tr>
                ) : paginated.length > 0 ? paginated.map((contact) => {
                  const statusInfo = STATUS_MAP[contact.status] || STATUS_MAP['PENDING'];
                  const isSelected = selected?.id === contact.id;
                  return (
                    <tr
                      key={contact.id}
                      onClick={() => setSelected(isSelected ? null : contact)}
                      className={cn("group hover:bg-white/[0.03] transition-all relative cursor-pointer", isSelected && "bg-emerald-500/5")}
                    >
                      <td className="px-8 py-5 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-4">
                          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center font-black text-sm border transition-all",
                            (contact.status === 'PENDING' || !contact.status) ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-white/5 border-white/5 text-slate-500"
                          )}>
                            {contact.name?.charAt(0)?.toUpperCase() || <User className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{contact.name || 'Khách ẩn danh'}</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-0.5">{contact.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", statusInfo.className)}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-xs font-bold text-slate-500">
                          {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <a href={`tel:${contact.phone}`} onClick={e => e.stopPropagation()}
                            className="h-9 w-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all">
                            <Phone className="h-4 w-4" />
                          </a>
                          <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); setConfirmDelete({ isOpen: true, id: contact.id }); }}
                            className="h-9 w-9 rounded-full border-white/5 bg-white/5 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/20 text-slate-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={4} className="py-24 text-center opacity-30">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3" />
                    <p className="text-sm font-black uppercase tracking-widest">Chưa có tin nhắn nào</p>
                  </td></tr>
                )}
              </tbody>
            </table>

            <div className="px-8 py-5 bg-white/5 flex items-center justify-between border-t border-white/5">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {paginated.length} / {filtered.length} liên hệ
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="h-9 w-9 rounded-full border-white/5 bg-white/5 text-slate-500 hover:text-white disabled:opacity-20">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="h-9 w-9 rounded-full border-white/5 bg-white/5 text-slate-500 hover:text-white disabled:opacity-20">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-6 space-y-5 sticky top-6"
              >
                {/* Avatar */}
                <div className="flex flex-col items-center text-center pt-2">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-2xl font-black text-white mb-3">
                    {selected.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <h3 className="text-xl font-black text-white">{selected.name}</h3>
                  <span className={cn("mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", (STATUS_MAP[selected.status] || STATUS_MAP['PENDING']).className)}>
                    {(STATUS_MAP[selected.status] || STATUS_MAP['PENDING']).label}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2.5">
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-emerald-500/10 transition-all group">
                      <Phone className="h-4 w-4 text-slate-600 group-hover:text-emerald-500" />
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white">{selected.phone}</span>
                    </a>
                  )}
                  {selected.email && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-bold text-slate-300 truncate">{selected.email}</span>
                    </div>
                  )}
                  {selected.createdAt && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Calendar className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-bold text-slate-300">{new Date(selected.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  )}
                </div>

                {/* Message */}
                {selected.message && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Nội dung</p>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed italic">{selected.message}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Cập nhật trạng thái</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STATUS_MAP).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => updateStatus(selected.id, key)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          selected.status === key
                            ? cn(val.className, "opacity-100")
                            : "bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {selected.status === key && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setConfirmDelete({ isOpen: true, id: selected.id })}
                  variant="ghost"
                  className="w-full text-[10px] font-black text-red-500/70 hover:text-red-500 hover:bg-red-500/5 uppercase tracking-widest"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Xóa liên hệ này
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-950/30 border border-dashed border-white/10 rounded-[2rem] p-10 text-center"
              >
                <MessageSquare className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Chọn một liên hệ để xem chi tiết</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: '' })}
        onConfirm={() => deleteContact(confirmDelete.id)}
        title="Xóa liên hệ"
        message="Bạn có chắc chắn muốn xóa liên hệ này?"
        confirmText="Xóa"
        type="danger"
      />
    </div>
  );
}
