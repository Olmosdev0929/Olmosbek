import React, { useState, useEffect } from 'react';
import { EnglishLevel, MockExam, MockExamResult } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Headphones,
  Check,
  X,
  TrendingDown
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

const SAMPLE_MOCK_EXAM: MockExam = {
  id: 'mock_ielts_1',
  title: 'IELTS Academic & CEFR Full Mock Simulation',
  level: 'B2',
  type: 'IELTS Academic',
  timeLimitMinutes: 15,
  totalQuestions: 6,
  questions: [
    {
      id: 'q1',
      section: 'listening',
      questionText: 'What is the primary reason the university expanded its solar panel infrastructure?',
      audioPrompt: 'The vice-chancellor emphasized that although cutting operational expenses was advantageous, the decisive factor was mitigating the campus aggregate carbon footprint in alignment with the national green transition accord.',
      options: [
        'To reduce tuition fees for incoming international undergraduates',
        'To curb the university total carbon footprint in line with national accords',
        'To generate surplus electricity and sell it to local municipalities',
        'To replace the outdated hydraulic heating grid across dormitories'
      ],
      correctIndex: 1,
      topicCategory: 'Detail',
      explanation: 'The speaker explicitly states that "the decisive factor was mitigating the campus aggregate carbon footprint in alignment with the national green transition accord".'
    },
    {
      id: 'q2',
      section: 'listening',
      questionText: 'According to the lecturer, what implication does artificial automation have on creative writing?',
      audioPrompt: 'Contrary to prevalent apprehensions, algorithmic synthesis does not extinguish human artistic genius; rather, it dismantles mechanical drafting bottlenecks, enabling authors to orchestrate deeper character psychologies.',
      options: [
        'It completely supplants human novelists in mainstream publishing',
        'It eliminates routine mechanical drafting, allowing deeper thematic focus',
        'It drastically decreases public demand for literary works',
        'It forces authors to conform to homogenized narrative tropes'
      ],
      correctIndex: 1,
      topicCategory: 'Inference',
      explanation: 'The speaker states that automation "dismantles mechanical drafting bottlenecks, enabling authors to orchestrate deeper character psychologies".'
    },
    {
      id: 'q3',
      section: 'reading',
      passageText: `Bioluminescence, the emission of light by living organisms, is predominantly observed in oceanic ecosystems where sunlight is severely attenuated. Organisms produce chemical light through the oxidation of luciferin catalyzed by luciferase enzymes. Marine biologists identify multiple evolutionary utilities for this adaptation: predatory counter-illumination, intraspecific mating signaling, and startling prospective assailants.

Recent biotechnical ventures have begun transcribing these enzymatic genetic sequences into floral flora, envisioning self-illuminating urban arboretums that could potentially supplant carbon-intensive municipal streetlights.`,
      questionText: 'Which of the following is identified as a potential modern biotechnological application of bioluminescence?',
      options: [
        'Producing synthetic oceanic dietary supplements for fish farming',
        'Genetically engineering glowing trees to reduce municipal streetlamp electricity usage',
        'Creating chemical pesticides that activate solely during nighttime',
        'Detecting early submarine seismic vibrations along tectonic faults'
      ],
      correctIndex: 1,
      topicCategory: 'Detail',
      explanation: 'The passage highlights "transcribing these enzymatic genetic sequences into floral flora, envisioning self-illuminating urban arboretums that could potentially supplant carbon-intensive municipal streetlights".'
    },
    {
      id: 'q4',
      section: 'reading',
      passageText: `Bioluminescence, the emission of light by living organisms, is predominantly observed in oceanic ecosystems where sunlight is severely attenuated...`,
      questionText: 'What does the term "attenuated" in the first sentence most nearly denote?',
      options: [
        'Amplified and polarized',
        'Weakened, reduced, or diminished',
        'Reflected by salinity gradients',
        'Artificially accelerated'
      ],
      correctIndex: 1,
      topicCategory: 'Vocabulary in Context',
      explanation: 'In deep ocean water, sunlight is "attenuated", meaning it is weakened and significantly diminished as depth increases.'
    },
    {
      id: 'q5',
      section: 'reading',
      passageText: `Cognitive psychologists have long investigated the spacing effect—a psychological phenomenon wherein learning is substantially greater when study sessions are spaced over time, rather than condensed into an intensive mass session. Spaced repetition forces neural retrieval effort, strengthening synaptic consolidation.`,
      questionText: 'What can be inferred regarding intensive "cramming" before an examination?',
      options: [
        'It provides durable long-term conceptual retention with minimal cognitive fatigue',
        'It induces rapid superficial familiarity but yields inferior long-term memory consolidation',
        'It stimulates synaptic plasticity more effectively than interval study',
        'It is scientifically proven to be optimal for complex STEM mathematical subjects'
      ],
      correctIndex: 1,
      topicCategory: 'Inference',
      explanation: 'The text highlights that spacing out sessions forces retrieval effort and strengthens synaptic consolidation, implying massed cramming yields poor durable retention.'
    },
    {
      id: 'q6',
      section: 'reading',
      passageText: `Cognitive psychologists have long investigated the spacing effect...`,
      questionText: 'What is the primary rhetorical purpose of the passage?',
      options: [
        'To critique standardized university examination formatting',
        'To elucidate the cognitive and neurological justification for spaced learning',
        'To compare psychological conditioning across animal species',
        'To advocate for shorter academic semesters in secondary education'
      ],
      correctIndex: 1,
      topicCategory: 'Main Idea',
      explanation: 'The passage explains why spaced repetition produces superior learning outcomes via neural retrieval effort and synaptic consolidation.'
    }
  ]
};

interface MockExamArenaProps {
  studentLevel: EnglishLevel;
}

export const MockExamArena: React.FC<MockExamArenaProps> = ({ studentLevel }) => {
  const [examState, setExamState] = useState<'intro' | 'active' | 'finished'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(SAMPLE_MOCK_EXAM.timeLimitMinutes * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [result, setResult] = useState<MockExamResult | null>(null);

  // Timer countdown
  useEffect(() => {
    if (examState !== 'active' || isTimerPaused) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [examState, isTimerPaused]);

  // Start exam
  const handleStartExam = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(SAMPLE_MOCK_EXAM.timeLimitMinutes * 60);
    setExamState('active');
    sound.playCardFlip();
  };

  // Play audio for listening question
  const handlePlayAudioPrompt = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = 0.9;
    u.onend = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(u);
  };

  // Select answer
  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
    sound.playClick();
  };

  // Calculate score & finish
  const handleFinishExam = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    let correctCount = 0;
    const weakTopicsMap: Record<string, { count: number; advice: string }> = {};

    SAMPLE_MOCK_EXAM.questions.forEach((q, idx) => {
      const isCorrect = userAnswers[idx] === q.correctIndex;
      if (isCorrect) {
        correctCount++;
      } else {
        if (!weakTopicsMap[q.topicCategory]) {
          weakTopicsMap[q.topicCategory] = {
            count: 0,
            advice: getTopicAdvice(q.topicCategory),
          };
        }
        weakTopicsMap[q.topicCategory].count++;
      }
    });

    const percentage = Math.round((correctCount / SAMPLE_MOCK_EXAM.totalQuestions) * 100);
    let band = 'IELTS 5.5 (CEFR B1)';
    if (percentage >= 85) band = 'IELTS 8.0 - 8.5 (CEFR C1+)';
    else if (percentage >= 70) band = 'IELTS 7.0 - 7.5 (CEFR B2+)';
    else if (percentage >= 50) band = 'IELTS 6.0 - 6.5 (CEFR B2)';

    const weakTopics = Object.entries(weakTopicsMap).map(([topic, data]) => ({
      topic,
      incorrectCount: data.count,
      advice: data.advice,
    }));

    setResult({
      examId: SAMPLE_MOCK_EXAM.id,
      score: correctCount,
      percentage,
      estimatedBand: band,
      completedAt: new Date().toLocaleDateString('uz-UZ'),
      timeSpentSeconds: SAMPLE_MOCK_EXAM.timeLimitMinutes * 60 - timeLeftSeconds,
      weakTopics,
    });

    setExamState('finished');
    sound.playConfetti();
  };

  const getTopicAdvice = (category: string) => {
    switch (category) {
      case 'Vocabulary in Context':
        return "Matn ichidagi notanish so'zlarning sinonimlarini matn mantiqidan kelib chiqib taxmin qilish ustida ko'proq mashq qiling.";
      case 'Inference':
        return "Muallif to'g'ridan-to'g'ri aytmagan, ammo mantiqiy xulosa qilib chiqarilishi kerak bo'lgan jumlalarga ko'proq e'tibor qarating.";
      case 'Detail':
        return "Savoldagi kalit so'zlarni (Keywords) matndan tez topish (Scanning) usulini rivojlantiring.";
      default:
        return "Matnning asosiy g'oyasini umumiy tushunish (Skimming) ko'nikmasini kuchaytiring.";
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = SAMPLE_MOCK_EXAM.questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-3xl bg-linear-to-r from-red-900 via-rose-900 to-slate-900 text-white p-6 shadow-xl border border-rose-700/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-rose-300" />
                IELTS & CEFR Mock Simulator
              </span>
              <span className="text-xs text-rose-200/80">Listening & Reading Sinovi</span>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white">
              To'liq Mock Exam & Xatolar Tahlili
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/80 mt-1 max-w-2xl">
              Haqiqiy imtihon sharoitida o'zingizni sinab ko'ring. Sinovdan so'ng testdagi barcha xatolaringiz mavzular bo'yicha tahlil qilinadi va shaxsiy tavsiyalar beriladi.
            </p>
          </div>

          {examState === 'active' && (
            <div className="flex items-center gap-3 bg-rose-950/80 px-4 py-2 rounded-2xl border border-rose-500/40">
              <Clock className="w-5 h-5 text-rose-400 animate-pulse" />
              <div className="text-right">
                <span className="text-[10px] uppercase text-rose-300 block font-bold">Qolgan vaqt:</span>
                <span className="text-xl font-mono font-black text-white">{formatTimer(timeLeftSeconds)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1. INTRO STATE */}
      {examState === 'intro' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-2xl mx-auto space-y-6 py-12">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {SAMPLE_MOCK_EXAM.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Ushbu sinov Listening va Reading qismlaridan iborat 6 ta akademik savolni o'z ichiga oladi. Vaqt me'yori: 15 daqiqa.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Format:</span>
              <span className="font-bold text-slate-900 dark:text-white">IELTS Academic</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Savollar:</span>
              <span className="font-bold text-slate-900 dark:text-white">6 ta savol</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Vaqt:</span>
              <span className="font-bold text-slate-900 dark:text-white">15 daqiqa</span>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Imtihonni Boshlash</span>
          </button>
        </div>
      )}

      {/* 2. ACTIVE EXAM STATE */}
      {examState === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Question Arena */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  {currentQ.section === 'listening' ? <Headphones className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  {currentQ.section.toUpperCase()} • Savol #{currentQuestionIndex + 1}
                </span>

                <span className="text-xs text-slate-400 font-medium">
                  {Object.keys(userAnswers).length} / {SAMPLE_MOCK_EXAM.totalQuestions} javob berildi
                </span>
              </div>

              {/* Listening Audio Prompt */}
              {currentQ.section === 'listening' && currentQ.audioPrompt && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Headphones className="w-4 h-4 text-amber-600" />
                      Listening Audio Tinglash:
                    </span>

                    <button
                      onClick={() => handlePlayAudioPrompt(currentQ.audioPrompt!)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlayingAudio ? 'Tinglanmoqda...' : 'Audioni tinglash'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Reading Passage if Reading question */}
              {currentQ.section === 'reading' && currentQ.passageText && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                  {currentQ.passageText}
                </div>
              )}

              {/* Question text */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {currentQ.questionText}
              </h4>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(currentQuestionIndex, optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 dark:border-rose-600 text-rose-950 dark:text-rose-100 shadow-xs font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="mt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Oldingi</span>
                </button>

                {currentQuestionIndex < SAMPLE_MOCK_EXAM.totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1"
                  >
                    <span>Keyingi</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExam}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Sinovni Yakunlash</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Right Question Navigator Palette */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                Savollar Xaritasi
              </h4>

              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_MOCK_EXAM.questions.map((q, idx) => {
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`p-3 rounded-xl text-xs font-extrabold transition-all text-center ${
                        isCurrent
                          ? 'ring-2 ring-rose-500 bg-rose-600 text-white'
                          : isAnswered
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={handleFinishExam}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-colors"
                >
                  Natijani Hisoblash
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. FINISHED RESULT & ERROR ANALYSIS STATE */}
      {examState === 'finished' && result && (
        <div className="space-y-6">
          
          {/* Score Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Imtihon Natijasi
              </span>
              <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {result.estimatedBand}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                To'plangan ball: {result.score} / {SAMPLE_MOCK_EXAM.totalQuestions} ({result.percentage}%) • Sarflangan vaqt: {Math.floor(result.timeSpentSeconds / 60)} daqiqa
              </p>
            </div>

            <button
              onClick={handleStartExam}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan Topshirish</span>
            </button>
          </div>

          {/* Error Analysis "Xatolar ustida ishlash" */}
          {result.weakTopics.length > 0 && (
            <div className="bg-rose-50/60 dark:bg-rose-950/30 rounded-3xl p-6 border border-rose-200 dark:border-rose-800/40 space-y-4">
              <div className="flex items-center gap-2 font-extrabold text-rose-900 dark:text-rose-300 text-sm">
                <TrendingDown className="w-5 h-5 text-rose-600" />
                <span>Xatolar Ustida Ishlash & Shaxsiy Rivojlanish Rejasi:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.weakTopics.map((wt, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-700 dark:text-rose-400">
                        {wt.topic}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-[10px] font-bold text-rose-700">
                        {wt.incorrectCount} ta xato
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {wt.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question by Question Review */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Barcha Savollar Tahlili va To'g'ri Javoblar:
            </h4>

            <div className="space-y-4 text-xs">
              {SAMPLE_MOCK_EXAM.questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      isCorrect
                        ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-rose-200 dark:border-rose-800/60 bg-rose-50/40 dark:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {isCorrect ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <X className="w-4 h-4 text-rose-600" />
                        )}
                        Savol #{idx + 1}: {q.questionText}
                      </span>
                      <span className="text-[10px] uppercase text-slate-500">
                        {q.topicCategory}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-500 block">Sizning javobingiz:</span>
                        <span className={`font-semibold ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                          {userAns !== undefined ? q.options[userAns] : 'Belgilanmagan'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">To'g'ri javob:</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {q.options[q.correctIndex]}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      Tushuntirish: {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
