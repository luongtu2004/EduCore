'use client';

import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import api from '@/lib/axios';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    course: 'IELTS Foundation',
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/crm/leads/public', {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        source: 'WEBSITE',
        note: `Khóa học quan tâm: ${formData.course}. Lời nhắn: ${formData.note}`
      });
      alert('Cảm ơn bạn! Thông tin của bạn đã được gửi đến bộ phận tư vấn của EduCore.');
      setFormData({ fullName: '', phone: '', email: '', course: 'IELTS Foundation', note: '' });
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 bg-white">
        <section className="bg-slate-50 py-24 pt-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900 md:text-5xl">Liên hệ với EduCore</h1>
                  <p className="mt-4 text-lg text-slate-600">Bạn cần tư vấn lộ trình học IELTS? Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-emerald-600">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Hotline tư vấn</p>
                      <p className="text-slate-600">0901 234 567 (8h00 - 21h00)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-emerald-600">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Email hỗ trợ</p>
                      <p className="text-slate-600">contact@educore.edu.vn</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-emerald-600">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Trụ sở chính</p>
                      <p className="text-slate-600">Số 123, Đường ABC, Quận Cầu Giấy, Hà Nội</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200 border border-slate-100">
                <h2 className="mb-8 text-2xl font-bold text-slate-900">Gửi tin nhắn cho chúng tôi</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Nguyễn Văn A" 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
                      <input 
                        required 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="090 123 4567" 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email (Không bắt buộc)</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Khóa học quan tâm</label>
                    <select 
                      value={formData.course}
                      onChange={e => setFormData({ ...formData, course: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500"
                    >
                      <option>IELTS Foundation</option>
                      <option>IELTS Intensive</option>
                      <option>IELTS Mastery</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Tin nhắn của bạn</label>
                    <textarea 
                      rows={4} 
                      value={formData.note}
                      onChange={e => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Bạn cần chúng tôi giúp gì?" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                  <Button type="submit" className="w-full py-6 font-bold text-lg" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Gửi yêu cầu tư vấn</>}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
