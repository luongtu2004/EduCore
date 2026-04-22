'use client';

import { 
  User, Mail, Phone, Shield, Camera, 
  Lock, LogOut, Save, Edit3, ArrowLeft,
  Loader2, CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('thong-tin');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        fullName: parsedUser.fullName || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
      }));
    }
  }, []);

  const handleUpdateProfile = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const updateData: any = {
        fullName: formData.fullName,
        phone: formData.phone
      };

      const response: any = await api.patch(`/auth/users/${user.id}`, updateData);
      if (response.success) {
        toast.success('Cập nhật thông tin thành công!');
        // Update local storage
        const newUser = { ...user, ...updateData };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.id) return;
    if (!formData.password) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const response: any = await api.patch(`/auth/users/${user.id}`, {
        password: formData.password
      });
      if (response.success) {
        toast.success('Đổi mật khẩu thành công!');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* BACK BUTTON */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="rounded-full bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest gap-2 px-6 h-11 transition-all hover:scale-105 active:scale-95">
              <ArrowLeft className="h-4 w-4" /> Quay lại Website
            </Button>
          </Link>
        </div>

        {/* HEADER */}
        <div className="relative mb-24">
          <div className="h-48 md:h-64 w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />
          </div>

          {/* AVATAR */}
          <div className="absolute -bottom-16 left-8 md:left-12 flex flex-col md:flex-row items-end gap-6">
            <div className="relative group">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-white p-2 shadow-xl ring-4 ring-white">
                <div className="h-full w-full rounded-[2rem] bg-slate-100 flex items-center justify-center overflow-hidden">
                  <User className="h-16 w-16 text-slate-300" />
                </div>
              </div>
            </div>
            
            <div className="pb-4 md:pb-6 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.fullName}</h1>
                <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                  {user.role}
                </span>
              </div>
              <p className="text-slate-500 font-medium mt-1 italic">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-32 md:mt-24">
          {/* NAVIGATION */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 overflow-hidden">
              <div className="space-y-1">
                {[
                  { id: 'thong-tin', label: 'Thông tin cá nhân', icon: User },
                  { id: 'bao-mat', label: 'Bảo mật & Mật khẩu', icon: Shield },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group",
                      activeTab === tab.id 
                        ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <tab.icon className={cn(
                      "h-5 w-5 transition-colors",
                      activeTab === tab.id ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
                    )} />
                    <span className="text-sm font-bold tracking-tight">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group"
                >
                  <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-widest">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 min-h-[400px]">
              {activeTab === 'thong-tin' ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hồ sơ cá nhân</h2>
                      <p className="text-sm text-slate-400 mt-1 font-medium italic">Thông tin cá nhân của bạn trên hệ thống.</p>
                    </div>
                    <Button 
                      variant="ghost"
                      onClick={() => setIsEditing(!isEditing)}
                      className={cn(
                        "rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest transition-all",
                        isEditing ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-600"
                      )}
                    >
                      {isEditing ? 'Hủy' : <><Edit3 className="mr-2 h-3 w-3" /> Chỉnh sửa</>}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                      <input 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-70"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-70"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        disabled
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all opacity-70 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">* Email không thể thay đổi để đảm bảo bảo mật tài khoản.</p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-4 border-t border-slate-50">
                       <Button 
                        onClick={handleUpdateProfile}
                        disabled={isLoading}
                        className="rounded-xl px-8 h-12 bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200"
                       >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Lưu thông tin</>}
                       </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bảo mật tài khoản</h2>
                    <p className="text-sm text-slate-400 mt-1 font-medium italic">Thay đổi mật khẩu đăng nhập hệ thống.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                       <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                            <input 
                              type="password" 
                              placeholder="Nhập mật khẩu mới"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
                            <input 
                              type="password" 
                              placeholder="Nhập lại mật khẩu mới"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                          </div>
                       </div>
                       <Button 
                        onClick={handleChangePassword}
                        disabled={isLoading}
                        className="w-full md:w-auto rounded-xl px-8 h-12 bg-slate-900 hover:bg-slate-800 font-black text-[10px] uppercase tracking-widest mt-4"
                       >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cập nhật mật khẩu'}
                       </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
