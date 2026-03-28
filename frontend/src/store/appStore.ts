import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'kn' | 'gu' | 'pa' | 'ml';
export type FarmState = 'fallow' | 'cultivating' | 'post-harvest';

export interface OnboardingData {
  phase1?: {
    history: string;
    timeWindow: string;
  };
  phase2?: {
    crop: string;
    stage: string;
    irrigation: string;
    symptoms: string;
  };
  phase3?: {
    nextCrop: string;
    targetHarvest: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

interface AppState {
  // Auth
  token: string | null;
  userId: string | null;
  setAuth: (token: string, userId: string) => void;
  logout: () => void;

  // Preferences & Context
  language: Language;
  setLanguage: (lang: Language) => void;
  
  farmState: FarmState | null;
  setFarmState: (state: FarmState) => void;
  
  onboardingData: OnboardingData;
  setOnboardingData: (phase: keyof OnboardingData, data: any) => void;
  
  // Chat
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  
  // Network
  isOffline: boolean;
  setOffline: (status: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      setAuth: (token, userId) => set({ token, userId }),
      logout: () => set({ token: null, userId: null, farmState: null, onboardingData: {}, messages: [] }),
      
      language: 'en',
      setLanguage: (language) => set({ language }),
      
      farmState: null,
      setFarmState: (farmState) => set({ farmState }),
      
      onboardingData: {},
      setOnboardingData: (phase, data) => 
        set((state) => ({
          onboardingData: { ...state.onboardingData, [phase]: data }
        })),
        
      messages: [],
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      clearMessages: () => set({ messages: [] }),
      
      isOffline: !navigator.onLine,
      setOffline: (isOffline) => set({ isOffline })
    }),
    {
      name: 'kisan-connect-storage',
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        language: state.language,
        farmState: state.farmState,
        onboardingData: state.onboardingData,
        messages: state.messages
      })
    }
  )
);
