import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Trophy,
  Star,
  Flame,
  Calendar,
  Brain,
  BookOpen,
  CheckCircle,
  XCircle,
  Users,
  Medal,
  Crown,
  ChevronRight,
  Download,
  Filter,
} from 'lucide-react';
import { GlassCard, Button, Badge, Tabs, ProgressRing, Avatar } from '../ui/GlassCard';
import { useAuth } from '../../contexts/AuthContext';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  xp: number;
  streak: number;
  level: number;
  badges: number;
  change: number;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, userId: '1', name: 'Alex Johnson', xp: 12450, streak: 45, level: 28, badges: 15, change: 0 },
  { rank: 2, userId: '2', name: 'Sarah Chen', xp: 11200, streak: 38, level: 25, badges: 12, change: 1 },
  { rank: 3, userId: '3', name: 'Michael Park', xp: 10850, streak: 32, level: 24, badges: 14, change: -1 },
  { rank: 4, userId: '4', name: 'Emma Wilson', xp: 9500, streak: 28, level: 22, badges: 10, change: 2 },
  { rank: 5, userId: '5', name: 'James Lee', xp: 8900, streak: 25, level: 20, badges: 11, change: -1 },
  { rank: 6, userId: '6', name: 'Olivia Brown', xp: 8200, streak: 22, level: 19, badges: 9, change: 0 },
  { rank: 7, userId: '7', name: 'William Davis', xp: 7800, streak: 19, level: 18, badges: 8, change: 3 },
  { rank: 8, userId: '8', name: 'Sophia Martinez', xp: 7200, streak: 15, level: 17, badges: 7, change: -2 },
  { rank: 9, userId: '9', name: 'Benjamin Taylor', xp: 6900, streak: 12, level: 16, badges: 6, change: 1 },
  { rank: 10, userId: '10', name: 'Current User', xp: 5200, streak: 12, level: 12, badges: 5, change: 0 },
];

const weeklyData = [
  { day: 'Mon', hours: 2.5, quizzes: 3, xp: 120 },
  { day: 'Tue', hours: 1.8, quizzes: 2, xp: 85 },
  { day: 'Wed', hours: 3.2, quizzes: 4, xp: 150 },
  { day: 'Thu', hours: 2.1, quizzes: 2, xp: 90 },
  { day: 'Fri', hours: 2.8, quizzes: 3, xp: 200 },
  { day: 'Sat', hours: 4.1, quizzes: 5, xp: 180 },
  { day: 'Sun', hours: 1.5, quizzes: 1, xp: 40 },
];

const subjectPerformance = [
  { subject: 'Mathematics', score: 85, trend: 'up', quizzes: 24 },
  { subject: 'Physics', score: 78, trend: 'up', quizzes: 18 },
  { subject: 'Chemistry', score: 92, trend: 'up', quizzes: 20 },
  { subject: 'Biology', score: 71, trend: 'down', quizzes: 15 },
  { subject: 'English', score: 88, trend: 'up', quizzes: 22 },
];

type AnalyticsTab = 'overview' | 'leaderboard' | 'subjects';

export function AnalyticsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [timeRange, setTimeRange] = useState('week');

  const stats = [
    { label: 'Total XP', value: profile?.xp || 5200, change: '+12%', icon: Star, color: 'primary' },
    { label: 'Study Hours', value: 18.2, change: '+8%', icon: Clock, color: 'accent' },
    { label: 'Quizzes Done', value: 42, change: '+15%', icon: Trophy, color: 'secondary' },
    { label: 'Accuracy', value: '84%', change: '+5%', icon: Target, color: 'success' },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: 'from-yellow-400 to-amber-500', icon: Crown };
    if (rank === 2) return { color: 'from-gray-300 to-gray-400', icon: Medal };
    if (rank === 3) return { color: 'from-orange-400 to-orange-600', icon: Medal };
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Analytics</h1>
          <p className="text-gray-400">Track your learning journey</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            {['day', 'week', 'month'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm capitalize ${
                  timeRange === range ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
            { id: 'subjects', label: 'Subjects', icon: <BookOpen className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as AnalyticsTab)}
        />
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard hover>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <div className={`flex items-center gap-1 mt-2 text-sm ${
                        stat.change.startsWith('+') ? 'text-accent' : 'text-danger'
                      }`}>
                        {stat.change.startsWith('+') ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg bg-${stat.color}/20`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Weekly Activity
                </h3>

                <div className="h-48 flex items-end justify-between gap-2">
                  {weeklyData.map((day, index) => {
                    const maxHours = Math.max(...weeklyData.map(d => d.hours));
                    const height = (day.hours / maxHours) * 100;

                    return (
                      <motion.div
                        key={day.day}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex-1 flex flex-col items-center justify-end group"
                      >
                        <motion.div
                          className="w-full max-w-8 bg-gradient-to-t from-primary to-secondary rounded-t-lg relative cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {day.hours}h - {day.xp} XP
                          </div>
                        </motion.div>
                        <div className="mt-2 text-xs text-gray-400">{day.day}</div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">18.2h</p>
                    <p className="text-sm text-gray-400">Total Hours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">20</p>
                    <p className="text-sm text-gray-400">Quizzes Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-accent">865</p>
                    <p className="text-sm text-gray-400">XP Earned</p>
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
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Subject Performance
                </h3>

                <div className="space-y-4">
                  {subjectPerformance.map((subject, index) => (
                    <motion.div
                      key={subject.subject}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{subject.subject}</span>
                          <Badge variant="primary" size="sm">{subject.quizzes} quizzes</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">{subject.score}%</span>
                          {subject.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-accent" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-danger" />
                          )}
                        </div>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${subject.score >= 80 ? 'bg-accent' : subject.score >= 60 ? 'bg-warning' : 'bg-danger'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.score}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-secondary" />
                  Learning Breakdown
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Quiz Practice', value: 35, icon: Trophy, color: '#4F8CFF' },
                  { label: 'AI Tutor Sessions', value: 25, icon: Brain, color: '#7C4DFF' },
                  { label: 'Flashcard Reviews', value: 20, icon: BookOpen, color: '#00D084' },
                  { label: 'Reading Time', value: 20, icon: Clock, color: '#FFA500' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5"
                  >
                    <ProgressRing
                      progress={item.value}
                      size={56}
                      strokeWidth={5}
                      color={item.color}
                    >
                      <span className="text-sm font-bold text-white">{item.value}%</span>
                    </ProgressRing>
                    <div>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <p className="text-lg font-semibold text-white">{item.value}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}

      {activeTab === 'leaderboard' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Weekly Leaderboard
                </h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    This Week
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {leaderboardData.map((entry, index) => {
                  const isCurrentUser = entry.name === 'Current User';
                  const rankBadge = getRankBadge(entry.rank);

                  return (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isCurrentUser ? 'bg-primary/20 border border-primary/30' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {rankBadge ? (
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankBadge.color} flex items-center justify-center`}>
                            <rankBadge.icon className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-400">{entry.rank}</span>
                        )}
                      </div>

                      <Avatar fallback={entry.name} />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {entry.name}
                          {isCurrentUser && <span className="text-primary ml-2">(You)</span>}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Level {entry.level}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-warning" />
                            {entry.streak} days
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold gradient-text">{entry.xp.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">XP</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {entry.change > 0 && (
                          <Badge variant="success" size="sm">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {entry.change}
                          </Badge>
                        )}
                        {entry.change < 0 && (
                          <Badge variant="danger" size="sm">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {Math.abs(entry.change)}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-4">
            <GlassCard className="bg-gradient-to-br from-warning/10 via-transparent to-primary/10 border-warning/20">
              <div className="text-center">
                <Crown className="w-12 h-12 mx-auto text-warning mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Weekly Challenge</h3>
                <p className="text-sm text-gray-400 mb-4">Complete challenges to climb the leaderboard!</p>
                <Button variant="warning" className="w-full">
                  View Challenges
                </Button>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Your Rank</h3>
              <div className="text-center mb-4">
                <ProgressRing progress={72} size={120}>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold gradient-text">#10</span>
                    <span className="text-xs text-gray-400">Top 10%</span>
                  </div>
                </ProgressRing>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">XP to next rank</span>
                  <span className="text-white">1,700 XP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Daily streak</span>
                  <span className="text-white">{profile?.streak || 12} days</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectPerformance.map((subject, index) => (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${subject.score >= 80 ? 'rgba(0, 208, 132, 0.2)' : subject.score >= 60 ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 107, 107, 0.2)'} ` }}>
                    <BookOpen className={`w-6 h-6 ${subject.score >= 80 ? 'text-accent' : subject.score >= 60 ? 'text-warning' : 'text-danger'}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {subject.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-accent" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-danger" />
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{subject.subject}</h3>

                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="primary" size="sm">{subject.quizzes} quizzes</Badge>
                  <span className="text-sm text-gray-400">Avg: {subject.score}%</span>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${subject.score >= 80 ? 'bg-accent' : subject.score >= 60 ? 'bg-warning' : 'bg-danger'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.score}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                  />
                </div>

                <Button variant="ghost" size="sm" className="w-full mt-4" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
                  View Details
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
