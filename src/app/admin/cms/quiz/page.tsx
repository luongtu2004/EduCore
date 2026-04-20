'use client';

import { useState, useEffect } from 'react';
import {
  Zap, Plus, Edit, Trash2, ChevronUp, ChevronDown,
  CheckCircle2, AlertCircle, Loader2, Search, Filter,
  MoreVertical, BookOpen, Target, Headphones, Flag, Home, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestionModal } from '@/components/modals/quiz-question-modal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const sectionIcons: any = {
  foundation: <Flag className="h-4 w-4" />,
  skills: <Headphones className="h-4 w-4" />,
  goal: <Target className="h-4 w-4" />,
  general: <BookOpen className="h-4 w-4" />
};

export default function QuizManagementPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [sectionFilter, setSectionFilter] = useState('All');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/quiz');
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải câu hỏi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    try {
      await api.delete(`/cms/quiz/${id}`);
      setQuestions(questions.filter(q => q.id !== id));
      toast.success('Đã xóa câu hỏi!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      toast.error('Không thể xóa câu hỏi.');
    }
  };

  const handleEdit = (q: any) => {
    setEditingQuestion(q);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = sectionFilter === 'All' || q.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">QUẢN LÝ QUIZ AI</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">QUẢN LÝ QUIZ AI</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">NỘI DUNG BÀI TEST TRÌNH ĐỘ HỌC VIÊN EDUCORE</p>
        </div>
        <Button
          onClick={handleAdd}
          className="h-12 rounded-lg bg-[#065f46] hover:bg-[#047857] text-white px-6 font-bold text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/5 uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> THÊM CÂU HỎI MỚI
        </Button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col lg:flex-row gap-3 mb-10">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm kiếm câu hỏi, nội dung test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5f9] border-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="relative group min-w-[220px]">
          <Filter className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="w-full h-12 pl-12 pr-10 rounded-full bg-[#f1f5f9] hover:bg-white border-transparent hover:border-slate-100 border transition-all text-xs font-bold text-slate-600 shadow-sm shadow-transparent hover:shadow-md appearance-none outline-none cursor-pointer uppercase tracking-wider"
          >
            <option value="All">TẤT CẢ PHẦN TEST</option>
            <option value="foundation">FOUNDATION</option>
            <option value="skills">SKILLS</option>
            <option value="goal">GOAL</option>
            <option value="general">GENERAL</option>
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Đang tải dữ liệu CMS...</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => {
            const isActive = q.isActive;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={q.id}
                className={cn(
                  "group flex items-stretch gap-0 rounded-[24px] border bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden",
                  isActive
                    ? "border-emerald-200 shadow-emerald-50"
                    : "border-slate-200"
                )}
              >
                {/* LEFT: ORDER BADGE */}
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 px-4 py-5 border-r transition-colors duration-200 min-w-[56px]",
                    isActive
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <button className="p-1 rounded-lg text-slate-300 opacity-50 hover:opacity-100 hover:text-emerald-500 transition-all">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <span className={cn(
                    "text-sm font-black tabular-nums",
                    isActive ? "text-emerald-600" : "text-slate-400"
                  )}>
                    {String(q.order || idx + 1).padStart(2, '0')}
                  </span>
                  <button className="p-1 rounded-lg text-slate-300 opacity-50 hover:opacity-100 hover:text-emerald-500 transition-all">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* RIGHT: CONTENT */}
                <div className={cn(
                  "flex-1 min-w-0 px-6 py-5",
                  isActive ? "bg-emerald-50/20" : "bg-white"
                )}>
                  {/* TOP ROW: meta + actions */}
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Section tag */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
                        {sectionIcons[q.section] || <BookOpen className="h-3 w-3" />}
                        {q.section}
                      </span>
                      {/* Status */}
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          Bản nháp
                        </span>
                      )}
                    </div>

                    {/* Action buttons – always in row, no floating */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        onClick={() => handleEdit(q)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-slate-200 bg-white text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-none"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        onClick={() => deleteQuestion(q.id)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-slate-200 bg-white text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-none"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Question title */}
                  <h3 className="text-base font-semibold text-slate-900 leading-snug mb-4">
                    {q.text}
                  </h3>

                  {/* Answer options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {q.options.map((opt: string, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50/70 border border-slate-200 hover:bg-white hover:border-emerald-300 transition-all duration-150 cursor-default"
                      >
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          Đáp án {i + 1} (W: {q.weights[i]})
                        </span>
                        <span className="text-xs font-medium text-slate-700 leading-snug line-clamp-2">
                          {opt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-sm font-bold text-slate-400 italic">Không tìm thấy câu hỏi nào</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      <QuizQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchQuestions}
        question={editingQuestion}
      />
    </div>
  );
}
