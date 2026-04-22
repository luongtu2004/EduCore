'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CreditCard, Tag, CheckCircle2, 
  Loader2, ShoppingBag, ArrowRight,
  ShieldCheck, Percent, Ticket, Building2,
  Copy, QrCode, Phone, Clock, CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

// ============================================================
//  CẤU HÌNH THÔNG TIN NGÂN HÀNG
// ============================================================
const BANK_CONFIG = {
  bankId: 'MB',
  bankName: 'MB Bank',
  accountNo: '9991756789',
  accountName: 'LUONG VAN TU',
  branch: 'Chi nhánh TP. HCM',
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: number;
  };
}

type PaymentMethod = 'TRANSFER' | 'CONSULT';
type Step = 'FORM' | 'BANK_TRANSFER' | 'SUCCESS';

export function CheckoutModal({ isOpen, onClose, course }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [confirmedTransfer, setConfirmedTransfer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER');
  const [step, setStep] = useState<Step>('FORM');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const value = parseFloat(appliedCoupon.discount.replace(/[^0-9]/g, ''));
    if (appliedCoupon.type === 'PERCENT') {
      return (course.price * value) / 100;
    } else {
      return value;
    }
  };

  const discountAmount = calculateDiscount();
  const finalPrice = Math.max(0, course.price - discountAmount);

  const transferContent = `HOCPHI ${formData.fullName.toUpperCase().replace(/\s+/g, '') || 'HOCVIEN'} ${appliedCoupon?.code || ''}`.trim();

  const qrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-compact2.png?amount=${finalPrice}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;

  const handleVerifyCoupon = async () => {
    if (!couponCode) return;
    setVerifyingCoupon(true);
    try {
      const response: any = await api.get(`/cms/coupons/verify/${couponCode}`);
      if (response.success) {
        setAppliedCoupon(response.data);
        toast.success('Áp dụng mã giảm giá thành công!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
      setAppliedCoupon(null);
    } finally {
      setVerifyingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: any = await api.post('/crm/leads/public', {
        ...formData,
        source: 'WEBSITE',
        courseName: course.title,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        finalPrice,
        note: `[${paymentMethod === 'TRANSFER' ? 'CHUYỂN KHOẢN' : 'TƯ VẤN SAU'}] ${course.title}${appliedCoupon ? ` | Mã KM: ${appliedCoupon.code}` : ''} | Tổng: ${finalPrice.toLocaleString()}đ`,
      });

      if (response.success) {
        if (paymentMethod === 'TRANSFER') {
          setStep('BANK_TRANSFER');
        } else {
          setStep('SUCCESS');
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xử lý đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}!`);
  };

  const handleClose = () => {
    setStep('FORM');
    setAppliedCoupon(null);
    setCouponCode('');
    setFormData({ fullName: '', phone: '', email: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* ====== STEP 1: FORM ====== */}
            {step === 'FORM' && (
              <>
                {/* LEFT: FORM */}
                <div className="flex-1 p-12 border-r border-slate-50 overflow-y-auto max-h-[90vh]">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Đăng ký & Thanh toán</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Điền thông tin để hoàn tất đăng ký</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Student Info */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Họ và tên học viên</label>
                      <input required value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        type="text" placeholder="VD: Nguyễn Văn A"
                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-transparent focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Số điện thoại</label>
                        <input required value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          type="tel" placeholder="098..."
                          className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-transparent focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                        <input required value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          type="email" placeholder="example@gmail.com"
                          className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-transparent focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phương thức thanh toán</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setPaymentMethod('TRANSFER')}
                          className={cn(
                            "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all",
                            paymentMethod === 'TRANSFER'
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                          )}
                        >
                          <Building2 className="h-6 w-6" />
                          <span className="text-[11px] font-black uppercase tracking-wider">Chuyển khoản</span>
                          <span className="text-[9px] font-bold opacity-60">Hiển thị thông tin CK</span>
                        </button>
                        <button type="button" onClick={() => setPaymentMethod('CONSULT')}
                          className={cn(
                            "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all",
                            paymentMethod === 'CONSULT'
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                          )}
                        >
                          <Phone className="h-6 w-6" />
                          <span className="text-[11px] font-black uppercase tracking-wider">Tư vấn sau</span>
                          <span className="text-[9px] font-bold opacity-60">Nhân viên liên hệ</span>
                        </button>
                      </div>
                    </div>

                    {/* Coupon */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mã giảm giá</label>
                        {appliedCoupon && (
                          <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1.5">
                            <Ticket className="h-3 w-3" /> Đã áp dụng: {appliedCoupon.code}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          <input type="text" placeholder="Nhập mã ưu đãi..."
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-transparent focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 text-sm font-black uppercase placeholder:font-bold outline-none transition-all"
                          />
                        </div>
                        <Button type="button" onClick={handleVerifyCoupon}
                          disabled={verifyingCoupon || !couponCode}
                          className="h-14 px-6 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
                        >
                          {verifyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Áp dụng'}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading}
                      className="w-full h-16 rounded-[1.8rem] bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs tracking-[0.2em] uppercase shadow-xl shadow-slate-200 gap-3 mt-4 transition-all"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        paymentMethod === 'TRANSFER'
                          ? <><Building2 className="h-5 w-5" /> TIẾP TỤC → XEM THÔNG TIN CK</>
                          : <><ShoppingBag className="h-5 w-5" /> GỬI YÊU CẦU TƯ VẤN</>
                      )}
                    </Button>
                  </form>
                </div>

                {/* RIGHT: SUMMARY */}
                <div className="w-full md:w-72 bg-slate-50 p-12 flex flex-col justify-between">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tóm tắt</span>
                      <button onClick={handleClose} className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase italic leading-tight">{course.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">Khóa học Professional</p>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-slate-200/60">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-400">Giá gốc</span>
                        <span className="font-black text-slate-900">{course.price.toLocaleString()}đ</span>
                      </div>
                      {appliedCoupon && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between text-sm">
                          <span className="font-bold text-emerald-600 flex items-center gap-1"><Percent className="h-3 w-3" /> Giảm giá</span>
                          <span className="font-black text-emerald-600">-{discountAmount.toLocaleString()}đ</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-1">Tổng thanh toán</span>
                      <span className="text-3xl font-black text-emerald-600 italic tracking-tighter">
                        {finalPrice.toLocaleString()}đ
                      </span>
                    </div>
                    <div className="p-4 bg-white/60 rounded-2xl border border-slate-200/40 flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                      <p className="text-[9px] font-bold text-slate-500 leading-normal">
                        Thanh toán bảo mật. Hoàn tiền 100% nếu không hài lòng.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ====== STEP 2: BANK TRANSFER ====== */}
            {step === 'BANK_TRANSFER' && (
              <div className="w-full flex flex-col md:flex-row">
                {/* QR + Bank Info */}
                <div className="flex-1 p-12 border-r border-slate-50">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                        <QrCode className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase italic">Thông tin chuyển khoản</h2>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Quét mã QR hoặc chuyển khoản thủ công</p>
                      </div>
                    </div>
                    <button onClick={handleClose} className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center mb-8">
                    <div className="p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-100">
                      <img
                        src={qrUrl}
                        alt="QR chuyển khoản"
                        className="w-56 h-56 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`STK: ${BANK_CONFIG.accountNo} | NH: ${BANK_CONFIG.bankName} | ST: ${finalPrice} | ND: ${transferContent}`)}`;
                        }}
                      />
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="space-y-3">
                    {[
                      { label: 'Ngân hàng', value: `${BANK_CONFIG.bankName} (${BANK_CONFIG.bankId})`, copy: false },
                      { label: 'Số tài khoản', value: BANK_CONFIG.accountNo, copy: true },
                      { label: 'Chủ tài khoản', value: BANK_CONFIG.accountName, copy: false },
                      { label: 'Số tiền', value: `${finalPrice.toLocaleString()}đ`, copy: true, highlight: true },
                      { label: 'Nội dung CK', value: transferContent, copy: true, highlight: true },
                    ].map((item) => (
                      <div key={item.label} className={cn(
                        "flex items-center justify-between p-5 rounded-2xl",
                        item.highlight ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50"
                      )}>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                          <p className={cn(
                            "text-sm font-black",
                            item.highlight ? "text-emerald-700" : "text-slate-900"
                          )}>{item.value}</p>
                        </div>
                        {item.copy && (
                          <button
                            onClick={() => handleCopy(item.value, item.label)}
                            className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Instructions */}
                <div className="w-full md:w-72 bg-slate-900 p-12 flex flex-col justify-between text-white">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-black uppercase italic mb-2">Hướng dẫn</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 bước đơn giản</p>
                    </div>
                    
                    {[
                      { num: '01', title: 'Mở app ngân hàng', desc: 'Mở ứng dụng Mobile Banking của bạn' },
                      { num: '02', title: 'Quét mã QR', desc: 'Quét mã QR hoặc nhập số tài khoản thủ công' },
                      { num: '03', title: 'Nhập đúng nội dung', desc: `Nhập nội dung: "${transferContent}" để đối soát` },
                    ].map((step) => (
                      <div key={step.num} className="flex gap-4">
                        <span className="text-2xl font-black text-emerald-500 leading-none shrink-0">{step.num}</span>
                        <div>
                          <p className="text-sm font-black text-white">{step.title}</p>
                          <p className="text-[11px] font-medium text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}

                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
                      <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                        Sau khi chuyển khoản, nhân viên EduCore sẽ xác nhận và liên hệ với bạn trong vòng <span className="text-white">30 phút</span> trong giờ hành chính.
                      </p>
                    </div>
                  </div>

                  {/* Confirmation checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all">
                    <input
                      type="checkbox"
                      checked={confirmedTransfer}
                      onChange={(e) => setConfirmedTransfer(e.target.checked)}
                      className="mt-0.5 h-5 w-5 rounded accent-emerald-500 cursor-pointer shrink-0"
                    />
                    <span className="text-[11px] font-bold text-slate-300 leading-relaxed">
                      Tôi xác nhận đã <span className="text-white font-black">chuyển khoản thành công</span> với đúng số tiền và nội dung chuyển khoản như trên.
                    </span>
                  </label>

                  <Button
                    onClick={() => setStep('SUCCESS')}
                    disabled={!confirmedTransfer}
                    className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-[11px] uppercase tracking-widest gap-2 mt-3 transition-all"
                  >
                    <CheckCheck className="h-4 w-4" /> Xác nhận đã chuyển khoản
                  </Button>
                </div>
              </div>
            )}

            {/* ====== STEP 3: SUCCESS ====== */}
            {step === 'SUCCESS' && (
              <div className="w-full p-20 text-center space-y-8">
                <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-100">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase italic mb-3">
                    {paymentMethod === 'TRANSFER' ? 'Đã nhận thông tin!' : 'Yêu cầu đã gửi!'}
                  </h2>
                  <p className="text-slate-500 font-bold max-w-md mx-auto leading-relaxed">
                    {paymentMethod === 'TRANSFER'
                      ? 'Cảm ơn bạn! Chúng tôi sẽ xác nhận giao dịch và kích hoạt tài khoản trong vòng 30 phút.'
                      : 'Cảm ơn bạn! Chuyên viên tư vấn sẽ liên hệ với bạn sớm nhất trong vòng 24 giờ.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
                  <Phone className="h-4 w-4" />
                  <span>Hotline hỗ trợ: <span className="text-emerald-600 font-black">0912 345 678</span></span>
                </div>
                <Button onClick={handleClose}
                  className="h-14 px-12 rounded-2xl bg-slate-900 text-white font-black text-xs tracking-widest uppercase"
                >
                  Quay lại trang học viện
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
