'use client';

import { 
  Facebook, Instagram, Youtube, Mail, 
  Phone, MapPin, ArrowRight, MessageCircle,
  GraduationCap, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function PublicFooter() {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, color: 'text-[#1877F2]', bg: 'hover:bg-[#1877F2]/10', border: 'hover:border-[#1877F2]/20' },
    { name: 'Instagram', icon: Instagram, color: 'text-[#E4405F]', bg: 'hover:bg-[#E4405F]/10', border: 'hover:border-[#E4405F]/20' },
    { name: 'Youtube', icon: Youtube, color: 'text-[#FF0000]', bg: 'hover:bg-[#FF0000]/10', border: 'hover:border-[#FF0000]/20' },
  ];

  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          
          {/* BRAND SECTION */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-600 to-cyan-400 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-xl shadow-emerald-100 transition-all group-hover:scale-105 group-hover:rotate-3">
                  <GraduationCap className="h-7 w-7" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <Sparkles className="h-2 w-2 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1">
                   <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Edu</span>
                   <span className="text-xl font-black tracking-tighter text-emerald-600 uppercase">Core</span>
                </div>
                <span className="text-[8px] font-black text-slate-400 tracking-[0.4em] mt-1.5 uppercase opacity-80">Intelligence System</span>
              </div>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              Hệ thống đào tạo Anh ngữ tiêu chuẩn quốc tế, tiên phong ứng dụng AI vào giảng dạy giúp cá nhân hóa lộ trình học tập tối ưu.
            </p>
            
            {/* COLORFUL SOCIAL ICONS */}
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center transition-all border border-transparent shadow-sm",
                    social.bg,
                    social.border,
                    "hover:shadow-md"
                  )}
                >
                  <social.icon className={cn("h-5 w-5 transition-colors", social.color)} />
                </button>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-[0.2em]">Khám phá</h4>
            <ul className="space-y-4">
              {['Khóa học IELTS', 'Tiếng Anh giao tiếp', 'Lộ trình học tập', 'Cộng đồng học viên'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-slate-500 font-bold text-sm hover:text-emerald-600 transition-colors flex items-center gap-2 group">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-[0.2em]">Hỗ trợ</h4>
            <ul className="space-y-4">
              {['Trung tâm trợ giúp', 'Chính sách bảo mật', 'Điều khoản dịch vụ', 'Liên hệ hợp tác'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-slate-500 font-bold text-sm hover:text-emerald-600 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="space-y-8">
            <h4 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-[0.2em]">Liên hệ</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600 shrink-0 border border-gray-100">
                  <MapPin className="h-5 w-5" />
                </div>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Tòa nhà EduCore, 123 Đường Cầu Giấy, Hà Nội
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 shrink-0 border border-gray-100">
                  <Phone className="h-5 w-5" />
                </div>
                <p className="text-slate-900 font-black text-base italic tracking-tighter">1900 888 999</p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-24 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            © 2026 EduCore Intelligence. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest">Privacy Policy</Link>
            <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
