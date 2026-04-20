'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Share2, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 bg-white pb-24 pt-32">
        <article className="mx-auto max-w-3xl px-6">
          <Button variant="ghost" className="mb-8 gap-2 pl-0 text-slate-500" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" /> Quay lại blog
          </Button>

          <header className="space-y-6">
            <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              KINH NGHIỆM HỌC TẬP
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
              5 Bí quyết đạt IELTS 8.0 cho người bận rộn
            </h1>
            <div className="flex items-center justify-between border-y border-slate-100 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Admin EduCore</p>
                  <p className="text-xs text-slate-500">20 Tháng 4, 2026 • 5 phút đọc</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full"><Facebook className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full"><Twitter className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full"><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </header>

          <div className="mt-12 space-y-8 text-lg leading-relaxed text-slate-700">
            <p className="font-semibold text-slate-900">
              Học IELTS không chỉ là học tiếng Anh, đó là một hành trình rèn luyện kỷ luật. Đặc biệt với những người đã đi làm, thời gian là kẻ thù lớn nhất. Dưới đây là 5 bí quyết giúp bạn tối ưu hóa thời gian và đạt điểm cao.
            </p>
            <div className="aspect-video rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 italic text-sm">
              [Ảnh minh họa phương pháp học tập]
            </div>
            <h2 className="text-2xl font-bold text-slate-900">1. Tận dụng "thời gian chết"</h2>
            <p>
              Bạn có thể luyện nghe (Listening) thông qua podcast hoặc radio trong lúc di chuyển đi làm, nấu ăn hoặc dọn dẹp nhà cửa. Hãy để tiếng Anh bao quanh bạn một cách tự nhiên nhất.
            </p>
            <h2 className="text-2xl font-bold text-slate-900">2. Phương pháp học cuốn chiếu</h2>
            <p>
              Đừng cố gắng học tất cả 4 kỹ năng trong một ngày. Hãy tập trung sâu vào 1-2 kỹ năng mỗi ngày để bộ não có thời gian hấp thụ kiến thức tốt hơn.
            </p>
            <div className="rounded-xl bg-emerald-50 p-6 border-l-4 border-emerald-500 italic">
              "Sự kiên trì quan trọng hơn cường độ học. Học 30 phút mỗi ngày tốt hơn học 5 tiếng vào ngày cuối tuần."
            </div>
          </div>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}
