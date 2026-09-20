import React, { useState } from 'react';
import {
  StudentUser,
  Material,
  Flashcard,
  FlashcardInterval,
  KahootQuiz,
  Homework,
  HomeworkSubmission,
  StudentGroup,
  AttendanceEntry,
  EnglishLevel
} from '../types';
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Video,
  FileQuestion,
  Gamepad2,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Brain,
  Headphones,
  PenTool,
  Bell,
  ArrowRight,
  ExternalLink,
  RotateCw,
  Mic,
  Trophy,
  Zap
} from 'lucide-react';
import { FlashcardsDeck } from './FlashcardsDeck';
import { KahootArena } from './KahootArena';
import { MaterialsView } from './MaterialsView';
import { HomeworkAndScheduleView } from './HomeworkAndScheduleView';
import { AISpeakingPartner } from './AISpeakingPartner';
import { AIEssayChecker } from './AIEssayChecker';
import { SmartReader } from './SmartReader';
import { LeaderboardAndBadges } from './LeaderboardAndBadges';
import { MockExamArena } from './MockExamArena';
import { sound } from '../utils/soundEffects';

interface StudentPanelProps {
  student: StudentUser;
  materials: Material[];
  flashcards: Flashcard[];
  kahootQuizzes: KahootQuiz[];
  homeworks: Homework[];
  submissions: HomeworkSubmission[];
  activeGroup: StudentGroup;
  attendanceHistory: AttendanceEntry[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUpdateCardInterval: (cardId: string, interval: FlashcardInterval) => void;
  onAddNewCard: (card: Omit<Flashcard, 'id' | 'nextReviewAt' | 'repetitionCount' | 'state'>) => void;
  onSubmitHomework: (submission: Omit<HomeworkSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  onTriggerLessonAlert: () => void;
  onSendDueNotification: (word: string, count: number) => void;
  onAddWordToFlashcards: (word: string, translation: string, level: EnglishLevel) => void;
}

export const StudentPanel: React.FC<StudentPanelProps> = ({
  student,
  materials,
  flashcards,
  kahootQuizzes,
  homeworks,
  submissions,
  activeGroup,
  attendanceHistory,
  activeTab,
  onTabChange,
  onUpdateCardInterval,
  onAddNewCard,
  onSubmitHomework,
  onTriggerLessonAlert,
  onSendDueNotification,
  onAddWordToFlashcards,
}) => {
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<string>('all');

  // Due flashcards
  const dueCards = flashcards.filter(c => c.nextReviewAt <= Date.now());

  // Recent graded submission
  const recentGraded = submissions.find(s => s.status === 'graded');

  return (
    <div className="space-y-6">
      
      {/* 1. STUDENT HERO GREETING & NEXT LESSON COUNTDOWN BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left info */}
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                O'quvchi Paneli • Daraja: {student.level}
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                Guruh: {student.groupName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight leading-tight">
              Xush kelibsiz, <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-orange-400">{student.name}</span>!
            </h1>

            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Bugungi dars jadvali: <b>{activeGroup.scheduleDays}</b>, soat <b>{activeGroup.lessonTime}</b> da boshlanadi. Tizim dars vaqti kelganda avtomatik eslatma beradi.
            </p>
          </div>

          {/* Right Live Alert & Action */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Navbatdagi darsga qoldi:</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                00:35:12
              </div>
              <span className="text-[11px] text-indigo-200 block mt-0.5">
                Ustoz: {activeGroup.teacherName}
              </span>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={onTriggerLessonAlert}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Dars Signali (Sinov)</span>
              </button>
              <button
                onClick={() => onTabChange('schedule')}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Dars Xonasi & Jadval</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Quick bottom stats bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <span className="text-indigo-200 text-[10px] block">Kunlik Seriya:</span>
              <span className="font-bold text-white">{student.streakDays} kun ketma-ket</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-400/20 flex items-center justify-center text-orange-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-indigo-200 text-[10px] block">Anki So'zlar:</span>
              <span className="font-bold text-white">{flashcards.length} ta ({dueCards.length} ta navbatda)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-indigo-200 text-[10px] block">Dars Davomati:</span>
              <span className="font-bold text-white">{student.attendanceRate}% a'lo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-400/20 flex items-center justify-center text-purple-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-indigo-200 text-[10px] block">To'plangan XP:</span>
              <span className="font-bold text-white">{student.xpPoints} XP Ball</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN STUDENT NAVIGATION TABS */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bosh Sahifa</span>
        </button>

        <button
          onClick={() => {
            setSelectedMaterialCategory('all');
            onTabChange('materials');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'materials'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Kurs Materiallari (A1-C2)</span>
        </button>

        <button
          onClick={() => onTabChange('flashcards')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'flashcards'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Anki Flashcards (SRS)</span>
          {dueCards.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
              {dueCards.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('kahoot')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'kahoot'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Kahoot Arena</span>
        </button>

        <button
          onClick={() => onTabChange('ai_speaking')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ai_speaking'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span>AI Speaking</span>
        </button>

        <button
          onClick={() => onTabChange('ai_writing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ai_writing'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PenTool className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>AI Writing</span>
        </button>

        <button
          onClick={() => onTabChange('smart_reader')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'smart_reader'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
          <span>Smart Reader</span>
        </button>

        <button
          onClick={() => onTabChange('mock_exam')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'mock_exam'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
          <span>Mock Exam</span>
        </button>

        <button
          onClick={() => onTabChange('leaderboard')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Reyting & Badges</span>
        </button>

        <button
          onClick={() => onTabChange('homework')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'homework'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileQuestion className="w-3.5 h-3.5" />
          <span>Uyga Vazifalar ({homeworks.length})</span>
        </button>

        <button
          onClick={() => onTabChange('schedule')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Dars Jadvali & Davomat</span>
        </button>
      </div>

      {/* 3. CONDITIONAL ACTIVE TAB RENDERING */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Bento Grid Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Anki Flashcard Widget (Directly addressing Anki prompt) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 text-orange-700 flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    AnkiDroid SRS
                  </span>
                  <span className="text-xs font-bold text-orange-600">
                    {dueCards.length} ta so'z navbatda
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  Kunlik Lug'at Takrorlashi
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  "Water", "Perseverance" va boshqa so'zlarni 1 daqiqa, 5 daqiqa, 1 soat, 1 kun yoki 1 oy intervallari bo'yicha takrorlang.
                </p>

                {/* Mini preview of current card */}
                {dueCards[0] && (
                  <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/70 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900">{dueCards[0].word}</span>
                      <span className="text-slate-400 font-mono text-[11px] ml-1.5">{dueCards[0].phonetic}</span>
                      <div className="text-amber-800 font-semibold text-[11px]">{dueCards[0].translation}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-700">
                      Hozir takrorlash!
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => onTabChange('flashcards')}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Anki Sessiyasini Boshlash</span>
              </button>
            </div>

            {/* 2. Kahoot Arena Challenge Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3" />
                    Kahoot Battle
                  </span>
                  <span className="text-xs font-bold text-purple-600">
                    Jonli Duel
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  Ingliz Tili Viktorina Jangi
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  4 ta geometrik shakllar (qizil ▲, ko'k ◆, sariq ●, yashil ■) orqali tengdoshlaringiz bilan tezkor ingliz tili jangida qatnashing!
                </p>

                <div className="flex items-center gap-1 pt-1">
                  <div className="w-6 h-6 rounded-md bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">▲</div>
                  <div className="w-6 h-6 rounded-md bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">◆</div>
                  <div className="w-6 h-6 rounded-md bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">●</div>
                  <div className="w-6 h-6 rounded-md bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">■</div>
                  <span className="text-[11px] text-slate-400 ml-2 font-medium">B1 Vocab & Grammar</span>
                </div>
              </div>

              <button
                onClick={() => onTabChange('kahoot')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Kahoot O'yiniga Kirish</span>
              </button>
            </div>

            {/* 3. Homework & Feedback Status Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Uyga Vazifa
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    95 / 100 ball
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  Oxirgi Baholangan Insho
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  O'qituvchi <b>{activeGroup.teacherName}</b> sizning inshoingizni tekshirdi va yuqori baholadi:
                </p>

                {recentGraded && (
                  <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-xs text-emerald-900 italic line-clamp-2">
                    "{recentGraded.teacherFeedback}"
                  </div>
                )}
              </div>

              <button
                onClick={() => onTabChange('homework')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Vazifalarni Ko'rish & Topshirish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Dedicated Skill Modules Quick Cards (Grammar, Listening, Reading, Writing) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Ingliz Tili Ko'nikmalari Bo'limlari
              </h3>
              <span className="text-xs text-slate-500">
                A1 dan C2 gacha barcha darajalar
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Grammar */}
              <div
                onClick={() => {
                  setSelectedMaterialCategory('grammar');
                  onTabChange('materials');
                }}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <PenTool className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Grammatika
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Zamonlar, Conditionals, Modals
                </p>
              </div>

              {/* Listening */}
              <div
                onClick={() => {
                  setSelectedMaterialCategory('listening');
                  onTabChange('materials');
                }}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Headphones className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Tinglab Tushunish
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Audio muloqotlar va testlar
                </p>
              </div>

              {/* Reading */}
              <div
                onClick={() => {
                  setSelectedMaterialCategory('reading');
                  onTabChange('materials');
                }}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Kitoblar & Matnlar
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  O'qish va so'zni Ankiga olish
                </p>
              </div>

              {/* Writing */}
              <div
                onClick={() => {
                  setSelectedMaterialCategory('writing');
                  onTabChange('materials');
                }}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  Insho & Yozish
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Formal letter, Essay, Writing
                </p>
              </div>
            </div>
          </div>

          {/* New AI & Interactive Features Hub on Dashboard */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
                  Yangi AI & Interaktiv O'quv Modullari
                </h3>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                100% Amaliy va Integratsiyalangan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* AI Speaking */}
              <div
                onClick={() => onTabChange('ai_speaking')}
                className="bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-slate-900 dark:to-blue-950/40 p-5 rounded-3xl border border-blue-200/80 dark:border-blue-900/60 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                      Ovozli AI
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    AI Speaking Partner
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Mikrofon orqali real vaqtda gapiring, talaffuz va grammatik xatolaringiz bo'yicha jonli tavsiyalar oling.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Suhbatni boshlash</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* AI Writing */}
              <div
                onClick={() => onTabChange('ai_writing')}
                className="bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-slate-900 dark:to-emerald-950/40 p-5 rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <PenTool className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      IELTS Kriteriylari
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    AI Essay Checker
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Task Response, Cohesion, Lexical Resource va Grammar bo'yicha 4 o'lchamli chuqur tahlil va Band hisoblash.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Inshoni tekshirtirish</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Smart Reader */}
              <div
                onClick={() => onTabChange('smart_reader')}
                className="bg-gradient-to-br from-teal-50 to-cyan-50/40 dark:from-slate-900 dark:to-teal-950/40 p-5 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 shadow-xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      1-Click Anki SRS
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    Smart Reader & Lug'at
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Matn ustidagi har qanday so'zni bosing, talaffuzi va tarjimasini ko'ring hamda bitta tugma bilan Ankiga qo'shing.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-teal-100 dark:border-teal-900/40 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                  <span>Matnlarni o'qish</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Mock Exam */}
              <div
                onClick={() => onTabChange('mock_exam')}
                className="bg-gradient-to-br from-rose-50 to-orange-50/40 dark:from-slate-900 dark:to-rose-950/40 p-5 rounded-3xl border border-rose-200/80 dark:border-rose-900/60 shadow-xs hover:shadow-md hover:border-rose-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                      Xatolar Tahlili
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                    IELTS Mock Exam Simulator
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Listening va Reading bo'yicha taymer bilan haqiqiy imtihon topshiring, zaif mavzularingizni aniqlang.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-900/40 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>Sinovni boshlash</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Leaderboard & Badges */}
              <div
                onClick={() => onTabChange('leaderboard')}
                className="bg-gradient-to-br from-purple-50 to-pink-50/40 dark:from-slate-900 dark:to-purple-950/40 p-5 rounded-3xl border border-purple-200/80 dark:border-purple-900/60 shadow-xs hover:shadow-md hover:border-purple-400 transition-all cursor-pointer group flex flex-col justify-between sm:col-span-2 lg:col-span-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                      Gamification & XP
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Akademiya Reytingi & Yutuq Nishonlari
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Anki so'zlarini o'zlashtirish, Kahoot o'yinlaridagi g'alabalar va darslardagi faollik uchun maxsus nishonlar oling va yetakchilar safidan joy oling.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                  <span>Reytingni ko'rish</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 4. MATERIALS VIEW TAB (Videos, Books, Tests) */}
      {activeTab === 'materials' && (
        <MaterialsView
          materials={materials}
          selectedCategory={selectedMaterialCategory}
          onSelectCategory={setSelectedMaterialCategory}
          onAddWordToFlashcards={onAddWordToFlashcards}
        />
      )}

      {/* 5. ANKI FLASHCARDS SRS TAB */}
      {activeTab === 'flashcards' && (
        <FlashcardsDeck
          cards={flashcards}
          onUpdateCardInterval={onUpdateCardInterval}
          onAddNewCard={onAddNewCard}
          onSendDueNotification={onSendDueNotification}
        />
      )}

      {/* 6. KAHOOT ARENA TAB */}
      {activeTab === 'kahoot' && (
        <KahootArena
          quizzes={kahootQuizzes}
          studentName={student.name}
          onGameComplete={(score, xp) => {
            // award XP to student
          }}
        />
      )}

      {/* 7. HOMEWORK & SCHEDULE TAB */}
      {(activeTab === 'homework' || activeTab === 'schedule') && (
        <HomeworkAndScheduleView
          homeworks={homeworks}
          submissions={submissions}
          activeGroup={activeGroup}
          studentId={student.id}
          studentName={student.name}
          attendanceHistory={attendanceHistory}
          onSubmitHomework={onSubmitHomework}
          onTriggerLessonAlert={onTriggerLessonAlert}
        />
      )}

      {/* 8. AI SPEAKING PARTNER TAB */}
      {activeTab === 'ai_speaking' && (
        <AISpeakingPartner
          studentLevel={student.level}
          onAddWordToFlashcards={onAddWordToFlashcards}
        />
      )}

      {/* 9. AI ESSAY CHECKER TAB */}
      {activeTab === 'ai_writing' && (
        <AIEssayChecker
          studentLevel={student.level}
        />
      )}

      {/* 10. SMART READER TAB */}
      {activeTab === 'smart_reader' && (
        <SmartReader
          studentLevel={student.level}
          onAddWordToFlashcards={onAddWordToFlashcards}
        />
      )}

      {/* 11. MOCK EXAM SIMULATION TAB */}
      {activeTab === 'mock_exam' && (
        <MockExamArena
          studentLevel={student.level}
        />
      )}

      {/* 12. LEADERBOARD & BADGES TAB */}
      {activeTab === 'leaderboard' && (
        <LeaderboardAndBadges
          currentStudent={student}
        />
      )}

    </div>
  );
};
