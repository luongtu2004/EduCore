'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Phone, Mail, Clock, BookOpen,
  Loader2, CheckCircle2, Calendar, Award,
  Globe, ChevronRight, Home, AlertCircle, Sparkles, User, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ConfirmModal } from '@/components/modals/confirm-modal';

export default function StudentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmComplete, setConfirmComplete] = useState(false);

  const fetchStudent = async () => {
    try {
      const response: any = await api.get(`/crm/students/${id}`);
      if (response.success) setStudent(response.data);
    } catch {
      toast.error('Không tải được dữ liệu học viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudent(); }, [id]);

  const handleComplete = async () => {
    try {
      const response: any = await api.patch(`/crm/students/${id}/status`, { status: 'COMPLETED' });
      if (response.success) {
        toast.success('Đã đánh dấu hoàn thành khóa học');
        fetchStudent();
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    } finally {
      setConfirmComplete(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đang tải dữ liệu...</p>
    </div>
  );

  if (!student) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-slate-700 mx-auto" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Không tìm thấy học viên</p>
        <Button onClick={() => router.back()} variant="outline" className="border-white/10 text-slate-400">Quay lại</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans antialiased">
      <div className="p-8">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5"><Home className="h-3 w-3" /> Dashboard</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors">CRM</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link href="/admin/crm/students" className="hover:text-emerald-500 transition-colors">Học viên</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-white">{student.fullName}</span>
        </nav>

        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Danh sách học viên</span>
          </button>

          <div className="flex items-center gap-3">
            {student.status !== 'COMPLETED' && (
              <Button
                onClick={() => setConfirmComplete(true)}
                className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 font-black text-xs border-none gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <Award className="h-4 w-4" /> Đánh dấu hoàn thành
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ════ LEFT COL ════ */}
          <div className="space-y-6">

            {/* Profile card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <User className="h-32 w-32" />
              </div>
              <div className="flex flex-col items-center text-center mb-8 relative z-10">
                <div className="h-24 w-24 rounded-3xl flex items-center justify-center text-3xl font-black mb-4 shadow-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white">
                  {student.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{student.fullName}</h2>
                <div className="mt-3">
                  {student.status === 'COMPLETED' ? (
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-500/10 text-blue-500 border-blue-500/20 inline-flex items-center gap-1.5">
                      <Award className="h-3 w-3" /> Đã hoàn thành
                    </span>
                  ) : (
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3" /> Đang học
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                {[
                  { icon: Phone,    label: 'Điện thoại', value: student.phone },
                  { icon: Mail,     label: 'Email',      value: student.email || 'Chưa cập nhật' },
                  { icon: Calendar, label: 'Ngày nhập học', value: new Date(student.createdAt).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                    <Icon className="h-4 w-4 text-slate-600 group-hover:text-emerald-500 shrink-0 transition-colors" />
                    <div className="min-w-0">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
                      <p className="text-sm font-bold text-slate-200 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ════ RIGHT COL ════ */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Enrollment Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">Thông tin khóa học</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Chi tiết lộ trình học</p>
                </div>
              </div>

              <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tên khóa học</p>
                    <p className="text-lg font-black text-emerald-400 uppercase tracking-tighter">{student.courseName || 'Khóa học tiêu chuẩn'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tiến độ (Demo)</p>
                    <div className="flex items-center gap-4">
                      <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[30%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      </div>
                      <span className="text-sm font-bold text-white">30%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Source Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">Gốc dữ liệu</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Đơn hàng & Chăm sóc</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.orderInfo && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
                    <div className="absolute right-0 bottom-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Sparkles className="h-20 w-20" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Đơn hàng liên kết</p>
                    <Link href={`/admin/crm/orders/${student.orderInfo.id}`} className="text-lg font-black text-white hover:text-emerald-400 transition-colors uppercase tracking-tighter">
                      {student.orderInfo.id}
                    </Link>
                    <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Đã thanh toán
                    </p>
                  </div>
                )}
                
                {student.leadId && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Hồ sơ Leads ban đầu</p>
                    <Link href={`/admin/crm/leads/${student.leadId}`} className="text-lg font-black text-white hover:text-emerald-400 transition-colors uppercase tracking-tighter truncate block">
                      Xem lịch sử tư vấn
                    </Link>
                    <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5">
                      <User className="h-3 w-3 text-emerald-500" /> Được quản lý trong CRM
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>

        <ConfirmModal
          isOpen={confirmComplete}
          onClose={() => setConfirmComplete(false)}
          onConfirm={handleComplete}
          title="Hoàn thành khóa học"
          message="Bạn xác nhận học viên này đã hoàn thành khóa học? Trạng thái sẽ được chuyển sang 'Đã hoàn thành'."
          confirmText="Xác nhận hoàn thành"
          cancelText="Hủy"
          type="warning"
        />

      </div>
    </div>
  );
}
