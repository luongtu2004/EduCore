'use client';

import { 
  ArrowRight, BookOpen, Users, Star, 
  CheckCircle, Play, Sparkles, GraduationCap, 
  Building2, Trophy, Clock, Image as ImageIcon, MessageCircle,
  Loader2, Zap, HelpCircle, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
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
  const [banners, setBanners] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, bannersRes, faqsRes, testimonialsRes]: any = await Promise.all([
          api.get('/crm/courses'),
          api.get('/cms/banners'),
          api.get('/cms/faqs'),
          api.get('/cms/testimonials')
        ]);
        
        if (coursesRes.success) setCourses(coursesRes.data);
        if (bannersRes.success) {
          const activeBanners = bannersRes.data.filter((b: any) => b.isActive);
          setBanners(activeBanners);
        }
        if (faqsRes.success) setFaqs(faqsRes.data);
        if (testimonialsRes.success) {
          setTestimonials(testimonialsRes.data.filter((t: any) => t.isActive));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        {/* DYNAMIC BANNER SLIDER */}
        <section className="relative h-[85vh] lg:h-[95vh] overflow-hidden bg-slate-900">
           <AnimatePresence mode="wait">
              {banners.length > 0 ? (
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                   {/* Background Image with Overlay */}
                   <div className="absolute inset-0 z-0">
                      <img 
                        src={banners[currentBanner].imageUrl} 
                        alt={banners[currentBanner].title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                   </div>

                   {/* Content */}
                   <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex flex-col justify-center">
                      <div className="max-w-3xl space-y-8">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-black text-emerald-400 border border-emerald-500/20 backdrop-blur-md"
                        >
                          <Sparkles className="h-4 w-4" />
                          HỆ THỐNG ĐÀO TẠO TIẾNG ANH CAO CẤP
                        </motion.div>

                        <motion.h1
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-6xl font-black tracking-tight text-white lg:text-8xl leading-tight uppercase italic"
                        >
                          {banners[currentBanner].title.split(' ').slice(0, -2).join(' ')} <br />
                          <span className="text-emerald-500">{banners[currentBanner].title.split(' ').slice(-2).join(' ')}</span>
                        </motion.h1>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="text-xl text-slate-300 font-medium leading-relaxed max-w-2xl"
                        >
                          {banners[currentBanner].subtitle}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="flex flex-wrap gap-5"
                        >
                          <Link href={banners[currentBanner].link || '/courses'}>
                            <Button size="lg" className="h-16 rounded-2xl px-10 text-lg font-black shadow-2xl shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 border-none gap-3">
                              KHÁM PHÁ NGAY <ArrowRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                   </div>
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
                </div>
              )}
           </AnimatePresence>

           {/* SLIDER DOTS */}
           <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBanner(idx)}
                  className={cn(
                    "h-2 transition-all rounded-full",
                    currentBanner === idx ? "w-12 bg-emerald-500" : "w-2 bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
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
              {testimonials.length > 0 ? (
                testimonials.map((review, idx) => (
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
                ))
              ) : (
                <div className="col-span-3 py-20 text-center opacity-30">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Đang cập nhật câu chuyện thành công...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* DYNAMIC FAQs SECTION - NEW */}
        <section className="bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/3 space-y-6">
                <div className="h-1.5 w-12 bg-emerald-500 rounded-full" />
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-[1.1]">
                  Giải đáp <br /> Thắc mắc <br /> thường gặp
                </h2>
                <p className="text-slate-500 font-bold leading-relaxed">
                  Bạn vẫn còn băn khoăn? Đừng ngần ngại liên hệ với chúng tôi để được tư vấn lộ trình học tập miễn phí.
                </p>
                <div className="pt-4">
                  <Link href="/contact">
                    <Button className="rounded-full h-14 px-8 font-black text-xs uppercase tracking-widest gap-2 bg-slate-900 shadow-2xl shadow-slate-200">
                      Liên hệ tư vấn ngay <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:w-2/3 space-y-4">
                {faqs.length > 0 ? (
                  faqs.filter((f: any) => f.isActive).map((faq: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
                    >
                      <div className="flex items-start gap-4">
                         <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                            <HelpCircle className="h-4 w-4" />
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-slate-800 leading-tight mb-2 uppercase italic">{faq.question}</h4>
                            <p className="text-slate-500 font-medium leading-relaxed italic">
                              {faq.answer}
                            </p>
                         </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                   <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                      <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Đang cập nhật nội dung giải đáp...</p>
                   </div>
                )}
              </div>
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
