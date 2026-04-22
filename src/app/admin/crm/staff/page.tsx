'use client';

import { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search,
  ShieldCheck, Mail, Phone, Lock, LockOpen,
  Trash2, Edit, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, Filter, ChevronDown, Home, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserModal } from '@/components/modals/user-modal';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { toast } from 'react-hot-toast';

export default function CRMStaffPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
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
      }
    } catch (error) {
      console.error('Lỗi khi tải nhân sự:', error);
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
      toast.success('Đã xóa nhân sự thành công!');
      fetchUsers();
    } catch (error: any) {
      toast.error('Lỗi khi xóa nhân sự.');
    }
  };

  const toggleLock = async (user: any) => {
    try {
      await api.patch(`/auth/users/${user.id}`, { isActive: !user.isActive });
      toast.success(user.isActive ? `Đã khóa ${user.fullName}` : `Đã mở khóa ${user.fullName}`);
      fetchUsers();
    } catch (error: any) {
      toast.error('Lỗi khi thay đổi trạng thái.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return (user.role !== 'STUDENT') && matchesSearch && matchesRole; // Only show staff/admin in CRM Staff page
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-400 p-8">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
        <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
          <Home className="h-3 w-3" /> CRM
        </Link>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <span className="text-white">Quản lý Nhân sự & Staff</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-12 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Nhân sự hệ thống</h1>
            <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest leading-none">Quản lý đội ngũ tư vấn và giảng viên</p>
          </div>
        </div>
        <Button 
          onClick={handleAdd}
          className="h-12 rounded-xl bg-emerald-600 text-white px-8 font-black text-xs shadow-lg shadow-emerald-900/20 hover:scale-105 transition-all border-none gap-2"
        >
          <UserPlus className="h-4 w-4" /> THÊM NHÂN SỰ MỚI
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-950/50 border border-white/5 focus:bg-slate-950 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-200 outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-12 px-6 rounded-xl bg-slate-950/50 border border-white/5 text-xs font-bold text-slate-400 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer uppercase tracking-widest"
        >
          <option value="All">Tất cả vai trò</option>
          <option value="ADMIN">ADMIN</option>
          <option value="STAFF">STAFF</option>
          <option value="TEACHER">TEACHER</option>
          <option value="CONSULTANT">CONSULTANT</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Nhân viên</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Vai trò</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Trạng thái</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
               <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto opacity-20" />
                  </td>
               </tr>
            ) : paginatedUsers.map((user, idx) => (
              <tr key={user.id} className="group hover:bg-white/[0.03] transition-all relative">
                <td className="px-8 py-6 relative">
                  {/* HOVER INDICATOR BAR */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-gray-400 group-hover:text-emerald-500 transition-colors">
                      {user.fullName?.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-black text-white">{user.fullName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">MSNV: {user.id?.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                    user.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", user.isActive ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-700")} />
                    <span className={cn("text-[10px] font-black uppercase", user.isActive ? "text-emerald-500" : "text-slate-600")}>
                      {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Button 
                        size="icon" variant="ghost" 
                        onClick={() => toggleLock(user)}
                        className="h-9 w-9 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-500"
                      >
                        {user.isActive ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="icon" variant="ghost" 
                        onClick={() => handleEdit(user)}
                        className="h-9 w-9 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-500"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" variant="ghost" 
                        onClick={() => handleDeleteClick(user)}
                        className="h-9 w-9 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="px-8 py-6 bg-white/5 flex items-center justify-between border-t border-white/5">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
            Hiển thị {paginatedUsers.length} / {filteredUsers.length} dữ liệu
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" size="icon" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="h-9 w-9 rounded-full border-white/5 bg-white/5 text-gray-500 hover:text-white disabled:opacity-20"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button 
              variant="outline" size="icon"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="h-9 w-9 rounded-full border-white/5 bg-white/5 text-gray-500 hover:text-white disabled:opacity-20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={fetchUsers}
        user={editingUser}
      />
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
        onConfirm={deleteUser}
        title="Xóa nhân sự"
        message={`Bạn có chắc chắn muốn xóa nhân sự "${confirmDelete.name}" khỏi hệ thống CRM?`}
        confirmText="Xóa nhân sự"
        type="danger"
      />
    </div>
  );
}
