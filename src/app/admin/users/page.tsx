'use client';

import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, MoreHorizontal, 
  ShieldCheck, Mail, Phone, Lock, 
  Trash2, Edit, CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users'); // Hoặc endpoint tương đương
        setUsers(response.data);
      } catch (error) {
        console.error('Lỗi khi tải người dùng:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hệ thống người dùng</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Quản lý tài khoản, phân quyền và trạng thái hoạt động của nhân viên.</p>
        </div>
        <Button className="h-12 rounded-2xl bg-slate-900 text-white px-6 font-bold shadow-xl shadow-slate-200 gap-2 hover:scale-105 transition-all">
          <UserPlus className="h-5 w-5" /> Thêm thành viên
        </Button>
      </div>

      {/* STATS MINI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
               <Users className="h-6 w-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng thành viên</p>
               <p className="text-xl font-black text-slate-900">{users.length || '--'}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quản trị viên (Admin)</p>
               <p className="text-xl font-black text-slate-900">{users.filter(u => u.role === 'ADMIN').length || '0'}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
               <Lock className="h-6 w-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài khoản bị khóa</p>
               <p className="text-xl font-black text-slate-900">{users.filter(u => !u.isActive).length || '0'}</p>
            </div>
         </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm thành viên theo tên hoặc email..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thành viên</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Liên hệ</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">Đang tải danh sách...</td></tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                         {user.fullName?.charAt(0) || 'U'}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900">{user.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">ID: {user.id.slice(-6)}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <span className={cn(
                       "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-inset",
                       user.role === 'ADMIN' ? "bg-red-50 text-red-600 ring-red-100/50" : "bg-blue-50 text-blue-600 ring-blue-100/50"
                     )}>
                        {user.role}
                     </span>
                  </td>
                  <td className="px-6 py-6 space-y-1">
                     <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Mail className="h-3 w-3" /> {user.email}
                     </div>
                  </td>
                  <td className="px-6 py-6">
                     <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-xs font-bold text-emerald-600">Hoạt động</span></>
                        ) : (
                          <><XCircle className="h-4 w-4 text-red-500" /><span className="text-xs font-bold text-red-600">Bị khóa</span></>
                        )}
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                     </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">Không có người dùng nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
