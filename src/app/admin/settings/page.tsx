'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, Globe, Mail, ShieldCheck, 
  Save, Layout, Bell, Key, Image as ImageIcon,
  ChevronRight, Home, Info, Share2, Search as SearchIcon,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

const tabs = [
  { id: 'general', name: 'Tổng quan', icon: Info },
  { id: 'contact', name: 'Liên hệ & Social', icon: Share2 },
  { id: 'seo', name: 'Cấu hình SEO', icon: SearchIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    siteName: '',
    siteTagline: '',
    logo: '',
    favicon: '',
    phone: '',
    email: '',
    address: '',
    facebook: '',
    zalo: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/cms/settings');
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải cài đặt:', error);
      toast.error('Không thể tải cài đặt hệ thống.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response: any = await api.put('/cms/settings', formData);
      if (response.success) {
        toast.success('Đã lưu thay đổi thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      toast.error('Có lỗi xảy ra khi lưu cài đặt.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500 opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đang tải cấu hình hệ thống...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/admin" className="hover:text-emerald-500 transition-colors">DASHBOARD</Link>
        <ChevronRight className="h-2.5 w-2.5 opacity-30" />
        <span className="text-emerald-600">CÀI ĐẶT HỆ THỐNG</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">CÀI ĐẶT HỆ THỐNG</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">CẤU HÌNH THÔNG TIN VÀ GIAO DIỆN TOÀN CỤC</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 font-black text-[11px] transition-all gap-2.5 shadow-lg shadow-emerald-900/10 uppercase tracking-wider disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* SIDEBAR TABS */}
        <div className="w-full lg:w-72 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative group",
                activeTab === tab.id 
                  ? "bg-white text-emerald-600 shadow-xl shadow-slate-200/50 font-bold" 
                  : "text-slate-400 hover:bg-white/50 hover:text-slate-600"
              )}
            >
              <tab.icon className={cn("h-5 w-5", activeTab === tab.id ? "text-emerald-500" : "text-slate-300")} />
              <span className="text-sm">{tab.name}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute right-4 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 lg:p-12">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-10"
              >
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase mb-6">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tên hệ thống</label>
                      <input 
                        type="text" 
                        name="siteName"
                        value={formData.siteName || ''}
                        onChange={handleChange}
                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Khẩu hiệu (Tagline)</label>
                      <input 
                        type="text" 
                        name="siteTagline"
                        value={formData.siteTagline || ''}
                        onChange={handleChange}
                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase mb-6">Hình ảnh thương hiệu</h3>
                  <div className="flex flex-wrap gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Logo Website</label>
                      <div className="h-32 w-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-emerald-500 transition-all">
                        <ImageIcon className="h-6 w-6 text-slate-300 group-hover:text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">Tải lên</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Favicon (16x16)</label>
                      <div className="h-32 w-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-emerald-500 transition-all">
                        <Globe className="h-6 w-6 text-slate-300 group-hover:text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">Tải lên</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-10"
              >
                 <h3 className="text-xl font-black text-slate-900 uppercase">Thông tin liên hệ & Mạng xã hội</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Số điện thoại</label>
                      <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email hỗ trợ</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Địa chỉ văn phòng</label>
                      <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Facebook Fanpage</label>
                      <input type="text" name="facebook" value={formData.facebook || ''} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Zalo Official Account</label>
                      <input type="text" name="zalo" value={formData.zalo || ''} onChange={handleChange} placeholder="Số điện thoại hoặc link Zalo..." className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold" />
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'seo' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-10"
              >
                 <h3 className="text-xl font-black text-slate-900 uppercase">Cấu hình SEO Toàn cục</h3>
                 <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Meta Title mặc định</label>
                      <input type="text" name="seoTitle" value={formData.seoTitle || ''} onChange={handleChange} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Meta Description mặc định</label>
                      <textarea name="seoDescription" value={formData.seoDescription || ''} onChange={handleChange} rows={4} className="w-full p-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold resize-none"></textarea>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
