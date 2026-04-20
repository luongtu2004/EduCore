'use client';

import { 
  BookOpen, Star, Clock, CheckCircle, 
  ArrowRight, Loader2, Sparkles, Filter
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response: any = await api.get('/crm/courses');
        if (response.success) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PublicHeader />
      
      <main className="flex-1 pb-24 pt-32 lg:pt-48">
        <div className="mx-auto max-w-7xl px-6">
          
          {/* HEADER SECTION */}
          <div className="mb-20 text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 border border-emerald-100 uppercase tracking-widest shadow-sm"
            >
              <Sparkles className="h-3 w-3" />
              Khám phá năng lực của bạn
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-tight text-slate-900 md:text-7xl"
            >
              Hệ thống <span className="text-emerald-600 italic">Khóa học</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto max-w-2xl text-xl font-medium text-slate-500 leading-relaxed"
            >
              Từ IELTS, TOEIC đến Tiếng Anh giao tiếp công sở. Dữ liệu thực tế được quản lý tập trung từ hệ thống EduCore.
            </motion.p>
          </div>

          {/* COURSES GRID */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
               <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
               <p className="text-sm font-bold text-gray-400 italic">Đang tải dữ liệu từ MongoDB...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, idx) => (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative flex flex-col rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-2 border border-gray-100 cursor-pointer overflow-hidden"
                >
                  <Link href={`/courses/${course.slug}`} className="absolute inset-0 z-10" />
                  <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{course.title}</h3>
                  
                  <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> 
                      Hot Course
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Clock className="h-3.5 w-3.5" /> 
                      {course.duration}
                    </span>
                  </div>

                  <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="space-y-4 mb-10">
                     {course.content?.split(',').slice(0, 3).map((feat: string) => (
                       <div key={feat} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                             <CheckCircle className="h-3 w-3 text-emerald-600" />
                          </div>
                          {feat.trim()}
                       </div>
                     ))}
                  </div>

                  <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Học phí ưu đãi</p>
                      <p className="text-2xl font-black text-emerald-600 tracking-tight">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                      </p>
                    </div>
                    <Button className="h-12 w-12 rounded-xl p-0 bg-slate-900 group-hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200 relative z-20">
                      <ArrowRight className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
