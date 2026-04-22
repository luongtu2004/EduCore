'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ShoppingCart, User, Phone, Mail, Clock, BookOpen,
  Loader2, CheckCircle2, Calendar, CreditCard, XCircle, Home, ChevronRight, Copy, Tag, DollarSign, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/modals/confirm-modal';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PAID:      { label: 'Đã thanh toán', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  PENDING:   { label: 'Chờ xử lý',     color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  CANCELLED: { label: 'Đã hủy',        color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<{ isOpen: boolean; status: string }>({ isOpen: false, status: '' });

  const fetchOrder = async () => {
    try {
      const response: any = await api.get(`/crm/orders/${id}`);
      if (response.success) {
        setOrder(response.data);
      } else {
        toast.error('Không tìm thấy đơn hàng');
      }
    } catch {
      toast.error('Không tải được dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const updateStatus = async (status: string) => {
    setUpdatingStatus(true);
    try {
      await api.patch(`/crm/orders/${order.dbId}/status`, { status });
      toast.success(`Cập nhật: ${STATUS_CONFIG[status]?.label || status}`);
      fetchOrder();
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái');
    } finally {
      setUpdatingStatus(false);
      setConfirmStatus({ isOpen: false, status: '' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
        <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
          <ShoppingCart className="h-10 w-10 text-slate-600" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Không tìm thấy đơn hàng</h1>
        <p className="text-sm font-bold text-slate-500 mb-8">Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/admin/crm/orders">
          <Button className="h-12 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black text-[11px] uppercase tracking-widest text-white transition-all">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['PENDING'];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}!`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans antialiased">
      <div className="p-8">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5"><Home className="h-3 w-3" /> Dashboard</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors">CRM</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link href="/admin/crm/orders" className="hover:text-emerald-500 transition-colors">Đơn hàng</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-white">{order.id}</span>
        </nav>

        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Danh sách đơn hàng</span>
          </button>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {order.status === 'PENDING' && (
              <>
                <Button
                  onClick={() => setConfirmStatus({ isOpen: true, status: 'PAID' })}
                  disabled={updatingStatus}
                  className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-black text-xs border-none gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" /> Xác nhận thanh toán
                </Button>
                <Button
                  onClick={() => setConfirmStatus({ isOpen: true, status: 'CANCELLED' })}
                  disabled={updatingStatus}
                  variant="outline"
                  className="h-11 rounded-xl border-white/10 bg-white/5 text-slate-500 hover:text-red-400 hover:border-red-500/30 font-black text-xs gap-2 transition-all"
                >
                  <X className="h-4 w-4" /> Hủy đơn hàng
                </Button>
              </>
            )}
            {order.status !== 'PENDING' && (
              <div className={cn("h-11 px-6 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest cursor-default border", statusCfg.bg, statusCfg.color, statusCfg.border)}>
                {order.status === 'PAID' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {statusCfg.label}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ════ LEFT COL ════ */}
          <div className="space-y-6">

            {/* Profile card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-5 rotate-3 hover:rotate-0 transition-all duration-300">
                  <ShoppingCart className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">{order.studentName}</h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 mb-4">{order.id}</div>
                <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", statusCfg.color, statusCfg.bg, statusCfg.border)}>
                  {statusCfg.label}
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center"><Calendar className="h-3.5 w-3.5 text-slate-400" /></div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-0.5">Ngày tạo đơn</div>
                      <div className="text-xs font-bold text-slate-300">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                    </div>
                  </div>
                </div>

                {order.lead && (
                  <>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-emerald-500/20 transition-all cursor-pointer" onClick={() => handleCopy(order.lead.phone, 'Số điện thoại')}>
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all"><Phone className="h-3.5 w-3.5" /></div>
                        <div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-0.5">Điện thoại</div>
                          <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-all">{order.lead.phone}</div>
                        </div>
                      </div>
                      <Copy className="h-3.5 w-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>

                    {order.lead.email && (
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-emerald-500/20 transition-all cursor-pointer" onClick={() => handleCopy(order.lead.email, 'Email')}>
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all"><Mail className="h-3.5 w-3.5" /></div>
                          <div className="truncate pr-4">
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-0.5">Email</div>
                            <div className="text-xs font-bold text-slate-300 truncate group-hover:text-white transition-all">{order.lead.email}</div>
                          </div>
                        </div>
                        <Copy className="h-3.5 w-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Link to Lead info if exists */}
            {order.leadId && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-6 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Hồ sơ khách hàng</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Đơn hàng này liên kết với 1 Lead</p>
                  </div>
                </div>
                <Link href={`/admin/crm/leads/${order.leadId}`}>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl border-none relative z-10 h-10 transition-all">
                    Xem hồ sơ Lead
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* ════ RIGHT COL ════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* CHI TIẾT GIAO DỊCH */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <BookOpen className="h-3 w-3" /> Chi tiết giao dịch
              </h3>

              <div className="space-y-4">
                {/* Khóa học */}
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Khóa học / Sản phẩm</div>
                      <div className="text-lg font-black text-white">{order.courseName}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* PT Thanh toán */}
                  {order.lead?.paymentMethod && (
                    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Thanh toán</div>
                        <div className="text-sm font-bold text-white uppercase tracking-wider">{order.lead.paymentMethod === 'TRANSFER' ? 'Chuyển khoản' : 'Tư vấn sau'}</div>
                      </div>
                    </div>
                  )}

                  {/* Mã KM */}
                  {order.lead?.couponCode && (
                    <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">Mã giảm giá</div>
                        <div className="text-sm font-black text-white uppercase tracking-widest">{order.lead.couponCode}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* TỔNG TIỀN */}
                <div className="mt-6 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Tổng thành tiền</div>
                    <div className="text-3xl font-black italic text-white tracking-tight">{order.amount.toLocaleString('vi-VN')}đ</div>
                  </div>
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <DollarSign className="h-8 w-8" />
                  </div>
                </div>

              </div>
            </motion.div>

            {/* GHI CHÚ */}
            {order.lead?.note && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                  <User className="h-3 w-3" /> Ghi chú từ khách hàng
                </h3>
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                    "{order.lead.note}"
                  </p>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmStatus.isOpen}
        onClose={() => setConfirmStatus({ isOpen: false, status: '' })}
        onConfirm={() => {
          updateStatus(confirmStatus.status);
        }}
        title="Xác nhận trạng thái"
        message={
          confirmStatus.status === 'PAID'
            ? "Bạn có chắc chắn muốn xác nhận đơn hàng này ĐÃ THANH TOÁN? Đơn hàng sẽ bị khóa sau khi xác nhận."
            : "Bạn có chắc chắn muốn HỦY đơn hàng này? Đơn hàng sẽ bị khóa sau khi xác nhận."
        }
        confirmText="Xác nhận"
        cancelText="Đóng lại"
        type={confirmStatus.status === 'PAID' ? 'warning' : 'danger'}
      />
    </div>
  );
}
