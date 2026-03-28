import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Send, Square, Camera, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import type { ChatMessage, Language } from '../../store/appStore';
import { apiClient } from '../../services/api/client';
import { useSpeech } from '../../services/speech/useSpeech';
import { Button } from '../../components/ui/Button';
import { marked } from 'marked';

const WelcomeBanner: React.FC = () => {
  const { t } = useTranslation();
  const { onboardingData } = useAppStore();
  const crop = onboardingData.phase2?.crop;
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="w-20 h-20 rounded-full bg-agri-green/10 flex items-center justify-center text-4xl shadow-inner animate-pulse">
        🌾
      </div>
      <h3 className="text-xl font-bold text-agri-green">Kisan Connect</h3>
      <p className="text-agri-olive/80 text-sm max-w-[240px]">
        {t('chat.placeholder')}{crop ? ` 🌱 ${crop}` : ''}
      </p>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {['🌤 Weather advice', '🐛 Pest control', '💧 Irrigation'].map(tip => (
          <span key={tip} className="text-xs bg-agri-green/10 text-agri-green px-3 py-1.5 rounded-full font-medium border border-agri-green/20">
            {tip}
          </span>
        ))}
      </div>
    </div>
  );
};

export const ChatScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { messages, addMessage, isOffline, language, setLanguage, farmState, onboardingData, userId } = useAppStore();
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [lastBotMsg, setLastBotMsg] = useState<string | null>(null);
  const [lastUserMsg, setLastUserMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, supported, resetTranscript } = useSpeech(language);

  // Define supported languages for the dropdown
  const SUPPORTED_LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'bn', label: 'Bengali' },
    { code: 'te', label: 'Telugu' },
    { code: 'mr', label: 'Marathi' },
    { code: 'ta', label: 'Tamil' },
    { code: 'kn', label: 'Kannada' },
    { code: 'gu', label: 'Gujarati' },
    { code: 'pa', label: 'Punjabi' },
    { code: 'ml', label: 'Malayalam' },
  ] as const;

  useEffect(() => {
    if (isListening && transcript) setInput(transcript);
  }, [transcript, isListening]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } else {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || isOffline || loading) return;
    if (isListening) stopListening();

    const text = input.trim();
    const currentImage = selectedImage;
    const userMsg: ChatMessage = { id: Date.now().toString(), text, image: currentImage || undefined, sender: 'user', timestamp: Date.now() };
    addMessage(userMsg);
    setInput('');
    setSelectedImage(null);
    resetTranscript();
    setLoading(true);

    // If we have a previous bot response + this is a follow-up — send feedback first
    // ML_ENDPOINT: POST /ml/feedback — forward farmer's follow-up as implicit feedback
    if (lastBotMsg && lastUserMsg) {
      apiClient.sendFeedback({
        userId: userId || 'anonymous',
        originalQuery: lastUserMsg,
        mlResponse: lastBotMsg,
        farmerFollowup: text,
        lang: language,
        timestamp: Date.now(),
      }).catch(() => {}); // fire-and-forget
    }

    setLastUserMsg(text);

    try {
      // ML_ENDPOINT: POST /ml/query — full context is forwarded to ML backend
      const res = await apiClient.askQuery(
        text,
        'model-v1',
        language,
        farmState || 'fallow',
        onboardingData,
        userId || 'anonymous',
        currentImage || undefined
      );
      const botText = res.answer || '...';
      setLastBotMsg(botText);
      addMessage({ id: (Date.now() + 1).toString(), text: botText, sender: 'bot', timestamp: Date.now() });
    } catch {
      addMessage({ id: (Date.now() + 1).toString(), text: t('chat.errorText'), sender: 'bot', timestamp: Date.now() });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    apiClient.setLanguage(newLang);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Context chips */}
      <div className="shrink-0 flex gap-2 flex-wrap px-1 py-2 items-center">
        <span className="text-xs bg-agri-green/10 text-agri-green px-3 py-1.5 rounded-full border border-agri-green/20 font-medium">
          🌱 {farmState ?? 'Farm'}
        </span>
        
        <select
          value={language}
          onChange={handleLanguageChange}
          className="text-xs bg-agri-olive/10 text-agri-olive px-8 py-1.5 rounded-full border border-agri-olive/20 font-medium outline-none cursor-pointer appearance-none shadow-sm flex-1 max-w-[140px]"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
        >
          {SUPPORTED_LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>🌐 {l.label}</option>
          ))}
        </select>

        {onboardingData.phase2?.crop && (
          <span className="text-xs bg-agri-green/10 text-agri-green px-3 py-1.5 rounded-full border border-agri-green/20 font-medium">
            🌾 {onboardingData.phase2.crop}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-2 px-1">
        {messages.length === 0 && <WelcomeBanner />}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-enter flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-agri-green flex items-center justify-center text-white text-xs shrink-0 mr-2 mt-1 shadow">
                🌾
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-agri-green text-white rounded-tr-sm'
                  : 'bg-white border border-gray-100 text-agri-dark rounded-tl-sm'
              }`}
            >
              {msg.image && (
                <img src={msg.image} alt="Upload" className="max-w-full h-auto rounded-lg mb-2 shadow-sm" />
              )}
              {msg.sender === 'bot' ? (
                <div
                  className="prose prose-sm max-w-none text-agri-dark prose-p:leading-relaxed prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-a:text-agri-green"
                  dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }}
                />
              ) : (
                <div className="whitespace-pre-wrap">{msg.text}</div>
              )}
              <div className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-agri-green flex items-center justify-center text-white text-xs shrink-0 shadow">🌾</div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
              {[0, 150, 300].map(d => (
                <div key={d} className="w-2 h-2 rounded-full bg-agri-green/60 animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-sm p-3">
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg shadow-sm border border-gray-200" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 z-10"
            >
              <X size={14} />
            </button>
          </div>
        )}
        {isOffline && (
          <div className="text-center text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-full py-1.5 px-4 mb-2 font-medium">
            ⚠️ {t('chat.offlineNotice')}
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-2 items-end">
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isOffline || loading}
            className="w-12 h-12 !px-0 !py-0 shrink-0 rounded-full flex items-center justify-center border-gray-200 bg-white text-gray-500 hover:text-agri-green hover:bg-agri-green/10"
          >
            <Camera size={20} />
          </Button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              rows={1}
              disabled={isOffline || loading}
              className="w-full input resize-none min-h-[48px] max-h-[120px] pr-10 text-base leading-relaxed py-3"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
            />
            {supported && (
              <button
                type="button"
                onClick={() => isListening ? stopListening() : startListening()}
                disabled={isOffline || loading}
                className={`absolute right-3 bottom-3 p-1.5 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 text-white shadow-lg animate-pulse scale-110'
                    : 'text-agri-olive hover:text-agri-green hover:bg-agri-green/10'
                }`}
              >
                {isListening ? <Square size={18} /> : <Mic size={18} />}
              </button>
            )}
          </div>
          <Button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isOffline || loading}
            className="w-12 h-12 !px-0 !py-0 shrink-0 rounded-full flex items-center justify-center"
          >
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};
