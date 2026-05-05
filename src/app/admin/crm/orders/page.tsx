'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard, Search, Filter, ChevronRight,
  ChevronLeft, Home, Loader2, MoreVertical,
  CheckCircle2, Clock, XCircle, ShoppingCart,
  User, BookOpen, Trash2, Calendar, ChevronDown,
  DollarSign, Activity, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { useSocket } from '@/lib/socket-provider';

export default function CRMOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: '' });
  const [confirmStatus, setConfirmStatus] = useState<{ isOpen: boolean; id: string; status: string }>({ isOpen: false, id: '', status: '' });
  const itemsPerPage = 10;
  const { socket } = useSocket();

  useEffect(() => {
    fetchOrders();

    if (socket) {
      socket.on('newLead', (newLeadData) => {
        // If it's a course checkout, refresh the orders list
        if (newLeadData.courseName && newLeadData.finalPrice !== undefined) {
          fetchOrders();
        }
      });

      return () => {
        socket.off('newLead');
      };
    }
  }, [socket]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/crm/orders');
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalRevenue = orders.filter(o => o.status === 'PAID').reduce((acc, o) => acc + (o.amount || 0), 0);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      const dbId = orders.find(o => o.id === id)?.dbId || id;
      const response: any = await api.delete(`/crm/orders/${dbId}`);
      if (response.success) {
        toast.success('Đã xóa đơn hàng');
        fetchOrders();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error('Lỗi khi xóa đơn hàng');
    } finally {
      setConfirmDelete({ isOpen: false, id: '' });
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const dbId = orders.find(o => o.id === id)?.dbId || id;
      const response: any = await api.patch(`/crm/orders/${dbId}/status`, { status });
      if (response.success) {
        toast.success('Cập nhật trạng thái thành công');
        fetchOrders();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status: string, id: string) => {
    const commonClass = "w-[160px] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 justify-center outline-none transition-all cursor-pointer shadow-sm active:scale-95";
    switch (status) {
      case 'PAID':
        return (
          <span className={cn(commonClass, "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default shadow-emerald-500/5")}>
            <CheckCircle2 className="h-3.5 w-3.5" /> ĐÃ THANH TOÁN
          </span>
        );
      case 'PENDING':
        return (
          <div className="relative group/select">
            <select
              value="PENDING"
              onChange={(e) => {
                if (e.target.value !== 'PENDING') {
                  setConfirmStatus({ isOpen: true, id, status: e.target.value });
                }
              }}
              className={cn(commonClass, "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 appearance-none")}
            >
              <option value="PENDING">CHỜ XỬ LÝ</option>
              <option value="PAID">XÁC NHẬN THANH TOÁN</option>
              <option value="CANCELLED">HỦY ĐƠN HÀNG</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-amber-500/50 pointer-events-none group-hover/select:text-amber-500 transition-colors" />
          </div>
        );
      case 'CANCELLED':
        return (
          <span className={cn(commonClass, "bg-rose-500/10 text-rose-400 border-rose-500/20 cursor-default opacity-80 shadow-rose-500/5")}>
            <XCircle className="h-3.5 w-3.5" /> ĐÃ HỦY
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-400 p-8">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
        <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
          <Home className="h-3 w-3" /> CRM
        </Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <span className="text-white">QUẢN LÝ ĐƠN HÀNG</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-5">
          <div className="h-14 w-3 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Hệ thống đơn hàng</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10 uppercase tracking-widest">
                <Activity className="h-3 w-3" /> LIVE DATA
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="px-8 py-4 bg-[#111827] rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 h-16 w-16 bg-emerald-500/10 rounded-full blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <DollarSign className="h-3 w-3 text-emerald-500" /> TỔNG DOANH THU
              </p>
              <p className="text-3xl font-black text-white italic tracking-tighter">
                {formatAmount(totalRevenue)}
                <span className="text-[10px] text-slate-600 font-black ml-2 uppercase italic">Collected</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col lg:flex-row items-center gap-3 mb-10 relative">
        <div className="flex-1 relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors duration-300" />
          </div>
          <input
            type="search"
            placeholder="Tìm theo mã đơn hoặc tên học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-full bg-slate-950/50 border border-white/10 hover:border-white/20 focus:bg-slate-900 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium text-slate-200 placeholder:text-slate-600 outline-none shadow-sm backdrop-blur-sm"
          />
        </div>
        
        <div className="relative w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative group min-w-[200px] w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 pl-12 pr-10 rounded-full bg-slate-950/50 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 text-sm font-bold transition-all duration-300 shadow-sm backdrop-blur-sm outline-none appearance-none cursor-pointer w-full"
            >
              <option value="All">Trạng thái (Tất cả)</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 pointer-events-none group-focus-within:text-emerald-500" />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none group-hover:text-emerald-500 transition-colors" />
          </div>
          
          {(searchQuery || statusFilter !== 'All') && (
            <Button 
              variant="ghost"
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
              className="h-12 px-6 rounded-full border transition-all duration-300 text-sm font-bold bg-slate-950/50 border-white/10 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 shadow-sm backdrop-blur-sm w-full sm:w-auto"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Đơn hàng & Học viên</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Khóa học</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Số tiền</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Trạng thái (Click để đổi)</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto opacity-20" />
                </td>
              </tr>
            ) : paginatedOrders.length > 0 ? (
              paginatedOrders.map((order, idx) => (
                <tr key={order.id} className="group hover:bg-white/[0.03] transition-all relative">
                  <td className="px-8 py-6 relative">
                    {/* HOVER INDICATOR BAR */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-[14px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{order.id}</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                          <User className="h-3 w-3" /> {order.studentName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-500/50" /> {order.courseName}
                      </span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-sm font-black text-white">{order.amount.toLocaleString('vi-VN')}đ</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="w-fit mx-auto">
                      {getStatusBadge(order.status, order.id)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/crm/orders/${order.id}`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setConfirmDelete({ isOpen: true, id: order.id })}
                        className="h-10 w-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-32 text-center opacity-30">
                  <CreditCard className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-sm font-black uppercase tracking-[0.2em]">Chưa có đơn hàng nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="px-8 py-6 bg-white/5 flex items-center justify-between border-t border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Hiển thị {paginatedOrders.length} / {filteredOrders.length} dữ liệu
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline" size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="h-9 w-9 rounded-full border-white/5 bg-slate-950 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" size="icon"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="h-9 w-9 rounded-full border-white/5 bg-slate-950 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: '' })}
        onConfirm={() => handleDeleteOrder(confirmDelete.id)}
        title="Xóa đơn hàng"
        message="Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác."
        confirmText="Xóa đơn hàng"
        cancelText="Hủy"
        type="danger"
      />
      <ConfirmModal
        isOpen={confirmStatus.isOpen}
        onClose={() => setConfirmStatus({ isOpen: false, id: '', status: '' })}
        onConfirm={() => {
          updateOrderStatus(confirmStatus.id, confirmStatus.status);
          setConfirmStatus({ isOpen: false, id: '', status: '' });
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
