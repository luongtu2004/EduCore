'use client';

import { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search,
  ShieldCheck, Mail, Phone, Lock, LockOpen,
  Trash2, Edit, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, Filter, ChevronDown, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserModal } from '@/components/modals/user-modal';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { toast } from 'react-hot-toast';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false, id: '', name: ''
  });

  const fetchUsers = async () => {
    try {
      const response: any = await api.get('/auth/users');
      if (response.success) {
        setUsers(response.data);
      } else {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải người dùng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteClick = (user: any) => {
    setConfirmDelete({ isOpen: true, id: user.id, name: user.fullName });
  };

  const deleteUser = async () => {
    try {
      await api.delete(`/auth/users/${confirmDelete.id}`);
      toast.success('Đã xóa tài khoản thành công!');
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi xóa tài khoản.');
    }
  };

  const toggleLock = async (user: any) => {
    try {
      await api.patch(`/auth/users/${user.id}`, { isActive: !user.isActive });
      toast.success(user.isActive ? `Đã khóa tài khoản ${user.fullName}` : `Đã mở khóa tài khoản ${user.fullName}`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi thay đổi trạng thái tài khoản.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' ? user.isActive : !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    if (sortOrder === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOrder === 'Oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter, sortOrder]);

  const ROLE_COLORS: Record<string, string> = {
    ADMIN: 'bg-rose-500/10 text-rose-600 border border-rose-500/20',
    STAFF: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    TEACHER: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
    CONSULTANT: 'bg-orange-500/10 text-orange-600 border border-orange-500/20',
    STUDENT: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
  };

  const getAvatarGradient = (id: string) => {
    if (!id) return 'from-emerald-400 to-teal-500 text-white';
    const gradients = [
      'from-rose-400 to-orange-400 text-white',
      'from-blue-400 to-indigo-500 text-white',
      'from-emerald-400 to-teal-500 text-white',
      'from-purple-400 to-fuchsia-500 text-white',
      'from-amber-400 to-orange-500 text-white',
      'from-cyan-400 to-blue-500 text-white',
      'from-pink-400 to-rose-500 text-white',
    ];
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    return gradients[sum % gradients.length];
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-3 w-3 opacity-40" />
        <span className="text-emerald-600">HỆ THỐNG NGƯỜI DÙNG</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-2">Hệ thống người dùng</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Quản lý tài khoản & phân quyền hệ thống Educore</p>
        </div>
        <Button
          onClick={handleAdd}
          className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 font-black text-xs transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-widest hover:-translate-y-0.5"
        >
          <UserPlus className="h-4 w-4 mr-2" /> Thêm thành viên
        </Button>
      </div>

      {/* STATS MINI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
             <Users className="h-24 w-24" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+12% tuần này</span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng thành viên</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{isLoading ? '--' : users.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-rose-500/5 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
             <ShieldCheck className="h-24 w-24" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Không đổi</span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quản trị viên (Admin)</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{isLoading ? '--' : users.filter(u => u.role === 'ADMIN').length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-orange-500/5 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
             <Lock className="h-24 w-24" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">-2% tuần này</span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tài khoản bị khóa</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{isLoading ? '--' : users.filter(u => !u.isActive).length}</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col lg:flex-row gap-3 mb-10">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm thành viên theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium outline-none placeholder:text-slate-400 shadow-sm"
          />
        </div>
        
        {/* FILTERS */}
        <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          <div className="relative group min-w-[160px] shrink-0">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full h-12 pl-10 pr-8 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-all text-[11px] font-bold text-slate-700 shadow-sm appearance-none outline-none cursor-pointer uppercase tracking-wider"
            >
              <option value="All">Tất cả vai trò</option>
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>
              <option value="TEACHER">TEACHER</option>
              <option value="CONSULTANT">CONSULTANT</option>
              <option value="STUDENT">STUDENT</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />
          </div>

          <div className="relative group min-w-[150px] shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-12 pl-5 pr-8 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-all text-[11px] font-bold text-slate-700 shadow-sm appearance-none outline-none cursor-pointer uppercase tracking-wider"
            >
              <option value="All">Mọi trạng thái</option>
              <option value="Active">Hoạt động</option>
              <option value="Locked">Bị khóa</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />
          </div>

          <div className="relative group min-w-[150px] shrink-0">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full h-12 pl-5 pr-8 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-all text-[11px] font-bold text-slate-700 shadow-sm appearance-none outline-none cursor-pointer uppercase tracking-wider"
            >
              <option value="Newest">Mới nhất</option>
              <option value="Oldest">Cũ nhất</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />
          </div>
          
          {(searchQuery || roleFilter !== 'All' || statusFilter !== 'All' || sortOrder !== 'Newest') && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('All');
                setStatusFilter('All');
                setSortOrder('Newest');
              }}
              className="h-12 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-bold uppercase tracking-widest px-4 shrink-0"
            >
              Xóa lọc
            </Button>
          )}
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-[#f1f5f9]/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thành viên</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Vai trò</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Liên hệ</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6 h-20 bg-slate-50/20" />
                  </tr>
                ))
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    key={user.id}
                    className="group hover:bg-[#f1f5f9]/40 transition-all relative"
                  >
                    <td className="px-8 py-5 relative">
                      {/* HOVER INDICATOR BAR */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-12 w-12 rounded-[1rem] bg-gradient-to-br flex items-center justify-center font-black text-xl shadow-md group-hover:scale-110 transition-transform shrink-0",
                          getAvatarGradient(user.id)
                        )}>
                          {user.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[15px] font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight mb-1">{user.fullName}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md w-fit">ID: {user.id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex justify-center">
                        <span className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm",
                          ROLE_COLORS[user.role] || 'bg-slate-50 text-slate-600 border border-slate-200'
                        )}>
                          {user.role === 'ADMIN' && <ShieldCheck className="h-3 w-3" />}
                          {user.role === 'STAFF' && <Users className="h-3 w-3" />}
                          {user.role === 'TEACHER' && <CheckCircle2 className="h-3 w-3" />}
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col items-center gap-2 text-xs text-slate-600 font-bold">
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 w-full justify-center">
                          <Mail className="h-3.5 w-3.5 text-slate-400" /> {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 w-full justify-center">
                            <Phone className="h-3.5 w-3.5 text-slate-400" /> {user.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-center">
                        {user.isActive ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Hoạt động
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">
                              Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[11px] font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              Đã khóa
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleLock(user)}
                          title={user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          className={cn(
                            "h-10 w-10 rounded-full border border-slate-100 shadow-sm transition-all",
                            user.isActive
                              ? "bg-white text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                              : "bg-white text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                          )}
                        >
                          {user.isActive
                            ? <Lock className="h-4 w-4" />
                            : <LockOpen className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="h-10 w-10 rounded-full bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-sm transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(user)}
                          className="h-10 w-10 rounded-full bg-white border border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Không tìm thấy người dùng nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-8 py-6 bg-[#f1f5f9]/50 flex items-center justify-between border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Hiển thị {paginatedUsers.length} / {filteredUsers.length} thành viên
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline" size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="h-9 w-9 rounded-full border-slate-200 bg-white text-slate-400 hover:text-emerald-600 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" size="icon"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="h-9 w-9 rounded-full border-slate-200 bg-white text-slate-400 hover:text-emerald-600 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* USER MODAL */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={fetchUsers}
        user={editingUser}
      />

      {/* CONFIRM DELETE */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
        onConfirm={deleteUser}
        title="Xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản của "${confirmDelete.name}"? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.`}
        confirmText="Xóa tài khoản"
        type="danger"
      />
    </div>
  );
}
