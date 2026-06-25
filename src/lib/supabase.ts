import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mock Query Builder for fallback
class MockQueryBuilder {
  private tableName: string;
  private filters: any = {};

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getData() {
    const key = `mock_supabase_${this.tableName}`;
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    }
    // Return empty array by default
    return [];
  }

  private saveData(data: any) {
    const key = `mock_supabase_${this.tableName}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  select(fields: string = '*') {
    return this;
  }

  eq(field: string, value: any) {
    this.filters[field] = value;
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    return this;
  }

  limit(count: number) {
    return this;
  }

  async single() {
    const list = this.getData();
    // Filter items
    const filtered = list.filter((item: any) => {
      for (const key in this.filters) {
        if (item[key] !== this.filters[key]) return false;
      }
      return true;
    });
    return { data: filtered[0] || null, error: null };
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any): Promise<any> {
    const list = this.getData();
    const filtered = list.filter((item: any) => {
      for (const key in this.filters) {
        if (item[key] !== this.filters[key]) return false;
      }
      return true;
    });
    const res = { data: filtered, error: null };
    if (onfulfilled) {
      return Promise.resolve(res).then(onfulfilled, onrejected);
    }
    return Promise.resolve(res);
  }

  async insert(values: any) {
    const list = this.getData();
    const newItems = Array.isArray(values) ? values : [values];
    const generated = newItems.map(item => ({
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      ...item
    }));
    this.saveData([...list, ...generated]);
    return { data: Array.isArray(values) ? generated : generated[0], error: null };
  }

  async update(values: any) {
    const list = this.getData();
    const updatedList = list.map((item: any) => {
      let matches = true;
      for (const key in this.filters) {
        if (item[key] !== this.filters[key]) matches = false;
      }
      if (matches) {
        return { ...item, ...values, updated_at: new Date().toISOString() };
      }
      return item;
    });
    this.saveData(updatedList);
    const affected = updatedList.filter((item: any) => {
      for (const key in this.filters) {
        if (item[key] !== this.filters[key]) return false;
      }
      return true;
    });
    return { data: affected, error: null };
  }

  async delete() {
    const list = this.getData();
    const remaining = list.filter((item: any) => {
      let matches = true;
      for (const key in this.filters) {
        if (item[key] !== this.filters[key]) matches = false;
      }
      return !matches;
    });
    this.saveData(remaining);
    return { data: null, error: null };
  }
}

const mockAuthSubscribers = new Set<Function>();

const getMockSession = () => {
  const sessionStr = localStorage.getItem('mock_supabase_session');
  if (sessionStr) {
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const createMockSupabase = () => {
  return {
    auth: {
      async getSession() {
        return { data: { session: getMockSession() }, error: null };
      },
      onAuthStateChange(callback: Function) {
        mockAuthSubscribers.add(callback);
        const session = getMockSession();
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
        return {
          data: {
            subscription: {
              unsubscribe() {
                mockAuthSubscribers.delete(callback);
              }
            }
          }
        };
      },
      async signUp({ email, password, options }: any) {
        const mockUser = {
          id: 'mock-user-123',
          email,
          user_metadata: options?.data || {},
          created_at: new Date().toISOString()
        };
        const mockSession = {
          access_token: 'mock-token-123',
          user: mockUser,
          expires_at: Math.floor(Date.now() / 1000) + 3600
        };
        localStorage.setItem('mock_supabase_session', JSON.stringify(mockSession));
        
        // Seed initial profiles
        const profilesKey = 'mock_supabase_profiles';
        const profiles = localStorage.getItem(profilesKey);
        if (!profiles) {
          localStorage.setItem(profilesKey, JSON.stringify([{
            id: mockUser.id,
            email: mockUser.email,
            full_name: options?.data?.full_name || 'Areka Learner',
            role: 'student',
            grade_level: 10,
            preferred_language: 'en',
            xp: 150,
            level: 2,
            streak: 4,
            total_study_hours: 6.2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]));
        }

        mockAuthSubscribers.forEach(cb => cb('SIGNED_IN', mockSession));
        return { data: { user: mockUser, session: mockSession }, error: null };
      },
      async signInWithPassword({ email, password }: any) {
        const mockUser = {
          id: 'mock-user-123',
          email,
          user_metadata: { full_name: 'Areka Learner' },
          created_at: new Date().toISOString()
        };
        const mockSession = {
          access_token: 'mock-token-123',
          user: mockUser,
          expires_at: Math.floor(Date.now() / 1000) + 3600
        };
        localStorage.setItem('mock_supabase_session', JSON.stringify(mockSession));
        
        // Seed initial profiles
        const profilesKey = 'mock_supabase_profiles';
        const profiles = localStorage.getItem(profilesKey);
        if (!profiles) {
          localStorage.setItem(profilesKey, JSON.stringify([{
            id: mockUser.id,
            email: mockUser.email,
            full_name: 'Areka Learner',
            role: 'student',
            grade_level: 10,
            preferred_language: 'en',
            xp: 150,
            level: 2,
            streak: 4,
            total_study_hours: 6.2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]));
        }

        mockAuthSubscribers.forEach(cb => cb('SIGNED_IN', mockSession));
        return { data: { user: mockUser, session: mockSession }, error: null };
      },
      async signOut() {
        localStorage.removeItem('mock_supabase_session');
        mockAuthSubscribers.forEach(cb => cb('SIGNED_OUT', null));
        return { error: null };
      }
    },
    from(tableName: string) {
      return new MockQueryBuilder(tableName);
    }
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'student' | 'teacher' | 'moderator' | 'admin';
          school_name: string | null;
          grade_level: number;
          preferred_language: 'en' | 'am' | 'or' | 'ti';
          xp: number;
          level: number;
          streak: number;
          last_active_date: string | null;
          total_study_hours: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'student' | 'teacher' | 'moderator' | 'admin';
          school_name?: string | null;
          grade_level?: number;
          preferred_language?: 'en' | 'am' | 'or' | 'ti';
          xp?: number;
          level?: number;
          streak?: number;
          last_active_date?: string | null;
          total_study_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'student' | 'teacher' | 'moderator' | 'admin';
          school_name?: string | null;
          grade_level?: number;
          preferred_language?: 'en' | 'am' | 'or' | 'ti';
          xp?: number;
          level?: number;
          streak?: number;
          last_active_date?: string | null;
          total_study_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          color: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          color?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          color?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          subject_id: string | null;
          created_by: string | null;
          difficulty_level: string;
          time_limit_minutes: number | null;
          is_public: boolean;
          questions_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          subject_id?: string | null;
          created_by?: string | null;
          difficulty_level?: string;
          time_limit_minutes?: number | null;
          is_public?: boolean;
          questions_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          subject_id?: string | null;
          created_by?: string | null;
          difficulty_level?: string;
          time_limit_minutes?: number | null;
          is_public?: boolean;
          questions_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          quiz_id: string;
          question_text: string;
          question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank';
          options: Json;
          correct_answer: string;
          explanation: string | null;
          points: number;
          difficulty_level: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question_text: string;
          question_type?: 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank';
          options?: Json;
          correct_answer: string;
          explanation?: string | null;
          points?: number;
          difficulty_level?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          question_text?: string;
          question_type?: 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank';
          options?: Json;
          correct_answer?: string;
          explanation?: string | null;
          points?: number;
          difficulty_level?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          score: number;
          total_points: number;
          answers: Json;
          started_at: string;
          completed_at: string | null;
          time_spent_seconds: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          score?: number;
          total_points?: number;
          answers?: Json;
          started_at?: string;
          completed_at?: string | null;
          time_spent_seconds?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string;
          score?: number;
          total_points?: number;
          answers?: Json;
          started_at?: string;
          completed_at?: string | null;
          time_spent_seconds?: number | null;
        };
      };
      flashcards: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string | null;
          front_text: string;
          back_text: string;
          difficulty_level: string;
          is_ai_generated: boolean;
          review_count: number;
          last_reviewed_at: string | null;
          next_review_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject_id?: string | null;
          front_text: string;
          back_text: string;
          difficulty_level?: string;
          is_ai_generated?: boolean;
          review_count?: number;
          last_reviewed_at?: string | null;
          next_review_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject_id?: string | null;
          front_text?: string;
          back_text?: string;
          difficulty_level?: string;
          is_ai_generated?: boolean;
          review_count?: number;
          last_reviewed_at?: string | null;
          next_review_at?: string | null;
          created_at?: string;
        };
      };
      study_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          exam_date: string | null;
          subjects: Json;
          daily_hours: number;
          schedule: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          exam_date?: string | null;
          subjects?: Json;
          daily_hours?: number;
          schedule?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          exam_date?: string | null;
          subjects?: Json;
          daily_hours?: number;
          schedule?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          category: 'learning' | 'social' | 'streak' | 'quiz' | 'special';
          xp_reward: number;
          requirement_type: string;
          requirement_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          category: 'learning' | 'social' | 'streak' | 'quiz' | 'special';
          xp_reward?: number;
          requirement_type: string;
          requirement_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          category?: 'learning' | 'social' | 'streak' | 'quiz' | 'special';
          xp_reward?: number;
          requirement_type?: string;
          requirement_value?: number;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
      };
      study_groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          subject_id: string | null;
          created_by: string;
          is_public: boolean;
          max_members: number;
          invite_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          subject_id?: string | null;
          created_by: string;
          is_public?: boolean;
          max_members?: number;
          invite_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          subject_id?: string | null;
          created_by?: string;
          is_public?: boolean;
          max_members?: number;
          invite_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          content: string;
          message_type: 'text' | 'file' | 'voice' | 'poll';
          file_url: string | null;
          reply_to: string | null;
          is_edited: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          content: string;
          message_type?: 'text' | 'file' | 'voice' | 'poll';
          file_url?: string | null;
          reply_to?: string | null;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          content?: string;
          message_type?: 'text' | 'file' | 'voice' | 'poll';
          file_url?: string | null;
          reply_to?: string | null;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          notification_type: 'achievement' | 'reminder' | 'challenge' | 'message' | 'system' | 'streak' | 'exam';
          is_read: boolean;
          action_url: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          notification_type: 'achievement' | 'reminder' | 'challenge' | 'message' | 'system' | 'streak' | 'exam';
          is_read?: boolean;
          action_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          notification_type?: 'achievement' | 'reminder' | 'challenge' | 'message' | 'system' | 'streak' | 'exam';
          is_read?: boolean;
          action_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string | null;
          description: string | null;
          cover_image_url: string | null;
          file_url: string | null;
          subject_id: string | null;
          uploaded_by: string | null;
          is_public: boolean;
          chapters: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          file_url?: string | null;
          subject_id?: string | null;
          uploaded_by?: string | null;
          is_public?: boolean;
          chapters?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          file_url?: string | null;
          subject_id?: string | null;
          uploaded_by?: string | null;
          is_public?: boolean;
          chapters?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_memories: {
        Row: {
          id: string;
          user_id: string;
          memory_type: 'conversation' | 'preference' | 'weak_topic' | 'strong_topic' | 'learning_style' | 'goal';
          content: string;
          metadata: Json;
          created_at: string;
          importance_score: number;
          last_accessed: string | null;
          access_count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          memory_type: 'conversation' | 'preference' | 'weak_topic' | 'strong_topic' | 'learning_style' | 'goal';
          content: string;
          metadata?: Json;
          created_at?: string;
          importance_score?: number;
          last_accessed?: string | null;
          access_count?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          memory_type?: 'conversation' | 'preference' | 'weak_topic' | 'strong_topic' | 'learning_style' | 'goal';
          content?: string;
          metadata?: Json;
          created_at?: string;
          importance_score?: number;
          last_accessed?: string | null;
          access_count?: number;
        };
      };
      learning_profiles: {
        Row: {
          id: string;
          user_id: string;
          weak_topics: Json;
          strong_topics: Json;
          preferred_style: string;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          study_goals: Json;
          preferred_study_time: string | null;
          exam_preparations: Json;
          created_at: string;
          updated_at: string;
          quiz_history: Json;
          learning_streaks: Json;
          favorite_subjects: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          weak_topics?: Json;
          strong_topics?: Json;
          preferred_style?: string;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
          study_goals?: Json;
          preferred_study_time?: string | null;
          exam_preparations?: Json;
          created_at?: string;
          updated_at?: string;
          quiz_history?: Json;
          learning_streaks?: Json;
          favorite_subjects?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          weak_topics?: Json;
          strong_topics?: Json;
          preferred_style?: string;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
          study_goals?: Json;
          preferred_study_time?: string | null;
          exam_preparations?: Json;
          created_at?: string;
          updated_at?: string;
          quiz_history?: Json;
          learning_streaks?: Json;
          favorite_subjects?: Json;
        };
      };
      battles: {
        Row: {
          id: string;
          challenger_id: string;
          opponent_id: string | null;
          subject_id: string | null;
          battle_type: 'quiz_duel' | 'speed_challenge' | 'subject_battle' | 'tournament';
          status: 'pending' | 'active' | 'completed' | 'cancelled';
          challenger_score: number;
          opponent_score: number;
          winner_id: string | null;
          xp_reward: number;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          challenger_id: string;
          opponent_id?: string | null;
          subject_id?: string | null;
          battle_type?: 'quiz_duel' | 'speed_challenge' | 'subject_battle' | 'tournament';
          status?: 'pending' | 'active' | 'completed' | 'cancelled';
          challenger_score?: number;
          opponent_score?: number;
          winner_id?: string | null;
          xp_reward?: number;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          challenger_id?: string;
          opponent_id?: string | null;
          subject_id?: string | null;
          battle_type?: 'quiz_duel' | 'speed_challenge' | 'subject_battle' | 'tournament';
          status?: 'pending' | 'active' | 'completed' | 'cancelled';
          challenger_score?: number;
          opponent_score?: number;
          winner_id?: string | null;
          xp_reward?: number;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      ai_companions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          companion_type: 'owl' | 'robot' | 'dragon' | 'scientist' | 'wizard';
          customization: Json;
          mood: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          companion_type?: 'owl' | 'robot' | 'dragon' | 'scientist' | 'wizard';
          customization?: Json;
          mood?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          companion_type?: 'owl' | 'robot' | 'dragon' | 'scientist' | 'wizard';
          customization?: Json;
          mood?: string;
          created_at?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: 'member' | 'moderator' | 'admin';
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role?: 'member' | 'moderator' | 'admin';
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          role?: 'member' | 'moderator' | 'admin';
          joined_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string | null;
          started_at: string;
          ended_at: string | null;
          duration_minutes: number | null;
          activity_type: 'reading' | 'quiz' | 'flashcard' | 'video' | 'ai_tutor' | null;
          xp_earned: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject_id?: string | null;
          started_at?: string;
          ended_at?: string | null;
          duration_minutes?: number | null;
          activity_type?: 'reading' | 'quiz' | 'flashcard' | 'video' | 'ai_tutor' | null;
          xp_earned?: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject_id?: string | null;
          started_at?: string;
          ended_at?: string | null;
          duration_minutes?: number | null;
          activity_type?: 'reading' | 'quiz' | 'flashcard' | 'video' | 'ai_tutor' | null;
          xp_earned?: number;
          notes?: string | null;
        };
      };
      student_analytics: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          study_minutes: number;
          quizzes_completed: number;
          questions_correct: number;
          questions_total: number;
          xp_earned: number;
          flashcards_reviewed: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          study_minutes?: number;
          quizzes_completed?: number;
          questions_correct?: number;
          questions_total?: number;
          xp_earned?: number;
          flashcards_reviewed?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          study_minutes?: number;
          quizzes_completed?: number;
          questions_correct?: number;
          questions_total?: number;
          xp_earned?: number;
          flashcards_reviewed?: number;
        };
      };
      recent_conversations: {
        Row: {
          id: string;
          user_id: string;
          conversation_summary: string;
          topic: string | null;
          message_count: number;
          metadata: Json;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          conversation_summary: string;
          topic?: string | null;
          message_count?: number;
          metadata?: Json;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          conversation_summary?: string;
          topic?: string | null;
          message_count?: number;
          metadata?: Json;
          timestamp?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'student' | 'teacher' | 'moderator' | 'admin';
      language: 'en' | 'am' | 'or' | 'ti';
      question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank';
      message_type: 'text' | 'file' | 'voice' | 'poll';
      notification_type: 'achievement' | 'reminder' | 'challenge' | 'message' | 'system' | 'streak' | 'exam';
      achievement_category: 'learning' | 'social' | 'streak' | 'quiz' | 'special';
      memory_type: 'conversation' | 'preference' | 'weak_topic' | 'strong_topic' | 'learning_style' | 'goal';
      difficulty_level: 'beginner' | 'intermediate' | 'advanced';
      battle_type: 'quiz_duel' | 'speed_challenge' | 'subject_battle' | 'tournament';
      battle_status: 'pending' | 'active' | 'completed' | 'cancelled';
      companion_type: 'owl' | 'robot' | 'dragon' | 'scientist' | 'wizard';
      group_role: 'member' | 'moderator' | 'admin';
      activity_type: 'reading' | 'quiz' | 'flashcard' | 'video' | 'ai_tutor';
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Subject = Database['public']['Tables']['subjects']['Row'];
export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type Question = Database['public']['Tables']['questions']['Row'];
export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];
export type Flashcard = Database['public']['Tables']['flashcards']['Row'];
export type StudyPlan = Database['public']['Tables']['study_plans']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];
export type StudyGroup = Database['public']['Tables']['study_groups']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Book = Database['public']['Tables']['books']['Row'];
export type AIMemory = Database['public']['Tables']['ai_memories']['Row'];
export type LearningProfile = Database['public']['Tables']['learning_profiles']['Row'];
export type Battle = Database['public']['Tables']['battles']['Row'];
export type AICompanion = Database['public']['Tables']['ai_companions']['Row'];
export type GroupMember = Database['public']['Tables']['group_members']['Row'];
export type StudySession = Database['public']['Tables']['study_sessions']['Row'];
export type StudentAnalytics = Database['public']['Tables']['student_analytics']['Row'];
export type RecentConversation = Database['public']['Tables']['recent_conversations']['Row'];
