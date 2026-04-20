'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, User, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Giả lập đăng ký thành công
    setTimeout(() => {
      alert('Đăng ký thành công! Hãy đăng nhập để tiếp tục.');
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <Link 
        href="/" 
        className="absolute left-8 top-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại Trang chủ
      </Link>

      <div className="w-full max-w-lg space-y-8 rounded-2xl border border-slate-200 bg-white p-10 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white text-2xl font-bold shadow-lg shadow-emerald-200">E</div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Tạo tài khoản mới</h2>
          <p className="mt-2 text-sm text-slate-600">Bắt đầu quản lý trung tâm giáo dục của bạn ngay hôm nay.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input required type="text" placeholder="Nguyễn Văn A" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input required type="tel" placeholder="090 123 4567" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input required type="email" placeholder="admin@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input required type="password" placeholder="••••••••" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input id="terms" type="checkbox" required className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            <label htmlFor="terms" className="ml-2 block text-sm text-slate-600">
              Tôi đồng ý với <Link href="#" className="font-semibold text-emerald-600 hover:text-emerald-500">Điều khoản sử dụng</Link>
            </label>
          </div>

          <Button type="submit" className="w-full py-6 text-lg font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Đăng ký ngay'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
            Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </div>
  );
}
