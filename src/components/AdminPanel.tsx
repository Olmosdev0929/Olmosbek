import React, { useState } from 'react';
import {
  TeacherUser,
  StudentGroup,
  Material,
  EnglishLevel,
  MaterialCategory,
  MaterialType
} from '../types';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Video,
  FileQuestion,
  BarChart3,
  TrendingUp,
  UserCheck,
  Plus,
  Star,
  Clock,
  Layers,
  CheckCircle,
  Activity,
  Award,
  Rocket,
  CreditCard
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { ParentCRMAndPayments } from './ParentCRMAndPayments';

interface AdminPanelProps {
  teachers: TeacherUser[];
  groups: StudentGroup[];
  materials: Material[];
  onAssignTeacherToGroup: (teacherId: string, groupId: string) => void;
  onAddTeacher: (teacher: Omit<TeacherUser, 'id' | 'totalLessonsConducted' | 'rating'>) => void;
  onAddAdminMaterial: (material: Omit<Material, 'id' | 'createdAt'>) => void;
  onOpenDeploymentGuide?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  teachers,
  groups,
  materials,
  onAssignTeacherToGroup,
  onAddTeacher,
  onAddAdminMaterial,
  onOpenDeploymentGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'materials' | 'analytics' | 'crm'>('teachers');

  // Modal states
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<TeacherUser | null>(null);
  const [selectedGroupToAssign, setSelectedGroupToAssign] = useState<string>(groups[0]?.id || '');
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);

  // New Teacher form
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherExp, setNewTeacherExp] = useState(5);

  // Admin material form
  const [matTitle, setMatTitle] = useState('');
  const [matDescription, setMatDescription] = useState('');
  const [matLevel, setMatLevel] = useState<EnglishLevel>('B1');
  const [matCategory, setMatCategory] = useState<MaterialCategory>('grammar');
  const [matType, setMatType] = useState<MaterialType>('video');
  const [matDuration, setMatDuration] = useState('20 daqiqa');

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    onAddTeacher({
      name: newTeacherName.trim(),
      email: newTeacherEmail.trim() || `${newTeacherName.toLowerCase().replace(/\s+/g, '.')}@edulink.uz`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      experienceYears: Number(newTeacherExp),
      assignedGroupIds: [],
      status: 'active',
    });

    sound.playCorrect();
    setNewTeacherName('');
    setNewTeacherEmail('');
    setShowAddTeacherModal(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignModal || !selectedGroupToAssign) return;

    onAssignTeacherToGroup(showAssignModal.id, selectedGroupToAssign);
    sound.playCorrect();
    setShowAssignModal(null);
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) return;

    onAddAdminMaterial({
      title: matTitle.trim(),
      description: matDescription.trim(),
      level: matLevel,
      category: matCategory,
      type: matType,
      durationOrPages: matDuration,
      authorTeacherName: 'Admin & Metodistlar Kengashi',
    });

    sound.playCorrect();
    setMatTitle('');
    setMatDescription('');
    setShowAddMaterialModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Executive Header */}
      <div className="bg-linear-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/30 text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Boshqaruv & Nazorat Paneli (Admin)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            EduEnglish Platforma Boshqaruvi
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
            O'qituvchilarni guruhlarga biriktiring, yangi darslar va testlar joylang hamda o'qituvchilar sifati va o'quvchilar faolligini batafsil tahlil qiling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenDeploymentGuide && (
            <button
              onClick={onOpenDeploymentGuide}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 border border-emerald-400/40 cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-amber-300" />
              <span>Foydalanishga Topshirish & Havolalar</span>
            </button>
          )}
          <button
            onClick={() => setShowAddTeacherModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>O'qituvchi Tayinlash</span>
          </button>
          <button
            onClick={() => setShowAddMaterialModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Kontent Joylash</span>
          </button>
        </div>
      </div>

      {/* Handover & Live Deployment Banner */}
      <div className="bg-linear-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
            <Rocket className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Platforma foydalanishga topshirish uchun to'liq tayyor!
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Jonli havola faol
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              O'quvchi va o'qituvchilarga havolani yuborishingiz, Telegram boti orqali Mini App qilib ishga tushirishingiz yoki Google Cloud Run ga deploy qilishingiz mumkin.
            </p>
          </div>
        </div>
        {onOpenDeploymentGuide && (
          <button
            onClick={onOpenDeploymentGuide}
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Topshirish yo'riqnomasi & Havola</span>
            <Rocket className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* High-level KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jami O'quvchilar</span>
          <div className="text-2xl font-black text-slate-900 font-display">184 nafar</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18% o'sish bu oyda</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">O'qituvchilar</span>
          <div className="text-2xl font-black text-purple-600 font-display">{teachers.length} nafar</div>
          <span className="text-[10px] text-slate-500 font-medium">Barchasi sertifikatlangan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">O'tkazilgan Darslar</span>
          <div className="text-2xl font-black text-indigo-600 font-display">440 ta</div>
          <span className="text-[10px] text-slate-500 font-medium">95.4% davomat bilan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">O'quvchilar Qoniqishi</span>
          <div className="text-2xl font-black text-amber-500 font-display">4.92 / 5.0</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Yuqori sifat ko'rsatkichi</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'teachers'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>O'qituvchilar va Biriktirish ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'materials'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Barcha Materiallar Bazasi ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>O'qituvchilar Sifati & O'quvchilar Faolligi Tahlili</span>
        </button>

        <button
          onClick={() => setActiveTab('crm')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'crm'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-cyan-600" />
          <span>Ota-Ona Telegram & To'lovlar CRM</span>
        </button>
      </div>

      {/* VIEW 1: TEACHER MANAGEMENT & ASSIGNMENT */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => {
              const assignedGroups = groups.filter((g) => teacher.assignedGroupIds.includes(g.id));

              return (
                <div
                  key={teacher.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20"
                      />
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          {teacher.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {teacher.email}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Darslar soni:</span>
                        <span className="font-bold text-slate-800">{teacher.totalLessonsConducted} ta</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Reyting:</span>
                        <span className="font-bold text-amber-600">⭐ {teacher.rating} / 5.0</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Biriktirilgan Guruhlar:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {assignedGroups.length > 0 ? (
                          assignedGroups.map((grp) => (
                            <span
                              key={grp.id}
                              className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-semibold"
                            >
                              {grp.name} ({grp.level})
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Hozircha guruh biriktirilmagan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Faol O'qituvchi
                    </span>

                    <button
                      onClick={() => setShowAssignModal(teacher)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors"
                    >
                      Guruhga Biriktirish
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: GLOBAL MATERIALS DATABASE */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Platforma Darsliklari, Kitoblari va Testlari
              </h3>
              <p className="text-xs text-slate-500">
                A1-C2 darajalar bo'yicha markaziy ta'lim resurslari
              </p>
            </div>
            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Material Qo'shish</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">Nomi</th>
                  <th className="py-2.5 px-3">Daraja</th>
                  <th className="py-2.5 px-3">Bo'lim</th>
                  <th className="py-2.5 px-3">Turi</th>
                  <th className="py-2.5 px-3">Muallif / Mas'ul</th>
                  <th className="py-2.5 px-3 rounded-r-xl">Hajmi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-bold text-slate-900 max-w-xs truncate">{m.title}</td>
                    <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">{m.level}</span></td>
                    <td className="py-3 px-3 capitalize">{m.category}</td>
                    <td className="py-3 px-3 capitalize">{m.type}</td>
                    <td className="py-3 px-3 text-slate-500">{m.authorTeacherName}</td>
                    <td className="py-3 px-3 font-medium">{m.durationOrPages}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: TEACHER AUDIT & STUDENT ENGAGEMENT ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Teacher Performance Oversight (Requested by user: "o'qituvchilarninqanday dars o'tayotgani") */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  O'qituvchilarning Dars O'tish Sifati va Tezkorligi
                </h3>
                <p className="text-xs text-slate-500">
                  Dars o'tish intizomi, uyga vazifalarni tekshirish vaqti va o'quvchilar fikri
                </p>
              </div>
              <span className="text-xs text-emerald-600 font-bold">Jonli audit</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teachers.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900">{t.name}</h4>
                      <span className="text-[10px] text-slate-500">Tajriba: {t.experienceYears} yil</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-slate-600">
                      <span>O'tkazilgan darslar:</span>
                      <b className="text-slate-900">{t.totalLessonsConducted} ta dars</b>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Vazifa tekshirish tezligi:</span>
                      <b className="text-emerald-600">~1.5 soat (A'lo)</b>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Darslar o'tish sifati:</span>
                      <b className="text-purple-700">98% reja asosida</b>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>O'quvchilar bahosi:</span>
                      <b className="text-amber-600">⭐ {t.rating} / 5.0</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Activity Oversight (Requested by user: "o'quvchilarning faolligi haqida batafsil malumot") */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              O'quvchilar Faolligi va Tizimdan Foydalanish Statistikasi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                <span className="text-[11px] font-bold text-indigo-700 uppercase">Anki SRS So'zlar</span>
                <div className="text-2xl font-black text-indigo-950 font-display">14,280 ta</div>
                <p className="text-[10px] text-indigo-700">Bu oy o'rganilgan va takrorlangan so'zlar</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                <span className="text-[11px] font-bold text-purple-700 uppercase">Kahoot Battle O'yinlari</span>
                <div className="text-2xl font-black text-purple-950 font-display">860 match</div>
                <p className="text-[10px] text-purple-700">O'quvchilar o'rtasida o'tkazilgan viktorinalar</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 uppercase">Vazifalar Topshirish</span>
                <div className="text-2xl font-black text-emerald-950 font-display">94.2%</div>
                <p className="text-[10px] text-emerald-700">O'z vaqtida yuklangan insho va testlar</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 4: CRM & TUITION TRACKING */}
      {activeTab === 'crm' && (
        <ParentCRMAndPayments />
      )}

      {/* MODAL: ASSIGN TEACHER TO GROUP */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  O'qituvchini Guruhga Biriktirish
                </h3>
                <p className="text-slate-500">{showAssignModal.name}</p>
              </div>
              <button onClick={() => setShowAssignModal(null)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Guruhni Tanlang:</label>
                <select
                  value={selectedGroupToAssign}
                  onChange={(e) => setSelectedGroupToAssign(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} — {g.level} ({g.scheduleDays})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Biriktirishni Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TEACHER */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Yangi O'qituvchi Tayinlash</h3>
              <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAddTeacherSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">O'qituvchi Ism-Familiyasi *</label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="Shahnoza Karimova"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email manzili</label>
                <input
                  type="email"
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  placeholder="shahnoza@edulink.uz"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ish Tajribasi (yillarda)</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={newTeacherExp}
                  onChange={(e) => setNewTeacherExp(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  O'qituvchini Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ADMIN MATERIAL */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Platformaga Kontent Joylash (Admin)</h3>
              <button onClick={() => setShowAddMaterialModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Material Nomi *</label>
                <input
                  type="text"
                  required
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  placeholder="IELTS Band 8 Reading Masterclass"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Daraja</label>
                  <select
                    value={matLevel}
                    onChange={(e) => setMatLevel(e.target.value as EnglishLevel)}
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
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bo'lim</label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value as MaterialCategory)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="grammar">Grammar</option>
                    <option value="listening">Listening</option>
                    <option value="reading">Reading</option>
                    <option value="writing">Writing</option>
                    <option value="general">Umumiy</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turi</label>
                  <select
                    value={matType}
                    onChange={(e) => setMatType(e.target.value as MaterialType)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="video">Videodars</option>
                    <option value="book">Kitob</option>
                    <option value="test">Test</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tavsif</label>
                <textarea
                  rows={2}
                  value={matDescription}
                  onChange={(e) => setMatDescription(e.target.value)}
                  placeholder="Material mazmuni..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Joylash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
