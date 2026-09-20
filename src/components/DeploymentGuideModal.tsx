import React, { useState } from 'react';
import {
  Send,
  Globe,
  Smartphone,
  Apple,
  Check,
  Copy,
  ExternalLink,
  Bot,
  Layers,
  Sparkles,
  Zap,
  Terminal,
  ShieldCheck,
  Vibrate,
  X,
  Server,
  Code,
  Rocket,
  QrCode,
  CheckCircle2,
  MessageSquare,
  Share2
} from 'lucide-react';
import { telegram } from '../utils/telegram';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'quickshare' | 'telegram' | 'hosting' | 'playstore' | 'appstore'>('quickshare');
  const [botUsername, setBotUsername] = useState('EduEnglishPlatform_bot');
  const [appName, setAppName] = useState('app');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [hapticTested, setHapticTested] = useState(false);

  if (!isOpen) return null;

  const isTMA = telegram.isAvailable();
  const sharedHost = 'https://ais-pre-3mj4k3ios7tdaivafduoqc-309817203123.asia-east1.run.app';
  const currentHost = typeof window !== 'undefined' && window.location.origin.includes('run.app')
    ? window.location.origin
    : sharedHost;
  const generatedTelegramLink = `https://t.me/${botUsername.replace('@', '')}/${appName}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    telegram.hapticNotification('success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const testHaptic = (type: 'light' | 'medium' | 'heavy') => {
    telegram.hapticImpact(type);
    setHapticTested(true);
    setTimeout(() => setHapticTested(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-600 via-indigo-600 to-violet-700 p-6 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                <Rocket className="w-3 h-3 text-amber-300" />
                Foydalanishga topshirish & Ishga tushirish (Deploy)
              </span>
              {isTMA ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 flex items-center gap-1">
                  <Send className="w-3 h-3" /> Telegram Mini App Faol
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400/25 text-emerald-100 border border-emerald-300/30">
                  ✓ Jonli Server Faol
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight">
              Ilovani Foydalanishga Topshirish & Ulashish
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Platformangizning tayyor jonli havolasini oling, o'quvchi va o'qituvchilarga bering, Telegram boti ichida oching yoki doimiy domenga joylang.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quickshare')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'quickshare'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Rocket className="w-4 h-4 text-emerald-600" />
            <span>1. Tezkor Topshirish (Havola)</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'telegram'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-sky-500" />
            <span>2. Telegram Mini App</span>
          </button>

          <button
            onClick={() => setActiveTab('hosting')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'hosting'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4 text-indigo-500" />
            <span>3. 24/7 Doimiy Xosting</span>
          </button>

          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'playstore'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>4. Google Play Market</span>
          </button>

          <button
            onClick={() => setActiveTab('appstore')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'appstore'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>5. Apple App Store</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6 text-slate-700">

          {/* TAB 0: TEZKOR TOPSHIRISH VA JONLI HAVOLA */}
          {activeTab === 'quickshare' && (
            <div className="space-y-6">

              {/* Success Callout Banner */}
              <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base">
                        Platformangiz topshirishga to'liq tayyor!
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white animate-pulse">
                        Jonli havola faol
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">
                      Ilovangiz muvaffaqiyatli qurilgan va Google Cloud serverida ishlamoqda.
                      Quyidagi doimiy havolani o'quvchilar, o'qituvchilar yoki buyurtmachiga yuborib darhol foydalanishga topshirishingiz mumkin.
                    </p>
                  </div>
                </div>

                <a
                  href={currentHost}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <span>Yangi oynada ochish</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Direct Link & QR Code Card */}
              <div className="p-5 rounded-2xl border-2 border-indigo-100 bg-white shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      1. Asosiy Jonli Havola (Barcha foydalanuvchilar uchun)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ushbu havolani brauzerda, Telegramda yoki telefonda ochish mumkin (ro'yxatdan o'tish talab qilinmaydi)
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                    HTTPS Doimiy Havola
                  </span>
                </div>

                {/* Big Copy Bar */}
                <div className="p-3 bg-slate-900 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-100">
                  <div className="font-mono text-xs sm:text-sm text-emerald-400 truncate w-full px-2 select-all">
                    {currentHost}
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => copyToClipboard(currentHost, 'main-url')}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {copiedCode === 'main-url' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Nusxalandi!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Havolani nusxalash</span>
                        </>
                      )}
                    </button>
                    <a
                      href={currentHost}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="Yangi oynada ochish"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* QR Code and Quick Phone Scan */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(currentHost)}`}
                      alt="EduEnglish QR Code"
                      className="w-28 h-28 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                      <QrCode className="w-4 h-4 text-indigo-600" />
                      Telefon kamerasida skaner qilib ochish
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      O'quvchi yoki o'qituvchilar telefon kamerasini ushbu QR-kodga qaratsa, ilova darhol ochiladi va to'liq ekranda o'rnatib olish taklif etiladi.
                    </p>
                    <div className="text-[11px] text-slate-500 font-medium pt-1">
                      Android (Chrome) va iPhone (Safari) brauzerlariga to'liq moslangan.
                    </div>
                  </div>
                </div>
              </div>

              {/* Ready-made Invitation Message Template */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-500" />
                    2. O'quvchi va O'qituvchilar guruhiga yuborish uchun tayyor taklifnoma
                  </h4>
                  <span className="text-xs text-slate-400 hidden sm:inline">1 bosishda nusxalanadi</span>
                </div>
                
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-sans text-xs text-slate-700 leading-relaxed select-all">
                  <p className="font-bold text-slate-900 mb-1">
                    Assalomu alaykum! 🎓
                  </p>
                  <p className="mb-2">
                    Bizning ingliz tili ta'lim platformamiz rasman ishga tushirildi! Platformada darajali darslar, Anki interval kartochkalari, Kahoot testlari, insho tekshiruvchi AI va uy vazifalari mavjud.
                  </p>
                  <p className="font-semibold text-indigo-700">
                    👉 O'qishni boshlash uchun havola: <span className="font-mono">{currentHost}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-2">
                    📱 Telefon yoki kompyuter orqali bir bosishda kirishingiz mumkin.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const msg = `Assalomu alaykum! 🎓\nBizning ingliz tili ta'lim platformamiz rasman ishga tushirildi!\n👉 Kirish uchun havola: ${currentHost}\n📱 Telefon yoki kompyuter orqali bir bosishda kirishingiz mumkin.`;
                      copyToClipboard(msg, 'invite-msg');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    {copiedCode === 'invite-msg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'invite-msg' ? 'Matn nusxalandi!' : 'Xabarni nusxalash'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Methods of Deployment / Handover */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-indigo-600" />
                  3. Foydalanishga topshirishning 4 ta qulay usuli:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Method 1 */}
                  <div className="p-4 rounded-xl border-2 border-indigo-500/20 bg-indigo-50/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                        1-usul • AI Studio orqali
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600">Eng osoni</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                      "Share" va "Deploy" tugmalari
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      AI Studio interfeysining yuqori o'ng burchagidagi <strong>"Share"</strong> tugmasini bosing — tayyor havola hosil bo'ladi.
                      Doimiy 24/7 server uchun esa <strong>"Deploy"</strong> tugmasini bosib Cloud Run ga chiqaring.
                    </p>
                  </div>

                  {/* Method 2 */}
                  <div className="p-4 rounded-xl border-2 border-sky-500/20 bg-sky-50/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white text-[10px] font-bold">
                        2-usul • Telegram orqali
                      </span>
                      <span className="text-[11px] font-bold text-sky-600">Eng ommabop</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Telegram Mini App (TMA)
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Telegramda <code>@BotFather</code> ga kirib <code>/newapp</code> buyrug'i orqali o'z botingizga ushbu havolani biriktiring.
                      O'quvchilar bitta havola orqali Telegram ichida to'liq ilovadek foydalanadi.
                    </p>
                  </div>

                  {/* Method 3 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-white text-[10px] font-bold">
                        3-usul • O'z domeningizga
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">To'liq nazorat</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                      GitHub yoki ZIP yuklab olish
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      AI Studio Sozlamalar menyusidan <strong>"Export to GitHub"</strong> yoki <strong>"Download ZIP"</strong> qiling.
                      Kodni Vercel, Netlify yoki o'zingizning VPS serveringizga 1 bosishda o'rnatishingiz mumkin.
                    </p>
                  </div>

                  {/* Method 4 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold">
                        4-usul • Mobil qurilmaga
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600">PWA / Mobil</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Play Market & App Store yoki PWA
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Safari / Chrome brauzerida <strong>"Bosh ekranga qo'shish"</strong> (Add to Home Screen) qilinsa, telefon ekraniga ikonka tushib xuddi Play Market dasturidek ishlaydi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ready Checklist */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Topshirish oldidan tizim holati (Production Status):
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>O'quvchi Paneli (Anki, Kahoot, AI Speaking)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>O'qituvchi Paneli (Guruhlar, Davomat, Baholar)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Admin Paneli (O'qituvchilar & CRM boshqaruvi)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Telegram WebApp SDK & PWA moslashuvi</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 1: TELEGRAM MINI APP */}
          {activeTab === 'telegram' && (
            <div className="space-y-6">
              
              {/* Feature highlight */}
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3">
                <div className="p-2 bg-sky-500 text-white rounded-lg shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-sm">
                  <h4 className="font-bold text-sky-950">
                    Platforma allaqachon Telegram WebApp SDK ga to'liq moslangan!
                  </h4>
                  <p className="text-sky-800 mt-1">
                    Ilova Telegram ichida ochilganda avtomatik ravishda to'liq ekranga yoyiladi (<code>tg.expand()</code>), 
                    Anki kartochkalari va Kahoot testlarida haqiqiy telefon vibratsiyasi (Haptic feedback) beradi va 
                    o'quvchining Telegram ismini aniqlay oladi.
                  </p>
                </div>
              </div>

              {/* BotFather Interactive Link Generator */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Mini App to'g'ridan-to'g'ri havolasini hosil qilish
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Telegram Bot Username:
                    </label>
                    <input
                      type="text"
                      value={botUsername}
                      onChange={(e) => setBotUsername(e.target.value)}
                      placeholder="Masalan: EduEnglish_bot"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Mini App Short Name:
                    </label>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="Masalan: app"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="truncate text-xs font-mono text-indigo-700 w-full">
                    {generatedTelegramLink}
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedTelegramLink, 'tma-link')}
                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {copiedCode === 'tma-link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'tma-link' ? "Nusxalandi!" : "Havolani nusxalash"}</span>
                  </button>
                </div>
              </div>

              {/* Step by step BotFather instructions */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-500" />
                  BotFather orqali 4 ta qadamda ulash:
                </h4>

                <div className="space-y-3">
                  
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center">
                        1
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        Telegramda @BotFather ga kiring va yangi bot oching
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2 ml-7">
                      BotFather chatiga <code>/newbot</code> buyrug'ini yuboring, botga nom va username bering.
                    </p>
                    <div className="ml-7 flex items-center justify-between bg-slate-900 text-slate-100 px-3 py-2 rounded-lg font-mono text-xs">
                      <span>/newbot</span>
                      <button
                        onClick={() => copyToClipboard('/newbot', 'step-1')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedCode === 'step-1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center">
                        2
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        Mini App yaratish buyrug'i: /newapp
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2 ml-7">
                      BotFather ga <code>/newapp</code> buyrug'ini yuboring. O'zingiz ochgan botni tanlang:
                    </p>
                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 ml-7 mb-2">
                      <li><strong>App Title:</strong> EduEnglish Platformasi</li>
                      <li><strong>Description:</strong> Ingliz tili o'rganuvchilar va o'qituvchilar uchun ta'lim tizimi</li>
                      <li><strong>Photo (640x360):</strong> Ilova rasmini yuklang</li>
                      <li>
                        <strong>Web App URL:</strong> Xosting qilingan HTTPS havolangiz (masalan, Vercel yoki Cloud Run havolasi):
                        <div className="mt-1 flex items-center gap-2 bg-slate-100 p-1.5 rounded-md font-mono text-[11px] text-indigo-700">
                          <span className="truncate">{currentHost}</span>
                          <button
                            onClick={() => copyToClipboard(currentHost, 'current-host')}
                            className="text-slate-600 hover:text-indigo-600 font-sans font-bold"
                          >
                            {copiedCode === 'current-host' ? 'Nusxalandi' : 'Nusxalash'}
                          </button>
                        </div>
                      </li>
                      <li><strong>Short name:</strong> <code>app</code> yoki <code>edu</code></li>
                    </ul>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center">
                        3
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        Botning asosiy menyu tugmasini (Menu Button) o'rnatish
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2 ml-7">
                      Foydalanuvchilar botga kirganda chap pastki burchakda "O'qishni boshlash" tugmasi chiqishi uchun:
                    </p>
                    <div className="ml-7 flex items-center justify-between bg-slate-900 text-slate-100 px-3 py-2 rounded-lg font-mono text-xs">
                      <span>/setmenubutton</span>
                      <button
                        onClick={() => copyToClipboard('/setmenubutton', 'step-3')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedCode === 'step-3' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 4: Haptic Vibration Tester */}
                  <div className="p-3.5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Vibrate className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-xs text-indigo-950">
                          Telegram Haptic Feedback (Vibratsiya) sinovi
                        </span>
                      </div>
                      <span className="text-[11px] text-indigo-600">
                        {hapticTested ? "✓ Vibratsiya signali yuborildi!" : "Mobil qurilma uchun"}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-800/80 mt-1 mb-2">
                      Mini App ichida har bir Flashcard burilganda yoki Kahoot savoliga to'g'ri javob berilganda taktil aloqa beriladi.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => testHaptic('light')}
                        className="px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-50"
                      >
                        Yumshoq zarba (Light)
                      </button>
                      <button
                        onClick={() => testHaptic('medium')}
                        className="px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-50"
                      >
                        O'rtacha zarba (Medium)
                      </button>
                      <button
                        onClick={() => testHaptic('heavy')}
                        className="px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-50"
                      >
                        Kuchli zarba (Heavy)
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DOIMIY HOSTING */}
          {activeTab === 'hosting' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm">
                <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Doimiy 24/7 ishlash uchun xosting talablari:
                </h4>
                <p className="text-emerald-800">
                  Telegram Mini App va Mobil Ilovalar ishlashi uchun server <strong>HTTPS (SSL sertifikat)</strong> ga ega bo'lishi shart. 
                  Quyidagi variantlar bepul doimiy HTTPS va cheksiz domen taqdim etadi.
                </p>
              </div>

              {/* Option 1: Vercel */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                      ▲
                    </span>
                    <h5 className="font-extrabold text-slate-900 text-sm">
                      1-variant: Vercel (Eng qulay, tez va bepul)
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    Tavsiya etiladi
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Vercel Vite/React ilovalarini 1 daqiqada doimiy bepul serverga joylaydi va <code>.vercel.app</code> bepul SSL domen beradi.
                </p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400">
                    <span># Terminalda ishga tushirish:</span>
                    <button
                      onClick={() => copyToClipboard('npm i -g vercel && vercel --prod', 'vercel-cmd')}
                      className="text-xs hover:text-white"
                    >
                      {copiedCode === 'vercel-cmd' ? 'Nusxalandi!' : 'Nusxalash'}
                    </button>
                  </div>
                  <div className="text-emerald-400">npm run build</div>
                  <div className="text-sky-400">npx vercel --prod</div>
                </div>
              </div>

              {/* Option 2: Cloud Run / Render / VPS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                    Google Cloud Run (AI Studio orqali)
                  </h5>
                  <p className="text-xs text-slate-600 mb-2">
                    AI Studio interfeysining yuqori o'ng burchagidagi <strong>"Deploy"</strong> yoki <strong>"Share"</strong> tugmasini bosish orqali to'g'ridan-to'g'ri Cloud Run ga joylash mumkin.
                  </p>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block">
                    Serverless & Avtomatik masshtablanadi
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                    O'zbekiston VPS / Hetzner (Nginx + PM2)
                  </h5>
                  <p className="text-xs text-slate-600 mb-2">
                    Agar o'zingizning Ubuntu serveringiz bo'lsa: <code>npm run build</code> qiling va hosil bo'lgan <code>dist/</code> papkasini Nginx orqali ulang (Certbot orqali bepul SSL).
                  </p>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md inline-block">
                    O'z domeningiz uchun to'liq nazorat
                  </span>
                </div>
              </div>

              {/* Database advice */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <h5 className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Ma'lumotlar bazasi (Database) bo'yicha muhim eslatma:
                </h5>
                <p className="text-amber-900 leading-relaxed">
                  Ilova ayni paytda o'quvchi, o'qituvchi, guruhlar va dars ma'lumotlarini brauzerning <strong>localStorage</strong> qismida saqlaydi. 
                  Yuzlab mustaqil o'quvchi va o'qituvchilar turli telefonlardan real-time dars o'tishi va vazifalarni sinxron topshirishi uchun 
                  <strong> Firebase Firestore</strong> yoki <strong>Supabase / PostgreSQL</strong> bulutli ma'lumotlar bazasiga ulash tavsiya etiladi.
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: PLAY MARKET */}
          {activeTab === 'playstore' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm">
                <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  Google Play Marketga joylashning 2 ta yo'li:
                </h4>
                <p className="text-emerald-800">
                  Biz platformaga <code>manifest.json</code> va PWA standartlarini o'rnatdik. Shu sababli uni 10 daqiqa ichida tayyor Android <code>.aab</code> (Android App Bundle) ga aylantirish mumkin.
                </p>
              </div>

              {/* Method A: PWABuilder (Fastest) */}
              <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/20">
                <div className="flex items-center justify-between mb-1.5">
                  <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-xs font-bold">A-yo'l</span>
                    PWABuilder orqali tayyor .AAB olish (Eng tez va qulay)
                  </h5>
                  <span className="text-xs font-bold text-emerald-600">10 daqiqa</span>
                </div>
                <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside mb-3">
                  <li>Saytingizni xostingga joylang (masalan, Vercel yoki Cloud Run).</li>
                  <li>
                    <a 
                      href="https://www.pwabuilder.com" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-indigo-600 font-bold underline inline-flex items-center gap-0.5"
                    >
                      pwabuilder.com <ExternalLink className="w-3 h-3" />
                    </a> 
                    saytiga kiring va saytingiz havolasini yozing.
                  </li>
                  <li>Sayt avtomatik tekshiruvdan o'tgach, <strong>"Package for Stores"</strong> tugmasini bosing.</li>
                  <li><strong>"Google Play"</strong> ni tanlang va <strong>"Generate Package"</strong> tugmasini bosing.</li>
                  <li>Sizga tayyor imzolangan <code>.aab</code> yuklanadi!</li>
                </ol>
              </div>

              {/* Method B: Capacitor CLI */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h5 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-white text-xs font-bold">B-yo'l</span>
                  Capacitor (Android Studio orqali to'liq nazorat)
                </h5>
                <p className="text-xs text-slate-600 mb-2">
                  Agar sizga push bildirishnomalar yoki native Android plaginlari kerak bo'lsa, loyihaga Capacitor qo'shing:
                </p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs space-y-1">
                  <div className="text-slate-400"># 1. Capacitor paketlarini o'rnatish:</div>
                  <div className="text-emerald-400">npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                  <div className="text-slate-400 mt-2"># 2. Loyihani initsializatsiya qilish:</div>
                  <div className="text-sky-400">npx cap init EduEnglish com.eduenglish.app --web-dir=dist</div>
                  <div className="text-slate-400 mt-2"># 3. Android platformasini qo'shish va build qilish:</div>
                  <div className="text-amber-400">npm run build && npx cap add android</div>
                  <div className="text-emerald-400">npx cap open android</div>
                </div>
              </div>

              {/* Google Play Console Requirements */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <h5 className="font-bold text-slate-900 mb-2">
                  Google Play Console uchun kerakli talablar:
                </h5>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li><strong>Google Play Developer Account:</strong> Bir martalik 25$ to'lov.</li>
                  <li><strong>Ilova skrinshotlari:</strong> Kamida 2-4 ta telefon va planshet ekrani suratlari.</li>
                  <li><strong>Maxfiylik siyosati (Privacy Policy URL):</strong> Bepul GitHub Pages yoki sayt ichidagi sahifa.</li>
                  <li><strong>20 ta tester talabi:</strong> Yangi shaxsiy hisoblar uchun 14 kunlik yopiq test o'tkazish talab qilinadi.</li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 4: APP STORE */}
          {activeTab === 'appstore' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm">
                <h4 className="font-bold text-slate-950 flex items-center gap-1.5 mb-1">
                  <Apple className="w-4 h-4 text-slate-900" />
                  Apple App Store (iOS) ga chiqarish tartibi:
                </h4>
                <p className="text-slate-700">
                  iOS ilovalarini App Storega yuklash uchun macOS kompyuteri va Xcode dasturi hamda Apple Developer hisobi talab qilinadi.
                </p>
              </div>

              {/* Capacitor iOS workflow */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h5 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  Capacitor orqali iOS versiyani yaratish:
                </h5>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs space-y-1.5">
                  <div className="text-slate-400"># 1. iOS paketini o'rnatish:</div>
                  <div className="text-emerald-400">npm install @capacitor/ios</div>
                  <div className="text-slate-400 mt-2"># 2. iOS loyihasini yaratish:</div>
                  <div className="text-sky-400">npm run build && npx cap add ios</div>
                  <div className="text-slate-400 mt-2"># 3. Xcode da ochish:</div>
                  <div className="text-amber-400">npx cap open ios</div>
                </div>
              </div>

              {/* Steps in Xcode */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs">
                <h5 className="font-bold text-slate-900 mb-2">
                  Xcode va App Store Connect da yakuniy bosqichlar:
                </h5>
                <ol className="space-y-1.5 text-slate-600 list-decimal list-inside">
                  <li>Xcode dasturida <strong>Signing & Capabilities</strong> bo'limiga kirib o'z Apple ID va Team'ingizni tanlang.</li>
                  <li>Yuqori menyudan <strong>Product → Destination → Any iOS Device (arm64)</strong> ni tanlang.</li>
                  <li><strong>Product → Archive</strong> tugmasini bosing.</li>
                  <li>Arxiv tayyor bo'lgach, <strong>"Distribute App"</strong> orqali App Store Connect'ga avtomatik yuboring.</li>
                  <li><code>appstoreconnect.apple.com</code> da ilova tavsifi, skrinshotlari va narxini kiritib moderatsiyaga yuborasiz (1-2 kunda tekshiriladi).</li>
                </ol>
              </div>

              {/* Safari PWA Alternative */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs">
                <h5 className="font-bold text-indigo-950 mb-1">
                  💡 App Store kutmasdan iPhone ga o'rnatish (PWA Add to Home Screen):
                </h5>
                <p className="text-indigo-900 leading-relaxed">
                  O'quvchilaringiz Safari brauzerida saytga kirib, pastdagi <strong>"Ulashish" (Share)</strong> tugmasini bosib, 
                  <strong>"Bosh ekranga qo'shish" (Add to Home Screen)</strong> ni tanlashsa, ilova App Storedan yuklangandek alohida ikonka va to'liq ekranda ishlaydi!
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            EduEnglish • Telegram WebApp SDK, PWA Manifest va Mobil Tayyorlik Aktiv
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Tushunarli, yopish
          </button>
        </div>

      </div>
    </div>
  );
};
