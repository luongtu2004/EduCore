'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Shield, Lock, Eye, EyeOff, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const ROLES = [
  { value: 'ADMIN', label: 'Admin', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { value: 'STAFF', label: 'Staff', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'TEACHER', label: 'Teacher', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { value: 'CONSULTANT', label: 'Consultant', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { value: 'STUDENT', label: 'Student', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
];

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any; // null = create mode, object = edit mode
}

export function UserModal({ isOpen, onClose, onSuccess, user }: UserModalProps) {
  const isEditing = !!user;

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'STAFF',
    password: '',
    isActive: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'STAFF',
        password: '',
        isActive: user.isActive ?? true,
      });
    } else {
      setForm({ fullName: '', email: '', phone: '', role: 'STAFF', password: '', isActive: true });
    }
    setErrors({});
  }, [user, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!form.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ';
    if (!isEditing && !form.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (form.password && form.password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
        isActive: form.isActive,
      };
      if (form.password) payload.password = form.password;

      if (isEditing) {
        await api.patch(`/auth/users/${user.id}`, payload);
        toast.success('Cập nhật tài khoản thành công!');
      } else {
        await api.post('/auth/users', payload);
        toast.success('Tạo tài khoản thành công!');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {isEditing ? 'Cập nhật tài khoản' : 'Thêm thành viên mới'}
                  </h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    {isEditing ? `Chỉnh sửa — ${user?.fullName}` : 'Tạo tài khoản hệ thống EduCore'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* Full Name */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={cn(
                      "w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border text-sm font-medium outline-none transition-all",
                      errors.fullName
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/10"
                        : "border-slate-100 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5"
                    )}
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input
                    type="email"
                    placeholder="nhanvien@educore.vn"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={cn(
                      "w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border text-sm font-medium outline-none transition-all",
                      errors.email
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/10"
                        : "border-slate-100 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5"
                    )}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input
                    type="tel"
                    placeholder="0901234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium outline-none transition-all focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5"
                  />
                </div>
              </div>

              {/* Role + Status row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Role */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                    Vai trò <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:border-emerald-300 appearance-none cursor-pointer"
                    >
                      {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                    Trạng thái
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className={cn(
                      "w-full h-12 rounded-xl border text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                      form.isActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", form.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
                    {form.isActive ? 'Hoạt động' : 'Đã khóa'}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                  Mật khẩu {!isEditing && <span className="text-red-500">*</span>}
                  {isEditing && <span className="text-slate-300 font-medium normal-case tracking-normal ml-1">(để trống nếu không đổi)</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isEditing ? '••••••••' : 'Tối thiểu 6 ký tự'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={cn(
                      "w-full h-12 pl-11 pr-12 rounded-xl bg-slate-50 border text-sm font-medium outline-none transition-all",
                      errors.password
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/10"
                        : "border-slate-100 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.password}</p>}
              </div>

              {/* Role badge preview */}
              <div className="pt-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Xem trước vai trò</p>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map(r => (
                    <button
                      type="button"
                      key={r.value}
                      onClick={() => setForm({ ...form, role: r.value })}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                        form.role === r.value
                          ? r.color + " scale-105 shadow-sm"
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl border-slate-100 font-bold text-xs"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl bg-[#065f46] hover:bg-[#047857] text-white font-bold text-xs gap-2 shadow-lg shadow-emerald-900/10"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...</>
                  ) : (
                    <><Save className="h-4 w-4" /> {isEditing ? 'Cập nhật' : 'Tạo tài khoản'}</>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
