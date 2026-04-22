'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Filter, ChevronRight, 
  ChevronLeft, Home, Loader2, MoreVertical,
  CheckCircle2, Clock, XCircle, ShoppingCart,
  User, BookOpen, Trash2, Calendar
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
        toast.success('Đã cập nhật trạng thái');
        fetchOrders();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status: string, id: string) => {
    const commonClass = "w-[150px] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 justify-center outline-none transition-all cursor-pointer";
    switch (status) {
      case 'PAID':
        return (
          <span className={cn(commonClass, "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-default")}>
            <CheckCircle2 className="h-3 w-3" /> ĐÃ THANH TOÁN
          </span>
        );
      case 'PENDING':
        return (
          <select 
            value="PENDING" 
            onChange={(e) => {
              if (e.target.value !== 'PENDING') {
                setConfirmStatus({ isOpen: true, id, status: e.target.value });
              }
            }}
            className={cn(commonClass, "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20")}
          >
            <option value="PENDING">CHỜ XỬ LÝ</option>
            <option value="PAID">XÁC NHẬN THANH TOÁN</option>
            <option value="CANCELLED">HỦY ĐƠN HÀNG</option>
          </select>
        );
      case 'CANCELLED':
        return (
          <span className={cn(commonClass, "bg-rose-500/10 text-rose-500 border-rose-500/20 cursor-default opacity-80")}>
            <XCircle className="h-3 w-3" /> ĐÃ HỦY
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 p-8">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
        <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
          <Home className="h-3 w-3" /> CRM
        </Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <span className="text-white">Quản lý Đơn hàng</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-12 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Hệ thống đơn hàng</h1>
            <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest leading-none">Quản lý giao dịch và doanh thu khóa học</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-6 py-3 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tổng doanh thu</p>
              <p className="text-2xl font-black text-emerald-500">{totalRevenue.toLocaleString('vi-VN')}đ</p>
           </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc tên học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-950 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-200 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-12 px-6 rounded-xl bg-slate-950 border border-white/5 text-xs font-bold text-slate-400 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer uppercase tracking-widest"
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="PAID">ĐÃ THANH TOÁN</option>
          <option value="PENDING">CHỜ XỬ LÝ</option>
          <option value="CANCELLED">ĐÃ HỦY</option>
        </select>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
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
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-y-50 group-hover:scale-y-100" />
                    
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-emerald-500 transition-colors">
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
                           size="icon" variant="ghost" 
                           className="h-10 w-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100"
                         >
                            <BookOpen className="h-4 w-4" />
                         </Button>
                       </Link>
                       <Button 
                         size="icon" variant="ghost" 
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
