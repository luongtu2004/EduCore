'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Phone, Mail, Clock, BookOpen,
  Loader2, CheckCircle2, Calendar, MessageSquare,
  Award, Brain, CreditCard, Tag, DollarSign,
  User, Globe, ChevronRight, Home, Edit2,
  AlertCircle, Sparkles, Check, X, RefreshCw,
  ClipboardList, PenLine, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  NEW: { label: 'Mới đăng ký', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  CONTACTED: { label: 'Đã liên hệ', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  CONSULTING: { label: 'Đang tư vấn', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  TRIAL_LEARNING: { label: 'Học thử', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  WON: { label: 'Đã đăng ký HV', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
  LOST: { label: 'Không tiếp cận', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
};

const STATUS_FLOW = ['NEW', 'CONTACTED', 'CONSULTING', 'TRIAL_LEARNING', 'WON'];

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', email: '', phone: '', courseName: '' });
  const [savingEdit, setSavingEdit] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);

  const fetchStaffList = async () => {
    try {
      const res: any = await api.get('/auth/users');
      if (res.success) {
        setStaffList(res.data.filter((u: any) => ['STAFF', 'CONSULTANT', 'ADMIN'].includes(u.role)));
      }
    } catch (e) { }
  };

  const fetchLead = async () => {
    try {
      const response: any = await api.get(`/crm/leads/${id}`);
      if (response.success) setLead(response.data);
    } catch {
      toast.error('Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
    fetchStaffList();
  }, [id]);

  const submitNote = async () => {
    if (!newNote.trim()) return;
    setSubmittingNote(true);
    try {
      await api.post(`/crm/leads/${id}/note`, { note: newNote });
      toast.success('Đã thêm ghi chú');
      setNewNote('');
      fetchLead();
    } catch { toast.error('Lỗi khi thêm ghi chú'); }
    finally { setSubmittingNote(false); }
  };

  const openEdit = () => {
    setEditForm({ fullName: lead.fullName || '', email: lead.email || '', phone: lead.phone || '', courseName: lead.courseName || '' });
    setEditMode(true);
  };

  const saveEdit = async () => {
    setSavingEdit(true);
    try {
      await api.patch(`/crm/leads/${id}`, editForm);
      toast.success('Đã cập nhật thông tin');
      setEditMode(false);
      fetchLead();
    } catch { toast.error('Lỗi khi cập nhật'); }
    finally { setSavingEdit(false); }
  };

  const updateStatus = async (status: string) => {
    setUpdatingStatus(true);
    try {
      await api.patch(`/crm/leads/${id}/status`, { status, note: noteText || undefined });
      toast.success(`Cập nhật: ${STATUS_CONFIG[status]?.label || status}`);
      setNoteText('');
      fetchLead();
    } catch {
      toast.error('Lỗi cập nhật trạng thái');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssign = async (staffId: string) => {
    const staff = staffList.find(s => s.id === staffId);
    try {
      await api.patch(`/crm/leads/${id}/assign`, {
        assignedTo: staffId,
        assignedStaffName: staff?.fullName
      });
      toast.success(`Đã giao cho ${staff?.fullName}`);
      fetchLead();
    } catch {
      toast.error('Lỗi khi giao việc');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đang tải dữ liệu...</p>
    </div>
  );

  if (!lead) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-slate-700 mx-auto" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Không tìm thấy khách hàng</p>
        <Button onClick={() => router.back()} variant="outline" className="border-white/10 text-slate-400">Quay lại</Button>
      </div>
    </div>
  );

  const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG['NEW'];
  const currentStatusIdx = STATUS_FLOW.indexOf(lead.status);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans antialiased">
      <div className="p-8">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5"><Home className="h-3 w-3" /> Dashboard</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors">CRM</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link href="/admin/crm/leads" className="hover:text-emerald-500 transition-colors">Khách hàng tiềm năng</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-white">{lead.fullName}</span>
        </nav>

        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Danh sách khách hàng</span>
          </button>
          <div className="flex items-center gap-3">
            {currentStatusIdx < STATUS_FLOW.length - 1 && (
              <Button
                onClick={() => updateStatus(STATUS_FLOW[currentStatusIdx + 1])}
                disabled={updatingStatus}
                className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-black text-xs border-none gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="h-4 w-4" /> Chuyển sang: {STATUS_CONFIG[STATUS_FLOW[currentStatusIdx + 1]].label}
              </Button>
            )}
            <Button
              onClick={() => updateStatus('LOST')}
              disabled={updatingStatus || lead.status === 'LOST'}
              variant="outline"
              className="h-11 rounded-xl border-white/10 bg-white/5 text-slate-500 hover:text-red-400 hover:border-red-500/30 font-black text-xs gap-2"
            >
              <X className="h-4 w-4" /> Không tiếp cận
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ════ LEFT COL ════ */}
          <div className="space-y-6">

            {/* Profile card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className={cn(
                  "h-24 w-24 rounded-3xl flex items-center justify-center text-3xl font-black mb-4 shadow-2xl",
                  lead.paymentMethod === 'TRANSFER' ? "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white" :
                    lead.paymentMethod === 'CONSULT' ? "bg-gradient-to-tr from-amber-600 to-yellow-400 text-white" :
                      lead.source === 'AI_TEST' ? "bg-gradient-to-tr from-purple-600 to-violet-400 text-white" :
                        "bg-gradient-to-tr from-slate-700 to-slate-600 text-slate-300"
                )}>
                  {lead.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{lead.fullName}</h2>
                <span className={cn(
                  'mt-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
                  statusCfg.color, statusCfg.bg, statusCfg.border
                )}>
                  {statusCfg.label}
                </span>
                <button
                  onClick={openEdit}
                  className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-slate-600 hover:text-emerald-400 uppercase tracking-widest transition-colors group"
                >
                  <Edit2 className="h-3 w-3 group-hover:scale-110 transition-transform" />
                  Sửa thông tin
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Phone, label: 'Điện thoại', value: lead.phone },
                  { icon: Mail, label: 'Email', value: lead.email || 'Chưa cập nhật' },
                  { icon: Calendar, label: 'Ngày đăng ký', value: new Date(lead.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                  { icon: Globe, label: 'Nguồn', value: lead.source === 'AI_TEST' ? '🤖 Test AI' : lead.source === 'WEBSITE' ? '🌐 Website' : lead.source },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                    <Icon className="h-4 w-4 text-slate-600 group-hover:text-emerald-500 shrink-0 transition-colors" />
                    <div className="min-w-0">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
                      <p className="text-sm font-bold text-slate-200 truncate">{value}</p>
                    </div>
                  </div>
                ))}

                {/* Phân công nhân viên */}
                <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Người phụ trách (Sale)</p>
                  <select
                    value={lead.assignedTo || ''}
                    onChange={(e) => handleAssign(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-slate-950/50 border border-white/10 text-sm font-bold text-emerald-400 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-slate-500">Chưa phân công</option>
                    {staffList.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.fullName} ({staff.role})</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Payment / Checkout Info */}
            {lead.paymentMethod && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className={cn(
                  "rounded-[2rem] p-6 border",
                  lead.paymentMethod === 'TRANSFER'
                    ? "bg-emerald-950/40 border-emerald-500/20"
                    : "bg-amber-950/30 border-amber-500/20"
                )}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
                    lead.paymentMethod === 'TRANSFER' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  )}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Thông tin đăng ký</p>
                    <p className={cn("text-[9px] font-black uppercase tracking-widest",
                      lead.paymentMethod === 'TRANSFER' ? "text-emerald-400" : "text-amber-400"
                    )}>
                      {lead.paymentMethod === 'TRANSFER' ? '✅ Đã chuyển khoản' : '📞 Chờ tư vấn'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {lead.courseName && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <BookOpen className="h-4 w-4 text-slate-500 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Khóa học</p>
                        <p className="text-sm font-black text-white">{lead.courseName}</p>
                      </div>
                    </div>
                  )}
                  {lead.finalPrice && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <DollarSign className="h-4 w-4 text-slate-500 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Học phí</p>
                        <p className="text-xl font-black text-emerald-400">{Number(lead.finalPrice).toLocaleString()}<span className="text-sm">đ</span></p>
                      </div>
                    </div>
                  )}
                  {lead.couponCode && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Tag className="h-4 w-4 text-slate-500 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Mã giảm giá</p>
                        <p className="text-sm font-black text-purple-400">🎫 {lead.couponCode}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* ════ RIGHT COL ════ */}
          <div className="lg:col-span-2 space-y-8">

            {/* Status Flow */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Quy trình xử lý</h3>
              <div className="flex items-center gap-0 mb-8">
                {STATUS_FLOW.map((s, i) => {
                  const cfg = STATUS_CONFIG[s];
                  const done = i <= currentStatusIdx;
                  const active = i === currentStatusIdx;
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <button
                        onClick={() => !active && updateStatus(s)}
                        disabled={updatingStatus}
                        className={cn(
                          "flex flex-col items-center gap-2 flex-1 group cursor-pointer",
                          active && "cursor-default"
                        )}
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all text-xs font-black",
                          active ? `${cfg.bg} ${cfg.border} ${cfg.color} scale-110` :
                            done ? "bg-emerald-500 border-emerald-500 text-white" :
                              "bg-white/5 border-white/10 text-slate-700 group-hover:border-white/30"
                        )}>
                          {done && !active ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
                        </div>
                        <span className={cn("text-[8px] font-black uppercase tracking-wider text-center leading-tight",
                          active ? cfg.color : done ? "text-emerald-500" : "text-slate-700"
                        )}>{cfg.label}</span>
                      </button>
                      {i < STATUS_FLOW.length - 1 && (
                        <div className={cn("h-0.5 flex-1 mx-1 rounded-full", i < currentStatusIdx ? "bg-emerald-500" : "bg-white/5")} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick note when changing status */}
              <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Ghi chú cập nhật trạng thái</p>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="VD: Đã gọi điện lúc 9h sáng, khách đồng ý tham gia buổi tư vấn thứ 3..."
                  rows={3}
                  className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-700 outline-none resize-none font-medium leading-relaxed"
                />
              </div>
            </motion.div>

            {/* Quiz Result or No Test */}
            {lead.quizResult ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 rounded-[2rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Brain className="h-28 w-28 text-purple-400" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white tracking-tighter uppercase italic">Kết quả Test AI</h3>
                      <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Phân tích trình độ tự động</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Trình độ</p>
                      <p className="text-xl font-black text-purple-400 leading-tight">{lead.quizResult.level}</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Tổng điểm</p>
                      <p className="text-xl font-black text-white">{lead.quizResult.score} <span className="text-slate-600 text-sm font-bold">/ 40</span></p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : !lead.paymentMethod && (
              <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] p-10 text-center">
                <Sparkles className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Chưa thực hiện Test AI</p>
                <p className="text-xs text-slate-700 mt-1">Khuyến khích khách hàng làm test để được tư vấn chính xác hơn.</p>
              </div>
            )}

            {/* Note */}
            {lead.note && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-slate-600" />
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Ghi chú</p>
                </div>
                <p className="text-sm font-medium text-slate-300 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4">
                  {lead.note}
                </p>
              </motion.div>
            )}

            {/* Add Note */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6">
              <div className="flex items-center gap-2 mb-4">
                <PenLine className="h-4 w-4 text-emerald-500" />
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Thêm ghi chú</h3>
              </div>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Nhập ghi chú nội bộ... (VD: Đã gọi điện, khách đồng ý tham gia tư vấn thứ 3)"
                rows={3}
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-4 text-sm text-slate-300 placeholder:text-slate-700 outline-none resize-none font-medium leading-relaxed focus:border-emerald-500/50 transition-all"
              />
              <Button
                onClick={submitNote}
                disabled={!newNote.trim() || submittingNote}
                className="mt-3 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-black text-xs border-none gap-2 disabled:opacity-40"
              >
                {submittingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Lưu ghi chú
              </Button>
            </motion.div>

            {/* Activity Log */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Nhật ký hoạt động</h3>
                <button onClick={fetchLead} className="text-slate-700 hover:text-emerald-500 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {lead.activityLogs?.length > 0 ? lead.activityLogs.map((log: any, idx: number) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                    <div className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                      log.type === 'CREATED' ? "bg-emerald-500/10 text-emerald-500" :
                        log.type === 'STATUS_CHANGE' ? "bg-blue-500/10 text-blue-400" :
                          log.type === 'NOTE' ? "bg-purple-500/10 text-purple-400" :
                            log.type === 'UPDATED' ? "bg-amber-500/10 text-amber-400" :
                              "bg-white/5 text-slate-500"
                    )}>
                      {log.type === 'CREATED' ? <User className="h-4 w-4" /> :
                        log.type === 'STATUS_CHANGE' ? <ClipboardList className="h-4 w-4" /> :
                          log.type === 'NOTE' ? <PenLine className="h-4 w-4" /> :
                            log.type === 'UPDATED' ? <Edit2 className="h-4 w-4" /> :
                              <Clock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-200 leading-snug">{log.content}</p>
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-700">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-black uppercase tracking-widest">Chưa có nhật ký</p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditMode(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Sửa thông tin khách hàng</h2>
                <button onClick={() => setEditMode(false)} className="text-slate-500 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Họ và tên', key: 'fullName', type: 'text' },
                  { label: 'Số điện thoại', key: 'phone', type: 'tel' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Khóa học quan tâm', key: 'courseName', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">{label}</label>
                    <input
                      type={type}
                      value={(editForm as any)[key]}
                      onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl bg-slate-950/50 border border-white/10 text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => setEditMode(false)} variant="outline" className="flex-1 h-11 rounded-xl border-white/10 text-slate-400 font-black text-xs">Hủy</Button>
                <Button onClick={saveEdit} disabled={savingEdit} className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border-none font-black text-xs gap-2">
                  {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu thay đổi
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
