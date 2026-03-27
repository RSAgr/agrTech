import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../store/appStore';
import { apiClient } from '../../services/api/client';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
];

export const LanguageSelectScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { language, setLanguage } = useAppStore();

  const handleSelect = (code: string) => {
    setLanguage(code as any);
    i18n.changeLanguage(code);
    apiClient.setLanguage(code);
    navigate('/farm-state');
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="text-center">
        <span className="text-4xl">🗣️</span>
        <h2 className="text-2xl font-bold text-agri-green mt-2">{t('language.title')}</h2>
        <p className="text-agri-olive/80 text-sm mt-1">Select your preferred language</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {LANGUAGES.map((lang, idx) => (
          <div
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className="page-enter"
            style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'both' }}
          >
            <Card
              selected={language === lang.code}
              className="flex flex-col items-center justify-center py-5 gap-1 text-center"
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-xl font-bold text-agri-dark leading-tight">{lang.native}</span>
              <span className="text-xs text-agri-olive">{lang.label}</span>
              {language === lang.code && (
                <span className="text-xs text-agri-green font-semibold mt-1">✓ Selected</span>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
