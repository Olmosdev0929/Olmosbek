import React, { useState } from 'react';
import { StudentPayment, ParentNotificationLog } from '../types';
import {
  Users,
  Send,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Sparkles,
  DollarSign,
  TrendingUp,
  Check
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

const INITIAL_PAYMENTS: StudentPayment[] = [
  {
    id: 'pay_1',
    studentId: 'std_1',
    studentName: 'Temur Malik',
    groupName: 'IELTS Mastery 7.5+',
    parentName: 'Rustam Malik (Otasi)',
    parentPhone: '+998 90 123 45 67',
    monthlyFee: 650000,
    amountPaid: 650000,
    status: 'paid',
    dueDate: '2026-09-25',
    lastPaymentDate: '2026-09-10',
    paymentMethod: 'Payme',
  },
  {
    id: 'pay_2',
    studentId: 'std_2',
    studentName: 'Dilnoza Karimova',
    groupName: 'IELTS Mastery 7.5+',
    parentName: 'Nodira Karimova (Onasi)',
    parentPhone: '+998 91 234 56 78',
    monthlyFee: 650000,
    amountPaid: 0,
    status: 'overdue',
    dueDate: '2026-09-15',
  },
  {
    id: 'pay_3',
    studentId: 'std_3',
    studentName: 'Sardor Rustamov',
    groupName: 'General English B2',
    parentName: 'Akmal Rustamov (Otasi)',
    parentPhone: '+998 93 345 67 89',
    monthlyFee: 550000,
    amountPaid: 300000,
    status: 'pending',
    dueDate: '2026-09-28',
    paymentMethod: 'Click',
  },
  {
    id: 'pay_4',
    studentId: 'std_4',
    studentName: 'Malika Alimova',
    groupName: 'Pre-IELTS Intensive',
    parentName: 'Shahlo Alimova (Onasi)',
    parentPhone: '+998 94 456 78 90',
    monthlyFee: 550000,
    amountPaid: 550000,
    status: 'paid',
    dueDate: '2026-09-22',
    lastPaymentDate: '2026-09-18',
    paymentMethod: 'Naqd',
  },
];

interface ParentCRMAndPaymentsProps {
  onTriggerGlobalNotification?: (title: string, message: string) => void;
}

export const ParentCRMAndPayments: React.FC<ParentCRMAndPaymentsProps> = ({
  onTriggerGlobalNotification
}) => {
  const [payments, setPayments] = useState<StudentPayment[]>(INITIAL_PAYMENTS);
  const [logs, setLogs] = useState<ParentNotificationLog[]>([
    {
      id: 'log_1',
      studentId: 'std_2',
      studentName: 'Dilnoza Karimova',
      parentPhone: '+998 91 234 56 78',
      type: 'payment_reminder',
      message: 'Hurmatli Nodira opa! Dilnoza Karimova uchun sentyabr oyi to\'lovi bo\'yicha eslatma.',
      sentAt: 'Bugun, 10:45',
      status: 'delivered',
    }
  ]);

  const [selectedStudentForNotice, setSelectedStudentForNotice] = useState<StudentPayment | null>(null);
  const [noticeType, setNoticeType] = useState<'attendance_absence' | 'payment_reminder' | 'grade_report'>('payment_reminder');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  // Stats
  const totalRevenue = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalDue = payments.reduce((acc, p) => acc + (p.monthlyFee - p.amountPaid), 0);
  const overdueCount = payments.filter(p => p.status === 'overdue').length;

  const handleOpenNoticeModal = (student: StudentPayment, type: 'attendance_absence' | 'payment_reminder' | 'grade_report') => {
    setSelectedStudentForNotice(student);
    setNoticeType(type);

    if (type === 'attendance_absence') {
      setCustomMessage(`Hurmatli ${student.parentName}! Farzandingiz ${student.studentName} bugun ${student.groupName} darsiga sababsiz kelmadi. Iltimos, xabardor bo'ling.`);
    } else if (type === 'payment_reminder') {
      setCustomMessage(`Assalomu alaykum, hurmatli ${student.parentName}! Farzandingiz ${student.studentName}ning o'quv kursi to'lov muddati (${student.dueDate}) yaqinlashmoqda. Qoldiq to'lov summasi: ${(student.monthlyFee - student.amountPaid).toLocaleString()} so'm. Click/Payme orqali to'lashingiz mumkin.`);
    } else {
      setCustomMessage(`Hurmatli ${student.parentName}! Farzandingiz ${student.studentName} so'nggi dars va Anki mashg'ulotlarida yuqori natijalar ko'rsatmoqda!`);
    }

    sound.playClick();
  };

  const handleSendTelegramNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForNotice || isSending) return;

    setIsSending(true);
    sound.playCardFlip();

    try {
      const res = await fetch('/api/crm/send-parent-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudentForNotice.studentName,
          parentPhone: selectedStudentForNotice.parentPhone,
          type: noticeType,
          message: customMessage,
        }),
      });

      const data = await res.json();
      if (data.success && data.log) {
        setLogs(prev => [data.log, ...prev]);
        sound.playSuccess();
        if (onTriggerGlobalNotification) {
          onTriggerGlobalNotification(
            "Telegram xabarnomasi yuborildi",
            `${selectedStudentForNotice.parentName} (${selectedStudentForNotice.parentPhone}) ga bildirishnoma yetkazildi.`
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
      setSelectedStudentForNotice(null);
    }
  };

  const handleMarkAsPaid = (studentId: string) => {
    setPayments(prev =>
      prev.map(p => {
        if (p.studentId === studentId) {
          return {
            ...p,
            amountPaid: p.monthlyFee,
            status: 'paid',
            lastPaymentDate: new Date().toLocaleDateString('uz-UZ'),
          };
        }
        return p;
      })
    );
    sound.playSuccess();
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="rounded-3xl bg-linear-to-r from-cyan-900 via-blue-950 to-slate-900 text-white p-6 shadow-xl border border-cyan-700/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-300" />
                CRM & Ota-Onani Xabardor Qilish
              </span>
              <span className="text-xs text-cyan-200/80">To'lovlar & Davomat Eslatmalari</span>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white">
              Ota-Onaga Telegram Bot & Kurs To'lovlari CRM
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100/80 mt-1 max-w-2xl">
              O'quvchilarning oylik to'lovlarini nazorat qiling, darsga kelmaganida yoki to'lov muddati yaqinlashganda ota-onaning Telegram botiga bir tugma orqali avtomatik eslatma yuboring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-cyan-950/60 p-3 rounded-2xl border border-cyan-600/30 text-right">
              <span className="text-[10px] text-cyan-300 uppercase block font-bold">Jami Tushum:</span>
              <span className="text-base font-black text-emerald-400">
                {totalRevenue.toLocaleString()} so'm
              </span>
            </div>
            <div className="bg-rose-950/60 p-3 rounded-2xl border border-rose-600/30 text-right">
              <span className="text-[10px] text-rose-300 uppercase block font-bold">Qarzdorlik:</span>
              <span className="text-base font-black text-rose-400">
                {totalDue.toLocaleString()} so'm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main CRM Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Student Payments Table */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Talaba yoki ota-ona qidirish..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    filterStatus === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Barchasi ({payments.length})
                </button>
                <button
                  onClick={() => setFilterStatus('overdue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    filterStatus === 'overdue' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Qarzdorlar ({overdueCount})
                </button>
                <button
                  onClick={() => setFilterStatus('paid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    filterStatus === 'paid' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  To'langan
                </button>
              </div>
            </div>

            {/* Students List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.map(p => (
                <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {p.studentName}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {p.groupName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{p.parentName}</span>
                      <span>•</span>
                      <span className="font-mono text-cyan-700 dark:text-cyan-400">{p.parentPhone}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {p.amountPaid.toLocaleString()} / {p.monthlyFee.toLocaleString()} so'm
                      </div>
                      <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md mt-0.5 ${
                        p.status === 'paid'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : p.status === 'overdue'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        {p.status === 'paid' ? "To'langan" : p.status === 'overdue' ? "Qarzdorlik" : "Kutilmoqda"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenNoticeModal(p, 'payment_reminder')}
                        className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 text-cyan-700 dark:text-cyan-300 transition-colors"
                        title="Ota-onaga Telegram eslatma yuborish"
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      {p.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkAsPaid(p.studentId)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">To'landi</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Telegram Bot Notification Logs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-cyan-600" />
              Yuborilgan Telegram Xabarlari Tarixi
            </h4>

            <div className="space-y-3 max-h-[420px] overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {log.studentName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {log.sentAt}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {log.message}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-cyan-600 dark:text-cyan-400 pt-1">
                    <span>{log.parentPhone}</span>
                    <span className="flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      Yetkazildi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Send Telegram Notice */}
      {selectedStudentForNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-600" />
                Ota-Onaga Telegram Xabarnomasi
              </h4>
              <button
                onClick={() => setSelectedStudentForNotice(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Yopish
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 text-xs">
              <div className="font-bold text-cyan-900 dark:text-cyan-200">
                Qabul qiluvchi: {selectedStudentForNotice.parentName}
              </div>
              <div className="text-cyan-700 dark:text-cyan-300 font-mono text-[11px]">
                {selectedStudentForNotice.parentPhone} • O'quvchi: {selectedStudentForNotice.studentName}
              </div>
            </div>

            {/* Notice type selector */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Xabar turi:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenNoticeModal(selectedStudentForNotice, 'payment_reminder')}
                  className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                    noticeType === 'payment_reminder'
                      ? 'bg-cyan-600 text-white border-cyan-600'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  To'lov Eslatmasi
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenNoticeModal(selectedStudentForNotice, 'attendance_absence')}
                  className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                    noticeType === 'attendance_absence'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Darsga Kelmadi
                </button>
              </div>
            </div>

            {/* Custom Message */}
            <form onSubmit={handleSendTelegramNotice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                  Xabar matni (Telegram bot orqali yuboriladi):
                </label>
                <textarea
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForNotice(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSending || !customMessage.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? "Yuborilmoqda..." : "Yuborish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
