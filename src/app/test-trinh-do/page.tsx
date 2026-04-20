'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, ChevronRight, Zap, Target, Brain, 
  Award, ArrowRight, Loader2, User, BookOpen, Clock, 
  Flag, Pencil, Headphones, Globe, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import api from '@/lib/axios';

const sectionIcons: any = {
  foundation: <Flag className="h-6 w-6" />,
  skills: <Headphones className="h-6 w-6" />,
  goal: <Target className="h-6 w-6" />,
  general: <BookOpen className="h-6 w-6" />
};

export default function TestPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0); 
  const [answers, setAnswers] = useState<number[]>([]);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [result, setResult] = useState<any>(null);

  // FETCH QUESTIONS FROM CMS (BACKEND)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response: any = await api.get('/public/quiz/questions');
        if (response.success) {
          setQuestions(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải câu hỏi:', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleNext = (weightIndex: number) => {
    setAnswers([...answers, weightIndex]);
    setStep(step + 1);
  };

  // SUBMIT TO BACKEND FOR GRADING AND CRM LEAD CREATION
  const submitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: any = await api.post('/public/quiz/submit', {
        ...formData,
        answers
      });
      if (response.success) {
        setResult(response.data);
        setStep(questions.length + 2); // Final step
      }
    } catch (error: any) {
      console.error('Lỗi gửi kết quả:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const currentQuestion = questions[step - 1];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased">
      <PublicHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center py-20 pt-32 px-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200 text-center border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100%] -mr-10 -mt-10" />
                <div className="h-20 w-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-8 relative z-10">
                  <Brain className="h-10 w-10" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4 relative z-10">
                  Phân tích trình độ <span className="text-emerald-600">AI 2.0</span>
                </h1>
                <p className="text-slate-500 font-bold mb-10 leading-relaxed relative z-10">
                  Dữ liệu được quản lý bởi hệ thống CMS và phân tích bởi thuật toán AI của EduCore.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-10 relative z-10">
                   {[
                     { icon: <Target className="h-5 w-5 text-emerald-500" />, label: "Chính xác", val: "98%" },
                     { icon: <Zap className="h-5 w-5 text-yellow-500" />, label: "Câu hỏi", val: questions.length },
                     { icon: <Sparkles className="h-5 w-5 text-blue-500" />, label: "Real-time", val: "Active" },
                   ].map((item, i) => (
                     <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                        {item.icon}
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{item.label}</span>
                        <span className="text-xs font-black text-slate-900">{item.val}</span>
                     </div>
                   ))}
                </div>
                <Button 
                  onClick={() => setStep(1)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs tracking-[0.2em] uppercase py-8 rounded-2xl transition-all shadow-xl shadow-slate-200 border-none group"
                >
                  BẮT ĐẦU PHÂN TÍCH <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step >= 1 && step <= questions.length && currentQuestion && (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-slate-100"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 text-emerald-600 flex items-center justify-center border border-slate-100">
                      {sectionIcons[currentQuestion.section] || <BookOpen className="h-6 w-6" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Câu hỏi {step} / {questions.length}</span>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Phần: {currentQuestion.section}</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: `${(step - 1) * (100 / questions.length)}%` }}
                      animate={{ width: `${step * (100 / questions.length)}%` }}
                    />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-8">
                  {currentQuestion.text}
                </h2>
                <div className="space-y-3">
                  {currentQuestion.options.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleNext(currentQuestion.weights[idx])}
                      className="w-full p-6 text-left rounded-2xl border-2 border-slate-50 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 transition-all font-bold text-slate-600 group flex items-center justify-between"
                    >
                      <span className="text-sm">{option}</span>
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                         <ChevronRight className="h-4 w-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === questions.length + 1 && (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-slate-100 text-center"
              >
                 <div className="h-20 w-20 bg-yellow-50 rounded-3xl flex items-center justify-center text-yellow-600 mx-auto mb-8 animate-bounce">
                  <Award className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">Phân tích hoàn tất!</h2>
                <p className="text-slate-500 font-bold mb-10 leading-relaxed">
                  Để AI của EduCore tính điểm và gửi lộ trình học cá nhân hóa cho bạn, vui lòng hoàn tất thông tin cuối cùng.
                </p>
                <form onSubmit={submitTest} className="space-y-4 text-left">
                  <div className="relative">
                    <User className="absolute left-5 top-5 h-5 w-5 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="Họ và tên học viên"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Zap className="absolute left-5 top-5 h-5 w-5 text-slate-400" />
                    <input
                      required
                      type="tel"
                      placeholder="Số điện thoại Zalo"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all outline-none"
                    />
                  </div>
                  <Button 
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs tracking-[0.2em] uppercase py-8 rounded-2xl mt-6 border-none shadow-xl shadow-emerald-100"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "XEM KẾT QUẢ AI TÍNH TOÁN"}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === questions.length + 2 && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-slate-200 border border-emerald-100 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                
                <div className="flex flex-col md:flex-row gap-10 items-start">
                   {/* Left Col: Result */}
                   <div className="flex-1 space-y-8">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Phân tích bởi Backend AI</span>
                        <h2 className="text-4xl font-black text-emerald-600 tracking-tighter uppercase mt-2">
                          {result.level}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[10px] font-black text-slate-400">ĐIỂM HỆ THỐNG:</span>
                           <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{result.score}</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative">
                        <p className="text-slate-600 font-bold leading-relaxed italic text-sm">
                           EduCore đã ghi nhận kết quả của bạn và đẩy vào hệ thống CRM. Giảng viên chuyên môn sẽ liên hệ sớm nhất để tư vấn chi tiết.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Chúng tôi đang chuẩn bị lộ trình cho bạn...</p>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                             className="h-full bg-emerald-500"
                             initial={{ width: 0 }}
                             animate={{ width: '100%' }}
                             transition={{ duration: 2, repeat: Infinity }}
                           />
                        </div>
                      </div>
                   </div>

                   {/* Right Col: Course Suggestion */}
                   <div className="w-full md:w-72 space-y-6">
                      <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                         <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/40 transition-all" />
                         <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Khóa học gợi ý</p>
                         <h3 className="text-2xl font-black uppercase mb-8 leading-tight">{result.course}</h3>
                         <Button 
                            onClick={() => window.location.href = '/courses'}
                            className="w-full bg-white text-slate-900 hover:bg-emerald-500 hover:text-white font-black text-[10px] tracking-widest uppercase py-6 rounded-2xl border-none transition-all"
                         >
                            CHI TIẾT KHÓA HỌC
                         </Button>
                      </div>

                      <Button 
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                        className="w-full text-slate-900 font-black text-[10px] tracking-widest uppercase py-6 rounded-2xl border-2 border-slate-100"
                      >
                        QUAY LẠI TRANG CHỦ
                      </Button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
