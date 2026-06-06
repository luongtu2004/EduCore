'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail, Lock, Loader2, ArrowLeft, Eye, EyeOff,
  AlertCircle, LogIn, ShieldCheck, Globe, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({ account: '', password: '' });

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', {
        email: formData.account,
        password: formData.password,
      }) as any;
      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
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

        /* ── Page shell ── */
        .lp {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 3.5rem 1.5rem 4rem;
          overflow: hidden;
        }

        /* ── BG ── */
        .lp-bg { position: fixed !important; inset: 0; z-index: 0; }
        .lp-ov {
          position: fixed; inset: 0; z-index: 1;
          background:
            radial-gradient(ellipse 70% 70% at 50% 40%, rgba(3,18,10,0.25) 0%, rgba(2,8,16,0.75) 100%),
            linear-gradient(to bottom, rgba(2,8,16,0.55) 0%, rgba(2,8,16,0.35) 50%, rgba(2,8,16,0.65) 100%);
          backdrop-filter: blur(1.5px);
        }

        /* Particles */
        .lp-pts { position: fixed; inset: 0; z-index: 2; pointer-events: none; overflow: hidden; }
        .lp-pt {
          position: absolute; border-radius: 50%;
          background: rgba(16,185,129,0.5);
          animation: pt-up linear infinite;
        }
        @keyframes pt-up {
          0%   { transform: translateY(105vh); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.5; }
          100% { transform: translateY(-5vh) translateX(20px); opacity: 0; }
        }

        /* ── Back ── */
        .lp-back {
          position: fixed; top: 1.75rem; left: 1.75rem; z-index: 30;
          display: flex; align-items: center; gap: 0.375rem;
          color: rgba(255,255,255,0.35); font-size: 0.8125rem; font-weight: 500;
          text-decoration: none; transition: color 0.2s; font-family: 'Inter', sans-serif;
        }
        .lp-back:hover { color: rgba(52,211,153,0.85); }

        /* ── Wrapper (logo + card + reg) stacked ── */
        .lp-wrap {
          position: relative; z-index: 10;
          width: 100%; max-width: 520px;
          display: flex; flex-direction: column; align-items: center;
          gap: 0;
          opacity: 0; transform: translateY(28px);
          animation: wrap-in 0.65s cubic-bezier(0.22,1,0.36,1) 0.08s forwards;
        }
        @keyframes wrap-in { to { opacity: 1; transform: translateY(0); } }

        /* ── Logo block (above card) ── */
        .lp-hero {
          text-align: center;
          margin-bottom: -1px; /* touch the card top */
          position: relative; z-index: 2;
        }
        .lp-ring {
          display: inline-block; position: relative;
          width: 50px; height: 50px; margin-bottom: 0.5rem;
        }
        .lp-ring::before {
          content: ''; position: absolute; inset: -3px; border-radius: 50%;
          background: conic-gradient(from 0deg, #10b981, #34d399, #059669, #10b981);
          animation: ring-rot 4s linear infinite;
        }
        @keyframes ring-rot { to { transform: rotate(360deg); } }
        .lp-ring-in {
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

        .lp-title {
          font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em;
          color: #ffffff; margin-bottom: 0.2rem; line-height: 1.2;
        }
        .lp-sub {
          font-size: 0.775rem; color: rgba(255,255,255,0.32); font-weight: 400;
          line-height: 1.5; margin-bottom: 1rem;
        }
        .lp-sub em { font-style: normal; font-weight: 600; color: rgba(52,211,153,0.8); }

        /* ── Card (form only) ── */
        .lp-card {
          width: 100%;
          padding: 2.5rem 2.625rem 2.25rem;
          background: rgba(4, 14, 9, 0.78);
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

        /* ── Error ── */
        .lp-err {
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0.8rem 0.9rem; margin-bottom: 1.125rem;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 12px; color: #fca5a5;
          font-size: 0.8375rem; font-weight: 500;
          animation: err-shake 0.35s ease;
        }
        @keyframes err-shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)}
          40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)}
        }

        /* ── Fields ── */
        .lp-field { margin-bottom: 1.375rem; }
        .lp-lbl {
          display: block; font-size: 0.7rem; font-weight: 700;
          color: rgba(255,255,255,0.35); margin-bottom: 0.5rem;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .lp-lbl-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.5rem;
        }
        .lp-forgot {
          font-size: 0.7rem; font-weight: 600;
          color: rgba(52,211,153,0.6); text-decoration: none; transition: color 0.2s;
        }
        .lp-forgot:hover { color: rgba(52,211,153,1); }

        .lp-iw { position: relative; }
        .lp-ico {
          position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: rgba(255,255,255,0.17);
          transition: color 0.2s; width: 17px; height: 17px;
        }
        .lp-iw:focus-within .lp-ico { color: rgba(16,185,129,0.6); }

        .lp-inp {
          width: 100%; padding: 1.0625rem 1rem 1.0625rem 2.75rem;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; color: rgba(255,255,255,0.9);
          font-size: 0.9375rem; font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .lp-inp::placeholder { color: rgba(255,255,255,0.17); }
        .lp-inp:focus {
          background: rgba(16,185,129,0.045);
          border-color: rgba(16,185,129,0.38);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.08);
        }
        .lp-inp:-webkit-autofill,
        .lp-inp:-webkit-autofill:hover,
        .lp-inp:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px #050f09 inset !important;
          -webkit-text-fill-color: rgba(255,255,255,0.9) !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        .lp-eye {
          position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 0;
          color: rgba(255,255,255,0.2); display: flex; transition: color 0.2s;
        }
        .lp-eye:hover { color: rgba(255,255,255,0.5); }

        /* ── Bottom row: remember ── */
        .lp-rem {
          display: flex; align-items: center; gap: 0.5rem;
          margin: 1.25rem 0 1.75rem;
        }
        .lp-chk { width: 15px; height: 15px; accent-color: #10b981; cursor: pointer; }
        .lp-rem-lbl { font-size: 0.8375rem; color: rgba(255,255,255,0.27); cursor: pointer; }

        /* ── Submit ── */
        .lp-btn {
          width: 100%; padding: 1.0625rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%);
          border: none; border-radius: 13px; color: white;
          font-size: 1rem; font-weight: 700; font-family: 'Inter', sans-serif;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
          letter-spacing: 0.01em;
        }
        .lp-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
          transform: translateX(-100%); transition: transform 0.55s;
        }
        .lp-btn:hover::after { transform: translateX(100%); }
        .lp-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(16,185,129,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .lp-btn:active { transform: scale(0.985); }
        .lp-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .lp-btn-in { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .lp-spin { animation: ring-rot 0.9s linear infinite; }

        /* ── Register (below card) ── */
        .lp-reg {
          text-align: center; margin-top: 1.375rem;
          font-size: 0.875rem; color: rgba(255,255,255,0.28);
        }
        .lp-reg a {
          font-weight: 700; color: rgba(52,211,153,0.75);
          text-decoration: none; transition: color 0.2s;
        }
        .lp-reg a:hover { color: #34d399; }

        /* ── Footer ── */
        .lp-footer {
          position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
          z-index: 30; display: flex; align-items: center; gap: 1.5rem;
          font-size: 0.72rem; white-space: nowrap;
        }
        .lp-fl {
          display: flex; align-items: center; gap: 0.3rem;
          color: rgba(255,255,255,0.22); text-decoration: none;
          transition: color 0.2s; font-weight: 500;
          font-family: 'Inter', sans-serif;
        }
        .lp-fl:hover { color: rgba(52,211,153,0.8); }
        .lp-fsep { color: rgba(255,255,255,0.1); }
      `}</style>

      <div className="lp">
        {/* BG */}
        <Image src="/login-bg.png" alt="" fill priority className="lp-bg"
          style={{ objectFit: 'cover', objectPosition: 'center' }} />
        <div className="lp-ov" />

        {/* Particles */}
        {mounted && (
          <div className="lp-pts">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="lp-pt" style={{
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
        <Link href="/" className="lp-back">
          <ArrowLeft size={15} /> Quay lại Trang chủ
        </Link>

        {/* ── Stacked layout: hero → card → reg ── */}
        <div className="lp-wrap">

          {/* LOGO + TITLE — above the card */}
          <div className="lp-hero">
            <div className="lp-ring">
              <div className="lp-ring-in">E</div>
            </div>
            <h1 className="lp-title">Đăng nhập Admin</h1>
            <p className="lp-sub">
              Chào mừng bạn quay trở lại với <em>EduCore</em>.
            </p>
          </div>

          {/* CARD — form only */}
          <div className="lp-card">
            {error && (
              <div className="lp-err">
                <AlertCircle size={17} /> {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="lp-field">
                <label className="lp-lbl">Email hoặc Số điện thoại</label>
                <div className="lp-iw">
                  <Mail className="lp-ico" />
                  <input
                    required type="text" value={formData.account}
                    onChange={e => setFormData({ ...formData, account: e.target.value })}
                    placeholder="admin@educore.edu.vn"
                    className="lp-inp" autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lp-field">
                <div className="lp-lbl-row">
                  <label className="lp-lbl" style={{ margin: 0 }}>Mật khẩu</label>
                  <Link href="#" className="lp-forgot">Quên mật khẩu?</Link>
                </div>
                <div className="lp-iw">
                  <Lock className="lp-ico" />
                  <input
                    required type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="lp-inp" autoComplete="current-password"
                  />
                  <button type="button" className="lp-eye" tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="lp-rem">
                <input id="rem" type="checkbox" className="lp-chk" />
                <label htmlFor="rem" className="lp-rem-lbl">Ghi nhớ đăng nhập</label>
              </div>

              {/* Submit */}
              <button type="submit" className="lp-btn" disabled={isLoading}>
                <div className="lp-btn-in">
                  {isLoading
                    ? <><Loader2 size={18} className="lp-spin" /> Đang xác thực...</>
                    : <><LogIn size={17} /> Đăng nhập ngay</>
                  }
                </div>
              </button>
            </form>
          </div>

          {/* REGISTER — below card */}
          <div className="lp-reg">
            Chưa có tài khoản?{' '}
            <Link href="/register">Đăng ký ngay</Link>
          </div>
        </div>

        {/* Footer */}
        <div className="lp-footer">
          <a href="#" className="lp-fl"><HelpCircle size={11} /> Hỗ trợ</a>
          <span className="lp-fsep">•</span>
          <a href="#" className="lp-fl"><ShieldCheck size={11} /> Bảo mật</a>
          <span className="lp-fsep">•</span>
          <a href="#" className="lp-fl"><Globe size={11} /> Tiếng Việt</a>
        </div>
      </div>
    </>
  );
}
