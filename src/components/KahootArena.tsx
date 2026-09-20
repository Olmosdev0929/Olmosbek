import React, { useState, useEffect, useRef } from 'react';
import { KahootQuiz, KahootQuestion } from '../types';
import {
  Gamepad2,
  Trophy,
  Flame,
  Clock,
  RotateCcw,
  Sparkles,
  Award,
  Volume2,
  CheckCircle2,
  XCircle,
  Play,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { telegram } from '../utils/telegram';
import confetti from 'canvas-confetti';

interface KahootArenaProps {
  quizzes: KahootQuiz[];
  studentName: string;
  onGameComplete?: (finalScore: number, xpGained: number) => void;
}

interface PlayerScore {
  name: string;
  score: number;
  isUser: boolean;
  avatar: string;
}

export const KahootArena: React.FC<KahootArenaProps> = ({
  quizzes,
  studentName,
  onGameComplete,
}) => {
  const [selectedQuiz, setSelectedQuiz] = useState<KahootQuiz>(quizzes[0]);
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'question' | 'result' | 'podium'>('lobby');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userScore, setUserScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pointsGained, setPointsGained] = useState(0);

  // Leaderboard competitors
  const [leaderboard, setLeaderboard] = useState<PlayerScore[]>([
    { name: studentName, score: 0, isUser: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'Madina Saidova', score: 850, isUser: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { name: 'Bobur Mirzayev', score: 720, isUser: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { name: 'Jasur Bek', score: 680, isUser: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { name: 'Nodira Aliyeva', score: 540, isUser: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQ: KahootQuestion | undefined = selectedQuiz.questions[currentQuestionIndex];

  // Start game from lobby
  const startGame = () => {
    sound.playCardFlip();
    setGameState('countdown');
    setUserScore(0);
    setStreak(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);

    // Initial 3-second ready countdown
    setTimeout(() => {
      startQuestion(0);
    }, 2500);
  };

  const startQuestion = (qIndex: number) => {
    setCurrentQuestionIndex(qIndex);
    setSelectedOption(null);
    setIsCorrect(null);
    const time = selectedQuiz.questions[qIndex]?.timeLimitSeconds || 20;
    setTimeLeft(time);
    setGameState('question');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        if (prev <= 5) sound.playKahootTick();
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    sound.playWrong();
    telegram.hapticNotification('warning');
    setIsCorrect(false);
    setSelectedOption(-1);
    setStreak(0);
    setPointsGained(0);
    setGameState('result');
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedOption !== null || gameState !== 'question') return;

    telegram.hapticImpact('medium');
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(optionIndex);

    const correct = optionIndex === currentQ.correctIndex;
    setIsCorrect(correct);

    let earned = 0;
    if (correct) {
      sound.playCorrect();
      telegram.hapticNotification('success');
      // Speed multiplier
      const speedFactor = timeLeft / (currentQ.timeLimitSeconds || 20);
      const basePoints = currentQ.points || 1000;
      const speedBonus = Math.round(basePoints * speedFactor * 0.5);
      const streakBonus = streak * 100;
      earned = basePoints + speedBonus + streakBonus;

      const newStreak = streak + 1;
      const newScore = userScore + earned;

      setStreak(newStreak);
      setUserScore(newScore);
      setPointsGained(earned);

      // Update leaderboard
      updateLeaderboard(newScore, true);
    } else {
      sound.playWrong();
      telegram.hapticNotification('error');
      setStreak(0);
      setPointsGained(0);
      updateLeaderboard(userScore, false);
    }

    setGameState('result');
  };

  const updateLeaderboard = (newScore: number, isGood: boolean) => {
    setLeaderboard((prev) => {
      const updated = prev.map((p) => {
        if (p.isUser) {
          return { ...p, score: newScore };
        } else {
          // Bots gain random points
          const botGain = Math.random() > 0.35 ? Math.floor(Math.random() * 800) + 400 : 0;
          return { ...p, score: p.score + botGain };
        }
      });
      return updated.sort((a, b) => b.score - a.score);
    });
  };

  const handleNextStep = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      startQuestion(currentQuestionIndex + 1);
    } else {
      // Game ended -> podium
      setGameState('podium');
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      sound.playCorrect();
      if (onGameComplete) {
        onGameComplete(userScore, Math.round(userScore / 10));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Kahoot color palettes & geometric shapes
  const buttonStyles = [
    {
      bg: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700',
      border: 'border-rose-600',
      shape: '▲',
      name: 'Qizil Uchburchak',
    },
    {
      bg: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
      border: 'border-blue-600',
      shape: '◆',
      name: 'Ko\'k Romb',
    },
    {
      bg: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700',
      border: 'border-amber-600',
      shape: '●',
      name: 'Sariq Doira',
    },
    {
      bg: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700',
      border: 'border-emerald-600',
      shape: '■',
      name: 'Yashil Kvadrat',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* LOBBY SCREEN */}
      {gameState === 'lobby' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-500/20 transform -rotate-3">
            <Gamepad2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs uppercase tracking-wider">
              Kahoot Arena Battle
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {selectedQuiz.title}
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {selectedQuiz.description}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 max-w-md mx-auto text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span>Savollar soni:</span>
              <span className="font-bold">{selectedQuiz.questions.length} ta</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Daraja:</span>
              <span className="font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                {selectedQuiz.level}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Qatnashuvchi:</span>
              <span className="font-bold text-slate-900">{studentName} (Siz)</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="btn-start-kahoot"
              onClick={startGame}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-base shadow-xl shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>O'yinni Boshlash (Start Quiz)</span>
            </button>
          </div>
        </div>
      )}

      {/* COUNTDOWN SCREEN */}
      {gameState === 'countdown' && (
        <div className="bg-slate-950 text-white rounded-3xl p-16 text-center shadow-2xl max-w-2xl mx-auto space-y-4">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-400">
            Tayyormisiz?
          </p>
          <div className="text-7xl font-black text-white font-display animate-pulse">
            3... 2... 1...
          </div>
          <p className="text-slate-400 text-xs">
            Savol chiqishi bilanoq eng tez to'g'ri shaklni tanlang!
          </p>
        </div>
      )}

      {/* ACTIVE QUESTION SCREEN (Kahoot 4-block style) */}
      {gameState === 'question' && currentQ && (
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Header & Countdown Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">
                {currentQuestionIndex + 1} / {selectedQuiz.questions.length}
              </span>
              {streak > 1 && (
                <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {streak}x Seriya!
                </span>
              )}
            </div>

            {/* Circular or pill timer */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-sm border-2 ${
                timeLeft <= 5 ? 'bg-rose-50 border-rose-500 text-rose-600 animate-ping' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}>
                {timeLeft}
              </div>
            </div>

            <div className="text-xs font-bold text-slate-700">
              Ball: <span className="text-purple-600">{userScore}</span>
            </div>
          </div>

          {/* Time bar progress */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 linear ${
                timeLeft <= 5 ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${(timeLeft / (currentQ.timeLimitSeconds || 20)) * 100}%` }}
            />
          </div>

          {/* Big Question Prompt Box */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl text-center min-h-[140px] flex items-center justify-center border-4 border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Kahoot 4 Answer Shapes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const style = buttonStyles[idx];
              return (
                <button
                  key={idx}
                  id={`kahoot-opt-${idx}`}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`${style.bg} text-white p-5 rounded-2xl shadow-lg border-b-4 ${style.border} transition-all transform active:scale-95 text-left flex items-center gap-4 cursor-pointer min-h-[76px]`}
                >
                  <span className="text-2xl font-black shrink-0 w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center">
                    {style.shape}
                  </span>
                  <span className="text-base sm:text-lg font-bold leading-tight">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* QUESTION RESULT & EXPLANATION */}
      {gameState === 'result' && currentQ && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-150">
          <div className={`p-6 sm:p-8 rounded-3xl text-center text-white shadow-xl ${
            isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              {isCorrect ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-display mb-1">
              {isCorrect ? 'To\'g\'ri javob! Barakalla!' : 'Afsuski, noto\'g\'ri!'}
            </h3>

            {isCorrect && (
              <p className="text-sm font-bold text-emerald-100">
                +{pointsGained} ball to'pladingiz!
              </p>
            )}

            <div className="mt-4 bg-white/10 rounded-2xl p-4 text-xs text-left max-w-lg mx-auto backdrop-blur-xs">
              <span className="font-bold block mb-1 uppercase tracking-wider text-white/80">
                To'g'ri javob:
              </span>
              <p className="text-sm font-bold text-white mb-2">
                {currentQ.options[currentQ.correctIndex]}
              </p>
              {currentQ.explanation && (
                <p className="text-white/90 text-xs italic">
                  Tushuntirish: {currentQ.explanation}
                </p>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="mt-6 px-8 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-md hover:bg-slate-100 transition-all flex items-center gap-2 mx-auto"
            >
              <span>{currentQuestionIndex < selectedQuiz.questions.length - 1 ? 'Keyingi savol' : 'Natijalarni ko\'rish'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mini Live Leaderboard */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Guruh yetakchilari (Top Players)
            </h4>
            <div className="space-y-2">
              {leaderboard.map((p, rank) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs ${
                    p.isUser ? 'bg-indigo-50 border border-indigo-200 font-bold' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 text-center font-black ${rank === 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                      {rank + 1}
                    </span>
                    <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
                    <span>{p.name} {p.isUser && '(Siz)'}</span>
                  </div>
                  <span className="font-extrabold text-indigo-600">{p.score} pt</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* FINAL PODIUM SCREEN */}
      {gameState === 'podium' && (
        <div className="max-w-2xl mx-auto bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30">
            <Trophy className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              O'yin Yakunlandi!
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display">
              G'oliblar Shoxsupasi
            </h2>
            <p className="text-xs text-slate-400">
              Siz {userScore} ball bilan o'yinni tamomladingiz!
            </p>
          </div>

          {/* Podium 3 columns */}
          <div className="flex items-end justify-center gap-3 pt-6 pb-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-300 mb-1">
                {leaderboard[1]?.name || 'Madina'}
              </span>
              <div className="w-20 bg-slate-700 h-24 rounded-t-2xl flex flex-col items-center justify-center font-bold">
                <span className="text-xl">🥈 2</span>
                <span className="text-[10px] text-slate-400">{leaderboard[1]?.score}</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-extrabold text-amber-400 mb-1">
                {leaderboard[0]?.name || studentName}
              </span>
              <div className="w-24 bg-linear-to-b from-amber-400 to-amber-600 h-36 rounded-t-2xl flex flex-col items-center justify-center font-black text-slate-900 shadow-xl">
                <span className="text-3xl">👑 1</span>
                <span className="text-xs font-bold">{leaderboard[0]?.score}</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-300 mb-1">
                {leaderboard[2]?.name || 'Bobur'}
              </span>
              <div className="w-20 bg-amber-800/80 h-16 rounded-t-2xl flex flex-col items-center justify-center font-bold">
                <span className="text-xl">🥉 3</span>
                <span className="text-[10px] text-slate-400">{leaderboard[2]?.score}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setGameState('lobby')}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Bosh menyuga qaytish</span>
            </button>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Qayta o'ynash</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
