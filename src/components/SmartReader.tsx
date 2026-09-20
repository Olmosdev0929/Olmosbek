import React, { useState } from 'react';
import { EnglishLevel, SmartReaderPassage } from '../types';
import {
  BookOpen,
  Volume2,
  Sparkles,
  Plus,
  Check,
  Brain,
  Search,
  ExternalLink,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

const SAMPLE_PASSAGES: SmartReaderPassage[] = [
  {
    id: 'rd_1',
    title: 'The Evolution of Cognitive Artificial Intelligence',
    level: 'B2',
    genre: 'Science & Technology',
    readTime: '3 daqiqa',
    content: `Artificial intelligence has transcended elementary computational algorithms to emulate sophisticated neural cognitive frameworks. In contemporary research laboratories across Oxford and Zurich, neuroscientists collaborate with computer engineers to develop neural architectures capable of deciphering intricate linguistic nuances and philosophical metaphors.

However, prominent ethicists caution that unregulated autonomous systems could inadvertently exacerbate socio-economic inequalities. Transparency in machine learning decision-making remains a pivotal prerequisite for fostering public trust and safeguarding privacy in automated administrative domains.`,
    keyWords: [
      { word: 'transcended', translation: "chegaradan oshib o'tmoq, yengib o'tmoq", phonetic: '/trænˈsendɪd/', partOfSpeech: 'verb', example: 'His performance transcended all initial expectations.' },
      { word: 'emulate', translation: "taqlid qilmoq, o'rnak olmoq", phonetic: '/ˈem.jə.leɪt/', partOfSpeech: 'verb', example: 'Young scholars strive to emulate the discipline of renowned professors.' },
      { word: 'nuances', translation: "nozik jihatlar, farqlar", phonetic: '/ˈnjuː.ɑːnsɪz/', partOfSpeech: 'noun', example: 'Diplomats must understand the subtle cultural nuances of speech.' },
      { word: 'pivotal', translation: "o'ta muhim, hal qiluvchi", phonetic: '/ˈpɪv.ə.təl/', partOfSpeech: 'adjective', example: 'The agreement marked a pivotal turning point in regional peace.' },
      { word: 'safeguarding', translation: "himoya qilmoq, asramoq", phonetic: '/ˈseɪf.ɡɑː.dɪŋ/', partOfSpeech: 'verb', example: 'Strict digital laws are necessary for safeguarding personal confidential data.' },
    ]
  },
  {
    id: 'rd_2',
    title: 'Sustainable Urban Living in Green Capitals',
    level: 'B1',
    genre: 'Environment & Society',
    readTime: '2 daqiqa',
    content: `Copenhagen and Vienna are globally recognized for pioneering sustainable municipal infrastructures. Urban planners prioritize integrated bicycle expressways, solar-powered public transit networks, and communal vertical gardens.

Residents frequently report diminished stress levels attributable to pedestrianized metropolitan districts. By discouraging private vehicular congestion, municipal authorities cultivate vibrant neighborhoods where local commerce and recreational sports naturally flourish.`,
    keyWords: [
      { word: 'pioneering', translation: "kashfiyotchilik, yangilik kiritish", phonetic: '/ˌpaɪəˈnɪə.rɪŋ/', partOfSpeech: 'adjective', example: 'The university conducted pioneering research on renewable green hydrogen.' },
      { word: 'diminished', translation: "kamaygan, pasaygan", phonetic: '/dɪˈmɪn.ɪʃt/', partOfSpeech: 'adjective', example: 'Air pollution diminished significantly after closing inner-city factories.' },
      { word: 'flourish', translation: "gullab-yashnamoq, rivojlanmoq", phonetic: '/ˈflʌr.ɪʃ/', partOfSpeech: 'verb', example: 'Creative startups flourish in supportive innovation hubs.' },
    ]
  },
  {
    id: 'rd_3',
    title: 'The Art of Masterful Communication',
    level: 'A2',
    genre: 'Daily Skills',
    readTime: '2 daqiqa',
    content: `Effective communication is more than speaking clearly. It involves active listening and showing sincere empathy to your conversation partner. When you ask open questions and maintain respectful eye contact, people feel valued and understood. This simple habit builds lasting friendships and professional confidence.`,
    keyWords: [
      { word: 'sincere', translation: "samimiy, chin ko'ngildan", phonetic: '/sɪnˈsɪər/', partOfSpeech: 'adjective', example: 'She expressed sincere gratitude to her English tutor.' },
      { word: 'empathy', translation: "hamdardlik, his-tuyg'uni tushunish", phonetic: '/ˈem.pə.θi/', partOfSpeech: 'noun', example: 'Empathy helps teachers understand their students challenges.' },
    ]
  }
];

interface SmartReaderProps {
  studentLevel: EnglishLevel;
  onAddWordToFlashcards: (word: string, translation: string, level: EnglishLevel) => void;
}

export const SmartReader: React.FC<SmartReaderProps> = ({
  studentLevel,
  onAddWordToFlashcards,
}) => {
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [activeWordData, setActiveWordData] = useState<{
    word: string;
    translation: string;
    phonetic: string;
    partOfSpeech: string;
    example: string;
  } | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [addedWords, setAddedWords] = useState<Record<string, boolean>>({});
  const [isSpeakingPassage, setIsSpeakingPassage] = useState(false);

  const passage = SAMPLE_PASSAGES[selectedPassageIndex];

  // Clean word helper
  const cleanWord = (w: string) => w.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, "").trim();

  // Click on any word in the passage
  const handleWordClick = async (rawWord: string) => {
    const word = cleanWord(rawWord);
    if (!word || word.length < 2) return;

    sound.playClick();

    // Check predefined list first
    const foundInList = passage.keyWords.find(
      k => k.word.toLowerCase() === word.toLowerCase()
    );

    if (foundInList) {
      setActiveWordData(foundInList);
      return;
    }

    // Otherwise, fetch from server AI reader-explain
    setIsLoadingExplanation(true);
    setActiveWordData({
      word,
      translation: 'Yuklanmoqda...',
      phonetic: `/${word.toLowerCase()}/`,
      partOfSpeech: 'so\'z',
      example: `Context: in this sentence...`,
    });

    try {
      const res = await fetch('/api/ai/reader-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordOrPhrase: word,
          contextSentence: passage.content,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveWordData({
          word: data.data.word,
          translation: data.data.uzbekTranslation,
          phonetic: data.data.phonetic,
          partOfSpeech: data.data.partOfSpeech,
          example: data.data.example,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // Add word to Anki Flashcard deck
  const handleAddToAnki = () => {
    if (!activeWordData) return;
    onAddWordToFlashcards(activeWordData.word, activeWordData.translation, passage.level);
    setAddedWords(prev => ({ ...prev, [activeWordData.word.toLowerCase()]: true }));
    sound.playConfetti();
  };

  // Speak word aloud
  const handleSpeakWord = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-GB';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  // Speak whole passage
  const handleToggleSpeakPassage = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeakingPassage) {
      window.speechSynthesis.cancel();
      setIsSpeakingPassage(false);
    } else {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(passage.content);
      u.lang = 'en-GB';
      u.rate = 0.9;
      u.onend = () => setIsSpeakingPassage(false);
      u.onerror = () => setIsSpeakingPassage(false);
      setIsSpeakingPassage(true);
      window.speechSynthesis.speak(u);
    }
  };

  // Split text into interactive clickable words
  const renderInteractiveText = (text: string) => {
    const paragraphs = text.split('\n\n');
    return paragraphs.map((p, pIdx) => {
      const words = p.split(' ');
      return (
        <p key={pIdx} className="mb-4 leading-relaxed text-sm sm:text-base text-slate-800 dark:text-slate-200">
          {words.map((w, wIdx) => {
            const cleaned = cleanWord(w).toLowerCase();
            const isKeyWord = passage.keyWords.some(k => k.word.toLowerCase() === cleaned);
            const isSelected = activeWordData && activeWordData.word.toLowerCase() === cleaned;

            return (
              <span
                key={wIdx}
                onClick={() => handleWordClick(w)}
                className={`cursor-pointer inline-block px-0.5 rounded transition-all select-text hover:bg-indigo-100 dark:hover:bg-indigo-950/80 hover:text-indigo-700 dark:hover:text-indigo-300 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400'
                    : isKeyWord
                    ? 'font-semibold text-indigo-700 dark:text-indigo-300 underline decoration-indigo-400/60 decoration-wavy underline-offset-4'
                    : ''
                }`}
              >
                {w}{' '}
              </span>
            );
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-3xl bg-linear-to-r from-teal-900 via-emerald-900 to-slate-900 text-white p-6 shadow-xl border border-teal-700/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                Smart Reader & Instant Vocabulary
              </span>
              <span className="text-xs text-teal-200/80">1-Click Anki Integratsiyasi</span>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white">
              Aqlli Matn O'qish & Interaktiv Lug'at
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-2xl">
              Matndagi istalgan notanish so'z ustiga bosing: uning transkripsiyasi, o'zbekcha tarjimasi va talaffuzi ko'rinadi. Bitta tugma bilan uni to'g'ridan-to'g'ri o'zingizning Anki Flashcard palubangizga qo'shing!
            </p>
          </div>

          <button
            onClick={handleToggleSpeakPassage}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shadow-md ${
              isSpeakingPassage
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeakingPassage ? "O'qishni to'xtatish" : "Matnni ovozli eshitish"}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Passage Selector & Text */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Passage tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shadow-xs">
            {SAMPLE_PASSAGES.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPassageIndex(idx);
                  setActiveWordData(p.keyWords[0] || null);
                  sound.playCardFlip();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  selectedPassageIndex === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px]">
                  {p.level}
                </span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>

          {/* Passage Reader Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {passage.genre} • Daraja: {passage.level}
                </span>
                <h3 className="text-xl font-black font-display text-slate-900 dark:text-white mt-0.5">
                  {passage.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>O'qish vaqti: {passage.readTime}</span>
              </div>
            </div>

            {/* Reading Content */}
            <div className="pt-2 font-serif select-text">
              {renderInteractiveText(passage.content)}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Maslahat: Matndagi istalgan so'z ustiga bossangiz, o'ng tomondagi panelda uning batafsil ma'lumoti chiqadi.</span>
            </div>

          </div>

        </div>

        {/* Right Column: Instant Dictionary & Add to Anki Card */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-600" />
                Interaktiv So'z Kartasi
              </span>
              {activeWordData && (
                <button
                  onClick={() => handleSpeakWord(activeWordData.word)}
                  className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                  title="Talaffuzni eshitish"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {activeWordData ? (
              <div className="space-y-4">
                
                <div>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-2xl font-black font-display text-slate-900 dark:text-white capitalize">
                      {activeWordData.word}
                    </h4>
                    <span className="text-xs text-slate-500 font-mono">
                      {activeWordData.phonetic}
                    </span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase">
                    {activeWordData.partOfSpeech}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 space-y-1">
                  <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 block">
                    O'zbekcha tarjimasi:
                  </span>
                  <p className="text-sm font-extrabold text-indigo-700 dark:text-indigo-200">
                    {activeWordData.translation}
                  </p>
                </div>

                {activeWordData.example && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-500 dark:text-slate-400 block">
                      Misol jumla:
                    </span>
                    <p className="italic text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-indigo-500">
                      "{activeWordData.example}"
                    </p>
                  </div>
                )}

                {/* Add to Anki Button */}
                <button
                  onClick={handleAddToAnki}
                  disabled={Boolean(addedWords[activeWordData.word.toLowerCase()])}
                  className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                    addedWords[activeWordData.word.toLowerCase()]
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-orange-500 hover:bg-orange-400 text-white'
                  }`}
                >
                  {addedWords[activeWordData.word.toLowerCase()] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Anki kartalariga qo'shildi!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Anki Kartalariga Qo'shish (SRS)</span>
                    </>
                  )}
                </button>

              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">
                Matndan biror so'zni bosing
              </div>
            )}

            {/* List of important words from passage */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                Ushbu matndagi asosiy so'zlar:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {passage.keyWords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveWordData(kw)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    {kw.word}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
