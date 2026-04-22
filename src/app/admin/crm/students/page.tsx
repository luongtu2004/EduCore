'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap, Search, Filter,
  Mail, Phone, Clock, Sparkles,
  BookOpen, LayoutGrid, CheckCircle2,
  X, ChevronRight, Home, Loader2, MoreVertical,
  Trash2, User, UserPlus, ChevronLeft, Award, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/modals/confirm-modal';

export default function CRMStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: '' });
  const [confirmComplete, setConfirmComplete] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: '' });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/crm/students');
      if (response.success) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách học viên:', error);
      toast.error('Không thể tải danh sách học viên.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response: any = await api.delete(`/crm/students/${id}`);
      if (response.success) {
        toast.success('Đã xóa học viên thành công');
        setStudents(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      toast.error('Lỗi khi xóa học viên');
    } finally {
      setConfirmDelete({ isOpen: false, id: '' });
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const response: any = await api.patch(`/crm/students/${id}/status`, { status: 'COMPLETED' });
      if (response.success) {
        toast.success('Đã đánh dấu hoàn thành khóa học');
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'COMPLETED' } : s));
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    } finally {
      setConfirmComplete({ isOpen: false, id: '' });
    }
  };

  const filteredStudents = students.filter(student => 
    student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone?.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans antialiased selection:bg-emerald-500/30">
      <div className="p-8 space-y-8">
        
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <Link href="/admin" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5"><Home className="h-3 w-3" /> Dashboard</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link href="/admin/crm" className="hover:text-emerald-500 transition-colors">CRM</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-white">Học viên</span>
        </nav>

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight italic mb-2">Học viên (Students)</h1>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">QUẢN LÝ LỘ TRÌNH VÀ TIẾN ĐỘ HỌC TẬP</p>
          </div>
          <Button 
            className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 font-black text-[11px] transition-all gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] uppercase tracking-widest border-none"
          >
            <UserPlus className="h-4 w-4" /> THÊM HỌC VIÊN
          </Button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col lg:flex-row items-center gap-4 mb-10 relative">
          <div className="flex-1 relative group w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-white/10 focus:bg-slate-950 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-200 placeholder:text-slate-600 outline-none shadow-inner"
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-xl overflow-hidden relative">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest w-[30%]">Học viên</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Khóa học</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Ngày nhập học</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto opacity-20" />
                    </td>
                  </tr>
                ) : paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student, idx) => (
                    <tr key={student.id} className="group hover:bg-slate-900/50 transition-all relative">
                      <td className="px-8 py-6 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-emerald-500 rounded-r-full group-hover:h-8 transition-all duration-300" />
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all border border-white/5 shadow-inner">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-wider">{student.fullName}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-1 tracking-widest">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-emerald-500/70" />
                          {student.courseName || 'IELTS Foundation'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center">
                          {student.status === 'COMPLETED' ? (
                            <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 justify-center bg-blue-500/10 text-blue-500 border-blue-500/20 w-[130px]">
                              <Award className="h-3 w-3" /> Đã hoàn thành
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 justify-center bg-emerald-500/10 text-emerald-500 border-emerald-500/20 w-[130px]">
                              <CheckCircle2 className="h-3 w-3" /> Đang học
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="text-xs font-bold text-slate-500">
                          {new Date(student.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <Link href={`/admin/crm/students/${student.id}`}>
                            <Button 
                              size="icon" variant="ghost" 
                              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {student.status !== 'COMPLETED' && (
                            <Button 
                              onClick={() => setConfirmComplete({ isOpen: true, id: student.id })}
                              size="icon" variant="ghost" 
                              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-blue-500/20 text-slate-500 hover:text-blue-400 transition-all"
                              title="Đánh dấu hoàn thành"
                            >
                              <Award className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            onClick={() => setConfirmDelete({ isOpen: true, id: student.id })}
                            size="icon" variant="ghost" 
                            className="h-10 w-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                            title="Xóa học viên"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <GraduationCap className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-xs uppercase font-black tracking-widest">Không tìm thấy học viên nào</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="px-8 py-6 bg-white/5 flex items-center justify-between border-t border-white/5">
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
              Hiển thị {paginatedStudents.length} / {filteredStudents.length} dữ liệu
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" size="icon" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="h-9 w-9 rounded-full border-white/5 bg-white/5 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" size="icon"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="h-9 w-9 rounded-full border-white/5 bg-white/5 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={confirmDelete.isOpen}
          onClose={() => setConfirmDelete({ isOpen: false, id: '' })}
          onConfirm={() => handleDelete(confirmDelete.id)}
          title="Xóa học viên"
          message="Bạn có chắc chắn muốn xóa học viên này? Hành động này không thể hoàn tác."
          confirmText="Xóa học viên"
          cancelText="Hủy"
          type="danger"
        />

        <ConfirmModal
          isOpen={confirmComplete.isOpen}
          onClose={() => setConfirmComplete({ isOpen: false, id: '' })}
          onConfirm={() => handleComplete(confirmComplete.id)}
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
