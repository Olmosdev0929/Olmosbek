import React, { useState } from 'react';
import { EnglishLevel, EssayEvaluation } from '../types';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Zap,
  TrendingUp
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

const SAMPLE_ESSAY_TOPICS = [
  {
    id: 'topic_1',
    title: 'Technology & Remote Work',
    type: 'IELTS Writing Task 2 (Discussion)',
    prompt: 'Some people believe that working remotely from home is more beneficial for employees and companies, while others think traditional office work is essential. Discuss both views and give your own opinion.',
    sampleText: `In contemporary society, the prevalence of telecommuting has sparked considerable debate. While some individuals argue that working from home provides unprecedented flexibility and cost-effectiveness, others contend that conventional corporate environments foster essential collaboration. This essay will examine both perspectives before presenting a balanced viewpoint.

On the one hand, remote employment offers undeniable advantages. Firstly, employees save substantial hours otherwise wasted on daily commutes, which can directly enhance work-life balance and mental well-being. Furthermore, companies can significantly reduce expenditure on commercial real estate and overhead utilities.

On the other hand, traditional offices provide irreplaceable social cohesion. Face-to-face spontaneous interaction accelerates creative problem-solving and reinforces company culture. Without direct supervision, some workers may also struggle with self-discipline and isolation.

In conclusion, although remote work delivers immense flexibility, a hybrid model combining both paradigms appears to be the most optimal solution for sustainable productivity.`
  },
  {
    id: 'topic_2',
    title: 'University Education vs Career Experience',
    type: 'IELTS Writing Task 2 (Opinion)',
    prompt: 'Some people think that university education is the best way to have a successful career, while others think that having practical work experience is more important. To what extent do you agree or disagree?',
    sampleText: `Education has traditionally been regarded as the cornerstone of professional success. Nevertheless, in today's rapidly evolving job market, an increasing number of people assert that hands-on vocational experience outstrips theoretical academic degrees. I partially agree with this viewpoint, believing that both components are interdependent.`
  }
];

interface AIEssayCheckerProps {
  studentLevel: EnglishLevel;
}

export const AIEssayChecker: React.FC<AIEssayCheckerProps> = ({ studentLevel }) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [customTopic, setCustomTopic] = useState('');
  const [essayText, setEssayText] = useState(SAMPLE_ESSAY_TOPICS[0].sampleText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<EssayEvaluation | null>(null);
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  const currentTopic = SAMPLE_ESSAY_TOPICS[selectedTopicIndex];
  const activePrompt = customTopic.trim() || currentTopic.prompt;
  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  const handleSelectSampleTopic = (index: number) => {
    setSelectedTopicIndex(index);
    setCustomTopic('');
    setEssayText(SAMPLE_ESSAY_TOPICS[index].sampleText);
    setEvaluation(null);
    sound.playCardFlip();
  };

  const handleAnalyzeEssay = async () => {
    if (!essayText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    sound.playCardFlip();

    try {
      const response = await fetch('/api/ai/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essayText,
          topic: activePrompt,
          essayType: currentTopic.type,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setEvaluation(resData.data);
        sound.playSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyRewrite = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRewrite(true);
    sound.playClick();
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-3xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 shadow-xl border border-indigo-700/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                Gemini AI Writing Examiner
              </span>
              <span className="text-xs text-blue-200/80">IELTS & CEFR Writing Tekshiruvchisi</span>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white">
              AI Insho (Essay) Tahlilchisi & Ball Baholash
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl">
              Inshoyingizni kiriting va rasmiy IELTS mezonlari bo'yicha darhol xolis baho, xatolar tuzatmasi, lug'at boyituvchi tavsiyalar hamda 8.5+ ballik qayta yozilgan namunasini oling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-blue-800/60 border border-blue-600/40 text-xs font-bold text-blue-200">
              O'quvchi Darajasi: {studentLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Essay Input & Prompt */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Topic Switcher */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                Mavzuni tanlang yoki o'zingiznikini yozing:
              </label>
              <div className="flex gap-2">
                {SAMPLE_ESSAY_TOPICS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectSampleTopic(idx)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border text-left truncate ${
                      selectedTopicIndex === idx && !customTopic
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {currentTopic.type}
              </span>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {activePrompt}
              </p>
            </div>

            {/* Essay Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Insho matni:</span>
                <span className={`font-bold ${wordCount >= 250 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {wordCount} ta so'z (Tavsiya: kamida 250 ta)
                </span>
              </div>

              <textarea
                value={essayText}
                onChange={e => setEssayText(e.target.value)}
                rows={14}
                placeholder="Inshoyingizni shu yerga yozing yoki nusxasini joylashtiring..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyzeEssay}
              disabled={isAnalyzing || !essayText.trim()}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI inshoni baholamoqda...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Sun'iy Intellekt bilan Tekshirish</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Right Column: Detailed Feedback & Criteria Assessment */}
        <div className="lg:col-span-6 space-y-4">
          
          {evaluation ? (
            <div className="space-y-4">
              
              {/* Overall Score Badge Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Taxminiy IELTS Balli
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black font-display text-indigo-600 dark:text-indigo-400">
                      Band {evaluation.overallBand}
                    </span>
                    <span className="text-xs text-slate-500">
                      / 9.0 Maksimal
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-right">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px]">
                    <span className="text-slate-500 block">Task:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{evaluation.taskAchievement?.score || 6.5}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px]">
                    <span className="text-slate-500 block">Coherence:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{evaluation.coherenceCohesion?.score || 6.5}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px]">
                    <span className="text-slate-500 block">Lexical:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{evaluation.lexicalResource?.score || 6.5}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px]">
                    <span className="text-slate-500 block">Grammar:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{evaluation.grammaticalAccuracy?.score || 6.5}</span>
                  </div>
                </div>
              </div>

              {/* Examiner Summary */}
              <div className="bg-amber-50/80 dark:bg-amber-950/30 rounded-3xl p-5 border border-amber-200 dark:border-amber-800/40 text-xs space-y-2">
                <div className="flex items-center gap-2 font-extrabold text-amber-900 dark:text-amber-300">
                  <Award className="w-4 h-4 text-amber-600" />
                  Ekspert Xulosasi & Tavsiyalar:
                </div>
                <p className="text-amber-950 dark:text-amber-200 leading-relaxed">
                  {evaluation.examinerSummary}
                </p>
              </div>

              {/* Vocabulary Boost Section */}
              {evaluation.lexicalResource?.vocabularyBoost && evaluation.lexicalResource.vocabularyBoost.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Lug'at boyligini oshirish (Vocabulary Upgrades):
                  </div>
                  <div className="space-y-2 text-xs">
                    {evaluation.lexicalResource.vocabularyBoost.map((item, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="line-through text-slate-500 font-medium">"{item.original}"</span>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">"{item.better}"</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                            {item.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar Corrections */}
              {evaluation.grammaticalAccuracy?.grammarMistakes && evaluation.grammaticalAccuracy.grammarMistakes.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Grammatik Xatolar & Qoidalar:
                  </div>
                  <div className="space-y-2 text-xs">
                    {evaluation.grammaticalAccuracy.grammarMistakes.map((g, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-rose-600 dark:text-rose-400 line-through">"{g.mistake}"</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">"{g.correction}"</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {g.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Band 8.5-9.0 Rewrite */}
              {evaluation.improvedVersion && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      Band 8.5+ Mukammal Qayta Yozilgan Versiya:
                    </div>
                    <button
                      onClick={() => handleCopyRewrite(evaluation.improvedVersion)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-xs flex items-center gap-1"
                    >
                      {copiedRewrite ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span className="text-[11px]">{copiedRewrite ? 'Nusxalandi!' : 'Nusxa olish'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                    {evaluation.improvedVersion}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4 py-16">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Insho Tahlili Hali Boshlanmadi
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Chap tomondagi maydonga inshoni kiriting va "Sun'iy Intellekt bilan Tekshirish" tugmasini bosing.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
