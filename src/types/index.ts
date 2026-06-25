export interface XPAction {
  action: string;
  xp: number;
}

export const XP_REWARDS: XPAction[] = [
  { action: 'correct_answer', xp: 10 },
  { action: 'quiz_completion', xp: 20 },
  { action: 'daily_login', xp: 5 },
  { action: 'weekly_streak', xp: 50 },
  { action: 'challenge_completion', xp: 100 },
  { action: 'flashcard_review', xp: 5 },
  { action: 'study_session', xp: 15 },
  { action: 'battle_win', xp: 50 },
];

export interface LevelInfo {
  level: number;
  xpRequired: number;
  title: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, xpRequired: 0, title: 'Novice Scholar' },
  { level: 2, xpRequired: 100, title: 'Curious Learner' },
  { level: 3, xpRequired: 250, title: 'Eager Student' },
  { level: 4, xpRequired: 450, title: 'Dedicated Learner' },
  { level: 5, xpRequired: 700, title: 'Knowledge Seeker' },
  { level: 6, xpRequired: 1000, title: 'Smart Scholar' },
  { level: 7, xpRequired: 1400, title: 'Rising Star' },
  { level: 8, xpRequired: 1900, title: 'Academic Elite' },
  { level: 9, xpRequired: 2500, title: 'Wisdom Master' },
  { level: 10, xpRequired: 3200, title: 'Grand Scholar' },
  { level: 20, xpRequired: 12000, title: 'Sage of Learning' },
  { level: 30, xpRequired: 28000, title: 'Enlightened Mind' },
  { level: 50, xpRequired: 80000, title: 'Master of Knowledge' },
  { level: 75, xpRequired: 180000, title: 'Legendary Scholar' },
  { level: 100, xpRequired: 320000, title: 'Ultimate Genius' },
];

export function getLevelFromXP(xp: number): LevelInfo {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[Math.min(i + 1, LEVELS.length - 1)];
      break;
    }
  }

  return {
    ...currentLevel,
    xpRequired: nextLevel.xpRequired - currentLevel.xpRequired,
  };
}

export interface AchievementInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'streak' | 'quiz' | 'special';
  xpReward: number;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export const SUBJECT_COLORS: Record<string, string> = {
  mathematics: '#4F8CFF',
  biology: '#00D084',
  chemistry: '#7C4DFF',
  physics: '#FF6B6B',
  english: '#FFA500',
  history: '#8B4513',
  geography: '#20B2AA',
  ict: '#4169E1',
};

export const AI_COMPANION_TYPES = [
  { id: 'owl', name: 'Genius Owl', emoji: '🦉', color: '#FFD700' },
  { id: 'robot', name: 'Robo Teacher', emoji: '🤖', color: '#4F8CFF' },
  { id: 'dragon', name: 'Study Dragon', emoji: '🐉', color: '#FF6B6B' },
  { id: 'scientist', name: 'Future Scientist', emoji: '🔬', color: '#00D084' },
  { id: 'wizard', name: 'Knowledge Wizard', emoji: '🧙', color: '#7C4DFF' },
] as const;

export type AICompanionType = typeof AI_COMPANION_TYPES[number]['id'];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  userAnswer?: number;
  points: number;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  answers: number[];
  startTime: Date;
  endTime?: Date;
}

export interface StudyPlanDay {
  date: Date;
  subject: string;
  topic: string;
  duration: number;
  type: 'reading' | 'quiz' | 'revision' | 'practice';
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  level: number;
  badges: number;
}

export interface NotificationData {
  id: string;
  type: 'achievement' | 'reminder' | 'challenge' | 'message' | 'system' | 'streak' | 'exam';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// AI Memory System Types
export interface MemoryTopic {
  id: string;
  name: string;
  mastery_level: number;
  last_practiced: string;
  practice_count: number;
}

export interface QuizRecord {
  quiz_id: string;
  quiz_title: string;
  subject: string;
  score: number;
  total_points: number;
  date: string;
}

export interface StudyStreak {
  start_date: string;
  end_date: string | null;
  days: number;
  active: boolean;
}

export interface Recommendation {
  type: 'revision' | 'quiz' | 'lesson' | 'exam_prep';
  title: string;
  description: string;
  topic?: string;
  priority: 'high' | 'medium' | 'low';
  action_url?: string;
}

export type MemoryType = 'conversation' | 'preference' | 'weak_topic' | 'strong_topic' | 'learning_style' | 'goal';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
