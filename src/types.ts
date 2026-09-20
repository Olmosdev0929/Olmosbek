export type UserRole = 'student' | 'teacher' | 'admin';

export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type MaterialCategory = 'grammar' | 'listening' | 'reading' | 'writing' | 'general';
export type MaterialType = 'video' | 'book' | 'test';

export interface Material {
  id: string;
  title: string;
  description: string;
  level: EnglishLevel;
  category: MaterialCategory;
  type: MaterialType;
  durationOrPages: string;
  thumbnailUrl?: string;
  videoUrl?: string; // YouTube or video sample
  bookContent?: string; // text for reading reader
  vocabularyList?: { word: string; translation: string }[];
  quizQuestions?: QuizQuestion[];
  authorTeacherId?: string;
  authorTeacherName: string;
  createdAt: string;
  completed?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type FlashcardInterval = '1min' | '5min' | '1hour' | '1day' | '1month';

export interface Flashcard {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  translation: string;
  definition: string;
  example: string;
  exampleUz: string;
  level: EnglishLevel;
  nextReviewAt: number; // timestamp in ms
  interval: FlashcardInterval;
  repetitionCount: number;
  state: 'new' | 'learning' | 'review' | 'mastered';
  tags: string[];
}

export interface KahootQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  timeLimitSeconds: number;
  points: number;
  explanation?: string;
}

export interface KahootQuiz {
  id: string;
  title: string;
  level: EnglishLevel;
  description: string;
  questions: KahootQuestion[];
}

export interface Homework {
  id: string;
  title: string;
  instructions: string;
  level: EnglishLevel;
  groupId: string;
  groupName: string;
  teacherId: string;
  teacherName: string;
  deadline: string;
  maxScore: number;
  submissionsCount: number;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  homeworkTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  submittedAt: string;
  textContent: string;
  attachedFileName?: string;
  audioNoteUrl?: string;
  status: 'pending' | 'graded';
  score?: number;
  teacherFeedback?: string;
  gradedAt?: string;
}

export interface StudentGroup {
  id: string;
  name: string;
  level: EnglishLevel;
  teacherId: string;
  teacherName: string;
  scheduleDays: string; // e.g. "Dushanba, Chorshanba, Juma"
  lessonTime: string; // e.g. "14:00 - 15:30"
  studentCount: number;
  studentIds: string[];
  roomOrLink: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: EnglishLevel;
  streakDays: number;
  xpPoints: number;
  groupId: string;
  groupName: string;
  attendanceRate: number; // percentage
  completedLessonsCount: number;
}

export interface TeacherUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  experienceYears: number;
  assignedGroupIds: string[];
  totalLessonsConducted: number;
  rating: number;
  status: 'active' | 'busy' | 'vacation';
}

export interface AttendanceEntry {
  date: string; // YYYY-MM-DD
  groupId: string;
  records: {
    studentId: string;
    studentName: string;
    status: 'present' | 'absent' | 'late';
    note?: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'lesson_alert' | 'flashcard_due' | 'homework' | 'grade' | 'kahoot' | 'parent_alert' | 'payment_alert';
  createdAt: string;
  timestamp: number;
  read: boolean;
  actionPayload?: {
    tab?: string;
    id?: string;
  };
}

// AI Speaking Partner Types
export interface SpeakingTopic {
  id: string;
  title: string;
  part: 'Part 1 (Introduction)' | 'Part 2 (Cue Card)' | 'Part 3 (Discussion)';
  level: EnglishLevel;
  cueCardPoints?: string[];
  initialQuestion: string;
  sampleAnswer?: string;
}

export interface SpeakingMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
  feedback?: {
    pronunciationScore: number;
    grammarScore: number;
    fluencyScore: number;
    corrections: string[];
    betterPhrasing: string;
  };
}

// AI Essay Checker Types
export interface EssayEvaluation {
  overallBand: number; // e.g. 6.5, 7.0
  wordCount: number;
  taskAchievement: {
    score: number;
    comment: string;
  };
  coherenceCohesion: {
    score: number;
    comment: string;
  };
  lexicalResource: {
    score: number;
    comment: string;
    vocabularyBoost: { original: string; better: string; reason: string }[];
  };
  grammaticalAccuracy: {
    score: number;
    comment: string;
    grammarMistakes: { mistake: string; correction: string; explanation: string }[];
  };
  improvedVersion: string;
  examinerSummary: string;
}

// Smart Reader Types
export interface SmartReaderPassage {
  id: string;
  title: string;
  level: EnglishLevel;
  genre: string;
  readTime: string;
  content: string;
  keyWords: { word: string; translation: string; phonetic: string; partOfSpeech: string; example: string }[];
  audioUrl?: string;
}

// CRM & Tuition Payments Types
export interface StudentPayment {
  id: string;
  studentId: string;
  studentName: string;
  groupName: string;
  parentName: string;
  parentPhone: string;
  monthlyFee: number; // in UZS, e.g. 600000
  amountPaid: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string; // YYYY-MM-DD
  lastPaymentDate?: string;
  paymentMethod?: 'Payme' | 'Click' | 'Naqd' | 'Bank';
}

export interface ParentNotificationLog {
  id: string;
  studentId: string;
  studentName: string;
  parentPhone: string;
  type: 'attendance_absence' | 'payment_reminder' | 'grade_report' | 'achievement';
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered';
}

// Gamification & Badges Types
export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  groupName: string;
  xpPoints: number;
  streakDays: number;
  wordsMastered: number;
  kahootWins: number;
  isCurrentUser?: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'vocabulary' | 'writing' | 'speaking' | 'kahoot' | 'exam';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 - 100
  xpReward: number;
}

// Mock Exam Simulator Types
export interface MockExamQuestion {
  id: string;
  section: 'listening' | 'reading';
  questionText: string;
  passageText?: string;
  audioPrompt?: string;
  options: string[];
  correctIndex: number;
  topicCategory: 'Main Idea' | 'Inference' | 'Detail' | 'Vocabulary in Context';
  explanation: string;
}

export interface MockExam {
  id: string;
  title: string;
  level: EnglishLevel;
  type: 'IELTS Academic' | 'IELTS General' | 'CEFR B2' | 'CEFR C1';
  timeLimitMinutes: number;
  totalQuestions: number;
  questions: MockExamQuestion[];
}

export interface MockExamResult {
  examId: string;
  score: number; // out of total
  percentage: number;
  estimatedBand: string; // e.g. "IELTS 7.0" or "CEFR B2+"
  completedAt: string;
  timeSpentSeconds: number;
  weakTopics: { topic: string; incorrectCount: number; advice: string }[];
}

