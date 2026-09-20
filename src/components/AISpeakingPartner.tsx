import React, { useState, useEffect, useRef } from 'react';
import { EnglishLevel, SpeakingTopic, SpeakingMessage } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  User,
  Bot
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

const DEFAULT_TOPICS: SpeakingTopic[] = [
  {
    id: 'sp_1',
    title: 'Hometown & Living Environment',
    part: 'Part 1 (Introduction)',
    level: 'B1',
    initialQuestion: 'Good day! Let us begin Part 1. Can you describe the town or city where you grew up, and what you like most about it?',
  },
  {
    id: 'sp_2',
    title: 'Describe an unforgettable journey you went on',
    part: 'Part 2 (Cue Card)',
    level: 'B2',
    cueCardPoints: [
      'Where you went and who you were with',
      'What you did during this trip',
      'What challenges or highlights you encountered',
      'Explain why this particular journey remains so memorable to you'
    ],
    initialQuestion: 'Here is your Cue Card. Please take a moment to look at the points and then speak for 1 to 2 minutes when you are ready.',
  },
  {
    id: 'sp_3',
    title: 'Artificial Intelligence & Future Careers',
    part: 'Part 3 (Discussion)',
    level: 'C1',
    initialQuestion: 'In your perspective, how will automation and artificial intelligence reshape the traditional job market over the next two decades?',
  },
];

interface AISpeakingPartnerProps {
  studentLevel: EnglishLevel;
  onAddWordToFlashcards?: (word: string, translation: string, level: EnglishLevel) => void;
}

export const AISpeakingPartner: React.FC<AISpeakingPartnerProps> = ({
  studentLevel,
  onAddWordToFlashcards
}) => {
  const [selectedTopic, setSelectedTopic] = useState<SpeakingTopic>(DEFAULT_TOPICS[0]);
  const [messages, setMessages] = useState<SpeakingMessage[]>([
    {
      id: 'msg_init',
      sender: 'ai',
      text: DEFAULT_TOPICS[0].initialQuestion,
      timestamp: Date.now(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [activeVoiceResponse, setActiveVoiceResponse] = useState<string | null>(null);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition if browser supports it
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setHasSpeechRecognition(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Topic change handler
  const handleSelectTopic = (topic: SpeakingTopic) => {
    setSelectedTopic(topic);
    setMessages([
      {
        id: 'msg_' + Date.now(),
        sender: 'ai',
        text: topic.initialQuestion,
        timestamp: Date.now(),
      }
    ]);
    sound.playCardFlip();
  };

  // Toggle Voice Recording
  const handleToggleRecord = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      sound.playClick();
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        sound.playSuccess();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Speak AI text out loud using browser SpeechSynthesis
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (activeVoiceResponse === text) {
      setActiveVoiceResponse(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => setActiveVoiceResponse(null);
    utterance.onerror = () => setActiveVoiceResponse(null);

    setActiveVoiceResponse(text);
    window.speechSynthesis.speak(utterance);
  };

  // Send speech response to server
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isThinking) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const userText = inputText.trim();
    setInputText('');

    const userMsg: SpeakingMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);
    sound.playCardFlip();

    try {
      const response = await fetch('/api/ai/speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic.title,
          part: selectedTopic.part,
          transcript: userText,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const feedback = resData.data;
        const aiMsg: SpeakingMessage = {
          id: 'msg_ai_' + Date.now(),
          sender: 'ai',
          text: feedback.reply,
          timestamp: Date.now(),
          feedback: {
            pronunciationScore: feedback.pronunciationScore || 80,
            grammarScore: feedback.grammarScore || 78,
            fluencyScore: feedback.fluencyScore || 82,
            corrections: feedback.corrections || [],
            betterPhrasing: feedback.betterPhrasing || '',
          },
        };

        setMessages(prev => [...prev, aiMsg]);
        sound.playSuccess();
        // Auto pronounce examiner question
        handleSpeakText(feedback.reply);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          id: 'msg_err_' + Date.now(),
          sender: 'ai',
          text: 'Thank you for your response! Could you explain that in slightly more detail?',
          timestamp: Date.now(),
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                Gemini AI Speaking Partner
              </span>
              <span className="text-xs text-emerald-200/80">IELTS Speaking Simulyatori</span>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white">
              AI Ovozli Suhbatdosh & Talaffuz Murabbiyi
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl">
              Mikrofon orqali inglizcha gapiring. AI sizning javobingizni eshitadi, xatolar ustida tahlil beradi, talaffuzingizni baholaydi va suhbatni tabiiy davom ettiradi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-800/60 border border-emerald-600/40 text-xs font-bold text-emerald-200">
              Talaba Darajasi: {studentLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Topic Selector & Cue Card */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Suhbat Mavzusi & Qismlari
            </h3>

            <div className="space-y-2">
              {DEFAULT_TOPICS.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTopic(t)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all text-xs ${
                    selectedTopic.id === t.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] uppercase">
                      {t.part}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                      {t.level}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {t.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Cue Card Display if Part 2 */}
            {selectedTopic.cueCardPoints && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  IELTS Cue Card Vazifasi:
                </div>
                <ul className="text-xs text-amber-950 dark:text-amber-300 space-y-1 pl-4 list-disc">
                  {selectedTopic.cueCardPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Column: Interactive Chat & Speech Console */}
        <div className="lg:col-span-2 flex flex-col h-[620px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  IELTS Examiner AI
                </h4>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {isThinking ? 'Tahlil qilinmoqda...' : 'Tinglashga tayyor'}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSelectTopic(selectedTopic)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
              title="Suhbatni qayta boshlash"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Qayta boshlash</span>
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Audio read aloud for AI */}
                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeVoiceResponse === msg.text
                            ? 'bg-emerald-500 text-white animate-pulse'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{activeVoiceResponse === msg.text ? "O'qilmoqda..." : "Eshitish (Audio)"}</span>
                      </button>
                    )}
                  </div>

                  {/* AI Feedback Accordion for student's speech */}
                  {msg.feedback && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-2.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-800/60 pb-2">
                        <span className="font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Talaffuz & Grammatika Tahlili
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-bold">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                            Talaffuz: {msg.feedback.pronunciationScore}%
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100">
                            Grammatika: {msg.feedback.grammarScore}%
                          </span>
                        </div>
                      </div>

                      {msg.feedback.corrections.length > 0 && (
                        <div className="space-y-1">
                          <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block">
                            Tuzatishlar:
                          </span>
                          {msg.feedback.corrections.map((corr, idx) => (
                            <p key={idx} className="text-slate-600 dark:text-slate-300 pl-2 border-l-2 border-rose-400">
                              {corr}
                            </p>
                          ))}
                        </div>
                      )}

                      {msg.feedback.betterPhrasing && (
                        <div className="pt-1">
                          <span className="font-bold text-[11px] text-emerald-800 dark:text-emerald-300 block">
                            Yuqori daraja (IELTS 8.0+) tavsiya qilingan varianti:
                          </span>
                          <p className="italic text-emerald-900 dark:text-emerald-200 pl-2 border-l-2 border-emerald-500 mt-0.5">
                            "{msg.feedback.betterPhrasing}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic pl-11">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Examiner javobingizni tahlil qilmoqda...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Voice & Text Input Toolbar */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              
              {/* Mic toggle */}
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`p-3 rounded-2xl transition-all flex items-center justify-center shrink-0 ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-lg animate-pulse ring-4 ring-rose-300 dark:ring-rose-900'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                }`}
                title={isRecording ? "Yozishni to'xtatish" : "Mikrofon orqali gapirish"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={
                  isRecording
                    ? "Sizni tinglayapman, gapiring..."
                    : "Inglizcha javobingizni yozing yoki mikrofonni bosing..."
                }
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-colors shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-1">
              <span>Mikrofon tugmasi Web Speech API orqali ovozingizni avtomatik matnga aylantiradi.</span>
              {isRecording && (
                <span className="text-rose-500 font-bold flex items-center gap-1 animate-pulse">
                  ● Jonli yozilmoqda
                </span>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
