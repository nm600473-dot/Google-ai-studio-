import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { AIMemory, LearningProfile, RecentConversation, Json } from '../lib/supabase';

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

interface AIMemoryContextType {
  loading: boolean;

  // Memory data
  memories: AIMemory[];
  learningProfile: LearningProfile | null;
  recentConversations: RecentConversation[];

  // Derived data
  weakTopics: MemoryTopic[];
  strongTopics: MemoryTopic[];
  favoriteSubjects: string[];
  quizHistory: QuizRecord[];
  learningStreaks: StudyStreak[];
  recommendations: Recommendation[];

  // Memory operations
  saveConversationMemory: (content: string, topic?: string, metadata?: Json) => Promise<void>;
  savePreference: (key: string, value: string | string[] | Record<string, unknown>) => Promise<void>;
  updateWeakTopic: (topic: MemoryTopic) => Promise<void>;
  updateStrongTopic: (topic: MemoryTopic) => Promise<void>;
  updateLearningProfile: (updates: Partial<LearningProfile>) => Promise<void>;
  updateDifficultyLevel: (level: 'beginner' | 'intermediate' | 'advanced') => Promise<void>;
  addStudyGoal: (goal: string) => Promise<void>;
  removeStudyGoal: (goal: string) => Promise<void>;
  addExamPreparation: (exam: { subject: string; date: string; type: string }) => Promise<void>;
  removeExamPreparation: (exam: { subject: string; date: string }) => Promise<void>;
  setPreferredStudyTime: (time: string) => Promise<void>;
  setPreferredStyle: (style: string) => Promise<void>;

  // Memory management
  deleteMemory: (memoryId: string) => Promise<void>;
  clearConversationHistory: () => Promise<void>;
  resetAllMemories: () => Promise<void>;

  // Recommendations
  generateRecommendations: () => Recommendation[];

  // Utility
  getConversationContext: () => string;
  getPersonalizedGreeting: () => string;
  getTopicsNeedingReview: () => MemoryTopic[];
  refreshMemories: () => Promise<void>;
}

const AIMemoryContext = createContext<AIMemoryContextType | undefined>(undefined);

export function AIMemoryProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [memories, setMemories] = useState<AIMemory[]>([]);
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);

  const weakTopics: MemoryTopic[] = (learningProfile?.weak_topics as unknown as MemoryTopic[] | undefined) || [];
  const strongTopics: MemoryTopic[] = (learningProfile?.strong_topics as unknown as MemoryTopic[] | undefined) || [];
  const favoriteSubjects: string[] = (learningProfile?.favorite_subjects as unknown as string[] | undefined) || [];
  const quizHistory: QuizRecord[] = (learningProfile?.quiz_history as unknown as QuizRecord[] | undefined) || [];
  const learningStreaks: StudyStreak[] = (learningProfile?.learning_streaks as unknown as StudyStreak[] | undefined) || [];
  const recommendations: Recommendation[] = [];

  const fetchMemories = useCallback(async () => {
    if (!user) return;

    try {
      const [memoriesRes, profileRes, conversationsRes] = await Promise.all([
        supabase
          .from('ai_memories')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('learning_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('recent_conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(20),
      ]);

      if (memoriesRes.data) setMemories(memoriesRes.data);
      if (profileRes.data) setLearningProfile(profileRes.data);
      else if (profileRes.error?.code === 'PGRST116') {
        const { data: newProfile } = await supabase
          .from('learning_profiles')
          .insert({ user_id: user.id })
          .select()
          .single();
        if (newProfile) setLearningProfile(newProfile);
      }
      if (conversationsRes.data) setRecentConversations(conversationsRes.data);
    } catch (error) {
      console.error('Error fetching AI memories:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMemories();
    } else {
      setMemories([]);
      setLearningProfile(null);
      setRecentConversations([]);
      setLoading(false);
    }
  }, [user, fetchMemories]);

  const saveConversationMemory = async (content: string, topic?: string, metadata?: Json) => {
    if (!user || !learningProfile) return;

    await supabase.from('ai_memories').insert({
      user_id: user.id,
      memory_type: 'conversation',
      content,
      metadata: { topic, ...(typeof metadata === 'object' && metadata !== null ? metadata : {}) },
      importance_score: 0.5,
      access_count: 0,
    });

    await supabase.from('recent_conversations').insert({
      user_id: user.id,
      conversation_summary: content.substring(0, 200),
      topic: topic || null,
      message_count: (metadata as Record<string, number>)?.message_count || 1,
      metadata,
    });

    fetchMemories();
  };

  const savePreference = async (key: string, value: string | string[] | Record<string, unknown>) => {
    if (!user) return;

    await supabase.from('ai_memories').insert({
      user_id: user.id,
      memory_type: 'preference',
      content: `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`,
      metadata: { key, value },
      importance_score: 0.8,
      access_count: 0,
    });

    fetchMemories();
  };

  const updateWeakTopic = async (topic: MemoryTopic) => {
    if (!user || !learningProfile) return;

    const currentTopics = (learningProfile.weak_topics as unknown as MemoryTopic[] | undefined) || [];
    const existingIndex = currentTopics.findIndex(t => t.id === topic.id || t.name === topic.name);

    let updatedTopics: MemoryTopic[];
    if (existingIndex >= 0) {
      updatedTopics = [...currentTopics];
      updatedTopics[existingIndex] = topic;
    } else {
      updatedTopics = [...currentTopics, topic];
    }

    await supabase
      .from('learning_profiles')
      .update({ weak_topics: updatedTopics as unknown as Json, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    fetchMemories();
  };

  const updateStrongTopic = async (topic: MemoryTopic) => {
    if (!user || !learningProfile) return;

    const currentTopics = (learningProfile.strong_topics as unknown as MemoryTopic[] | undefined) || [];
    const existingIndex = currentTopics.findIndex(t => t.id === topic.id || t.name === topic.name);

    let updatedTopics: MemoryTopic[];
    if (existingIndex >= 0) {
      updatedTopics = [...currentTopics];
      updatedTopics[existingIndex] = topic;
    } else {
      updatedTopics = [...currentTopics, topic];
    }

    await supabase
      .from('learning_profiles')
      .update({ strong_topics: updatedTopics as unknown as Json, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    fetchMemories();
  };

  const updateLearningProfile = async (updates: Partial<LearningProfile>) => {
    if (!user || !learningProfile) return;

    await supabase
      .from('learning_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    fetchMemories();
  };

  const updateDifficultyLevel = async (level: 'beginner' | 'intermediate' | 'advanced') => {
    await updateLearningProfile({ difficulty_level: level });
  };

  const addStudyGoal = async (goal: string) => {
    if (!learningProfile) return;
    const currentGoals = learningProfile.study_goals as string[] || [];
    if (!currentGoals.includes(goal)) {
      await updateLearningProfile({ study_goals: [...currentGoals, goal] as unknown as Json });
    }
  };

  const removeStudyGoal = async (goal: string) => {
    if (!learningProfile) return;
    const currentGoals = learningProfile.study_goals as string[] || [];
    await updateLearningProfile({
      study_goals: currentGoals.filter(g => g !== goal) as unknown as Json
    });
  };

  const addExamPreparation = async (exam: { subject: string; date: string; type: string }) => {
    if (!learningProfile) return;
    const currentExams = learningProfile.exam_preparations as Array<{ subject: string; date: string; type: string }> || [];
    await updateLearningProfile({
      exam_preparations: [...currentExams, exam] as unknown as Json
    });
  };

  const removeExamPreparation = async (exam: { subject: string; date: string }) => {
    if (!learningProfile) return;
    const currentExams = learningProfile.exam_preparations as Array<{ subject: string; date: string; type: string }> || [];
    await updateLearningProfile({
      exam_preparations: currentExams.filter(e => !(e.subject === exam.subject && e.date === exam.date)) as unknown as Json
    });
  };

  const setPreferredStudyTime = async (time: string) => {
    await updateLearningProfile({ preferred_study_time: time });
  };

  const setPreferredStyle = async (style: string) => {
    await updateLearningProfile({ preferred_style: style });
  };

  const deleteMemory = async (memoryId: string) => {
    if (!user) return;
    await supabase.from('ai_memories').delete().eq('id', memoryId);
    fetchMemories();
  };

  const clearConversationHistory = async () => {
    if (!user) return;
    await supabase.from('recent_conversations').delete().eq('user_id', user.id);
    await supabase.from('ai_memories').delete().eq('user_id', user.id).eq('memory_type', 'conversation');
    fetchMemories();
  };

  const resetAllMemories = async () => {
    if (!user) return;
    await supabase.from('ai_memories').delete().eq('user_id', user.id);
    await supabase.from('recent_conversations').delete().eq('user_id', user.id);
    await supabase.from('learning_profiles').delete().eq('user_id', user.id);
    await supabase.from('learning_profiles').insert({ user_id: user.id });
    fetchMemories();
  };

  const generateRecommendations = (): Recommendation[] => {
    if (!learningProfile) return [];

    const recs: Recommendation[] = [];

    const lowMasteryTopics = weakTopics.filter(t => t.mastery_level < 40);
    lowMasteryTopics.forEach(topic => {
      recs.push({
        type: 'revision',
        title: `Review ${topic.name}`,
        description: `Your mastery level in ${topic.name} is currently at ${topic.mastery_level}%. Consider reviewing this topic.`,
        topic: topic.name,
        priority: topic.mastery_level < 30 ? 'high' : 'medium',
      });
    });

    const exams = learningProfile.exam_preparations as Array<{ subject: string; date: string; type: string }> | undefined;
    if (exams && exams.length > 0) {
      const today = new Date();
      exams.forEach(exam => {
        const examDate = new Date(exam.date);
        const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 14 && daysUntil > 0) {
          recs.push({
            type: 'exam_prep',
            title: `Prepare for ${exam.subject} ${exam.type}`,
            description: `Your ${exam.type} is in ${daysUntil} days. Time to start focused practice!`,
            topic: exam.subject,
            priority: daysUntil <= 7 ? 'high' : 'medium',
          });
        }
      });
    }

    if (quizHistory.length > 0) {
      const recentLowScores = quizHistory
        .filter(q => q.score / q.total_points < 0.6)
        .slice(0, 3);

      recentLowScores.forEach(quiz => {
        if (!recs.some(r => r.topic === quiz.subject)) {
          recs.push({
            type: 'quiz',
            title: `Practice ${quiz.subject}`,
            description: `Your recent ${quiz.quiz_title} score was below average. Try another practice round.`,
            topic: quiz.subject,
            priority: 'medium',
          });
        }
      });
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const getConversationContext = (): string => {
    if (!learningProfile || recentConversations.length === 0) return '';

    const recentTopics = recentConversations
      .slice(0, 5)
      .map(c => c.topic || c.conversation_summary)
      .filter(Boolean);

    const context = [
      `Student's preferred difficulty: ${learningProfile.difficulty_level}`,
      `Learning style: ${learningProfile.preferred_style}`,
      weakTopics.length > 0 ? `Areas needing improvement: ${weakTopics.map(t => t.name).join(', ')}` : '',
      strongTopics.length > 0 ? `Strong areas: ${strongTopics.map(t => t.name).join(', ')}` : '',
      recentTopics.length > 0 ? `Recently discussed: ${recentTopics.join('; ')}` : '',
    ].filter(Boolean).join('\n');

    return context;
  };

  const getPersonalizedGreeting = (): string => {
    if (!profile) return 'Hello!';

    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const name = profile.full_name?.split(' ')[0] || 'there';

    if (profile.streak && profile.streak > 0) {
      return `Good ${timeOfDay}, ${name}! You're on a ${profile.streak}-day streak. Let's keep it going!`;
    }

    const todayGoals = (learningProfile?.study_goals as string[])?.length || 0;
    if (todayGoals > 0) {
      return `Good ${timeOfDay}, ${name}! You have ${todayGoals} goals set for today. Ready to tackle them?`;
    }

    return `Good ${timeOfDay}, ${name}! What would you like to learn today?`;
  };

  const getTopicsNeedingReview = (): MemoryTopic[] => {
    return weakTopics.filter(t => t.mastery_level < 50)
      .sort((a, b) => a.mastery_level - b.mastery_level);
  };

  const refreshMemories = async () => {
    await fetchMemories();
  };

  const value: AIMemoryContextType = {
    loading,
    memories,
    learningProfile,
    recentConversations,
    weakTopics,
    strongTopics,
    favoriteSubjects,
    quizHistory,
    learningStreaks,
    recommendations,
    saveConversationMemory,
    savePreference,
    updateWeakTopic,
    updateStrongTopic,
    updateLearningProfile,
    updateDifficultyLevel,
    addStudyGoal,
    removeStudyGoal,
    addExamPreparation,
    removeExamPreparation,
    setPreferredStudyTime,
    setPreferredStyle,
    deleteMemory,
    clearConversationHistory,
    resetAllMemories,
    generateRecommendations,
    getConversationContext,
    getPersonalizedGreeting,
    getTopicsNeedingReview,
    refreshMemories,
  };

  return <AIMemoryContext.Provider value={value}>{children}</AIMemoryContext.Provider>;
}

export function useAIMemory() {
  const context = useContext(AIMemoryContext);
  if (context === undefined) {
    throw new Error('useAIMemory must be used within an AIMemoryProvider');
  }
  return context;
}
