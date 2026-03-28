import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../store/appStore';
import type { FarmState } from '../../store/appStore';
import { apiClient } from '../../services/api/client';

const STATES: { id: FarmState; emoji: string; color: string; gradient: string; labelKey: string; descKey: string }[] = [
  {
    id: 'fallow',
    emoji: '🏜️',
    color: 'text-amber-700',
    gradient: 'from-amber-50 to-orange-50',
    labelKey: 'farmState.fallow',
    descKey: 'farmState.fallowDesc',
  },
  {
    id: 'cultivating',
    emoji: '🌱',
    color: 'text-agri-green',
    gradient: 'from-emerald-50 to-green-50',
    labelKey: 'farmState.cultivating',
    descKey: 'farmState.cultivatingDesc',
  },
  {
    id: 'post-harvest',
    emoji: '🌾',
    color: 'text-agri-olive',
    gradient: 'from-yellow-50 to-amber-50',
    labelKey: 'farmState.postHarvest',
    descKey: 'farmState.postHarvestDesc',
  },
];

export const FarmStateScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { farmState, setFarmState } = useAppStore();

  const handleSelect = (state: FarmState) => {
    setFarmState(state);
    apiClient.setCategory(state);
    navigate('/onboarding');
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="text-center">
        <span className="text-4xl">🌍</span>
        <h2 className="text-2xl font-bold text-agri-green mt-2">{t('farmState.title')}</h2>
        <p className="text-agri-olive/80 text-sm mt-1">{t('farmState.title')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {STATES.map((s, idx) => (
          <div
            key={s.id}
            className="page-enter"
            style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
          >
            <Card
              selected={farmState === s.id}
              onClick={() => handleSelect(s.id)}
              className={`flex items-center gap-5 p-5 bg-gradient-to-r ${s.gradient}`}
            >
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm text-4xl transition-transform duration-300 group-hover:scale-110">
                {s.emoji}
              </div>
              <div>
                <div className={`text-xl font-bold ${s.color}`}>{t(s.labelKey)}</div>
                <div className="text-agri-olive/80 text-sm mt-0.5">{t(s.descKey)}</div>
              </div>
              {farmState === s.id && (
                <div className="ml-auto shrink-0 w-6 h-6 rounded-full bg-agri-green flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
