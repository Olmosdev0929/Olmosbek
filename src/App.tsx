import React, { useState, useEffect } from 'react';
import {
  UserRole,
  StudentUser,
  TeacherUser,
  StudentGroup,
  Material,
  Flashcard,
  FlashcardInterval,
  KahootQuiz,
  Homework,
  HomeworkSubmission,
  AttendanceEntry,
  NotificationItem,
  EnglishLevel
} from './types';
import {
  INITIAL_STUDENT,
  INITIAL_TEACHERS,
  INITIAL_GROUPS,
  INITIAL_MATERIALS,
  INITIAL_FLASHCARDS,
  INITIAL_KAHOOT_QUIZZES,
  INITIAL_HOMEWORKS,
  INITIAL_SUBMISSIONS,
  INITIAL_ATTENDANCE,
  INITIAL_NOTIFICATIONS
} from './data/mockData';
import { Header } from './components/Header';
import { StudentPanel } from './components/StudentPanel';
import { TeacherPanel } from './components/TeacherPanel';
import { AdminPanel } from './components/AdminPanel';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { sound } from './utils/soundEffects';
import { telegram } from './utils/telegram';
import { Bell, Clock, Brain, CheckCircle2, X, Rocket, Send } from 'lucide-react';

export default function App() {
  // Dark / Light theme mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('edu_theme');
    if (saved) return saved === 'dark';
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Current active role
  const [currentRole, setCurrentRole] = useState<UserRole>('student');

  // Student active tab
  const [studentActiveTab, setStudentActiveTab] = useState<string>('dashboard');

  // Deployment and Telegram modal guide state
  const [showDeployGuide, setShowDeployGuide] = useState<boolean>(false);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edu_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Local storage assisted state
  const [student, setStudent] = useState<StudentUser>(() => {
    const saved = localStorage.getItem('edu_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [teachers, setTeachers] = useState<TeacherUser[]>(() => {
    const saved = localStorage.getItem('edu_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [groups, setGroups] = useState<StudentGroup[]>(() => {
    const saved = localStorage.getItem('edu_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('edu_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('edu_flashcards');
    return saved ? JSON.parse(saved) : INITIAL_FLASHCARDS;
  });

  const [kahootQuizzes] = useState<KahootQuiz[]>(INITIAL_KAHOOT_QUIZZES);

  const [homeworks, setHomeworks] = useState<Homework[]>(() => {
    const saved = localStorage.getItem('edu_homeworks');
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORKS;
  });

  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => {
    const saved = localStorage.getItem('edu_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceEntry[]>(() => {
    const saved = localStorage.getItem('edu_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('edu_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Active floating toast banner
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    message: string;
    type: 'lesson' | 'anki' | 'grade';
    actionTab?: string;
  } | null>(null);

  // Telegram WebApp Initialization and Auto-user Sync
  useEffect(() => {
    telegram.init();
    const tgUser = telegram.getUser();
    if (tgUser && tgUser.firstName) {
      setStudent((prev) => ({
        ...prev,
        name: `${tgUser.firstName} ${tgUser.lastName || ''}`.trim(),
        avatar: tgUser.photoUrl || prev.avatar,
      }));
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('edu_student', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('edu_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('edu_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('edu_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('edu_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('edu_homeworks', JSON.stringify(homeworks));
  }, [homeworks]);

  useEffect(() => {
    localStorage.setItem('edu_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('edu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Timed check for Anki review alerts and Lesson alerts
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const dueCards = flashcards.filter(c => c.nextReviewAt <= now && c.state !== 'mastered');
      
      // If there are due cards, occasionally remind
      if (dueCards.length > 0 && Math.random() < 0.2) {
        // Can remind quietly
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [flashcards]);

  // Handle flashcard intervals as requested: 1min, 5min, 1hour, 1day, 1month
  const handleUpdateCardInterval = (cardId: string, interval: FlashcardInterval) => {
    const intervalMap: Record<FlashcardInterval, number> = {
      '1min': 60 * 1000,
      '5min': 5 * 60 * 1000,
      '1hour': 60 * 60 * 1000,
      '1day': 24 * 60 * 60 * 1000,
      '1month': 30 * 24 * 60 * 60 * 1000,
    };

    const nextTime = Date.now() + intervalMap[interval];

    setFlashcards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            interval,
            nextReviewAt: nextTime,
            repetitionCount: c.repetitionCount + 1,
            state: interval === '1month' ? 'mastered' : interval === '1min' ? 'learning' : 'review',
          };
        }
        return c;
      })
    );

    // Give XP to student
    setStudent((prev) => ({
      ...prev,
      xpPoints: prev.xpPoints + (interval === '1month' ? 25 : 10),
    }));
  };

  // Add new word
  const handleAddNewCard = (newCardData: Omit<Flashcard, 'id' | 'nextReviewAt' | 'repetitionCount' | 'state'>) => {
    const newCard: Flashcard = {
      ...newCardData,
      id: `fc_${Date.now()}`,
      nextReviewAt: Date.now() + 60 * 1000, // 1 min from now
      repetitionCount: 0,
      state: 'new',
    };
    setFlashcards((prev) => [newCard, ...prev]);
  };

  // Quick add from reader
  const handleAddWordFromReader = (word: string, translation: string, level: EnglishLevel) => {
    const existing = flashcards.find((c) => c.word.toLowerCase() === word.toLowerCase());
    if (existing) return;

    handleAddNewCard({
      word,
      phonetic: `/${word.toLowerCase()}/`,
      partOfSpeech: 'noun',
      translation,
      definition: `Definition for ${word} extracted from book reader.`,
      example: `The reader highlighted "${word}" in the chapter.`,
      exampleUz: `Kitobxon ushbu so'zni o'qish jarayonida saqladi.`,
      level,
      interval: '1min',
      tags: ['book-reader'],
    });
  };

  // Submit Homework
  const handleSubmitHomework = (submissionData: Omit<HomeworkSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: HomeworkSubmission = {
      ...submissionData,
      id: `sub_${Date.now()}`,
      submittedAt: 'Hozir',
      status: 'pending',
    };

    setSubmissions((prev) => {
      const filtered = prev.filter(s => !(s.homeworkId === submissionData.homeworkId && s.studentId === submissionData.studentId));
      return [newSub, ...filtered];
    });

    // Notify teacher
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: '📝 Yangi vazifa topshirildi!',
      message: `${submissionData.studentName} "${submissionData.homeworkTitle}" vazifasiga javob yukladi.`,
      type: 'homework',
      createdAt: 'Hozir',
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Teacher Grades Homework
  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          return {
            ...s,
            status: 'graded',
            score,
            teacherFeedback: feedback,
            gradedAt: 'Hozir',
          };
        }
        return s;
      })
    );

    // Send notification to student
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `🎉 Vazifangiz baholandi (${score}/100)!`,
      message: `Ustozingiz sizning vazifangizni tekshirdi: "${feedback}"`,
      type: 'grade',
      createdAt: 'Hozir',
      timestamp: Date.now(),
      read: false,
      actionPayload: { tab: 'homework' },
    };
    setNotifications((prev) => [notif, ...prev]);

    // Show floating toast
    setActiveToast({
      id: `toast_${Date.now()}`,
      title: `Vazifangiz baholandi: ${score} ball!`,
      message: feedback,
      type: 'grade',
      actionTab: 'homework',
    });
  };

  // Save Attendance (Teacher)
  const handleSaveAttendance = (
    groupId: string,
    date: string,
    records: { studentId: string; studentName: string; status: 'present' | 'absent' | 'late'; note?: string }[]
  ) => {
    const entry: AttendanceEntry = {
      date,
      groupId,
      records,
    };
    setAttendanceRecords((prev) => [entry, ...prev.filter(r => !(r.date === date && r.groupId === groupId))]);
  };

  // Create Group (Teacher)
  const handleCreateGroup = (groupData: Omit<StudentGroup, 'id' | 'studentCount' | 'studentIds'>) => {
    const newGroup: StudentGroup = {
      ...groupData,
      id: `grp_${Date.now()}`,
      studentCount: 1,
      studentIds: [student.id],
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  // Add Student to Group (Teacher)
  const handleAddStudentToGroup = (groupId: string, studentName: string, studentEmail: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            studentCount: g.studentCount + 1,
            studentIds: [...g.studentIds, `stu_${Date.now()}`],
          };
        }
        return g;
      })
    );
  };

  // Add Material (Teacher / Admin)
  const handleAddMaterial = (materialData: Omit<Material, 'id' | 'createdAt'>) => {
    const newMat: Material = {
      ...materialData,
      id: `mat_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      completed: false,
    };
    setMaterials((prev) => [newMat, ...prev]);
  };

  // Assign Teacher to Group (Admin)
  const handleAssignTeacherToGroup = (teacherId: string, groupId: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          const exists = t.assignedGroupIds.includes(groupId);
          return {
            ...t,
            assignedGroupIds: exists ? t.assignedGroupIds : [...t.assignedGroupIds, groupId],
          };
        }
        return t;
      })
    );

    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setGroups((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            return {
              ...g,
              teacherId: teacher.id,
              teacherName: teacher.name,
            };
          }
          return g;
        })
      );
    }
  };

  // Add Teacher (Admin)
  const handleAddTeacher = (teacherData: Omit<TeacherUser, 'id' | 'totalLessonsConducted' | 'rating'>) => {
    const newTeacher: TeacherUser = {
      ...teacherData,
      id: `tch_${Date.now()}`,
      totalLessonsConducted: 0,
      rating: 5.0,
    };
    setTeachers((prev) => [...prev, newTeacher]);
  };

  // Mark notification read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Trigger test alerts for demonstration
  const handleTriggerTestNotification = (type: 'lesson' | 'anki') => {
    if (type === 'lesson') {
      const activeGroup = groups[0] || INITIAL_GROUPS[0];
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: '🔔 Dars vaqti bo\'ldi!',
        message: `${activeGroup.name} guruhi bilan dars boshlanmoqda (${activeGroup.lessonTime}). Xonaga ulaning!`,
        type: 'lesson_alert',
        createdAt: 'Hozir',
        timestamp: Date.now(),
        read: false,
        actionPayload: { tab: 'schedule' },
      };
      setNotifications((prev) => [notif, ...prev]);
      setActiveToast({
        id: notif.id,
        title: '🔔 Dars boshlanmoqda!',
        message: `${activeGroup.name} — ${activeGroup.lessonTime}. Darsga kirishga tayyormisiz?`,
        type: 'lesson',
        actionTab: 'schedule',
      });
    } else {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: '🧠 Anki Flashcard: Takrorlash eslatmasi!',
        message: '"Water" va yana 3 ta yangi so\'zni belgilangan 5 daqiqalik interval bo\'yicha takrorlash vaqti keldi!',
        type: 'flashcard_due',
        createdAt: 'Hozir',
        timestamp: Date.now(),
        read: false,
        actionPayload: { tab: 'flashcards' },
      };
      setNotifications((prev) => [notif, ...prev]);
      setActiveToast({
        id: notif.id,
        title: '🧠 Anki So\'z Eslatmasi!',
        message: '"water", "perseverance" so\'zlarini takrorlash vaqti keldi.',
        type: 'anki',
        actionTab: 'flashcards',
      });
    }
  };

  const currentTeacher = teachers[0] || INITIAL_TEACHERS[0];
  const activeStudentGroup = groups.find((g) => g.id === student.groupId) || groups[0];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200`}>
      
      {/* GLOBAL HEADER WITH ROLE SWITCHER & NOTIFICATIONS */}
      <Header
        currentRole={currentRole}
        onRoleChange={(newRole) => {
          sound.playCardFlip();
          setCurrentRole(newRole);
        }}
        student={student}
        currentTeacher={currentTeacher}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onTriggerTestNotification={handleTriggerTestNotification}
        onSelectNotificationTab={(tab) => {
          if (currentRole === 'student') {
            setStudentActiveTab(tab);
          }
        }}
        onOpenDeploymentGuide={() => setShowDeployGuide(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* FLOATING LIVE ALERT TOAST NOTIFICATION (Requested for Lesson & Anki SRS) */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-2xl shrink-0 ${
                activeToast.type === 'lesson' ? 'bg-amber-500 text-slate-950' : 'bg-orange-500 text-white'
              }`}>
                {activeToast.type === 'lesson' ? <Clock className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-white">
                  {activeToast.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeToast.message}
                </p>
                {activeToast.actionTab && (
                  <button
                    onClick={() => {
                      if (currentRole !== 'student') setCurrentRole('student');
                      setStudentActiveTab(activeToast.actionTab!);
                      setActiveToast(null);
                    }}
                    className="mt-2 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors inline-block"
                  >
                    Bo'limga o'tish →
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN BODY BASED ON ACTIVE ROLE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ROLE 1: O'QUVCHI (STUDENT) PANEL */}
        {currentRole === 'student' && (
          <StudentPanel
            student={student}
            materials={materials}
            flashcards={flashcards}
            kahootQuizzes={kahootQuizzes}
            homeworks={homeworks}
            submissions={submissions}
            activeGroup={activeStudentGroup}
            attendanceHistory={attendanceRecords}
            activeTab={studentActiveTab}
            onTabChange={setStudentActiveTab}
            onUpdateCardInterval={handleUpdateCardInterval}
            onAddNewCard={handleAddNewCard}
            onSubmitHomework={handleSubmitHomework}
            onTriggerLessonAlert={() => handleTriggerTestNotification('lesson')}
            onSendDueNotification={() => handleTriggerTestNotification('anki')}
            onAddWordToFlashcards={handleAddWordFromReader}
          />
        )}

        {/* ROLE 2: O'QITUVCHI (TEACHER) PANEL */}
        {currentRole === 'teacher' && (
          <TeacherPanel
            currentTeacher={currentTeacher}
            groups={groups}
            materials={materials}
            homeworks={homeworks}
            submissions={submissions}
            attendanceRecords={attendanceRecords}
            onCreateGroup={handleCreateGroup}
            onAddStudentToGroup={handleAddStudentToGroup}
            onAddMaterial={handleAddMaterial}
            onGradeSubmission={handleGradeSubmission}
            onSaveAttendance={handleSaveAttendance}
          />
        )}

        {/* ROLE 3: ADMIN PANEL */}
        {currentRole === 'admin' && (
          <AdminPanel
            teachers={teachers}
            groups={groups}
            materials={materials}
            onAssignTeacherToGroup={handleAssignTeacherToGroup}
            onAddTeacher={handleAddTeacher}
            onAddAdminMaterial={handleAddMaterial}
            onOpenDeploymentGuide={() => setShowDeployGuide(true)}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>EduEnglish — Ingliz Tili O'quvchi, O'qituvchi va Admin Platformasi</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">A1-C2 • Anki SRS • Kahoot Battle • Davomat & Vazifalar</span>
          </div>

          <button
            onClick={() => setShowDeployGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Rocket className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>TMA, Hosting & App Store qo'llanmasi</span>
          </button>
        </div>
      </footer>

      {/* DEPLOYMENT, TELEGRAM MINI APP & STORE GUIDE MODAL */}
      <DeploymentGuideModal
        isOpen={showDeployGuide}
        onClose={() => setShowDeployGuide(false)}
      />

    </div>
  );
}
