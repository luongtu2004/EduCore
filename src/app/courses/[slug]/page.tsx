'use client';

import { 
  CheckCircle2, Clock, Star, Users, ArrowRight, 
  ChevronRight, BookOpen, GraduationCap, Trophy, 
  Sparkles, Calendar, ShieldCheck, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { ConsultationModal } from '@/components/modals/consultation-modal';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response: any = await api.get(`/crm/courses/${slug}`);
        if (response.success) {
          setCourse(response.data);
        }
      } catch (error) {
        console.error('Error fetching course detail:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
          <p className="text-sm font-bold text-gray-400">Đang tải nội dung khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-slate-900">Không tìm thấy khóa học</h1>
            <p className="text-slate-500 font-medium">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
            <Button asChild className="bg-emerald-600">
              <a href="/courses">Quay lại danh sách</a>
            </Button>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-900">
          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent" />
          <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-500/5 blur-[100px]" />
          
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="max-w-3xl space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-black text-emerald-400 border border-emerald-500/20"
              >
                <Sparkles className="h-4 w-4" />
                KHÓA HỌC ĐÀO TẠO CHUYÊN SÂU
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-black text-white lg:text-7xl tracking-tight leading-tight"
              >
                {course.title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-400 font-medium leading-relaxed"
              >
                {course.description}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-8 items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 ring-1 ring-white/10">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thời lượng</p>
                    <p className="text-white font-bold">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 ring-1 ring-white/10">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sĩ số tối đa</p>
                    <p className="text-white font-bold">15 học viên/lớp</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400 ring-1 ring-white/10">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đánh giá</p>
                    <p className="text-white font-bold">4.9/5.0 (200+ review)</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* LEFT: COURSE DETAILS */}
              <div className="lg:col-span-8 space-y-16">
                <div className="space-y-8">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                    Giới thiệu khóa học
                  </h2>
                  <div className="prose prose-slate prose-lg max-w-none font-medium text-slate-600 leading-relaxed">
                    {course.content || 'Nội dung khóa học đang được cập nhật...'}
                  </div>
                </div>

                <div className="space-y-8">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <div className="h-8 w-1 bg-blue-500 rounded-full" />
                    Bạn sẽ nhận được gì?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      'Lộ trình cá nhân hóa bằng AI 24/7',
                      'Giảng viên chuyên môn 8.5+ IELTS trực tiếp giảng dạy',
                      'Hỗ trợ chấm chữa bài Writing không giới hạn',
                      'Môi trường học tập hiện đại, đầy đủ tiện nghi',
                      'Cam kết đầu ra bằng văn bản pháp lý',
                      'Tặng bộ giáo trình và tài liệu độc quyền'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-emerald-50 transition-all">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-bold text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ / MOCK CURRICULUM */}
                <div className="space-y-8">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <div className="h-8 w-1 bg-purple-500 rounded-full" />
                    Nội dung đào tạo
                  </h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Chương 1: Xây dựng nền tảng vững chắc', duration: 'Tuần 1-4' },
                      { title: 'Chương 2: Phát triển kỹ năng chuyên sâu', duration: 'Tuần 5-8' },
                      { title: 'Chương 3: Chiến thuật phòng thi & Mẹo đạt điểm cao', duration: 'Tuần 9-12' },
                    ].map((chapter, idx) => (
                      <div key={idx} className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                            {idx + 1}
                          </div>
                          <span className="font-black text-slate-800">{chapter.title}</span>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{chapter.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: STICKY SIDEBAR CARD */}
              <div className="lg:col-span-4">
                <div className="sticky top-32 rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl shadow-slate-200 overflow-hidden">
                   <div className="p-10 space-y-8">
                      <div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Học phí trọn gói</p>
                        <p className="text-4xl font-black text-emerald-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                        </p>
                      </div>

                      <div className="space-y-5">
                         <div className="flex items-center justify-between py-3 border-b border-gray-50">
                            <div className="flex items-center gap-3 text-slate-500 font-bold">
                               <Calendar className="h-5 w-5" /> <span>Lịch khai giảng</span>
                            </div>
                            <span className="font-black text-slate-900">Thứ 2 hàng tuần</span>
                         </div>
                         <div className="flex items-center justify-between py-3 border-b border-gray-50">
                            <div className="flex items-center gap-3 text-slate-500 font-bold">
                               <ShieldCheck className="h-5 w-5" /> <span>Cam kết</span>
                            </div>
                            <span className="font-black text-emerald-600">Hoàn học phí</span>
                         </div>
                         <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3 text-slate-500 font-bold">
                               <Trophy className="h-5 w-5" /> <span>Chứng chỉ</span>
                            </div>
                            <span className="font-black text-slate-900">EduCore Certificate</span>
                         </div>
                      </div>

                      <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-lg font-black shadow-xl shadow-emerald-200 gap-3 hover:scale-105 active:scale-95 transition-all border-none"
                      >
                        ĐĂNG KÝ TƯ VẤN <ArrowRight className="h-5 w-5" />
                      </Button>
                      
                      <p className="text-center text-xs font-medium text-slate-400 italic">
                        * Hoàn tiền 100% nếu không đạt kết quả cam kết
                      </p>
                   </div>
                   
                   <div className="bg-slate-50 p-8 text-center border-t border-gray-100">
                      <p className="text-sm font-bold text-slate-600">Cần hỗ trợ nhanh?</p>
                      <p className="text-lg font-black text-emerald-600">Hotline: 0912 345 678</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      {/* CONSULTATION MODAL */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseName={course.title}
      />
    </div>
  );
}
