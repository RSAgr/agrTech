import { useState, useEffect, useCallback } from 'react';

// Extend window for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeech(language: string = 'en-US') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSupported(true);
        const autoLang = getSpeechLangByCode(language);
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = autoLang;

        recognitionInstance.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript('');
      recognition.lang = getSpeechLangByCode(language);
      recognition.start();
      setIsListening(true);
    }
  }, [recognition, language]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    supported,
    resetTranscript: () => setTranscript('')
  };
}

// Map app language code to BCP 47 language tags for SpeechRecognition
function getSpeechLangByCode(code: string): string {
  const map: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    bn: 'bn-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    ml: 'ml-IN'
  };
  return map[code] || 'en-US';
}
