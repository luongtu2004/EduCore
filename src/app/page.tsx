'use client';

import { 
  ArrowRight, BookOpen, Users, Star, 
  CheckCircle, Play, Sparkles, GraduationCap, 
  Building2, Trophy, Clock, Image as ImageIcon, MessageCircle,
  Loader2, Zap
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const stats = [
  { label: 'Học viên tin dùng', value: '10,000+', icon: Users, color: 'text-blue-400' },
  { label: 'Cơ sở toàn quốc', value: '15+', icon: Building2, color: 'text-emerald-400' },
  { label: 'Tỉ lệ đỗ chứng chỉ', value: '98%', icon: Trophy, color: 'text-orange-400' },
  { label: 'Năm kinh nghiệm', value: '10 Năm', icon: Clock, color: 'text-purple-400' },
];

export default function Home() {
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
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-32 pb-24 lg:pt-56 lg:pb-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-green-50 rounded-full blur-[100px] opacity-60" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
              <motion.div 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="relative z-10 space-y-10"
              >
                <motion.div 
                  variants={fadeInUp}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-100/50 px-4 py-2 text-sm font-black text-emerald-800 shadow-sm border border-emerald-200"
                >
                  <Sparkles className="h-4 w-4" />
                  HỆ THỐNG ĐÀO TẠO TIẾNG ANH CAO CẤP
                </motion.div>
                
                <motion.h1 
                  variants={fadeInUp}
                  className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl leading-[1.1]"
                >
                  Chinh phục IELTS <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent italic">Nâng tầm sự nghiệp</span>
                </motion.h1 >
                
                <motion.p 
                  variants={fadeInUp}
                  className="max-w-xl text-lg md:text-xl leading-relaxed text-slate-600 font-medium"
                >
                  Hệ thống đào tạo Anh ngữ cá nhân hóa bằng AI, lộ trình tối ưu và cam kết đầu ra bằng văn bản. Chúng tôi đồng hành cùng bạn trên con đường kiến tạo tương lai.
                </motion.p>
                
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
                  <Link href="/contact">
                    <Button size="lg" className="h-16 rounded-2xl px-10 text-lg font-black shadow-2xl shadow-emerald-200 bg-gradient-to-r from-emerald-600 to-green-600 gap-3 transition-all hover:scale-105 active:scale-95">
                      TƯ VẤN LỘ TRÌNH <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button size="lg" variant="outline" className="h-16 rounded-2xl px-10 text-lg font-black border-2 border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-900">
                      CÁC KHÓA HỌC
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Visual - HERO IMAGE */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative lg:ml-12"
              >
                <div className="relative aspect-square rounded-[4rem] bg-emerald-50 overflow-hidden shadow-2xl ring-1 ring-emerald-100 group">
                    <img 
                      src="/images/hero.png" 
                      alt="EduCore Hero" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* COURSES SECTION - DYNAMIC FROM MONGODB */}
        <section id="courses" className="bg-gray-50 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black text-slate-900">Khóa học tiêu biểu</h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                Chọn lộ trình phù hợp với mục tiêu của bạn. Dữ liệu thực tế được quản lý bởi hệ thống.
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="text-sm font-bold text-gray-400 italic">Đang tải dữ liệu từ MongoDB...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {courses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-100 transition-all border border-gray-100 flex flex-col cursor-pointer relative overflow-hidden"
                  >
                    <Link href={`/courses/${course.slug}`} className="absolute inset-0 z-10" />
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{course.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-orange-400">
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{course.duration}</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 flex-1 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="pt-6 border-t border-gray-50 space-y-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Học phí trọn gói</p>
                          <p className="text-xl font-black text-emerald-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</p>
                        </div>
                      </div>
                      <Button className="w-full h-12 rounded-xl bg-slate-900 hover:bg-emerald-600 font-bold transition-colors group-hover:shadow-lg relative z-20">
                        Đăng ký ngay <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-900" />
           <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
             <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
                {stats.map((stat, idx) => (
                  <motion.div 
                    key={stat.label} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center space-y-4"
                  >
                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                       <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-5xl font-black text-white tracking-tighter italic">{stat.value}</p>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
             </div>
           </div>
        </section>

        {/* STUDENT REVIEWS SECTION - SOCIAL PROOF */}
        <section className="bg-slate-50 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Câu chuyện thành công</h2>
              <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto">
                Hơn 10,000+ học viên đã đạt được mục tiêu cùng EduCore. Dưới đây là những câu chuyện tiêu biểu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Nguyễn Thu Trang', score: '8.0 IELTS', text: 'Nhờ lộ trình cá nhân hóa, mình đã vượt qua nỗi sợ Speaking và đạt điểm số mong đợi chỉ sau 3 tháng.', image: '/images/student-1.png' },
                { name: 'Trần Minh Quân', score: '7.5 IELTS', text: 'Hệ thống học tập cực kỳ hiện đại, đội ngũ giáo viên nhiệt tình và luôn hỗ trợ kịp thời.', image: '/images/student-2.png' },
                { name: 'Lê Thảo Vy', score: '8.5 IELTS', text: 'Chưa từng nghĩ mình có thể đạt 8.5 Listening. Bí quyết Shadowing từ EduCore thực sự thần kỳ!', image: '/images/student-3.png' },
              ].map((review, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100 flex flex-col gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-slate-200 overflow-hidden ring-4 ring-emerald-50">
                      <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tight">{review.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">{review.score}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 font-bold leading-relaxed italic">"{review.text}"</p>
                  <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Đã xác thực kết quả
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE WITH IMAGE */}
        <section className="bg-white py-24 lg:py-40 overflow-hidden">
           <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <motion.div 
                   initial={{ opacity: 0, x: -50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="relative"
                 >
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                       <img src="/images/feature.png" alt="AI Technology" className="w-full h-full object-cover" />
                    </div>
                 </motion.div>
                 
                 <div className="space-y-8">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight">
                       Ứng dụng công nghệ AI <br /> 
                       <span className="text-emerald-600">Cá nhân hóa việc học</span>
                    </h2>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                       Chúng tôi không chỉ dạy tiếng Anh, chúng tôi tối ưu hóa cách bạn học. Hệ thống AI theo dõi từng lỗi sai, phân tích điểm mạnh và tự động điều chỉnh lộ trình để bạn đạt kết quả nhanh nhất.
                    </p>
                    <Link href="/test-trinh-do">
                      <Button className="h-14 rounded-xl px-8 bg-slate-900 font-black text-xs tracking-widest uppercase gap-3">
                         BẮT ĐẦU TEST AI NGAY <Zap className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
