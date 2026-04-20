'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Plus, Edit, Trash2, ChevronRight, 
  BookOpen, Clock, PlayCircle, Layers,
  ChevronDown, ChevronUp, MoreVertical,
  ArrowLeft, Loader2, GripVertical, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { LessonModal } from '@/components/modals/lesson-modal';
import { ChapterModal } from '@/components/modals/chapter-modal';

export default function CourseCurriculumPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [editingLesson, setEditingLesson] = useState<any>(null);

  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get(`/cms/courses/${id}`);
      if (response.success) {
        setCourse(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu khóa học:', error);
      toast.error('Không thể tải dữ liệu khóa học.');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddChapter = () => {
    setEditingChapter(null);
    setIsChapterModalOpen(true);
  };

  const openEditChapter = (chapter: any) => {
    setEditingChapter(chapter);
    setIsChapterModalOpen(true);
  };

  const deleteChapter = async (chapterId: string) => {
    if (!confirm('Xóa chương này sẽ xóa tất cả bài học bên trong. Tiếp tục?')) return;
    try {
      await api.delete(`/cms/courses/chapters/${chapterId}`);
      toast.success('Đã xóa chương!');
      fetchCourseData();
    } catch (error) {
      toast.error('Lỗi khi xóa chương.');
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài học này?')) return;
    try {
      await api.delete(`/cms/courses/lessons/${lessonId}`);
      toast.success('Đã xóa bài học!');
      fetchCourseData();
    } catch (error) {
      toast.error('Lỗi khi xóa bài học.');
    }
  };

  const openAddLesson = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setEditingLesson(null);
    setIsLessonModalOpen(true);
  };

  const openEditLesson = (chapterId: string, lesson: any) => {
    setSelectedChapterId(chapterId);
    setEditingLesson(lesson);
    setIsLessonModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải giáo trình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 pb-32">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin/courses" className="hover:text-emerald-500 transition-colors">QUẢN LÝ KHÓA HỌC</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">GIÁO TRÌNH CHI TIẾT</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">
              {course?.title}
            </h1>
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 rounded-full bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">
                 Giáo trình đào tạo
               </span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 {course?.chapters?.length || 0} Chương • {course?.chapters?.reduce((acc: number, cur: any) => acc + (cur.lessons?.length || 0), 0)} Bài học
               </span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={openAddChapter}
          className="h-12 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-xl shadow-slate-200 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> THÊM CHƯƠNG MỚI
        </Button>
      </div>

      {/* CHAPTERS LIST */}
      <div className="max-w-4xl mx-auto space-y-10">
        {course?.chapters?.length > 0 ? (
          course.chapters.map((chapter: any, cIdx: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cIdx * 0.1 }}
              key={chapter.id} 
              className="relative"
            >
              {/* Chapter Header */}
              <div className="flex items-center justify-between mb-6 group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-500/20">
                    {cIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{chapter.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">CHƯƠNG {cIdx + 1}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                   <Button 
                     onClick={() => openAddLesson(chapter.id)}
                     variant="ghost" size="sm" className="h-9 px-4 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 text-[10px] font-black uppercase tracking-widest"
                   >
                     + BÀI HỌC
                   </Button>
                   <Button 
                     onClick={() => openEditChapter(chapter)}
                     variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100"
                   >
                     <Edit className="h-4 w-4 text-slate-400" />
                   </Button>
                   <Button 
                     onClick={() => deleteChapter(chapter.id)}
                     variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600"
                   >
                     <Trash2 className="h-4 w-4 text-slate-400 hover:text-rose-600" />
                   </Button>
                </div>
              </div>

              {/* Lessons List */}
              <div className="space-y-3 pl-14">
                {chapter.lessons?.length > 0 ? (
                  chapter.lessons.map((lesson: any, lIdx: number) => (
                    <div 
                      key={lesson.id}
                      className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <PlayCircle className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                             <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                               <Clock className="h-2.5 w-2.5" /> {lesson.duration || '--'}
                             </span>
                             {lesson.videoUrl && (
                               <span className="text-[9px] font-bold text-blue-500 uppercase flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded">
                                 VIDEO
                               </span>
                             )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <Button 
                          onClick={() => openEditLesson(chapter.id, lesson)}
                          variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100"
                        >
                          <Edit className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                        <Button 
                          onClick={() => deleteLesson(lesson.id)}
                          variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-slate-400 hover:text-rose-600" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Chưa có bài học nào trong chương này</p>
                    <button 
                      onClick={() => openAddLesson(chapter.id)}
                      className="mt-3 text-[10px] font-black text-emerald-600 uppercase hover:underline"
                    >
                      + THÊM BÀI HỌC ĐẦU TIÊN
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-40 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <Layers className="h-10 w-10 text-slate-200" />
             </div>
             <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Hệ thống bài giảng trống</p>
             <p className="text-xs text-slate-400 font-bold mt-2 italic">Bắt đầu bằng việc thêm chương mới cho khóa học</p>
          </div>
        )}
      </div>

      <LessonModal 
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSuccess={fetchCourseData}
        chapterId={selectedChapterId}
        lesson={editingLesson}
      />

      <ChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        onSuccess={fetchCourseData}
        courseId={id as string}
        chapter={editingChapter}
      />
    </div>
  );
}
