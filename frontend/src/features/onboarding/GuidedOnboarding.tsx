import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/ui/InputField';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../store/appStore';
import { apiClient } from '../../services/api/client';

export const GuidedOnboardingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { onboardingData, setOnboardingData } = useAppStore();
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Local state for forms
  const [phase1, setPhase1Local] = useState({ history: onboardingData.phase1?.history || '', timeWindow: onboardingData.phase1?.timeWindow || '' });
  const [phase2, setPhase2Local] = useState({ crop: onboardingData.phase2?.crop || '', stage: onboardingData.phase2?.stage || '', irrigation: onboardingData.phase2?.irrigation || '', symptoms: onboardingData.phase2?.symptoms || '' });
  const [phase3, setPhase3Local] = useState({ nextCrop: onboardingData.phase3?.nextCrop || '', targetHarvest: onboardingData.phase3?.targetHarvest || '' });

  const handleNext = async () => {
    setLoading(true);
    try {
      if (phase === 1) {
        setOnboardingData('phase1', phase1);
        await apiClient.onboardingPhase(1, phase1).catch(() => {});
        setPhase(2);
      } else if (phase === 2) {
        setOnboardingData('phase2', phase2);
        await apiClient.onboardingPhase(2, phase2).catch(() => {});
        setPhase(3);
      } else {
        setOnboardingData('phase3', phase3);
        await apiClient.onboardingPhase(3, phase3).catch(() => {});
        navigate('/chat');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (phase > 1) setPhase((p) => (p - 1) as any);
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-agri-green">
          {t(`onboarding.phase${phase}.title`)}
        </h2>
        <span className="text-sm font-bold text-agri-olive bg-agri-olive/10 px-3 py-1 rounded-round">
          {phase} / 3
        </span>
      </div>

      <Card className="p-6 flex flex-col gap-6">
        {phase === 1 && (
          <div className="flex flex-col gap-6">
            <InputField
              label={t('onboarding.phase1.historyLabel')}
              value={phase1.history}
              onChange={(e) => setPhase1Local({ ...phase1, history: e.target.value })}
              placeholder="e.g. Wheat"
            />
            <InputField
              label={t('onboarding.phase1.timeWindowLabel')}
              type="date"
              value={phase1.timeWindow}
              onChange={(e) => setPhase1Local({ ...phase1, timeWindow: e.target.value })}
            />
          </div>
        )}

        {phase === 2 && (
          <div className="flex flex-col gap-6">
             <InputField
              label={t('onboarding.phase2.cropLabel')}
              value={phase2.crop}
              onChange={(e) => setPhase2Local({ ...phase2, crop: e.target.value })}
              placeholder="e.g. Rice"
            />
            <InputField
              label={t('onboarding.phase2.stageLabel')}
              value={phase2.stage}
              onChange={(e) => setPhase2Local({ ...phase2, stage: e.target.value })}
              placeholder="e.g. Vegetative"
            />
            <InputField
              label={t('onboarding.phase2.irrigationLabel')}
              value={phase2.irrigation}
              onChange={(e) => setPhase2Local({ ...phase2, irrigation: e.target.value })}
              placeholder="e.g. Rain-fed"
            />
            <InputField
              label={t('onboarding.phase2.symptomsLabel')}
              value={phase2.symptoms}
              onChange={(e) => setPhase2Local({ ...phase2, symptoms: e.target.value })}
              placeholder="e.g. Yellow leaves"
            />
          </div>
        )}

        {phase === 3 && (
          <div className="flex flex-col gap-6">
            <InputField
              label={t('onboarding.phase3.nextCropLabel')}
              value={phase3.nextCrop}
              onChange={(e) => setPhase3Local({ ...phase3, nextCrop: e.target.value })}
              placeholder="e.g. Mustard"
            />
            <InputField
              label={t('onboarding.phase3.targetHarvestLabel')}
              type="date"
              value={phase3.targetHarvest}
              onChange={(e) => setPhase3Local({ ...phase3, targetHarvest: e.target.value })}
            />
          </div>
        )}

        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
          {phase > 1 && (
            <Button variant="secondary" onClick={handleBack} className="flex-1" disabled={loading}>
              {t('onboarding.back')}
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1" isLoading={loading}>
            {phase === 3 ? t('onboarding.finish') : t('onboarding.next')}
          </Button>
        </div>
      </Card>
    </div>
  );
};
