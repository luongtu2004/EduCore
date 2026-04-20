'use client';

import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ComingSoon({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
        <Construction className="h-10 w-10" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Tính năng: {title}</h1>
      <p className="mt-2 max-w-sm text-slate-500">
        Tính năng này đang được chúng tôi phát triển tích cực để mang lại trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau!
      </p>
      <Button variant="outline" className="mt-8 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Quay lại trang trước
      </Button>
    </div>
  );
}
