import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Brain,
  Sparkles,
  ChevronRight,
  Zap,
  Star,
  Award,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GlassCard, Button, ProgressRing, Badge } from '../ui/GlassCard';
import { getLevelFromXP } from '../../types';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { profile } = useAuth();
  const [showConfetti, setShowConfetti] = React.useState(false);

  const levelInfo = getLevelFromXP(profile?.xp || 0);
  const xpProgress = ((profile?.xp || 0) / (levelInfo.xpRequired + (profile?.xp || 0))) * 100;

  const stats = [
    { label: 'Total XP', value: profile?.xp || 0, icon: Zap, color: 'text-primary', bgColor: 'bg-primary/20' },
    { label: 'Current Level', value: profile?.level || 1, icon: Star, color: 'text-accent', bgColor: 'bg-accent/20' },
    { label: 'Day Streak', value: profile?.streak || 0, icon: Flame, color: 'text-warning', bgColor: 'bg-warning/20' },
    { label: 'Study Hours', value: Math.floor(profile?.total_study_hours || 0), icon: Clock, color: 'text-secondary', bgColor: 'bg-secondary/20' },
  ];

  const recentActivity = [
    { type: 'quiz', title: 'Mathematics Quiz', score: '85%', time: '2 hours ago', xp: 45 },
    { type: 'flashcard', title: 'Physics Flashcards', count: 20, time: '4 hours ago', xp: 15 },
    { type: 'ai-tutor', title: 'Chemistry Session', duration: '30 min', time: 'Yesterday', xp: 25 },
    { type: 'reading', title: 'Biology Chapter 5', progress: '80%', time: 'Yesterday', xp: 20 },
  ];

  const quickActions = [
    { id: 'ai-tutor', label: 'Ask AI Tutor', icon: Brain, color: 'from-primary to-secondary' },
    { id: 'quizzes', label: 'Start Quiz', icon: Trophy, color: 'from-secondary to-accent' },
    { id: 'flashcards', label: 'Review Cards', icon: BookOpen, color: 'from-accent to-primary' },
    { id: 'community', label: 'Join Group', icon: Sparkles, color: 'from-warning to-danger' },
  ];

  const weeklyProgress = [
    { day: 'Mon', completed: true, xp: 120 },
    { day: 'Tue', completed: true, xp: 85 },
    { day: 'Wed', completed: true, xp: 150 },
    { day: 'Thu', completed: true, xp: 90 },
    { day: 'Fri', completed: true, xp: 200 },
    { day: 'Sat', completed: false, xp: 0 },
    { day: 'Sun', completed: false, xp: 0 },
  ];

  const todayXP = weeklyProgress
    .filter(d => d.day === new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3))[0]?.xp || 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <ProgressRing
              progress={xpProgress}
              size={120}
              strokeWidth={10}
              color="url(#gradient)"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F8CFF" />
                  <stop offset="100%" stopColor="#7C4DFF" />
                </linearGradient>
              </defs>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <span className="text-3xl font-bold gradient-text">{profile?.level || 1}</span>
                <span className="text-xs text-gray-400">Level</span>
              </motion.div>
            </ProgressRing>
          </div>

          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},{' '}
                {profile?.full_name?.split(' ')[0] || 'Student'}!
              </h1>
              <p className="text-gray-400 mb-4">
                {profile?.streak && profile.streak > 0
                  ? `You're on a ${profile.streak}-day learning streak! Keep it going! `
                  : 'Start your learning journey today! '}
                <span className="text-accent font-semibold">
                  {levelInfo.xpRequired - (profile?.xp || 0)} XP
                </span>{' '}
                until next level.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="accent" size="md">
                <Flame className="w-3 h-3 mr-1" />
                {profile?.streak || 0} Day Streak
              </Badge>
              <Badge variant="primary" size="md">
                <Award className="w-3 h-3 mr-1" />
                {levelInfo.title}
              </Badge>
              <Badge variant="secondary" size="md">
                <Star className="w-3 h-3 mr-1" />
                Rank #42
              </Badge>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <Button
              variant="primary"
              className="w-full md:w-auto"
              onClick={() => onNavigate('ai-tutor')}
              icon={<Brain className="w-4 h-4" />}
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover className="relative overflow-hidden group">
              <div
                className={`absolute -top-4 -right-4 w-20 h-20 ${stat.bgColor} rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity`}
              />
              <div className="relative">
                <div className={`p-2 rounded-lg ${stat.bgColor} inline-flex mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="stat-value"
                >
                  {stat.value.toLocaleString()}
                </motion.div>
                <p className="stat-label">{stat.label}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                This Week's Progress
              </h2>
              <Badge variant="accent">+{todayXP} XP Today</Badge>
            </div>

            <div className="flex justify-between items-end gap-2 h-40">
              {weeklyProgress.map((day, index) => {
                const maxXP = Math.max(...weeklyProgress.map(d => d.xp || 1));
                const height = day.xp ? (day.xp / maxXP) * 100 : 10;

                return (
                  <motion.div
                    key={day.day}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                    className="flex-1 flex flex-col items-center justify-end"
                  >
                    <motion.div
                      className={`w-full max-w-8 rounded-t-lg ${
                        day.completed
                          ? 'bg-gradient-to-t from-primary to-secondary'
                          : 'bg-white/10'
                      }`}
                      style={{ height: `${height}%`, minHeight: '8px' }}
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="mt-2 text-xs text-gray-400">{day.day}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-400">Weekly Goal Progress</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '71%' }}
                    transition={{ delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-white">5/7 days</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </h2>

            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  onClick={() => onNavigate(action.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl glass-hover group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="flex-1 text-left font-medium text-white group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Recent Activity
              </h2>
              <button className="text-sm text-primary hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'quiz' ? 'bg-primary/20 text-primary' :
                    activity.type === 'flashcard' ? 'bg-accent/20 text-accent' :
                    activity.type === 'ai-tutor' ? 'bg-secondary/20 text-secondary' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {activity.type === 'quiz' && <Trophy className="w-5 h-5" />}
                    {activity.type === 'flashcard' && <BookOpen className="w-5 h-5" />}
                    {activity.type === 'ai-tutor' && <Brain className="w-5 h-5" />}
                    {activity.type === 'reading' && <BookOpen className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-semibold">+{activity.xp} XP</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Subject Mastery
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Mathematics', progress: 78, color: '#4F8CFF' },
                { name: 'Physics', progress: 65, color: '#FF6B6B' },
                { name: 'Chemistry', progress: 82, color: '#7C4DFF' },
                { name: 'Biology', progress: 71, color: '#00D084' },
                { name: 'English', progress: 90, color: '#FFA500' },
              ].map((subject, index) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{subject.name}</span>
                    <span className="text-sm font-medium text-white">{subject.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ delay: index * 0.1 + 0.6, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('analytics')}
              className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              View Detailed Analytics
            </button>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard className="bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Daily Challenge Available!</h3>
              <p className="text-gray-400">
                Complete today's special challenge and earn <span className="text-accent font-bold">+100 XP</span> bonus!
              </p>
            </div>
            <Button
              variant="accent"
              onClick={() => onNavigate('quizzes')}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Start Challenge
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
