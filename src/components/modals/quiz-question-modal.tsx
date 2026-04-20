'use client';

import { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, Plus, Trash2, Loader2,
  Flag, Headphones, Target, BookOpen 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface QuizQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  question?: any; // If editing
}

const sections = [
  { id: 'foundation', label: 'Nền tảng', icon: <Flag className="h-4 w-4" /> },
  { id: 'skills', label: 'Kỹ năng', icon: <Headphones className="h-4 w-4" /> },
  { id: 'goal', label: 'Mục tiêu', icon: <Target className="h-4 w-4" /> },
  { id: 'general', label: 'Chung', icon: <BookOpen className="h-4 w-4" /> }
];

export function QuizQuestionModal({ isOpen, onClose, onSuccess, question }: QuizQuestionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    section: 'foundation',
    options: ['', '', '', ''],
    weights: [0, 0, 0, 0],
    order: 0,
    isActive: true
  });

  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text,
        section: question.section,
        options: [...question.options],
        weights: [...question.weights],
        order: question.order || 0,
        isActive: question.isActive !== undefined ? question.isActive : true
      });
    } else {
      setFormData({
        text: '',
        section: 'foundation',
        options: ['', '', '', ''],
        weights: [0, 0, 0, 0],
        order: 0,
        isActive: true
      });
    }
  }, [question, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (question) {
        await api.put(`/cms/quiz/${question.id}`, formData);
        toast.success('Đã cập nhật câu hỏi thành công!');
      } else {
        await api.post('/cms/quiz', formData);
        toast.success('Đã tạo câu hỏi mới thành công!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu câu hỏi:', error);
      toast.error('Có lỗi xảy ra khi lưu câu hỏi.');
    } finally {
      setLoading(false);
    }
  };

  const updateOption = (index: number, val: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = val;
    setFormData({ ...formData, options: newOptions });
  };

  const updateWeight = (index: number, val: number) => {
    const newWeights = [...formData.weights];
    newWeights[index] = val;
    setFormData({ ...formData, weights: newWeights });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />

      {/* MODAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-[900px] bg-white rounded-[28px] border border-slate-200/80 shadow-[0_20px_80px_rgba(15,23,42,0.18)] overflow-hidden"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 pt-7 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-emerald-500 rounded-full shrink-0" />
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                {question ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
              </h2>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                Cấu hình nội dung bài Test AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-7 max-h-[75vh] overflow-y-auto">

            {/* SECTION 1: Question text */}
            <div className="space-y-2.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
                Nội dung câu hỏi
              </label>
              <textarea
                required
                value={formData.text}
                onChange={e => setFormData({ ...formData, text: e.target.value })}
                placeholder="Nhập nội dung câu hỏi tại đây..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 resize-none transition-all"
              />
            </div>

            {/* SECTION 2: Section + Order + Status */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-6 items-start">

              {/* Section chips */}
              <div className="space-y-2.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
                  Phân loại (Section)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sections.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, section: s.id })}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-150",
                        formData.section === s.id
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <span className={cn(
                        "transition-colors",
                        formData.section === s.id ? "text-emerald-500" : "text-slate-400"
                      )}>
                        {s.icon}
                      </span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order */}
              <div className="space-y-2.5 min-w-[100px]">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
                  Thứ tự
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 text-center focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>

              {/* Status toggle */}
              <div className="space-y-2.5 min-w-[120px]">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
                  Trạng thái
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2",
                    formData.isActive
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                  )}
                >
                  {formData.isActive
                    ? <><Check className="h-3.5 w-3.5" /> Hoạt động</>
                    : <><X className="h-3.5 w-3.5" /> Ẩn</>
                  }
                </button>
              </div>
            </div>

            {/* SECTION 3: Options & Weights */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
                Các đáp án &amp; Trọng số điểm
              </label>
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {/* Index label */}
                    <span className="w-5 shrink-0 text-[11px] font-black text-slate-300 text-center tabular-nums">
                      {i + 1}
                    </span>
                    {/* Answer input */}
                    <input
                      required
                      value={opt}
                      onChange={e => updateOption(i, e.target.value)}
                      placeholder={`Đáp án ${i + 1}...`}
                      className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                    />
                    {/* Weight input */}
                    <input
                      type="number"
                      value={formData.weights[i]}
                      onChange={e => updateWeight(i, parseInt(e.target.value))}
                      title="Trọng số điểm"
                      className="w-14 shrink-0 bg-white border border-slate-200 rounded-xl py-2.5 text-sm font-bold text-slate-700 text-center focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 pl-1">Số cuối mỗi hàng là trọng số điểm (weight) của đáp án đó.</p>
            </div>

          </div>

          {/* FOOTER */}
          <div className="px-8 py-5 border-t border-slate-100 bg-white flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[52px] rounded-2xl border border-slate-200 bg-white text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] h-[52px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-60 flex items-center justify-center gap-2.5 shadow-sm"
            >
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...</>
                : question ? 'Cập nhật câu hỏi' : 'Tạo câu hỏi mới'
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
