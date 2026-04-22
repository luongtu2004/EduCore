'use client';

import { 
  User, Mail, Phone, Shield, Camera, 
  Settings, Bell, Lock, LogOut, 
  CheckCircle2, AlertCircle, Edit3, Save,
  Calendar, MapPin, Briefcase, Award
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('thong-tin');

  const tabs = [
    { id: 'thong-tin', label: 'Thông tin cá nhân', icon: User },
    { id: 'bao-mat', label: 'Bảo mật & Tài khoản', icon: Shield },
    { id: 'thong-bao', label: 'Cấu hình thông báo', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER / COVER IMAGE */}
        <div className="relative mb-24">
          <div className="h-48 md:h-64 w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 shadow-2xl overflow-hidden relative">
            {/* Abstract shapes for premium look */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />
            
            <div className="absolute bottom-8 right-8">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-xs font-bold transition-all border border-white/30">
                <Camera className="h-4 w-4" />
                Thay đổi ảnh bìa
              </button>
            </div>
          </div>

          {/* AVATAR & BASIC INFO */}
          <div className="absolute -bottom-16 left-8 md:left-12 flex flex-col md:flex-row items-end gap-6">
            <div className="relative group">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-white p-2 shadow-xl ring-4 ring-white">
                <div className="h-full w-full rounded-[2rem] bg-slate-100 flex items-center justify-center overflow-hidden">
                  <User className="h-16 w-16 text-slate-300" />
                  {/* Image placeholder */}
                  {/* <img src="..." className="h-full w-full object-cover" /> */}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 h-10 w-10 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white hover:scale-110 transition-transform">
                <Camera className="h-5 w-5" />
              </button>
            </div>
            
            <div className="pb-4 md:pb-6 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin EduCore</h1>
                <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                  Administrator
                </span>
              </div>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2 justify-center md:justify-start italic">
                <MapPin className="h-3 w-3" /> Hà Nội, Việt Nam
              </p>
            </div>
          </div>

          <div className="absolute -bottom-16 right-0 hidden md:flex items-center gap-3">
             <Button 
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "rounded-2xl px-6 h-12 font-black text-xs uppercase tracking-widest transition-all shadow-lg",
                  isEditing ? "bg-slate-900 hover:bg-slate-800" : "bg-emerald-600 hover:bg-emerald-700"
                )}
             >
                {isEditing ? <><Save className="mr-2 h-4 w-4" /> Lưu thay đổi</> : <><Edit3 className="mr-2 h-4 w-4" /> Chỉnh sửa hồ sơ</>}
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-32 md:mt-24">
          {/* LEFT COLUMN: NAVIGATION */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 overflow-hidden">
              <div className="space-y-1">
                {tabs.map((tab) => (
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
                    {activeTab === tab.id && (
                      <motion.div layoutId="active-tab" className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50">
                <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group">
                  <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-widest">Đăng xuất</span>
                </button>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/20 transition-all" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-6 flex items-center gap-2">
                <Award className="h-4 w-4" /> Thành tích hệ thống
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-3xl font-black">128</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bài viết đã đăng</p>
                </div>
                <div>
                  <p className="text-3xl font-black">450+</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Khách hàng hỗ trợ</p>
                </div>
                <div className="pt-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" />
                  </div>
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-3">85% Hiệu suất công việc</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12"
            >
              {activeTab === 'thong-tin' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hồ sơ cá nhân</h2>
                    <p className="text-sm text-slate-400 mt-1 font-medium italic">Thông tin này sẽ được hiển thị trên hệ thống quản trị.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="text" 
                          defaultValue="Admin EduCore"
                          disabled={!isEditing}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-70"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chức vụ</label>
                      <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="text" 
                          defaultValue="Quản trị viên hệ thống"
                          disabled
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-70 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="email" 
                          defaultValue="admin@educore.edu.vn"
                          disabled={!isEditing}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-70"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="text" 
                          defaultValue="0987.654.321"
                          disabled={!isEditing}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-70"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiểu sử</label>
                    <textarea 
                      rows={4}
                      defaultValue="Xin chào, tôi chịu trách nhiệm quản lý nội dung và hệ thống CRM của EduCore Academy. Với hơn 5 năm kinh nghiệm trong lĩnh vực đào tạo..."
                      disabled={!isEditing}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-70 resize-none"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                       <Button 
                          variant="ghost" 
                          onClick={() => setIsEditing(false)}
                          className="rounded-xl px-6 h-12 font-bold text-slate-400 uppercase text-[10px] tracking-widest"
                       >
                          Hủy bỏ
                       </Button>
                       <Button className="rounded-xl px-8 h-12 bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200">
                          Lưu thay đổi
                       </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bao-mat' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bảo mật tài khoản</h2>
                    <p className="text-sm text-slate-400 mt-1 font-medium italic">Quản lý mật khẩu và các tùy chọn bảo mật 2 lớp.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-900">Xác thực 2 lớp (2FA) đang bật</p>
                        <p className="text-[11px] font-medium text-emerald-600 mt-0.5">Tài khoản của bạn đang được bảo vệ ở mức cao nhất.</p>
                      </div>
                      <Button variant="ghost" className="ml-auto text-[10px] font-black uppercase text-emerald-700 tracking-widest bg-emerald-100 hover:bg-emerald-200 rounded-xl px-4">Cấu hình</Button>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <Lock className="h-3 w-3" /> Đổi mật khẩu
                       </h3>
                       <div className="grid grid-cols-1 gap-4">
                          <input 
                            type="password" 
                            placeholder="Mật khẩu hiện tại"
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          />
                          <input 
                            type="password" 
                            placeholder="Mật khẩu mới"
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          />
                          <input 
                            type="password" 
                            placeholder="Xác nhận mật khẩu mới"
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          />
                       </div>
                       <Button className="w-full md:w-auto rounded-xl px-8 h-12 bg-slate-900 hover:bg-slate-800 font-black text-[10px] uppercase tracking-widest mt-4">
                          Cập nhật mật khẩu
                       </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'thong-bao' && (
                <div className="space-y-10">
                   <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình thông báo</h2>
                    <p className="text-sm text-slate-400 mt-1 font-medium italic">Chọn loại thông báo bạn muốn nhận qua hệ thống và email.</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { id: 'n1', title: 'Leads mới', desc: 'Thông báo khi có khách hàng tiềm năng đăng ký mới.', checked: true },
                      { id: 'n2', title: 'Học viên ghi danh', desc: 'Thông báo khi có học viên mới thanh toán khóa học.', checked: true },
                      { id: 'n3', title: 'Cập nhật hệ thống', desc: 'Các bản tin kỹ thuật và nâng cấp từ EduCore.', checked: false },
                      { id: 'n4', title: 'Lịch tư vấn', desc: 'Nhắc nhở trước 15 phút các cuộc hẹn đã lên lịch.', checked: true },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 transition-all group border-b border-slate-50 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{item.title}</p>
                          <p className="text-xs text-slate-400 font-medium mt-1">{item.desc}</p>
                        </div>
                        <div className={cn(
                          "h-6 w-11 rounded-full relative transition-colors cursor-pointer",
                          item.checked ? "bg-emerald-500" : "bg-slate-200"
                        )}>
                          <div className={cn(
                            "absolute top-1 h-4 w-4 bg-white rounded-full transition-all shadow-sm",
                            item.checked ? "left-6" : "left-1"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
