import React, { useState } from 'react';
import {
  StudentGroup,
  TeacherUser,
  Material,
  Homework,
  HomeworkSubmission,
  AttendanceEntry,
  EnglishLevel,
  MaterialCategory,
  MaterialType
} from '../types';
import {
  Users,
  Plus,
  BookOpen,
  Video,
  FileQuestion,
  CheckCircle2,
  Clock,
  Calendar,
  Award,
  Send,
  UserPlus,
  BarChart3,
  Edit3,
  CheckCheck,
  Search,
  Filter,
  CreditCard
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { ParentCRMAndPayments } from './ParentCRMAndPayments';

interface TeacherPanelProps {
  currentTeacher: TeacherUser;
  groups: StudentGroup[];
  materials: Material[];
  homeworks: Homework[];
  submissions: HomeworkSubmission[];
  attendanceRecords: AttendanceEntry[];
  onCreateGroup: (group: Omit<StudentGroup, 'id' | 'studentCount' | 'studentIds'>) => void;
  onAddStudentToGroup: (groupId: string, studentName: string, studentEmail: string) => void;
  onAddMaterial: (material: Omit<Material, 'id' | 'createdAt'>) => void;
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  onSaveAttendance: (groupId: string, date: string, records: { studentId: string; studentName: string; status: 'present' | 'absent' | 'late'; note?: string }[]) => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({
  currentTeacher,
  groups,
  materials,
  homeworks,
  submissions,
  attendanceRecords,
  onCreateGroup,
  onAddStudentToGroup,
  onAddMaterial,
  onGradeSubmission,
  onSaveAttendance,
}) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'materials' | 'attendance' | 'grading' | 'activity' | 'crm'>('grading');

  // Modals state
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState<string | null>(null);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [selectedSubmissionToGrade, setSelectedSubmissionToGrade] = useState<HomeworkSubmission | null>(null);

  // Form states - Create Group
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupLevel, setNewGroupLevel] = useState<EnglishLevel>('B1');
  const [newGroupDays, setNewGroupDays] = useState('Dushanba, Chorshanba, Juma');
  const [newGroupTime, setNewGroupTime] = useState('14:00 - 15:30');
  const [newGroupRoom, setNewGroupRoom] = useState('Xona 304');

  // Form states - Add Student
  const [studentNameToAdd, setStudentNameToAdd] = useState('');
  const [studentEmailToAdd, setStudentEmailToAdd] = useState('');

  // Form states - Publish Material
  const [matTitle, setMatTitle] = useState('');
  const [matDescription, setMatDescription] = useState('');
  const [matLevel, setMatLevel] = useState<EnglishLevel>('B1');
  const [matCategory, setMatCategory] = useState<MaterialCategory>('grammar');
  const [matType, setMatType] = useState<MaterialType>('video');
  const [matDuration, setMatDuration] = useState('15 daqiqa');
  const [matContent, setMatContent] = useState('');

  // Grading form states
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Attendance state
  const [selectedAttendanceGroup, setSelectedAttendanceGroup] = useState<string>(groups[0]?.id || 'grp_1');
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentAttendanceStatus, setCurrentAttendanceStatus] = useState<Record<string, 'present' | 'absent' | 'late'>>({
    'stu_1': 'present',
    'stu_2': 'present',
    'stu_3': 'late',
    'stu_4': 'present',
  });

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const gradedSubmissions = submissions.filter((s) => s.status === 'graded');

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    onCreateGroup({
      name: newGroupName.trim(),
      level: newGroupLevel,
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      scheduleDays: newGroupDays,
      lessonTime: newGroupTime,
      roomOrLink: newGroupRoom,
    });

    sound.playCorrect();
    setNewGroupName('');
    setShowCreateGroupModal(false);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddStudentModal || !studentNameToAdd.trim()) return;

    onAddStudentToGroup(showAddStudentModal, studentNameToAdd.trim(), studentEmailToAdd.trim());
    sound.playCorrect();
    setStudentNameToAdd('');
    setStudentEmailToAdd('');
    setShowAddStudentModal(null);
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) return;

    onAddMaterial({
      title: matTitle.trim(),
      description: matDescription.trim(),
      level: matLevel,
      category: matCategory,
      type: matType,
      durationOrPages: matDuration,
      bookContent: matType === 'book' ? matContent : undefined,
      authorTeacherId: currentTeacher.id,
      authorTeacherName: currentTeacher.name,
    });

    sound.playCorrect();
    setMatTitle('');
    setMatDescription('');
    setMatContent('');
    setShowAddMaterialModal(false);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmissionToGrade) return;

    onGradeSubmission(selectedSubmissionToGrade.id, Number(gradeScore), gradeFeedback.trim());
    sound.playCorrect();
    setSelectedSubmissionToGrade(null);
    setGradeFeedback('');
  };

  const handleSaveAttendance = () => {
    const records = [
      { studentId: 'stu_1', studentName: 'Azizbek Rahmatov', status: currentAttendanceStatus['stu_1'] || 'present' },
      { studentId: 'stu_2', studentName: 'Madina Saidova', status: currentAttendanceStatus['stu_2'] || 'present' },
      { studentId: 'stu_3', studentName: 'Bobur Mirzayev', status: currentAttendanceStatus['stu_3'] || 'late', note: 'Kechikdi' },
      { studentId: 'stu_4', studentName: 'Nodira Aliyeva', status: currentAttendanceStatus['stu_4'] || 'present' },
    ];
    onSaveAttendance(selectedAttendanceGroup, selectedAttendanceDate, records);
    sound.playCorrect();
    alert('Davomat muvaffaqiyatli saqlandi!');
  };

  return (
    <div className="space-y-6">
      
      {/* Teacher Profile Summary Card */}
      <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentTeacher.avatar}
            alt={currentTeacher.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider">
                O'qituvchi Portali
              </span>
              <span className="text-emerald-200 text-xs font-semibold">
                Tajriba: {currentTeacher.experienceYears} yil
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight mt-1">
              Ustoz {currentTeacher.name}
            </h2>
            <p className="text-xs text-emerald-100">
              {groups.length} ta guruh biriktirilgan • Reyting: ⭐ {currentTeacher.rating} / 5.0
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="px-4 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Guruh Ochish</span>
          </button>
          <button
            onClick={() => setShowAddMaterialModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500/40 hover:bg-emerald-500/60 border border-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Material Joylash</span>
          </button>
        </div>
      </div>

      {/* Teacher Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('grading')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'grading'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Vazifalarni Tekshirish ({pendingSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Davomat Jurnali</span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'groups'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Guruhlar & O'quvchilar ({groups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'materials'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Joylagan Materiallarim ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'activity'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>O'quvchilar Faolligi Tahlili</span>
        </button>

        <button
          onClick={() => setActiveTab('crm')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'crm'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-cyan-600" />
          <span>Ota-Ona Telegram & To'lovlar CRM</span>
        </button>
      </div>

      {/* VIEW 1: HOMEWORK CHECKING & GRADING */}
      {activeTab === 'grading' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              O'quvchilar Yuborgan Uyga Vazifalar
            </h3>
            <span className="text-xs text-slate-500">
              Kutilayotganlar: <b className="text-amber-600">{pendingSubmissions.length} ta</b>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map((sub) => {
              const isPending = sub.status === 'pending';
              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={sub.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={sub.studentName}
                          className="w-8 h-8 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900">
                            {sub.studentName}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            Topshirildi: {sub.submittedAt}
                          </span>
                        </div>
                      </div>

                      {isPending ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Tekshirilmagan
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Baholandi: {sub.score}/100 ball
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 pt-1">
                      {sub.homeworkTitle}
                    </h4>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-700 max-h-36 overflow-y-auto leading-relaxed whitespace-pre-line">
                      {sub.textContent}
                    </div>

                    {sub.attachedFileName && (
                      <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                        <span>Fayl biriktirilgan:</span>
                        <span className="underline">{sub.attachedFileName}</span>
                      </div>
                    )}

                    {!isPending && sub.teacherFeedback && (
                      <div className="bg-emerald-50 p-2.5 rounded-xl text-xs text-emerald-900 border border-emerald-100">
                        <span className="font-bold block text-[10px] uppercase text-emerald-700">
                          Sizning izohingiz:
                        </span>
                        <p className="italic">{sub.teacherFeedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => {
                        setSelectedSubmissionToGrade(sub);
                        setGradeScore(sub.score || 90);
                        setGradeFeedback(sub.teacherFeedback || '');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isPending ? 'Tekshirish va Baholash' : 'Bahoni Tahrirlash'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ATTENDANCE TRACKER */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Guruh Davomati Jurnali
              </h3>
              <p className="text-xs text-slate-500">
                Har bir dars uchun o'quvchilar qatnashishini belgilang
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedAttendanceGroup}
                onChange={(e) => setSelectedAttendanceGroup(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.level})
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={selectedAttendanceDate}
                onChange={(e) => setSelectedAttendanceDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
              >
              </input>
            </div>
          </div>

          {/* Student list for attendance */}
          <div className="space-y-3">
            {[
              { id: 'stu_1', name: 'Azizbek Rahmatov', level: 'B1' },
              { id: 'stu_2', name: 'Madina Saidova', level: 'B1' },
              { id: 'stu_3', name: 'Bobur Mirzayev', level: 'B1' },
              { id: 'stu_4', name: 'Nodira Aliyeva', level: 'B1' },
            ].map((st) => {
              const currentStatus = currentAttendanceStatus[st.id] || 'present';
              return (
                <div
                  key={st.id}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{st.name}</h4>
                      <span className="text-[10px] text-slate-400">Daraja: {st.level}</span>
                    </div>
                  </div>

                  {/* 3 Status Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentAttendanceStatus({ ...currentAttendanceStatus, [st.id]: 'present' })}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                      }`}
                    >
                      Hozir ✓
                    </button>
                    <button
                      onClick={() => setCurrentAttendanceStatus({ ...currentAttendanceStatus, [st.id]: 'late' })}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        currentStatus === 'late'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50'
                      }`}
                    >
                      Kechikdi ⏱
                    </button>
                    <button
                      onClick={() => setCurrentAttendanceStatus({ ...currentAttendanceStatus, [st.id]: 'absent' })}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        currentStatus === 'absent'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-rose-50'
                      }`}
                    >
                      Kelmadi ✗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAttendance}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Davomatni Saqlash</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: GROUPS & STUDENTS */}
      {activeTab === 'groups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              Faol Guruhlarim ({groups.length})
            </h3>
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi Guruh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {group.level}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {group.studentCount} ta o'quvchi
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900">
                    {group.name}
                  </h4>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                    <div>Kunlar: <b>{group.scheduleDays}</b></div>
                    <div>Vaqt: <b>{group.lessonTime}</b></div>
                    <div>Xona / Havola: <b>{group.roomOrLink}</b></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setShowAddStudentModal(group.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>O'quvchi Qo'shish</span>
                  </button>

                  <span className="text-xs font-bold text-emerald-600">
                    Darslar jadval asosida
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: PUBLISHED MATERIALS */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              O'qituvchi tomonidan platformaga joylangan resurslar
            </h3>
            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi Material Qo'shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {materials.map((m) => (
              <div
                key={m.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-extrabold bg-slate-100 text-slate-700">
                    {m.level} • {m.category}
                  </span>
                  <span className="text-slate-400">{m.type}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{m.title}</h4>
                <p className="text-slate-500 line-clamp-2">{m.description}</p>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  Davomiyligi: {m.durationOrPages}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: STUDENT ACTIVITY ANALYTICS */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">
            O'quvchilar Faolligi va O'zlashtirish Tahlili
          </h3>
          <p className="text-xs text-slate-500">
            O'quvchilarning darslardagi faolligi, Anki orqali yodlagan so'zlari va o'rtacha ballari
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">O'quvchi</th>
                  <th className="py-2.5 px-3">Daraja</th>
                  <th className="py-2.5 px-3">Anki So'zlar</th>
                  <th className="py-2.5 px-3">Davomat</th>
                  <th className="py-2.5 px-3">O'rtacha Ball</th>
                  <th className="py-2.5 px-3 rounded-r-xl">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-bold text-slate-900">Azizbek Rahmatov</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">B1</span></td>
                  <td className="py-3 px-3 font-semibold text-orange-600">128 ta yodlandi</td>
                  <td className="py-3 px-3 font-bold text-emerald-600">95%</td>
                  <td className="py-3 px-3 font-extrabold">95 / 100</td>
                  <td className="py-3 px-3"><span className="text-emerald-600 font-bold">A'lochi ⭐</span></td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-bold text-slate-900">Madina Saidova</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">B1</span></td>
                  <td className="py-3 px-3 font-semibold text-orange-600">94 ta yodlandi</td>
                  <td className="py-3 px-3 font-bold text-emerald-600">92%</td>
                  <td className="py-3 px-3 font-extrabold">88 / 100</td>
                  <td className="py-3 px-3"><span className="text-indigo-600 font-bold">Yaxshi</span></td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-bold text-slate-900">Bobur Mirzayev</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">B1</span></td>
                  <td className="py-3 px-3 font-semibold text-orange-600">62 ta yodlandi</td>
                  <td className="py-3 px-3 font-bold text-amber-600">80%</td>
                  <td className="py-3 px-3 font-extrabold">78 / 100</td>
                  <td className="py-3 px-3"><span className="text-amber-600 font-bold">O'rtacha</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 6: PARENT CRM & TUITION PAYMENTS */}
      {activeTab === 'crm' && (
        <ParentCRMAndPayments />
      )}

      {/* MODAL 1: CREATE GROUP */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Yangi Guruh Ochish</h3>
              <button onClick={() => setShowCreateGroupModal(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleCreateGroupSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Guruh Nomi *</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="masalan: IELTS 7+ Intensive"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Daraja</label>
                  <select
                    value={newGroupLevel}
                    onChange={(e) => setNewGroupLevel(e.target.value as EnglishLevel)}
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
                  <label className="font-bold text-slate-700 block mb-1">Dars Vaqti</label>
                  <input
                    type="text"
                    value={newGroupTime}
                    onChange={(e) => setNewGroupTime(e.target.value)}
                    placeholder="14:00 - 15:30"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dars Kunlari</label>
                <input
                  type="text"
                  value={newGroupDays}
                  onChange={(e) => setNewGroupDays(e.target.value)}
                  placeholder="Dushanba, Chorshanba, Juma"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Xona / Zoom Havolasi</label>
                <input
                  type="text"
                  value={newGroupRoom}
                  onChange={(e) => setNewGroupRoom(e.target.value)}
                  placeholder="Xona 304 / Zoom havolasi"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Guruhni Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD STUDENT TO GROUP */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Guruhga O'quvchi Qo'shish</h3>
              <button onClick={() => setShowAddStudentModal(null)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleAddStudentSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">O'quvchi Ism-Familiyasi *</label>
                <input
                  type="text"
                  required
                  value={studentNameToAdd}
                  onChange={(e) => setStudentNameToAdd(e.target.value)}
                  placeholder="Sardor Alimov"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email manzili</label>
                <input
                  type="email"
                  value={studentEmailToAdd}
                  onChange={(e) => setStudentEmailToAdd(e.target.value)}
                  placeholder="sardor@gmail.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  O'quvchini Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PUBLISH NEW MATERIAL */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Platformaga Yangi Material Joylash</h3>
              <button onClick={() => setShowAddMaterialModal(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleAddMaterialSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Material Mavzusi *</label>
                <input
                  type="text"
                  required
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  placeholder="Past Continuous & Daily Routines"
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
                    <option value="book">Kitob / Matn</option>
                    <option value="test">Test</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tavsifi</label>
                <textarea
                  rows={2}
                  value={matDescription}
                  onChange={(e) => setMatDescription(e.target.value)}
                  placeholder="Ushbu dars nima haqida ekanligi..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Davomiyligi yoki Sahifalar soni</label>
                <input
                  type="text"
                  value={matDuration}
                  onChange={(e) => setMatDuration(e.target.value)}
                  placeholder="15 daqiqa yoki 12 sahifa"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              {matType === 'book' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kitob / O'qish Matni</label>
                  <textarea
                    rows={4}
                    value={matContent}
                    onChange={(e) => setMatContent(e.target.value)}
                    placeholder="Matnni kiriting..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              )}

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
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Materialni Joylash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: GRADE SUBMISSION */}
      {selectedSubmissionToGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  O'quvchi javobini tekshirish
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedSubmissionToGrade.studentName} — {selectedSubmissionToGrade.homeworkTitle}
                </h3>
              </div>
              <button onClick={() => setSelectedSubmissionToGrade(null)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 max-h-40 overflow-y-auto leading-relaxed whitespace-pre-line text-slate-800">
                {selectedSubmissionToGrade.textContent}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ball (0 dan 100 gacha):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  O'qituvchi fikri va izohi:
                </label>
                <textarea
                  rows={3}
                  required
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Insho judayam yaxshi yozilgan, so'zlar to'g'ri ishlatilgan..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSubmissionToGrade(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Baholash va O'quvchiga Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
