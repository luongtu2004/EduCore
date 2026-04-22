'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Search, Filter, Loader2,
  BookOpen, Clock, DollarSign, BarChart,
  ChevronRight, ChevronLeft, MoreVertical, Star, ChevronDown, Home, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseModal } from '@/components/modals/course-modal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/courses');
      if (response.success) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải khóa học:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
    try {
      await api.delete(`/cms/courses/${id}`);
      setCourses(courses.filter(c => c.id !== id));
      toast.success('Đã xóa khóa học thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Lỗi khi xóa khóa học.');
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const [levelFilter, setLevelFilter] = useState('All');

  const filteredCourses = courses.filter(c => {
    const matchesSearch = (c.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (c.slug?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'All' || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">QUẢN LÝ KHÓA HỌC</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">QUẢN LÝ KHÓA HỌC</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">HỆ THỐNG HỌC LIỆU THÔNG MINH EDUCORE</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="h-12 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/5 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> THÊM KHÓA HỌC
        </Button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col lg:flex-row gap-3 mb-10">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm kiếm khóa học theo tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5f9] border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="relative group min-w-[200px]">
          <Filter className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full h-12 pl-12 pr-10 rounded-full bg-[#f1f5f9] hover:bg-white border-transparent hover:border-slate-100 border transition-all text-xs font-bold text-slate-600 shadow-sm shadow-transparent hover:shadow-md appearance-none outline-none cursor-pointer uppercase tracking-wider"
          >
            <option value="All">TẤT CẢ TRÌNH ĐỘ</option>
            {['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced'].map(l => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>

      {/* COURSES GRID - RESTORED GRID VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-[280px] rounded-[2.5rem] bg-white border border-slate-100 animate-pulse" />
          ))
        ) : paginatedCourses.length > 0 ? (
          paginatedCourses.map((course, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={course.id}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(course)}
                      variant="outline" size="icon" className="h-9 w-9 rounded-full border-slate-100 bg-white hover:bg-slate-900 hover:border-slate-900 hover:text-white text-slate-400 transition-all shadow-sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deleteCourse(course.id)}
                      variant="outline" size="icon" className="h-9 w-9 rounded-full border-slate-100 bg-white hover:bg-red-500 hover:border-red-500 hover:text-white text-slate-400 transition-all shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Link
                      href={`/admin/courses/${course.id}/curriculum`}
                      className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-100 bg-white hover:bg-emerald-600 hover:border-emerald-600 hover:text-white text-slate-400 transition-all shadow-sm"
                    >
                      <Layers className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{course.title}</h3>
                <p className="text-xs font-medium text-slate-400 line-clamp-2 mb-6">{course.description || 'Chưa có mô tả cho khóa học này.'}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {course.level && (
                    <span className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 flex items-center gap-1.5">
                      <BarChart className="h-3 w-3 text-slate-400" /> {course.level}
                    </span>
                  )}
                  {course.duration && (
                    <span className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-400" /> {course.duration}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Học phí</p>
                  <p className="text-lg font-black text-emerald-600">{course.price.toLocaleString()} VNĐ</p>
                </div>
                {course.isActive ? (
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-[10px] font-black text-slate-900 uppercase">Active</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-black text-slate-300 uppercase">Inactive</span>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Không tìm thấy khóa học</p>
          </div>
        )}
      </div>

      {/* PAGINATION BAR */}
      {totalPages > 1 && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-[#f1f5f9]/50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Hiển thị {paginatedCourses.length} / {filteredCourses.length} khóa học
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
      )}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCourses}
        course={editingCourse}
      />
    </div>
  );
}
