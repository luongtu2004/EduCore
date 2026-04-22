'use client';

import { useState, useEffect } from 'react';
import { 
  Ticket, Plus, Search, Filter, Edit, 
  Trash2, ChevronRight, Home, Calendar,
  CheckCircle2, XCircle, Tag, Percent,
  Loader2, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'PERCENT',
    expiry: '',
    maxUsage: 100,
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/coupons');
      if (response.success) {
        setCoupons(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải mã giảm giá:', error);
      toast.error('Không thể tải danh sách mã giảm giá.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (coupon: any = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type,
        expiry: new Date(coupon.expiry).toISOString().split('T')[0],
        maxUsage: coupon.maxUsage,
        isActive: coupon.isActive
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discount: '',
        type: 'PERCENT',
        expiry: '',
        maxUsage: 100,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingCoupon) {
        const response: any = await api.put(`/cms/coupons/${editingCoupon.id}`, formData);
        if (response.success) {
          toast.success('Cập nhật mã giảm giá thành công');
          fetchCoupons();
          setIsModalOpen(false);
        }
      } else {
        const response: any = await api.post('/cms/coupons', formData);
        if (response.success) {
          toast.success('Thêm mã giảm giá thành công');
          fetchCoupons();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return;
    try {
      const response: any = await api.delete(`/cms/coupons/${id}`);
      if (response.success) {
        toast.success('Đã xóa mã giảm giá thành công');
        setCoupons(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      toast.error('Lỗi khi xóa mã giảm giá');
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">QUẢN LÝ MÃ GIẢM GIÁ</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">MÃ GIẢM GIÁ</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">QUẢN LÝ CÁC CHƯƠNG TRÌNH ƯU ĐÃI & COUPONS</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 font-black text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/10 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> THÊM MÃ MỚI
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên chương trình..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-5 rounded-2xl bg-white border border-slate-100 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold outline-none placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã & Mức giảm</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Thời hạn</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lượt dùng</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
               <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto opacity-20" />
                  </td>
               </tr>
            ) : filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon, idx) => (
                <tr key={coupon.id} className="group hover:bg-slate-50/80 transition-all relative">
                  <td className="px-8 py-6 relative">
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-y-50 group-hover:scale-y-100" />
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                        {coupon.type === 'PERCENT' ? <Percent className="h-5 w-5" /> : <Tag className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-wider">{coupon.code}</p>
                        <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-widest">Giảm {coupon.discount}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                         <Calendar className="h-3.5 w-3.5 text-slate-300" /> {new Date(coupon.expiry).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                     <div className="w-24 mx-auto space-y-1.5">
                        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                           <span>{coupon.usageCount} DÙNG</span>
                           <span>{coupon.maxUsage} MAX</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(coupon.usageCount / coupon.maxUsage) * 100}%` }} />
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    {coupon.isActive ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Đang chạy</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100">Hết hạn/Ẩn</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Button 
                          onClick={() => handleOpenModal(coupon)}
                          size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-emerald-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(coupon.id)}
                          size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-24 text-center text-slate-400 uppercase font-black text-xs tracking-widest opacity-30">
                  Không tìm thấy mã giảm giá nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">{editingCoupon ? 'Cập nhật mã' : 'Thêm mã mới'}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Điền thông tin chương trình giảm giá</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mã Coupon</label>
                    <input 
                      type="text" 
                      required
                      placeholder="VD: EDUCORE2026"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold uppercase" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Loại giảm giá</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold outline-none appearance-none"
                    >
                      <option value="PERCENT">Phần trăm (%)</option>
                      <option value="FIXED">Số tiền cố định (đ)</option>
                    </select>
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mức giảm</label>
                    <input 
                      type="text" 
                      required
                      placeholder={formData.type === 'PERCENT' ? 'VD: 20%' : 'VD: 500.000đ'}
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Hạn sử dụng</label>
                    <input 
                      type="date" 
                      required
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giới hạn lượt dùng</label>
                    <input 
                      type="number" 
                      required
                      value={formData.maxUsage}
                      onChange={(e) => setFormData({ ...formData, maxUsage: parseInt(e.target.value) })}
                      className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1 flex flex-col justify-center pt-4">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div 
                          onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            formData.isActive ? "bg-emerald-500" : "bg-slate-200"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            formData.isActive ? "left-7" : "left-1"
                          )} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kích hoạt mã</span>
                     </label>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <Button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="ghost" 
                    className="flex-1 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-2 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-10 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-900/10 gap-2"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {editingCoupon ? 'CẬP NHẬT NGAY' : 'TẠO MÃ NGAY'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
