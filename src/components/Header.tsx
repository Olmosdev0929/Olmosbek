import React, { useState } from 'react';
import {
  UserRole,
  StudentUser,
  TeacherUser,
  NotificationItem
} from '../types';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Bell,
  Volume2,
  VolumeX,
  Flame,
  Award,
  Clock,
  Sparkles,
  CheckCheck,
  Rocket,
  Send,
  Sun,
  Moon
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { telegram } from '../utils/telegram';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  student: StudentUser;
  currentTeacher: TeacherUser;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onTriggerTestNotification: (type: 'lesson' | 'anki') => void;
  onSelectNotificationTab?: (tab: string) => void;
  onOpenDeploymentGuide: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  student,
  currentTeacher,
  notifications,
  onMarkNotificationRead,
  onTriggerTestNotification,
  onSelectNotificationTab,
  onOpenDeploymentGuide,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [soundOn, setSoundOn] = useState(sound.isEnabled());
  const [showNotifications, setShowNotifications] = useState(false);
  const isTMA = telegram.isAvailable();
  const tgUser = isTMA ? telegram.getUser() : null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSound = () => {
    const newState = sound.toggleSound();
    setSoundOn(newState);
    if (newState) sound.playCorrect();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight font-display">
                  Edu<span className="text-indigo-600 dark:text-indigo-400">English</span>
                </span>
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Platform
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Ingliz tili mukammal ta'lim tizimi
              </p>
            </div>
          </div>

          {/* Role Switcher Pill - The core navigation between Student, Teacher, and Admin */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              id="role-btn-student"
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                currentRole === 'student'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>O'quvchi</span>
              {currentRole === 'student' && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
              )}
            </button>

            <button
              id="role-btn-teacher"
              onClick={() => onRoleChange('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                currentRole === 'teacher'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>O'qituvchi</span>
              {currentRole === 'teacher' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
              )}
            </button>

            <button
              id="role-btn-admin"
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                currentRole === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
              {currentRole === 'admin' && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>
              )}
            </button>
          </div>

          {/* Right Action Controls: Sound, Theme, Streak/XP, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Student Gamification Stats (Visible when in student mode) */}
            {currentRole === 'student' && (
              <div className="hidden md:flex items-center gap-2">
                <div 
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-lg text-amber-700 dark:text-amber-300 text-xs font-bold"
                  title="Kunlik seriya (Streak)"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                  <span>{student.streakDays} kun</span>
                </div>
                <div 
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-lg text-indigo-700 dark:text-indigo-300 text-xs font-bold"
                  title="To'plangan tajriba ballari (XP)"
                >
                  <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{student.xpPoints} XP</span>
                </div>
              </div>
            )}

            {/* Launch / Deploy / Foydalanishga topshirish Button */}
            <button
              id="btn-open-deployment-guide"
              onClick={onOpenDeploymentGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-emerald-600 via-indigo-600 to-violet-600 hover:from-emerald-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all duration-150 active:scale-95 cursor-pointer ring-1 ring-white/20"
              title="Ilovani foydalanishga topshirish, ulashish havolasi va joylashtirish yo'riqnomasi"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Topshirish & Havola</span>
              <span className="sm:hidden">Topshirish</span>
              {isTMA ? (
                <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-extrabold hidden md:inline">
                  🚀 Jonli
                </span>
              )}
            </button>

            {/* Dark / Light Mode Switcher (Tungi va kunduzgi rejim tugmasi) */}
            <button
              id="btn-theme-toggle"
              onClick={() => {
                sound.playCardFlip();
                onToggleDarkMode();
              }}
              title={isDarkMode ? "Kunduzgi rejimga o'tish (Light mode)" : "Tungi rejimga o'tish (Dark mode)"}
              aria-label={isDarkMode ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish"}
              className="relative p-2 rounded-xl border transition-all duration-200 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 shadow-xs cursor-pointer group"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            {/* Sound Effects Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={toggleSound}
              title={soundOn ? "Ovozli effektlarni o'chirish" : "Ovozli effektlarni yoqish"}
              className={`p-2 rounded-xl border transition-colors ${
                soundOn
                  ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                id="btn-notifications-dropdown"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Bildirishnomalar va dars eslatmalari"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 p-3 shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        Bildirishnomalar ({unreadCount} ta yangi)
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Jonli eslatmalar</span>
                  </div>

                  {/* Simulator buttons for testing notifications on demand */}
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl mb-3 border border-dashed border-slate-200 dark:border-slate-700 text-[11px]">
                    <div className="text-slate-600 dark:text-slate-300 font-medium mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                      <span>Bildirishnoma sinov tugmalari:</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          onTriggerTestNotification('lesson');
                          sound.playNotificationChime();
                        }}
                        className="flex-1 py-1 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] transition-colors"
                      >
                        🔔 Dars vaqti signali
                      </button>
                      <button
                        onClick={() => {
                          onTriggerTestNotification('anki');
                          sound.playNotificationChime();
                        }}
                        className="flex-1 py-1 px-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px] transition-colors"
                      >
                        🧠 Anki so'z signali
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
                        Yangi bildirishnomalar mavjud emas
                      </p>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onMarkNotificationRead(item.id);
                            if (item.actionPayload?.tab && onSelectNotificationTab) {
                              onSelectNotificationTab(item.actionPayload.tab);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            !item.read
                              ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80 text-slate-800 dark:text-slate-200'
                              : 'bg-white dark:bg-slate-800/70 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-[12px] flex items-center gap-1">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                              {item.createdAt}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                            {item.message}
                          </p>
                          {!item.read && (
                            <div className="mt-1.5 flex items-center justify-end text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 gap-1">
                              <CheckCheck className="w-3 h-3" />
                              <span>O'qilgan deb belgilash</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Current Active User Badge */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-700">
              <img
                src={currentRole === 'teacher' ? currentTeacher.avatar : student.avatar}
                alt="Foydalanuvchi"
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentRole === 'teacher' ? currentTeacher.name : currentRole === 'admin' ? 'Admin Jamshid' : student.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {currentRole === 'student' && `Daraja: ${student.level} (${student.groupName})`}
                  {currentRole === 'teacher' && `Katta o'qituvchi • ${currentTeacher.totalLessonsConducted} dars`}
                  {currentRole === 'admin' && 'Tizim Boshqaruvchisi'}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
