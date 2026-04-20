'use client';

import { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search, MoreHorizontal,
  ShieldCheck, Mail, Phone, Lock,
  Trash2, Edit, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, Filter, ChevronDown, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Lỗi khi tải người dùng:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">HỆ THỐNG NGƯỜI DÙNG</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">HỆ THỐNG NGƯỜI DÙNG</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN HỆ THỐNG EDUCORE</p>
        </div>
        <Button className="h-12 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/5 uppercase tracking-wider">
          <UserPlus className="h-4 w-4" /> THÊM THÀNH VIÊN
        </Button>
      </div>

      {/* STATS MINI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tổng thành viên</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{users.length || '--'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Quản trị viên (Admin)</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{users.filter(u => u.role === 'ADMIN').length || '0'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tài khoản bị khóa</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{users.filter(u => !u.isActive).length || '0'}</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col lg:flex-row gap-3 mb-10">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm thành viên theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5f9] border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="relative group min-w-[220px]">
          <Filter className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full h-12 pl-12 pr-10 rounded-full bg-[#f1f5f9] hover:bg-white border-transparent hover:border-slate-100 border transition-all text-xs font-bold text-slate-600 shadow-sm shadow-transparent hover:shadow-md appearance-none outline-none cursor-pointer uppercase tracking-wider"
          >
            <option value="All">TẤT CẢ VAI TRÒ</option>
            <option value="ADMIN">ADMIN</option>
            <option value="STAFF">STAFF</option>
            <option value="TEACHER">TEACHER</option>
            <option value="STUDENT">STUDENT</option>
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
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
                    transition={{ delay: idx * 0.05 }}
                    key={user.id}
                    className="group hover:bg-[#f1f5f9]/40 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
                          {user.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{user.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">ID: {user.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest",
                        user.role === 'ADMIN' ? "bg-rose-50 text-rose-600" :
                          user.role === 'STAFF' ? "bg-blue-50 text-blue-600" :
                            "bg-emerald-50 text-emerald-600"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-bold">
                        <Mail className="h-3.5 w-3.5 text-slate-300" /> {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-center gap-2">
                        {user.isActive ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Đang hoạt động</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-rose-400" />
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Đã khóa</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white hover:text-emerald-600 hover:shadow-md transition-all shadow-transparent">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-rose-50 hover:text-rose-600 hover:shadow-md transition-all shadow-transparent">
                          <Trash2 className="h-3.5 w-3.5" />
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
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-10 mt-12">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          className="p-3 text-slate-400 hover:text-slate-900 disabled:opacity-10 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Trang</span>
          <span className="h-10 min-w-[40px] px-3 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-sm font-black text-slate-900 shadow-sm">{currentPage}</span>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">/</span>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{totalPages || 1}</span>
        </div>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          className="p-3 text-slate-400 hover:text-slate-900 disabled:opacity-10 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
