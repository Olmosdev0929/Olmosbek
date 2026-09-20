import React, { useState } from 'react';
import { StudentUser, LeaderboardEntry, AchievementBadge } from '../types';
import {
  Trophy,
  Flame,
  Award,
  Crown,
  Medal,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Brain,
  Gamepad2
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead_1',
    rank: 1,
    name: 'Dilnoza Karimova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    groupName: 'IELTS Mastery 7.5+',
    xpPoints: 3450,
    streakDays: 24,
    wordsMastered: 182,
    kahootWins: 14,
  },
  {
    id: 'lead_2',
    rank: 2,
    name: 'Sardor Rustamov',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    groupName: 'General English B2',
    xpPoints: 2980,
    streakDays: 18,
    wordsMastered: 140,
    kahootWins: 9,
  },
  {
    id: 'lead_3',
    rank: 3,
    name: 'Malika Alimova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    groupName: 'Pre-IELTS Intensive',
    xpPoints: 2640,
    streakDays: 15,
    wordsMastered: 125,
    kahootWins: 11,
  },
  {
    id: 'lead_4',
    rank: 4,
    name: 'Bobur Saidov',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    groupName: 'General English B2',
    xpPoints: 2190,
    streakDays: 12,
    wordsMastered: 98,
    kahootWins: 6,
  },
  {
    id: 'lead_5',
    rank: 5,
    name: 'Jasur Bekmirzayev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    groupName: 'IELTS Mastery 7.5+',
    xpPoints: 1950,
    streakDays: 9,
    wordsMastered: 84,
    kahootWins: 5,
  },
];

const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'bdg_1',
    title: 'Olovli 7 Kunlik Seriya',
    description: 'Ketma-ket 7 kun darslar va Anki kartalarini takrorlang',
    icon: 'flame',
    category: 'streak',
    unlocked: true,
    unlockedAt: '2026-09-18',
    progress: 100,
    xpReward: 250,
  },
  {
    id: 'bdg_2',
    title: '100 ta So\'z Ustasi',
    description: 'Anki SRS orqali 100 ta yangi so\'zni mukammal yodlang',
    icon: 'brain',
    category: 'vocabulary',
    unlocked: false,
    progress: 68,
    xpReward: 300,
  },
  {
    id: 'bdg_3',
    title: 'Kahoot Gladiator',
    description: 'Kahoot Arena jonli janglarida 5 marta g\'olib bo\'ling',
    icon: 'gamepad',
    category: 'kahoot',
    unlocked: true,
    unlockedAt: '2026-09-15',
    progress: 100,
    xpReward: 200,
  },
  {
    id: 'bdg_4',
    title: 'IELTS Insho Yozuvchisi',
    description: 'AI Essay Checker orqali 7.0+ ballik insho topshiring',
    icon: 'award',
    category: 'writing',
    unlocked: false,
    progress: 75,
    xpReward: 400,
  },
  {
    id: 'bdg_5',
    title: 'Speaking Chempioni',
    description: 'AI Speaking Partner bilan 10 ta to\'liq mavzuda suhbat quring',
    icon: 'zap',
    category: 'speaking',
    unlocked: false,
    progress: 40,
    xpReward: 350,
  },
  {
    id: 'bdg_6',
    title: 'To\'liq Mock Exam Fathchisi',
    description: 'Vaqt nazorati ostidagi Mock Exam sinovini muvaffaqiyatli tamomlang',
    icon: 'trophy',
    category: 'exam',
    unlocked: false,
    progress: 50,
    xpReward: 500,
  },
];

interface LeaderboardAndBadgesProps {
  currentStudent: StudentUser;
}

export const LeaderboardAndBadges: React.FC<LeaderboardAndBadgesProps> = ({
  currentStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges'>('leaderboard');
  const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'monthly' | 'all'>('weekly');

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-3xl bg-linear-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl border border-purple-700/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Gamification & Raqobat
              </span>
              <span className="text-xs text-purple-200/80">Akademiya Reytingi</span>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white">
              Reyting Jadvali & Yutuq Nishonlari
            </h2>
            <p className="text-xs sm:text-sm text-purple-100/80 mt-1 max-w-2xl">
              Anki so'zlarini takrorlang, Kahoot o'yinlarida g'olib bo'ling va XP ball to'plang. Akademiya bo'yicha eng kuchli Top-o'quvchilar ro'yxatiga kiring!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-purple-950/60 p-3 rounded-2xl border border-purple-600/30">
            <div className="text-right">
              <span className="text-[10px] text-purple-300 uppercase block font-bold">Sizning XP:</span>
              <span className="text-lg font-black text-amber-400">{currentStudent.xpPoints} XP</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Switcher Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1 shadow-xs">
          <button
            onClick={() => {
              setActiveTab('leaderboard');
              sound.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Top-O'quvchilar Reytingi</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('badges');
              sound.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'badges'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Yutuq Nishonlari ({INITIAL_BADGES.filter(b => b.unlocked).length}/{INITIAL_BADGES.length})</span>
          </button>
        </div>

        {activeTab === 'leaderboard' && (
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setFilterPeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterPeriod === 'weekly' ? 'bg-indigo-600 text-white' : 'text-slate-500'
              }`}
            >
              Haftalik
            </button>
            <button
              onClick={() => setFilterPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterPeriod === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-500'
              }`}
            >
              Oylik
            </button>
          </div>
        )}
      </div>

      {/* 1. LEADERBOARD VIEW */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            
            {/* 2nd place */}
            <div className="order-2 sm:order-1 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-center relative flex flex-col items-center">
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs">
                2-O'rin (Kumush)
              </div>
              <img
                src={MOCK_LEADERBOARD[1].avatar}
                alt={MOCK_LEADERBOARD[1].name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-300 dark:ring-slate-700 mt-2"
              />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">
                {MOCK_LEADERBOARD[1].name}
              </h4>
              <p className="text-[11px] text-slate-500">{MOCK_LEADERBOARD[1].groupName}</p>
              <div className="mt-3 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-slate-900 dark:text-slate-200 text-xs">
                {MOCK_LEADERBOARD[1].xpPoints} XP
              </div>
            </div>

            {/* 1st place */}
            <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900 rounded-3xl p-6 border-2 border-amber-400 dark:border-amber-600 shadow-lg text-center relative flex flex-col items-center -translate-y-2">
              <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                1-O'rin (Chempion)
              </div>
              <img
                src={MOCK_LEADERBOARD[0].avatar}
                alt={MOCK_LEADERBOARD[0].name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-400 mt-2"
              />
              <h4 className="font-black text-base text-slate-900 dark:text-white mt-3">
                {MOCK_LEADERBOARD[0].name}
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">{MOCK_LEADERBOARD[0].groupName}</p>
              <div className="mt-3 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-sm shadow-xs">
                {MOCK_LEADERBOARD[0].xpPoints} XP
              </div>
            </div>

            {/* 3rd place */}
            <div className="order-3 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-center relative flex flex-col items-center">
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-700 text-amber-100 font-black text-xs">
                3-O'rin (Bronza)
              </div>
              <img
                src={MOCK_LEADERBOARD[2].avatar}
                alt={MOCK_LEADERBOARD[2].name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-700/50 mt-2"
              />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">
                {MOCK_LEADERBOARD[2].name}
              </h4>
              <p className="text-[11px] text-slate-500">{MOCK_LEADERBOARD[2].groupName}</p>
              <div className="mt-3 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-slate-900 dark:text-slate-200 text-xs">
                {MOCK_LEADERBOARD[2].xpPoints} XP
              </div>
            </div>

          </div>

          {/* Full ranking table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-extrabold text-xs text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Talaba & Guruh</span>
              <div className="flex items-center gap-6">
                <span>Seriya</span>
                <span>Anki So'zlar</span>
                <span>Jami XP</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_LEADERBOARD.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-black text-sm ${
                      entry.rank === 1 ? 'text-amber-500' : entry.rank === 2 ? 'text-slate-400' : entry.rank === 3 ? 'text-amber-700' : 'text-slate-500'
                    }`}>
                      #{entry.rank}
                    </span>
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        {entry.name}
                      </h5>
                      <span className="text-[11px] text-slate-500">
                        {entry.groupName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{entry.streakDays} kun</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                      <Brain className="w-3.5 h-3.5" />
                      <span>{entry.wordsMastered} ta</span>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 font-black text-purple-700 dark:text-purple-300">
                      {entry.xpPoints} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. BADGES & ACHIEVEMENTS VIEW */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_BADGES.map(badge => (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
                badge.unlocked
                  ? 'bg-white dark:bg-slate-900 border-purple-300 dark:border-purple-800/80 shadow-md'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                  badge.unlocked
                    ? 'bg-linear-to-tr from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  {badge.icon === 'flame' && <Flame className="w-6 h-6 fill-current" />}
                  {badge.icon === 'brain' && <Brain className="w-6 h-6" />}
                  {badge.icon === 'gamepad' && <Gamepad2 className="w-6 h-6" />}
                  {badge.icon === 'award' && <Award className="w-6 h-6" />}
                  {badge.icon === 'zap' && <Zap className="w-6 h-6 fill-current" />}
                  {badge.icon === 'trophy' && <Trophy className="w-6 h-6" />}
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    +{badge.xpReward} XP
                  </span>
                  {badge.unlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Qo'lga kiritildi
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-1">
                      <Lock className="w-3 h-3" />
                      {badge.progress}% bajarildi
                    </span>
                  )}
                </div>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {badge.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {badge.description}
              </p>

              {/* Progress bar */}
              {!badge.unlocked && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
