'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail, Lock, Loader2, User, Phone, ArrowLeft,
  Eye, EyeOff, CheckCircle2, AlertCircle, UserPlus, Globe, ShieldCheck, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';

function PwdStrength({ pwd }: { pwd: string }) {
  if (!pwd) return null;
  const checks = [
    { ok: pwd.length >= 8, label: '8+ ký tự' },
    { ok: /[A-Z]/.test(pwd) && /[a-z]/.test(pwd), label: 'Hoa/thường' },
    { ok: /\d/.test(pwd), label: 'Có số' },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['#ef4444', '#f59e0b', '#10b981'];
  const labels = ['Yếu', 'Trung bình', 'Mạnh'];
  return (
    <div style={{ marginTop: '0.4rem' }}>
      <div style={{ display: 'flex', gap: 3, marginBottom: 5 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i < score ? colors[score - 1] : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: score > 0 ? colors[score - 1] : 'transparent' }}>
          {labels[score - 1] || ''}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {checks.map((c, i) => (
            <span key={i} style={{ fontSize: '0.65rem', color: c.ok ? 'rgba(16,185,129,0.75)' : 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle2 size={9} />{c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirm: '' });

  useEffect(() => { setMounted(true); }, []);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) return setError('Mật khẩu xác nhận không khớp!');
    if (form.password.length < 6) return setError('Mật khẩu cần ít nhất 6 ký tự!');
    setIsLoading(true);
    try {
      await api.post('/auth/register', { fullName: form.fullName, phone: form.phone, email: form.email, password: form.password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }

        .rp {
          font-family: 'Inter', sans-serif;
          min-height: 100vh; position: relative;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding: 3.5rem 1.5rem 4rem; overflow: hidden;
        }

        /* BG */
        .rp-bg { position: fixed !important; inset: 0; z-index: 0; }
        .rp-ov {
          position: fixed; inset: 0; z-index: 1;
          background:
            radial-gradient(ellipse 70% 70% at 50% 40%, rgba(3,18,10,0.25) 0%, rgba(2,8,16,0.78) 100%),
            linear-gradient(to bottom, rgba(2,8,16,0.55) 0%, rgba(2,8,16,0.35) 50%, rgba(2,8,16,0.68) 100%);
          backdrop-filter: blur(1.5px);
        }

        /* Particles */
        .rp-pts { position: fixed; inset: 0; z-index: 2; pointer-events: none; overflow: hidden; }
        .rp-pt {
          position: absolute; border-radius: 50%;
          background: rgba(16,185,129,0.5);
          animation: rp-up linear infinite;
        }
        @keyframes rp-up {
          0%   { transform: translateY(105vh); opacity: 0; }
          5%   { opacity: 1; } 95% { opacity: 0.5; }
          100% { transform: translateY(-5vh) translateX(20px); opacity: 0; }
        }

        /* Back */
        .rp-back {
          position: fixed; top: 1.75rem; left: 1.75rem; z-index: 30;
          display: flex; align-items: center; gap: 0.375rem;
          color: rgba(255,255,255,0.35); font-size: 0.8125rem; font-weight: 500;
          text-decoration: none; transition: color 0.2s; font-family: 'Inter', sans-serif;
        }
        .rp-back:hover { color: rgba(52,211,153,0.85); }

        /* Wrap */
        .rp-wrap {
          position: relative; z-index: 10;
          width: 100%; max-width: 520px;
          display: flex; flex-direction: column; align-items: center;
          opacity: 0; transform: translateY(28px);
          animation: rp-in 0.65s cubic-bezier(0.22,1,0.36,1) 0.08s forwards;
        }
        @keyframes rp-in { to { opacity: 1; transform: translateY(0); } }

        /* Hero */
        .rp-hero { text-align: center; position: relative; z-index: 2; }
        .rp-ring {
          display: inline-block; position: relative;
          width: 50px; height: 50px; margin-bottom: 0.5rem;
        }
        .rp-ring::before {
          content: ''; position: absolute; inset: -3px; border-radius: 50%;
          background: conic-gradient(from 0deg, #10b981, #34d399, #059669, #10b981);
          animation: rp-rot 4s linear infinite;
        }
        @keyframes rp-rot { to { transform: rotate(360deg); } }
        .rp-ring-in {
          position: relative; z-index: 1;
          width: calc(100% - 6px); height: calc(100% - 6px); margin: 3px;
          border-radius: 50%;
          background: linear-gradient(145deg, #10b981 0%, #059669 55%, #047857 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.25rem; font-weight: 900; color: white;
          box-shadow:
            0 0 0 1px rgba(16,185,129,0.3),
            0 0 20px rgba(16,185,129,0.55),
            0 0 40px rgba(16,185,129,0.18),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .rp-title {
          font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em;
          color: #ffffff; margin-bottom: 0.2rem; line-height: 1.2;
        }
        .rp-sub {
          font-size: 0.775rem; color: rgba(255,255,255,0.32); font-weight: 400;
          line-height: 1.5; margin-bottom: 1rem;
        }
        .rp-sub em { font-style: normal; font-weight: 600; color: rgba(52,211,153,0.8); }

        /* Card */
        .rp-card {
          width: 100%; padding: 2.25rem 2.625rem 2rem;
          background: rgba(4,14,9,0.78);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          backdrop-filter: blur(36px) saturate(1.5);
          -webkit-backdrop-filter: blur(36px) saturate(1.5);
          box-shadow:
            0 0 0 1px rgba(16,185,129,0.05),
            0 20px 60px rgba(0,0,0,0.6),
            0 6px 20px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.25);
        }

        /* Success */
        .rp-ok {
          display: flex; flex-direction: column; align-items: center;
          gap: 0.75rem; padding: 1.5rem; text-align: center;
        }
        .rp-ok-ic { color: #10b981; animation: bounce-ic 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes bounce-ic { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        .rp-ok-t { font-size: 1.1rem; font-weight: 700; color: rgba(255,255,255,0.9); }
        .rp-ok-s { font-size: 0.825rem; color: rgba(255,255,255,0.35); }

        /* Error */
        .rp-err {
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0.8rem 0.9rem; margin-bottom: 1.125rem;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 12px; color: #fca5a5;
          font-size: 0.8375rem; font-weight: 500;
          animation: rp-shake 0.35s ease;
        }
        @keyframes rp-shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)}
          40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)}
        }

        /* Grid 2 col */
        .rp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }

        /* Fields */
        .rp-field { margin-bottom: 1.125rem; }
        .rp-lbl {
          display: block; font-size: 0.7rem; font-weight: 700;
          color: rgba(255,255,255,0.33); margin-bottom: 0.45rem;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .rp-iw { position: relative; }
        .rp-ico {
          position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: rgba(255,255,255,0.16);
          transition: color 0.2s; width: 16px; height: 16px;
        }
        .rp-iw:focus-within .rp-ico { color: rgba(16,185,129,0.6); }
        .rp-inp {
          width: 100%; padding: 0.875rem 0.9rem 0.875rem 2.625rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; color: rgba(255,255,255,0.9);
          font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .rp-inp::placeholder { color: rgba(255,255,255,0.16); }
        .rp-inp:focus {
          background: rgba(16,185,129,0.04);
          border-color: rgba(16,185,129,0.38);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.08);
        }
        .rp-inp.ok { border-color: rgba(16,185,129,0.35) !important; }
        .rp-inp.bad { border-color: rgba(239,68,68,0.35) !important; }
        .rp-inp:-webkit-autofill,
        .rp-inp:-webkit-autofill:hover,
        .rp-inp:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px #050f09 inset !important;
          -webkit-text-fill-color: rgba(255,255,255,0.9) !important;
          transition: background-color 9999s ease-in-out 0s;
        }
        .rp-eye {
          position: absolute; right: 0.9rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 0;
          color: rgba(255,255,255,0.2); display: flex; transition: color 0.2s;
        }
        .rp-eye:hover { color: rgba(255,255,255,0.5); }
        .rp-hint {
          font-size: 0.68rem; margin-top: 4px; font-weight: 500;
          display: flex; align-items: center; gap: 3px;
        }
        .rp-hint.ok { color: rgba(16,185,129,0.75); }
        .rp-hint.bad { color: rgba(239,68,68,0.7); }

        /* Terms */
        .rp-terms {
          display: flex; align-items: flex-start; gap: 0.5rem;
          margin: 1rem 0 1.375rem;
          font-size: 0.8rem; color: rgba(255,255,255,0.28);
        }
        .rp-chk { width: 15px; height: 15px; accent-color: #10b981; margin-top: 2px; cursor: pointer; flex-shrink: 0; }
        .rp-terms a { color: rgba(52,211,153,0.7); text-decoration: none; font-weight: 600; transition: color 0.2s; }
        .rp-terms a:hover { color: rgba(52,211,153,1); }

        /* Submit */
        .rp-btn {
          width: 100%; padding: 1.0625rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%);
          border: none; border-radius: 13px; color: white;
          font-size: 1rem; font-weight: 700; font-family: 'Inter', sans-serif;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
          letter-spacing: 0.01em;
        }
        .rp-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
          transform: translateX(-100%); transition: transform 0.55s;
        }
        .rp-btn:hover::after { transform: translateX(100%); }
        .rp-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(16,185,129,0.5), inset 0 1px 0 rgba(255,255,255,0.15); }
        .rp-btn:active { transform: scale(0.985); }
        .rp-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .rp-btn-in { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .rp-spin { animation: rp-rot 0.9s linear infinite; }

        /* Login link */
        .rp-login {
          text-align: center; margin-top: 1.25rem;
          font-size: 0.875rem; color: rgba(255,255,255,0.28);
        }
        .rp-login a { font-weight: 700; color: rgba(52,211,153,0.75); text-decoration: none; transition: color 0.2s; }
        .rp-login a:hover { color: #34d399; }

        /* Footer */
        .rp-footer {
          position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
          z-index: 30; display: flex; align-items: center; gap: 1.5rem;
          font-size: 0.72rem; white-space: nowrap;
        }
        .rp-fl {
          display: flex; align-items: center; gap: 0.3rem;
          color: rgba(255,255,255,0.22); text-decoration: none;
          transition: color 0.2s; font-weight: 500; font-family: 'Inter', sans-serif;
        }
        .rp-fl:hover { color: rgba(52,211,153,0.8); }
        .rp-fsep { color: rgba(255,255,255,0.1); }
      `}</style>

      <div className="rp">
        {/* BG */}
        <Image src="/login-bg.png" alt="" fill priority className="rp-bg"
          style={{ objectFit: 'cover', objectPosition: 'center' }} />
        <div className="rp-ov" />

        {/* Particles */}
        {mounted && (
          <div className="rp-pts">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="rp-pt" style={{
                left: `${5 + Math.random() * 90}%`, bottom: 0,
                width: `${1 + Math.random() * 2.5}px`,
                height: `${1 + Math.random() * 2.5}px`,
                opacity: 0.2 + Math.random() * 0.5,
                animationDuration: `${8 + Math.random() * 10}s`,
                animationDelay: `${-Math.random() * 15}s`,
              }} />
            ))}
          </div>
        )}

        {/* Back */}
        <Link href="/" className="rp-back">
          <ArrowLeft size={15} /> Quay lại Trang chủ
        </Link>

        <div className="rp-wrap">
          {/* Hero */}
          <div className="rp-hero">
            <div className="rp-ring"><div className="rp-ring-in">E</div></div>
            <h1 className="rp-title">Tạo tài khoản</h1>
            <p className="rp-sub">Bắt đầu hành trình với <em>EduCore</em> ngay hôm nay.</p>
          </div>

          {/* Card */}
          <div className="rp-card">
            {success ? (
              <div className="rp-ok">
                <CheckCircle2 size={52} className="rp-ok-ic" />
                <div className="rp-ok-t">Đăng ký thành công! 🎉</div>
                <div className="rp-ok-s">Đang chuyển hướng đến trang đăng nhập...</div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="rp-err"><AlertCircle size={17} /> {error}</div>
                )}
                <form onSubmit={handleSubmit}>
                  {/* Row 1: Name + Phone */}
                  <div className="rp-grid" style={{ marginBottom: '1.125rem' }}>
                    <div>
                      <label className="rp-lbl">Họ và tên</label>
                      <div className="rp-iw">
                        <User className="rp-ico" />
                        <input required type="text" value={form.fullName} onChange={set('fullName')}
                          placeholder="Nguyễn Văn A" className="rp-inp" autoComplete="name" />
                      </div>
                    </div>
                    <div>
                      <label className="rp-lbl">Số điện thoại</label>
                      <div className="rp-iw">
                        <Phone className="rp-ico" />
                        <input required type="tel" value={form.phone} onChange={set('phone')}
                          placeholder="090 123 4567" className="rp-inp" autoComplete="tel" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="rp-field">
                    <label className="rp-lbl">Địa chỉ Email</label>
                    <div className="rp-iw">
                      <Mail className="rp-ico" />
                      <input required type="email" value={form.email} onChange={set('email')}
                        placeholder="example@email.com" className="rp-inp" autoComplete="email" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="rp-field">
                    <label className="rp-lbl">Mật khẩu</label>
                    <div className="rp-iw">
                      <Lock className="rp-ico" />
                      <input required type={showPwd ? 'text' : 'password'} value={form.password}
                        onChange={set('password')} placeholder="••••••••"
                        className="rp-inp" autoComplete="new-password" />
                      <button type="button" className="rp-eye" tabIndex={-1}
                        onClick={() => setShowPwd(v => !v)}>
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <PwdStrength pwd={form.password} />
                  </div>

                  {/* Confirm */}
                  <div className="rp-field">
                    <label className="rp-lbl">Xác nhận mật khẩu</label>
                    <div className="rp-iw">
                      <Lock className="rp-ico" />
                      <input required type={showConfirm ? 'text' : 'password'} value={form.confirm}
                        onChange={set('confirm')} placeholder="••••••••"
                        className={`rp-inp ${form.confirm ? (form.confirm === form.password ? 'ok' : 'bad') : ''}`}
                        autoComplete="new-password" />
                      <button type="button" className="rp-eye" tabIndex={-1}
                        onClick={() => setShowConfirm(v => !v)}>
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {form.confirm && (
                      <p className={`rp-hint ${form.confirm === form.password ? 'ok' : 'bad'}`}>
                        {form.confirm === form.password
                          ? <><CheckCircle2 size={10} /> Mật khẩu khớp</>
                          : <><AlertCircle size={10} /> Mật khẩu không khớp</>
                        }
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="rp-terms">
                    <input id="terms" type="checkbox" required className="rp-chk" />
                    <label htmlFor="terms">
                      Tôi đồng ý với <Link href="#">Điều khoản sử dụng</Link> và <Link href="#">Chính sách bảo mật</Link>
                    </label>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="rp-btn" disabled={isLoading}>
                    <div className="rp-btn-in">
                      {isLoading
                        ? <><Loader2 size={18} className="rp-spin" /> Đang tạo tài khoản...</>
                        : <><UserPlus size={17} /> Đăng ký ngay</>
                      }
                    </div>
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Login link */}
          <div className="rp-login">
            Đã có tài khoản?{' '}
            <Link href="/login">Đăng nhập tại đây</Link>
          </div>
        </div>

        {/* Footer */}
        <div className="rp-footer">
          <a href="#" className="rp-fl"><HelpCircle size={11} /> Hỗ trợ</a>
          <span className="rp-fsep">•</span>
          <a href="#" className="rp-fl"><ShieldCheck size={11} /> Bảo mật</a>
          <span className="rp-fsep">•</span>
          <a href="#" className="rp-fl"><Globe size={11} /> Tiếng Việt</a>
        </div>
      </div>
    </>
  );
}
