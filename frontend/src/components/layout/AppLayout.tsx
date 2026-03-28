import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { WifiOff, Globe, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Language } from '../../store/appStore';

const SUPPORTED_LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English',    native: 'English'   },
  { code: 'hi', label: 'Hindi',      native: 'हिंदी'      },
  { code: 'bn', label: 'Bengali',    native: 'বাংলা'     },
  { code: 'te', label: 'Telugu',     native: 'తెలుగు'    },
  { code: 'mr', label: 'Marathi',    native: 'मराठी'      },
  { code: 'ta', label: 'Tamil',      native: 'தமிழ்'     },
  { code: 'kn', label: 'Kannada',    native: 'ಕನ್ನಡ'      },
  { code: 'gu', label: 'Gujarati',   native: 'ગુજરાતી'   },
  { code: 'pa', label: 'Punjabi',    native: 'ਪੰਜਾਬੀ'    },
  { code: 'ml', label: 'Malayalam',  native: 'മലയാളം'    },
];

const Header: React.FC = () => {
  const { isOffline, language, setLanguage } = useAppStore();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const steps = ['/language', '/farm-state', '/onboarding', '/chat'];
  const stepIdx = steps.indexOf(location.pathname);

  const handleLangSelect = (code: Language) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language);

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

        {/* Language dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-1.5 text-agri-olive hover:text-agri-green transition-colors px-3 py-1.5 rounded-full hover:bg-agri-green/10 border border-transparent hover:border-agri-green/20"
          >
            <Globe size={16} />
            <span className="text-sm font-semibold uppercase">{currentLang?.code ?? language}</span>
            <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLangSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-agri-green/8 ${
                    lang.code === language
                      ? 'bg-agri-green/10 text-agri-green font-semibold'
                      : 'text-agri-dark'
                  }`}
                >
                  <span>{lang.label}</span>
                  <span className="text-xs text-gray-400">{lang.native}</span>
                </button>
              ))}
            </div>
          )}
        </div>
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
