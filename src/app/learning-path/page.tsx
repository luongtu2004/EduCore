'use client';

import { 
  CheckCircle2, Star, Target, Zap, 
  ChevronRight, BookOpen, GraduationCap, 
  Trophy, Sparkles, ArrowRight, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface LearningStep {
  id: string;
  order: number;
  title: string;
  description: string;
  target: string;
  features: string[];
  color: string;
}

interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  steps: LearningStep[];
}

export default function LearningPathPage() {
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<LearningPath | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await api.get('/learning-paths');
        // Lấy lộ trình IELTS đầu tiên
        if (response.success && response.data.length > 0) {
          setPath(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching learning path:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />
      
      <main className="flex-1 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 border border-emerald-100 shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              DỮ LIỆU ĐƯỢC ĐỔ TỪ HỆ THỐNG BACKEND
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
            >
              {path?.title || 'Đường tới Thành công'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto max-w-2xl text-xl font-medium text-slate-500 leading-relaxed"
            >
              {path?.description || 'Chúng tôi không dùng chung một lộ trình cho tất cả. EduCore sử dụng công nghệ phân tích năng lực để thiết kế con đường ngắn nhất dành riêng cho bạn.'}
            </motion.p>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="relative px-6 lg:px-8 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
               <p className="text-sm font-bold text-gray-400">Đang tải dữ liệu thực tế...</p>
            </div>
          ) : (
            <div className="mx-auto max-w-5xl">
              <div className="relative space-y-24">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 hidden md:block opacity-20" />

                {path?.steps.map((level, idx) => (
                  <motion.div 
                    key={level.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-gray-50 shadow-2xl z-10">
                       <div className={`h-4 w-4 rounded-full bg-${level.color}-500 z-20`} />
                    </div>

                    <div className="w-full md:w-[45%]">
                       <div className="group relative rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-100 border border-gray-100 transition-all hover:shadow-2xl hover:shadow-emerald-100">
                          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-${level.color}-50 text-${level.color}-600 font-black text-xl mb-6`}>
                             0{level.order}
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 mb-4">{level.title}</h3>
                          <p className="text-slate-500 font-medium leading-relaxed mb-6">
                             {level.description}
                          </p>
                          
                          <div className="p-5 rounded-2xl bg-gray-50 mb-6 border-l-4 border-emerald-500">
                             <p className="font-black text-sm text-slate-900 uppercase tracking-widest">
                                {level.target}
                             </p>
                          </div>

                          <ul className="space-y-3">
                             {level.features.map(f => (
                               <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  {f}
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                    <div className="hidden md:block w-[45%]" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* CALL TO ACTION */}
        <section className="mt-40 px-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="mx-auto max-w-4xl rounded-[3rem] bg-slate-900 p-12 lg:p-20 text-center relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/10 blur-[100px]" />
              <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-500/10 blur-[100px]" />
              
              <div className="relative z-10 space-y-8">
                 <h2 className="text-4xl font-black text-white lg:text-5xl">
                    Sẵn sàng bắt đầu <br /> 
                    <span className="text-emerald-400">Hành trình của riêng bạn?</span>
                 </h2>
                 <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto">
                    Đăng ký kiểm tra trình độ miễn phí và nhận bản thiết kế lộ trình cá nhân hóa ngay hôm nay.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                    <Button className="h-16 rounded-2xl px-10 text-lg font-black bg-gradient-to-r from-emerald-500 to-green-600 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all gap-2">
                       NHẬN LỘ TRÌNH MIỄN PHÍ <ArrowRight className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" className="h-16 rounded-2xl px-10 text-lg font-black text-white border-white/20 hover:bg-white/10">
                       CHÁT VỚI TƯ VẤN VIÊN
                    </Button>
                 </div>
              </div>
           </motion.div>
        </section>

      </main>

      <PublicFooter />

      <style jsx global>{`
        .bg-emerald-500 { background-color: #10b981; }
        .bg-blue-500 { background-color: #3b82f6; }
        .bg-purple-500 { background-color: #8b5cf6; }
        .bg-orange-500 { background-color: #f97316; }
        .text-emerald-600 { color: #059669; }
        .text-blue-600 { color: #2563eb; }
        .text-purple-600 { color: #7c3aed; }
        .text-orange-600 { color: #ea580c; }
        .bg-emerald-50 { background-color: #ecfdf5; }
        .bg-blue-50 { background-color: #eff6ff; }
        .bg-purple-50 { background-color: #f5f3ff; }
        .bg-orange-50 { background-color: #fff7ed; }
        .text-emerald-500 { color: #10b981; }
        .text-blue-500 { color: #3b82f6; }
        .text-purple-500 { color: #8b5cf6; }
        .text-orange-500 { color: #f97316; }
      `}</style>
    </div>
  );
}
