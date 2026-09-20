import React, { useState } from 'react';
import { Material, EnglishLevel, MaterialCategory, MaterialType, Flashcard } from '../types';
import {
  BookOpen,
  Video,
  FileQuestion,
  Headphones,
  PenTool,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Volume2,
  Plus,
  Play,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface MaterialsViewProps {
  materials: Material[];
  selectedCategory: string; // 'all' | 'grammar' | 'listening' | 'reading' | 'writing'
  onSelectCategory: (cat: string) => void;
  onAddWordToFlashcards?: (word: string, translation: string, level: EnglishLevel) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  selectedCategory,
  onSelectCategory,
  onAddWordToFlashcards,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);

  // Reader state for books
  const [addedWordStatus, setAddedWordStatus] = useState<string | null>(null);

  // Test state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Levels list
  const levels: EnglishLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filteredMaterials = materials.filter((mat) => {
    const matchesLevel = selectedLevel === 'all' || mat.level === selectedLevel;
    const matchesCategory =
      selectedCategory === 'all' || mat.category === selectedCategory;
    const matchesType = selectedType === 'all' || mat.type === selectedType;
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLevel && matchesCategory && matchesType && matchesSearch;
  });

  const handleOpenMaterial = (mat: Material) => {
    sound.playCardFlip();
    setActiveMaterial(mat);
    setUserAnswers({});
    setTestSubmitted(false);
    setAddedWordStatus(null);
  };

  const handleQuickAddWord = (word: string, translation: string) => {
    if (onAddWordToFlashcards && activeMaterial) {
      onAddWordToFlashcards(word, translation, activeMaterial.level);
      sound.playCorrect();
      setAddedWordStatus(word);
      setTimeout(() => setAddedWordStatus(null), 3000);
    }
  };

  const handleSelectQuizOption = (qId: string, optIdx: number) => {
    if (testSubmitted) return;
    setUserAnswers({ ...userAnswers, [qId]: optIdx });
  };

  const handleFinishQuiz = () => {
    setTestSubmitted(true);
    sound.playCorrect();
  };

  return (
    <div className="space-y-6">
      
      {/* If a material is currently opened (Reader / Video / Quiz modal) */}
      {activeMaterial ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Top Bar with Back Button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <button
              onClick={() => setActiveMaterial(null)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Materiallar ro'yxatiga qaytish</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase bg-indigo-100 text-indigo-700">
                {activeMaterial.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-slate-100 text-slate-600">
                {activeMaterial.category} • {activeMaterial.type}
              </span>
            </div>
          </div>

          {/* Title & Teacher Info */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {activeMaterial.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              O'qituvchi: <b>{activeMaterial.authorTeacherName}</b> • Davomiyligi/Hajmi: <b>{activeMaterial.durationOrPages}</b>
            </p>
          </div>

          {/* 1. VIDEO VIEWER */}
          {activeMaterial.type === 'video' && (
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-lg relative flex items-center justify-center">
                {/* Responsive educational video preview */}
                <img
                  src={activeMaterial.thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'}
                  alt={activeMaterial.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-xl transition-all transform hover:scale-110 mb-3">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                  <span className="font-extrabold text-sm sm:text-base">Videodarsni Tinglash va Ko'rish</span>
                  <span className="text-xs text-slate-300 mt-1">{activeMaterial.durationOrPages} • HD Sifat</span>
                </div>
              </div>

              {/* Lesson Summary and Transcript */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-800 text-sm">Dars tavsifi va asosiy nuqtalar:</h4>
                <p className="text-slate-600 leading-relaxed">
                  {activeMaterial.description}
                </p>
              </div>
            </div>
          )}

          {/* 2. E-BOOK & READING READER WITH WORD-LOOKUP FOR ANKI */}
          {activeMaterial.type === 'book' && (
            <div className="space-y-6">
              
              {/* Added to flashcards alert notification */}
              {addedWordStatus && (
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>"{addedWordStatus}" so'zi muvaffaqiyatli Anki Flashcard deckiga qo'shildi!</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full">Anki SRS</span>
                </div>
              )}

              {/* Reader layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Book text area */}
                <div className="lg:col-span-2 bg-amber-50/40 p-6 rounded-3xl border border-amber-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-200/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Interaktiv Kitob O'quvchi
                    </span>
                    <span className="text-[11px] text-amber-700">
                      O'ng paneldagi so'zlarni bosing va Anki kartochkasiga qo'shing
                    </span>
                  </div>

                  <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm whitespace-pre-line font-serif">
                    {activeMaterial.bookContent}
                  </div>
                </div>

                {/* Vocabulary Sidebar for Quick Anki Add */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Kitob Lug'ati (Vocab to Anki)
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Ushbu matndan yangi so'zlarni 1-bosishda Anki xotira tizimiga yuklang:
                  </p>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {activeMaterial.vocabularyList?.map((item) => (
                      <div
                        key={item.word}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-orange-300 bg-slate-50/60 hover:bg-orange-50/40 transition-all flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{item.word}</span>
                            <button
                              onClick={() => sound.speakEnglish(item.word)}
                              className="text-slate-400 hover:text-orange-500"
                              title="Talaffuz"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[11px] text-amber-800 font-medium">
                            {item.translation}
                          </span>
                        </div>

                        <button
                          onClick={() => handleQuickAddWord(item.word, item.translation)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-orange-200 hover:bg-orange-500 hover:text-white text-orange-600 font-bold text-[10px] transition-all flex items-center gap-1 shrink-0 shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Ankiga</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3. TEST / QUIZ RUNNER */}
          {activeMaterial.type === 'test' && activeMaterial.quizQuestions && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
                <span>Savollar soni: <b>{activeMaterial.quizQuestions.length} ta</b></span>
                <span>Maksimal ball: <b>100 ball</b></span>
              </div>

              <div className="space-y-4">
                {activeMaterial.quizQuestions.map((q, qIndex) => {
                  const selected = userAnswers[q.id];
                  const isCorrectAnswer = testSubmitted && selected === q.correctIndex;
                  const isWrongAnswer = testSubmitted && selected !== undefined && selected !== q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
                    >
                      <h4 className="font-bold text-slate-900 text-sm">
                        {qIndex + 1}. {q.question}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIndex) => {
                          const isPicked = selected === oIndex;
                          let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                          if (isPicked && !testSubmitted) {
                            btnClass = 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold';
                          } else if (testSubmitted) {
                            if (oIndex === q.correctIndex) {
                              btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-800 font-bold';
                            } else if (isPicked && oIndex !== q.correctIndex) {
                              btnClass = 'bg-rose-100 border-rose-500 text-rose-800 font-bold';
                            }
                          }

                          return (
                            <button
                              key={oIndex}
                              onClick={() => handleSelectQuizOption(q.id, oIndex)}
                              className={`p-3 rounded-xl border text-left transition-all ${btnClass}`}
                            >
                              <span className="font-bold mr-2">{String.fromCharCode(65 + oIndex)})</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {testSubmitted && (
                        <div className={`p-2.5 rounded-xl text-xs ${
                          selected === q.correctIndex ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                        }`}>
                          <p className="font-semibold">
                            {selected === q.correctIndex ? '✓ To\'g\'ri!' : '✗ Noto\'g\'ri!'}
                          </p>
                          <p className="text-[11px] mt-0.5 opacity-90">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!testSubmitted ? (
                <button
                  onClick={handleFinishQuiz}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-500/20 transition-all"
                >
                  Testni yakunlash va natijani tekshirish
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <h4 className="text-base font-extrabold text-emerald-900">
                    Test natijasi saqlandi!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    To'g'ri javoblaringiz o'quvchi profilingizga qo'shildi.
                  </p>
                  <button
                    onClick={() => {
                      setUserAnswers({});
                      setTestSubmitted(false);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Qayta topshirish
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* MAIN MATERIALS CATALOG VIEW */
        <div className="space-y-5">
          
          {/* Section Categories Pills (Grammar, Listening, Reading, Writing, Hammasi) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Barcha Bo'limlar
            </button>
            <button
              onClick={() => onSelectCategory('grammar')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'grammar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Grammatika (Grammar)</span>
            </button>
            <button
              onClick={() => onSelectCategory('listening')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'listening'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Tinglash (Listening)</span>
            </button>
            <button
              onClick={() => onSelectCategory('reading')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'reading'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>O'qish (Reading)</span>
            </button>
            <button
              onClick={() => onSelectCategory('writing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'writing'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Yozish (Writing)</span>
            </button>
          </div>

          {/* Level and Type Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Level Selector Pills A1-C2 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Daraja:</span>
              <button
                onClick={() => setSelectedLevel('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedLevel === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Hammasi
              </button>
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    selectedLevel === lvl
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Type selector (Video, Kitob, Test) & Search */}
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">Barcha Turlar</option>
                <option value="video">Videodarslar</option>
                <option value="book">Kitoblar / Matnlar</option>
                <option value="test">Testlar & Mashqlar</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Qidirish..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none w-36 sm:w-48"
                />
              </div>
            </div>

          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                onClick={() => handleOpenMaterial(mat)}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
              >
                {/* Optional thumbnail for videos */}
                {mat.type === 'video' && mat.thumbnailUrl && (
                  <div className="aspect-video w-full overflow-hidden relative bg-slate-100">
                    <img
                      src={mat.thumbnailUrl}
                      alt={mat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-md">
                        <Play className="w-4 h-4 fill-indigo-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-2.5 flex-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-md font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {mat.level}
                    </span>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      {mat.type === 'video' && <Video className="w-3.5 h-3.5 text-blue-500" />}
                      {mat.type === 'book' && <BookOpen className="w-3.5 h-3.5 text-amber-500" />}
                      {mat.type === 'test' && <FileQuestion className="w-3.5 h-3.5 text-emerald-500" />}
                      <span>{mat.durationOrPages}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {mat.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Ustoz: <b>{mat.authorTeacherName}</b></span>
                  <span className="font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Ochish →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-500">
                Tanlangan filtrlar bo'yicha materiallar topilmadi.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
