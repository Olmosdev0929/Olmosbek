import React, { useState, useEffect } from 'react';
import { Flashcard, FlashcardInterval, EnglishLevel } from '../types';
import {
  Volume2,
  RotateCw,
  Plus,
  Clock,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Brain,
  Filter,
  Search,
  Bell,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { telegram } from '../utils/telegram';
import confetti from 'canvas-confetti';

interface FlashcardsDeckProps {
  cards: Flashcard[];
  onUpdateCardInterval: (cardId: string, interval: FlashcardInterval) => void;
  onAddNewCard: (card: Omit<Flashcard, 'id' | 'nextReviewAt' | 'repetitionCount' | 'state'>) => void;
  onSendDueNotification: (cardWord: string, count: number) => void;
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({
  cards,
  onUpdateCardInterval,
  onAddNewCard,
  onSendDueNotification,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState<'study' | 'deck' | 'stats'>('study');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New card form state
  const [newWord, setNewWord] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('noun');
  const [newDefinition, setNewDefinition] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newExampleUz, setNewExampleUz] = useState('');
  const [newLevel, setNewLevel] = useState<EnglishLevel>('B1');

  // Filter cards that are due for review (now >= nextReviewAt)
  const now = Date.now();
  const dueCards = cards.filter(c => c.nextReviewAt <= now);
  const studyList = dueCards.length > 0 ? dueCards : cards;
  const currentCard = studyList[activeCardIndex] || studyList[0];

  // Check if due cards exist and notify
  useEffect(() => {
    if (dueCards.length > 0) {
      // due cards ready
    }
  }, [dueCards.length]);

  const handleFlip = () => {
    sound.playCardFlip();
    telegram.hapticImpact('light');
    setIsFlipped(!isFlipped);
  };

  const handleRateCard = (interval: FlashcardInterval) => {
    if (!currentCard) return;

    sound.playCardFlip();
    telegram.hapticImpact('medium');
    onUpdateCardInterval(currentCard.id, interval);

    // If mastered or long interval, play chime and haptic success
    if (interval === '1month') {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      sound.playCorrect();
      telegram.hapticNotification('success');
    }

    // Advance to next card or reset
    setIsFlipped(false);
    if (activeCardIndex < studyList.length - 1) {
      setActiveCardIndex(activeCardIndex + 1);
    } else {
      setActiveCardIndex(0);
      confetti({ particleCount: 70, spread: 80 });
      sound.playCorrect();
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newTranslation.trim()) return;

    onAddNewCard({
      word: newWord.trim(),
      phonetic: newPhonetic.trim() || `/${newWord.toLowerCase()}/`,
      partOfSpeech: newPartOfSpeech,
      translation: newTranslation.trim(),
      definition: newDefinition.trim() || `Definition of ${newWord}`,
      example: newExample.trim() || `Example with ${newWord}.`,
      exampleUz: newExampleUz.trim() || `"${newWord}" so'ziga misol.`,
      level: newLevel,
      interval: '1min',
      tags: ['user-added'],
    });

    sound.playCorrect();
    setNewWord('');
    setNewPhonetic('');
    setNewTranslation('');
    setNewDefinition('');
    setNewExample('');
    setNewExampleUz('');
    setShowAddModal(false);
  };

  // Helper for human-readable time remaining
  const getTimeRemainingText = (timestamp: number) => {
    const diff = timestamp - Date.now();
    if (diff <= 0) return 'Hozir takrorlash kerak!';
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${mins} daqiqadan so'ng`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} soatdan so'ng`;
    const days = Math.floor(hours / 24);
    return `${days} kundan so'ng`;
  };

  // Filtered deck for the dictionary tab
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevelFilter === 'all' || card.level === selectedLevelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & SRS Engine Intro */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" />
                AnkiDroid Spaced Repetition (SRS)
              </span>
              {dueCards.length > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-rose-900/40 text-amber-200 text-xs font-bold animate-pulse">
                  {dueCards.length} ta so'z navbatda
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight">
              Intervalli Takrorlash Tizimi bilan So'zlarni Abadiy Yodlang
            </h2>
            <p className="text-sm text-white/90 leading-relaxed">
              O'rganayotgan so'zingizni xotirangizdagi darajasiga qarab <b>1 daqiqa</b>, <b>5 daqiqa</b>, <b>1 soat</b>, <b>1 kun</b> yoki <b>1 oy (bilaman)</b> oralig'ida belgilang. Tizim belgilangan vaqtda bildirishnoma yuborib turadi!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onSendDueNotification(currentCard ? currentCard.word : 'water', dueCards.length || 1)}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-xs font-bold backdrop-blur-md transition-all flex items-center gap-2"
              title="Test bildirishnomasi jo'natish"
            >
              <Bell className="w-4 h-4" />
              <span>Bildirishnoma sinash</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi so'z qo'shish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'study'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span>Yodlash Sessiyasi ({studyList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('deck')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'deck'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Barcha Lug'at ({cards.length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          O'zlashtirilgan: <b className="text-emerald-600">{cards.filter(c => c.state === 'mastered').length} ta</b>
        </div>
      </div>

      {/* VIEW 1: ACTIVE STUDY SESSION (Anki card style) */}
      {activeTab === 'study' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Card Progress Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">
              Karta {activeCardIndex + 1} / {studyList.length}
            </span>
            <div className="flex items-center gap-1.5 text-orange-600 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{getTimeRemainingText(currentCard.nextReviewAt)}</span>
            </div>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((activeCardIndex + 1) / studyList.length) * 100}%` }}
            />
          </div>

          {/* FLIP CARD ITSELF */}
          <div
            onClick={handleFlip}
            className="group cursor-pointer perspective-1000 min-h-[360px] relative rounded-3xl p-8 sm:p-10 bg-white border-2 border-slate-200 shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between text-center select-none"
          >
            {/* Top Info Bar inside card */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                {currentCard.level} • {currentCard.partOfSpeech}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.speakEnglish(currentCard.word);
                  }}
                  className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                  title="Talaffuzni tinglash"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Front & Back Content */}
            {!isFlipped ? (
              // FRONT OF CARD
              <div className="my-auto space-y-4 py-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
                  {currentCard.word}
                </h1>
                <p className="text-base text-slate-500 font-mono">
                  {currentCard.phonetic}
                </p>
                <div className="pt-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 font-semibold text-xs animate-bounce">
                    <RotateCw className="w-3.5 h-3.5" />
                    Javobni ko'rish uchun kartani bosing
                  </span>
                </div>
              </div>
            ) : (
              // BACK OF CARD (REVEALED)
              <div className="my-auto space-y-5 py-4 text-left animate-in fade-in duration-200">
                <div className="text-center pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-3xl font-extrabold text-slate-900">
                      {currentCard.word}
                    </h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.speakEnglish(currentCard.word);
                      }}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-400 font-mono">{currentCard.phonetic}</p>
                </div>

                {/* Uzbek Translation */}
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    O'zbekcha ma'nosi:
                  </span>
                  <p className="text-lg font-bold text-amber-950">
                    {currentCard.translation}
                  </p>
                </div>

                {/* English Definition */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Ta'rif (Definition):
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {currentCard.definition}
                  </p>
                </div>

                {/* Example sentence */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Misol jumlada:
                  </span>
                  <p className="text-slate-800 font-medium italic mb-1">
                    "{currentCard.example}"
                  </p>
                  <p className="text-slate-500">
                    "{currentCard.exampleUz}"
                  </p>
                </div>
              </div>
            )}

            {/* Bottom State Pill */}
            <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
              <span>Oldingi oraliq: <b>{currentCard.interval}</b></span>
              <span>•</span>
              <span>Takrorlashlar: <b>{currentCard.repetitionCount} marta</b></span>
            </div>
          </div>

          {/* ANKI SPACED REPETITION INTERVAL BUTTONS (User explicitly asked for 1 min, 5 min, 1 hour, 1 day, 1 month / bilaman) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-center text-xs font-bold text-slate-600 mb-2">
              Qiyinlik darajasiga qarab takrorlash vaqtini tanlang:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {/* 1 daqiqa (Qayta / Again) */}
              <button
                id="btn-anki-1min"
                onClick={() => handleRateCard('1min')}
                className="py-3 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95"
              >
                <span className="text-sm font-extrabold">1 daqiqa</span>
                <span className="text-[10px] font-medium opacity-80">Qayta (Again)</span>
              </button>

              {/* 5 daqiqa (Qiyin / Hard) */}
              <button
                id="btn-anki-5min"
                onClick={() => handleRateCard('5min')}
                className="py-3 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95"
              >
                <span className="text-sm font-extrabold">5 daqiqa</span>
                <span className="text-[10px] font-medium opacity-80">Qiyin (Hard)</span>
              </button>

              {/* 1 soat (Yaxshi / Good) */}
              <button
                id="btn-anki-1hour"
                onClick={() => handleRateCard('1hour')}
                className="py-3 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95"
              >
                <span className="text-sm font-extrabold">1 soat</span>
                <span className="text-[10px] font-medium opacity-80">O'rtacha (Good)</span>
              </button>

              {/* 1 kun (Oson / Easy) */}
              <button
                id="btn-anki-1day"
                onClick={() => handleRateCard('1day')}
                className="py-3 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95"
              >
                <span className="text-sm font-extrabold">1 kun</span>
                <span className="text-[10px] font-medium opacity-80">Oson (Easy)</span>
              </button>

              {/* 1 oy / Bilaman (Mastered) */}
              <button
                id="btn-anki-1month"
                onClick={() => handleRateCard('1month')}
                className="col-span-2 sm:col-span-1 py-3 px-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95 shadow-xs"
              >
                <span className="text-sm font-extrabold">1 oy / Bilaman</span>
                <span className="text-[10px] font-medium opacity-80">Yodlandi ✓</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: FULL DECK DIRECTORY */}
      {activeTab === 'deck' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="So'z yoki tarjimani qidirish (masalan: water)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">Barcha darajalar</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCards.map((card) => {
              const isDue = card.nextReviewAt <= Date.now();
              return (
                <div
                  key={card.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                        {card.level} • {card.partOfSpeech}
                      </span>
                      <button
                        onClick={() => sound.speakEnglish(card.word)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{card.word}</h4>
                      <p className="text-xs text-slate-400 font-mono">{card.phonetic}</p>
                    </div>

                    <p className="text-sm font-semibold text-amber-700 bg-amber-50/60 px-2 py-1 rounded-lg">
                      {card.translation}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 italic">
                      "{card.example}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className={`font-semibold ${isDue ? 'text-rose-600' : 'text-slate-400'}`}>
                      {getTimeRemainingText(card.nextReviewAt)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600 text-[10px]">
                      {card.interval}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD NEW WORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Yangi So'z Qo'shish (Anki)</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Inglizcha So'z *</label>
                  <input
                    type="text"
                    required
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="masalan: resilient"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transkripsiya</label>
                  <input
                    type="text"
                    value={newPhonetic}
                    onChange={(e) => setNewPhonetic(e.target.value)}
                    placeholder="/rɪˈzɪl.jənt/"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">O'zbekcha Tarjimasi *</label>
                <input
                  type="text"
                  required
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  placeholder="bardoshli, chidamli"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">So'z turkumi</label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="noun">Noun (Ot)</option>
                    <option value="verb">Verb (Fe'l)</option>
                    <option value="adjective">Adjective (Sifat)</option>
                    <option value="adverb">Adverb (Ravish)</option>
                    <option value="idiom">Idiom (Ibora)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Daraja</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as EnglishLevel)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Inglizcha Misol Jumla</label>
                <input
                  type="text"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="He is a resilient person who never gives up."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Misolning O'zbekcha Tarjimasi</label>
                <input
                  type="text"
                  value={newExampleUz}
                  onChange={(e) => setNewExampleUz(e.target.value)}
                  placeholder="U hech qachon taslim bo'lmaydigan bardoshli inson."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-500/20"
                >
                  Lug'atga saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
