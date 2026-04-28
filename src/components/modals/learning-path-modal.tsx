'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface LearningPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  path?: any;
}

export function LearningPathModal({ isOpen, onClose, onSuccess, path }: LearningPathModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    isActive: true,
  });
  
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    if (path) {
      setFormData({
        title: path.title,
        slug: path.slug,
        description: path.description || '',
        isActive: path.isActive,
      });
      setSteps(path.steps?.map((s: any) => ({
        ...s,
        features: s.features || []
      })) || []);
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        isActive: true,
      });
      setSteps([]);
    }
  }, [path, isOpen]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        title: '',
        description: '',
        target: '',
        color: 'emerald',
        order: steps.length,
        features: []
      }
    ]);
  };

  const removeStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    // Update order
    newSteps.forEach((step, i) => { step.order = i; });
    setSteps(newSteps);
  };

  const updateStep = (index: number, field: string, value: any) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const addFeature = (stepIndex: number) => {
    const newSteps = [...steps];
    if (!newSteps[stepIndex].features) newSteps[stepIndex].features = [];
    newSteps[stepIndex].features.push('');
    setSteps(newSteps);
  };

  const updateFeature = (stepIndex: number, featureIndex: number, value: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex].features[featureIndex] = value;
    setSteps(newSteps);
  };

  const removeFeature = (stepIndex: number, featureIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].features.splice(featureIndex, 1);
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.title || !formData.slug) {
        toast.error('Vui lòng điền đủ Tiêu đề và Đường dẫn');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        steps: steps.map((s, i) => ({
          title: s.title,
          description: s.description,
          target: s.target,
          color: s.color || 'emerald',
          order: i,
          features: s.features.filter((f: string) => f.trim() !== '')
        }))
      };

      if (path?.id) {
        await api.put(`/learning-paths/${path.id}`, payload);
        toast.success('Cập nhật lộ trình thành công');
      } else {
        await api.post('/learning-paths', payload);
        toast.success('Tạo lộ trình mới thành công');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (val: string) => {
    return val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {path ? 'CẬP NHẬT LỘ TRÌNH' : 'THÊM LỘ TRÌNH MỚI'}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Thiết lập cấu trúc khóa học
                </p>
              </div>
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-50">
              <form id="learning-path-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Thông tin chung */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-sm font-black uppercase text-slate-800">Thông tin chung</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiêu đề lộ trình</label>
                      <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ 
                            ...formData, 
                            title: e.target.value,
                            slug: path ? formData.slug : generateSlug(e.target.value)
                          });
                        }}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-bold transition-all"
                        placeholder="VD: Lộ trình Frontend Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đường dẫn (Slug)</label>
                      <input
                        required
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-bold transition-all"
                        placeholder="vd: frontend-developer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mô tả ngắn</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-4 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium transition-all resize-none min-h-[100px]"
                      placeholder="Mô tả về đối tượng, mục tiêu của lộ trình này..."
                    />
                  </div>
                </div>

                {/* Các bước (Steps) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase text-slate-800">Các giai đoạn học (Steps)</h3>
                    <Button type="button" onClick={addStep} variant="outline" className="h-9 gap-2 text-xs font-bold border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100">
                      <Plus className="h-3 w-3" /> THÊM GIAI ĐOẠN
                    </Button>
                  </div>

                  {steps.length === 0 ? (
                    <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-white">
                      <p className="text-xs font-bold text-slate-400">Chưa có giai đoạn nào. Hãy thêm giai đoạn đầu tiên.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {steps.map((step, sIdx) => (
                        <div key={sIdx} className="bg-white p-5 rounded-2xl border border-slate-200 relative group">
                          <button
                            type="button"
                            onClick={() => removeStep(sIdx)}
                            className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <div className="flex gap-4">
                            <div className="pt-2 cursor-grab text-slate-300 hover:text-slate-500">
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400">Tên giai đoạn</label>
                                  <input type="text" value={step.title} onChange={(e) => updateStep(sIdx, 'title', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg bg-slate-50 text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="VD: Nền tảng (Tháng 1-2)" required
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400">Mục tiêu đầu ra</label>
                                  <input type="text" value={step.target} onChange={(e) => updateStep(sIdx, 'target', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg bg-slate-50 text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="VD: IELTS 5.0" required
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400">Mô tả chi tiết</label>
                                <textarea value={step.description} onChange={(e) => updateStep(sIdx, 'description', e.target.value)}
                                  className="w-full p-3 rounded-lg bg-slate-50 text-sm font-medium border-none focus:ring-2 focus:ring-emerald-500/20 min-h-[80px]"
                                  placeholder="Nội dung chính..." required
                                />
                              </div>

                              {/* Features */}
                              <div className="space-y-2 pt-2 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-bold text-slate-400">Điểm nổi bật (Features)</label>
                                  <button type="button" onClick={() => addFeature(sIdx)} className="text-[10px] font-bold text-emerald-600 hover:underline">
                                    + Thêm ý
                                  </button>
                                </div>
                                {step.features.map((feat: string, fIdx: number) => (
                                  <div key={fIdx} className="flex gap-2">
                                    <input type="text" value={feat} onChange={(e) => updateFeature(sIdx, fIdx, e.target.value)}
                                      className="flex-1 h-9 px-3 rounded-lg bg-slate-50 text-xs font-medium border-none"
                                      placeholder="VD: Nắm vững 12 thì cơ bản..."
                                    />
                                    <button type="button" onClick={() => removeFeature(sIdx, fIdx)} className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex items-center justify-end gap-3">
              <Button type="button" onClick={onClose} variant="ghost" className="h-12 px-6 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">
                HỦY BỎ
              </Button>
              <Button type="submit" form="learning-path-form" disabled={loading} className="h-12 px-8 font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 uppercase tracking-widest text-[11px]">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'LƯU THAY ĐỔI'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
