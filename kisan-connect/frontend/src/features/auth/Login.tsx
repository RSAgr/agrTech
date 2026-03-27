import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/ui/InputField';
import { apiClient } from '../../services/api/client';
import { useAppStore } from '../../store/appStore';

// Decorative SVG leaf shapes for the background
const FloatingLeaf = ({ style, delay = 0 }: { style?: React.CSSProperties; delay?: number }) => (
  <svg
    style={{ ...style, animationDelay: `${delay}s` }}
    className="absolute opacity-10 floating"
    width="60" height="60" viewBox="0 0 60 60" fill="white"
  >
    <path d="M30 5 C15 15, 5 30, 15 45 C20 52, 28 55, 35 50 C45 42, 55 28, 45 15 C40 8, 35 3, 30 5 Z" />
  </svg>
);

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useAppStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) { setError(t('login.invalidPhone')); return; }
    setError('');
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.login(phone, otp);
      setAuth(res.token, res.userId);
      navigate('/language');
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-bg relative overflow-hidden">
      {/* Decorative floating leaves */}
      <FloatingLeaf style={{ top: '8%', left: '10%', width: 80, height: 80 }} delay={0} />
      <FloatingLeaf style={{ top: '20%', right: '8%', width: 50, height: 50, transform: 'rotate(45deg)' }} delay={1.5} />
      <FloatingLeaf style={{ bottom: '15%', left: '6%', width: 40, height: 40, transform: 'rotate(-30deg)' }} delay={3} />
      <FloatingLeaf style={{ bottom: '25%', right: '12%', width: 70, height: 70 }} delay={2} />
      <FloatingLeaf style={{ top: '50%', left: '3%', width: 30, height: 30, transform: 'rotate(60deg)' }} delay={0.5} />

      {/* Glowing orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-agri-light/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-agri-green/30 blur-3xl pointer-events-none" />

      {/* Content card */}
      <div className="relative z-10 w-full max-w-sm mx-4 page-enter">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4 mx-auto shadow-lg" style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}>
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">{t('login.title')}</h1>
          <p className="text-white/70 mt-2 text-lg">{t('login.subtitle')}</p>
        </div>

        {/* Glass card */}
        <div className="glass-panel p-8">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
              <InputField
                label={t('login.phoneNumber')}
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="9876543210"
                error={error}
              />
              <Button type="submit" className="w-full mt-2">
                {t('login.sendOtp')} →
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="text-center text-agri-dark/60 text-sm mb-1">
                Code sent to <strong className="text-agri-green">{phone}</strong>
              </div>
              <InputField
                label={t('login.otp')}
                type="number"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP"
                error={error}
              />
              <Button type="submit" className="w-full" isLoading={loading}>
                {t('login.login')} ✓
              </Button>
              <button
                type="button"
                className="text-agri-green text-sm hover:underline text-center transition-colors"
                onClick={() => { setStep(1); setError(''); }}
              >
                ← Change number
              </button>
            </form>
          )}
        </div>

        <p className="text-white/40 text-xs text-center mt-6">
          Kisan Connect · Digital Agriculture Advisor · India
        </p>
      </div>
    </div>
  );
};
