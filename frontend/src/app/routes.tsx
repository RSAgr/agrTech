import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { AppLayout } from '../components/layout/AppLayout';

// Lazy load screens
const LoginScreen = React.lazy(() => import('../features/auth/Login').then(m => ({ default: m.LoginScreen })));
const LanguageSelectScreen = React.lazy(() => import('../features/language/LanguageSelect').then(m => ({ default: m.LanguageSelectScreen })));
const FarmStateScreen = React.lazy(() => import('../features/farmState/FarmStateSelect').then(m => ({ default: m.FarmStateScreen })));
const GuidedOnboardingScreen = React.lazy(() => import('../features/onboarding/GuidedOnboarding').then(m => ({ default: m.GuidedOnboardingScreen })));
const ChatScreen = React.lazy(() => import('../features/chat/ChatScreen').then(m => ({ default: m.ChatScreen })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAppStore(state => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center font-medium text-agri-green">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/language" element={<LanguageSelectScreen />} />
          <Route path="/farm-state" element={<FarmStateScreen />} />
          <Route path="/onboarding" element={<GuidedOnboardingScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
          
          <Route path="/" element={<Navigate to="/language" replace />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
};
