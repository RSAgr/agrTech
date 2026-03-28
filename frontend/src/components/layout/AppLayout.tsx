import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { WifiOff, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ALL_LANGUAGES = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'kn', 'gu', 'pa', 'ml'] as const;

const Header: React.FC = () => {
  const { isOffline, language, setLanguage } = useAppStore();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const steps = ['/language', '/farm-state', '/onboarding', '/chat'];
  const stepIdx = steps.indexOf(location.pathname);

  const cycleLang = () => {
    const currentIdx = ALL_LANGUAGES.indexOf(language as any);
    const next = ALL_LANGUAGES[(currentIdx + 1) % ALL_LANGUAGES.length];
    setLanguage(next as any);
    i18n.changeLanguage(next);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm flex items-center justify-between px-5">
      <button
        onClick={() => navigate('/chat')}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-9 h-9 rounded-full bg-agri-green flex items-center justify-center text-white font-bold text-sm shadow-md" style={{ animation: 'pulseGlow 4s ease-in-out infinite' }}>
          🌾
        </div>
        <span className="font-bold text-agri-green hidden sm:block text-lg">Kisan Connect</span>
      </button>

      {/* Route progress dots */}
      {stepIdx >= 0 && (
        <div className="flex gap-2 items-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${i <= stepIdx ? 'w-3 h-3 bg-agri-green shadow-sm' : 'w-2 h-2 bg-gray-300'}`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        {isOffline && (
          <div className="flex items-center gap-1.5 text-orange-600 text-sm font-medium bg-orange-50 border border-orange-200 px-3 py-1 rounded-full animate-pulse">
            <WifiOff size={14} />
            <span>Offline</span>
          </div>
        )}
        <button
          onClick={cycleLang}
          title="Cycle language (EN → HI → BN → TE → ...)"
          className="flex items-center gap-1.5 text-agri-olive hover:text-agri-green transition-colors px-3 py-1.5 rounded-full hover:bg-agri-green/10"
        >
          <Globe size={18} />
          <span className="text-sm font-semibold uppercase">{language}</span>
        </button>
      </div>
    </header>
  );
};

export const AppLayout: React.FC = () => {
  const { setOffline, language } = useAppStore();
  const { i18n } = useTranslation();

  // Restore persisted language into i18n on mount (e.g. after page refresh)
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOffline]);

  return (
    <div className="min-h-screen bg-agri-offwhite">
      {/* Subtle background texture */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(26,86,50,0.08) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(107,112,92,0.06) 0%, transparent 50%)`
      }} />

      <Header />

      <main className="relative z-10 pt-16 w-full max-w-lg mx-auto px-4 py-6 flex flex-col min-h-screen">
        <div className="page-enter flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
