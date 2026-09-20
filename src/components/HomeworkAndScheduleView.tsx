import React, { useState } from 'react';
import { Homework, HomeworkSubmission, StudentGroup, AttendanceEntry } from '../types';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Paperclip,
  Mic,
  Calendar,
  Video,
  Award,
  Bell,
  Sparkles,
  ChevronRight,
  Upload
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface HomeworkAndScheduleViewProps {
  homeworks: Homework[];
  submissions: HomeworkSubmission[];
  activeGroup: StudentGroup;
  studentId: string;
  studentName: string;
  attendanceHistory: AttendanceEntry[];
  onSubmitHomework: (submission: Omit<HomeworkSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  onTriggerLessonAlert: () => void;
}

export const HomeworkAndScheduleView: React.FC<HomeworkAndScheduleViewProps> = ({
  homeworks,
  submissions,
  activeGroup,
  studentId,
  studentName,
  attendanceHistory,
  onSubmitHomework,
  onTriggerLessonAlert,
}) => {
  const [selectedHw, setSelectedHw] = useState<Homework | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'homework' | 'schedule'>('homework');

  // Check which homework is submitted
  const getSubmissionForHw = (hwId: string) => {
    return submissions.find((s) => s.homeworkId === hwId && s.studentId === studentId);
  };

  const handleOpenSubmitModal = (hw: Homework) => {
    setSelectedHw(hw);
    const existing = getSubmissionForHw(hw.id);
    if (existing) {
      setSubmissionText(existing.textContent);
      setAttachedFileName(existing.attachedFileName || '');
    } else {
      setSubmissionText('');
      setAttachedFileName('');
      setRecordedAudio(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw || !submissionText.trim()) return;

    onSubmitHomework({
      homeworkId: selectedHw.id,
      homeworkTitle: selectedHw.title,
      studentId: studentId,
      studentName: studentName,
      textContent: submissionText.trim(),
      attachedFileName: attachedFileName || 'Uy_vazifasi_javobi.docx',
      audioNoteUrl: recordedAudio || undefined,
    });

    sound.playCorrect();
    setSelectedHw(null);
  };

  const handleSimulateAttach = () => {
    setAttachedFileName('Essay_Draft_Final_Revision.pdf');
    sound.playCardFlip();
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      sound.playKahootTick();
      setTimeout(() => {
        setIsRecording(false);
        setRecordedAudio('audio_recording_speech.mp3');
        sound.playCorrect();
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-tab navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('homework')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'homework'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Uyga Vazifalar ({homeworks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Dars Jadvali & Davomat</span>
          </button>
        </div>

        <button
          onClick={onTriggerLessonAlert}
          className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
        >
          <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
          <span>Dars Bildirishnomasi Sinovi</span>
        </button>
      </div>

      {/* VIEW 1: HOMEWORK ASSIGNMENTS & SUBMISSIONS */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeworks.map((hw) => {
              const sub = getSubmissionForHw(hw.id);
              const isGraded = sub && sub.status === 'graded';
              const isPending = sub && sub.status === 'pending';
              const isMissing = !sub;

              return (
                <div
                  key={hw.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-slate-100 text-slate-700">
                        {hw.groupName}
                      </span>

                      {/* Status badge */}
                      {isGraded ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Baholandi: {sub.score}/{hw.maxScore} ball
                        </span>
                      ) : isPending ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Tekshiruvda
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Topshirilmagan
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {hw.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {hw.instructions}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Muddat: <b className="text-rose-600">{hw.deadline}</b></span>
                      <span>O'qituvchi: <b>{hw.teacherName}</b></span>
                    </div>
                  </div>

                  {/* Teacher Feedback Banner if Graded */}
                  {isGraded && sub.teacherFeedback && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>O'qituvchi xulosasi va fikri:</span>
                      </div>
                      <p className="text-emerald-800 italic">
                        "{sub.teacherFeedback}"
                      </p>
                    </div>
                  )}

                  {/* Submission Action Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    {sub ? (
                      <span className="text-xs text-slate-400">
                        Topshirilgan: <b>{sub.submittedAt}</b>
                      </span>
                    ) : (
                      <span className="text-xs text-rose-500 font-medium">
                        Vaqt tugashidan oldin topshiring
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenSubmitModal(hw)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isGraded
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      }`}
                    >
                      <span>{sub ? 'Javobni Ko\'rish / O\'zgartirish' : 'Vazifani Topshirish'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: SCHEDULE & ATTENDANCE */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          
          {/* UPCOMING LESSON LIVE CARD */}
          <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Navbatdagi Jonli Dars
                  </span>
                  <span className="text-xs text-indigo-300 font-medium">
                    {activeGroup.scheduleDays}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
                  {activeGroup.name}
                </h2>

                <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                  O'qituvchi: <b>{activeGroup.teacherName}</b> • Vaqti: <b>{activeGroup.lessonTime}</b> • Joylashuv: <b>{activeGroup.roomOrLink}</b>
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shrink-0">
                <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold block">
                  Dars boshlanishiga qoldi:
                </span>
                <div className="text-3xl font-black font-mono text-amber-300 tracking-wider">
                  00:35:12
                </div>
                <button
                  onClick={() => alert(`Dars xonasiga ulanish: ${activeGroup.roomOrLink}`)}
                  className="w-full px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Dars Xonasiga Kirish</span>
                </button>
              </div>
            </div>
          </div>

          {/* ATTENDANCE HISTORY TABLE */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  O'quvchi Davomat Jurnali
                </h3>
                <p className="text-xs text-slate-500">
                  Darslarga qatnashish ko'rsatkichi va o'qituvchi belgilari
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-200">
                Umumiy Davomat: 95%
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-xl">Sana</th>
                    <th className="py-2.5 px-3">Dars Mavzusi</th>
                    <th className="py-2.5 px-3">Holat</th>
                    <th className="py-2.5 px-3 rounded-r-xl">O'qituvchi Izohi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-semibold">2026-09-20 (Bugun)</td>
                    <td className="py-3 px-3">Present Perfect Continuous & Speaking</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Hozir (Present) ✓
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">Faol qatnashdi</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-semibold">2026-09-18</td>
                    <td className="py-3 px-3">Past Simple vs Past Continuous</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Hozir (Present) ✓
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">O'z vaqtida keldi</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-semibold">2026-09-15</td>
                    <td className="py-3 px-3">Vocabulary: Travel & Airport English</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                        Kechikdi (Late)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-amber-700">5 daqiqa kechikdi (yo'l tirbandligi)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBMISSION MODAL */}
      {selectedHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                  Uyga vazifani topshirish
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedHw.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHw(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Javob matni yoki insho *
                </label>
                <textarea
                  rows={6}
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Vazifangiz bo'yicha to'liq matnni shu yerga yozing..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Attach simulated file & Audio note */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateAttach}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5"
                >
                  <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                  <span>{attachedFileName ? `Biriktirildi: ${attachedFileName}` : 'Fayl biriktirish (.docx, .pdf)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : recordedAudio
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>
                    {isRecording
                      ? 'Ovoz yozilmoqda...'
                      : recordedAudio
                      ? 'Audio biriktirildi ✓'
                      : 'Ovozli javob yozish (Speaking)'}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedHw(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>O'qituvchiga yuborish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
