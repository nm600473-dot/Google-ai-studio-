import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Target,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Brain,
  Trophy,
  BarChart3,
  Timer,
  Download,
} from 'lucide-react';
import { GlassCard, Button, Input, Badge, Modal, ProgressRing } from '../ui/GlassCard';
import { useAuth } from '../../contexts/AuthContext';

interface StudyDay {
  date: Date;
  subjects: {
    name: string;
    topic: string;
    duration: number;
    type: 'reading' | 'quiz' | 'revision' | 'practice';
    completed: boolean;
    xp: number;
  }[];
}

interface StudyPlan {
  id: string;
  title: string;
  examDate: Date;
  subjects: string[];
  dailyHours: number;
  schedule: StudyDay[];
  isActive: boolean;
}

const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  const endPadding = 42 - days.length;
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

const getDaysUntilExam = (examDate: Date) => {
  const today = new Date();
  const diff = examDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export function StudyPlanPage() {
  const { profile } = useAuth();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const examDate = new Date(today.getFullYear(), today.getMonth() + 2, 15);
  const daysUntilExam = getDaysUntilExam(examDate);

  const weeklyProgress = 72;
  const todayXP = 120;

  const calendarDays = generateCalendarDays(currentYear, currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const todaySchedule = [
    { time: '09:00', subject: 'Mathematics', topic: 'Quadratic Equations', duration: 1.5, type: 'reading', completed: true, xp: 25 },
    { time: '11:00', subject: 'Physics', topic: 'Newton\'s Laws', duration: 1, type: 'practice', completed: true, xp: 20 },
    { time: '14:00', subject: 'Chemistry', topic: 'Chemical Reactions', duration: 1.5, type: 'quiz', completed: false, xp: 30 },
    { time: '16:00', subject: 'Biology', topic: 'Cell Division', duration: 1, type: 'revision', completed: false, xp: 15 },
  ];

  const upcomingTasks = [
    { day: 'Tomorrow', tasks: ['Complete Physics Quiz', 'Review Chemistry Notes', 'Practice Math Problems'] },
    { day: 'Wednesday', tasks: ['Biology Flashcard Review', 'English Essay Draft'] },
    { day: 'Thursday', tasks: ['Mock Math Exam', 'Chemistry Lab Report'] },
  ];

  const stats = [
    { label: 'Days Until Exam', value: daysUntilExam, icon: Calendar, color: 'danger' },
    { label: 'Study Hours Today', value: 4, icon: Clock, color: 'primary' },
    { label: 'Tasks Completed', value: 6, icon: CheckCircle, color: 'accent' },
    { label: 'XP Earned Today', value: todayXP, icon: Trophy, color: 'warning' },
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isExamDay = (date: Date) => {
    return date.toDateString() === examDate.toDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Study Planner</h1>
          <p className="text-gray-400">Organize your learning for exam success</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export Plan
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
            Create Plan
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}/20`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{monthNames[currentMonth]} {currentYear}</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handlePrevMonth} icon={<ChevronLeft className="w-4 h-4" />} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentMonth(today.getMonth());
                    setCurrentYear(today.getFullYear());
                  }}
                >
                  Today
                </Button>
                <Button variant="ghost" size="sm" onClick={handleNextMonth} icon={<ChevronRight className="w-4 h-4" />} />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentMonth;
                const hasEvent = day.getDate() % 3 === 0 && isCurrentMonth;

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.005 }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square p-1 rounded-lg flex flex-col items-center justify-center transition-all relative
                      ${!isCurrentMonth ? 'text-gray-600' : 'text-gray-400 hover:bg-white/5'}
                      ${isToday(day) ? 'bg-primary/20 text-primary border border-primary/30' : ''}
                      ${isExamDay(day) ? 'bg-danger/20 text-danger border border-danger/30' : ''}
                      ${selectedDate?.toDateString() === day.toDateString() ? 'bg-secondary/20 text-secondary border border-secondary/30' : ''}
                    `}
                  >
                    <span className="text-sm font-medium">{day.getDate()}</span>
                    {hasEvent && !isExamDay(day) && !isToday(day) && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
                    )}
                    {isExamDay(day) && (
                      <AlertCircle className="absolute top-0.5 right-0.5 w-3 h-3 text-danger" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/30" />
                  <span className="text-gray-400">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger/20 border border-danger/30" />
                  <span className="text-gray-400">Exam Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  <span className="text-gray-400">Has Tasks</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="bg-gradient-to-br from-secondary/10 via-transparent to-primary/10 border-secondary/20">
            <div className="flex items-center gap-4">
              <ProgressRing
                progress={weeklyProgress}
                size={80}
                color="#7C4DFF"
              >
                <span className="text-lg font-bold text-white">{weeklyProgress}%</span>
              </ProgressRing>
              <div>
                <p className="text-sm text-gray-400">Weekly Goal</p>
                <p className="text-lg font-semibold text-white">{weeklyProgress}% Complete</p>
                <p className="text-xs text-gray-400 mt-1">+{todayXP} XP today</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Today's Schedule
            </h3>

            <div className="space-y-3">
              {todaySchedule.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-xl ${task.completed ? 'bg-accent/10 border border-accent/20' : 'bg-white/5 border border-white/10'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-gray-400">{task.time}</span>
                      <Badge variant="primary" size="sm">{task.subject}</Badge>
                    </div>
                    {task.completed && <CheckCircle className="w-4 h-4 text-accent" />}
                  </div>
                  <p className="text-sm text-white font-medium">{task.topic}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.duration}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-warning" />
                      +{task.xp} XP
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-secondary" />
            Upcoming Tasks
          </h3>
          <Button variant="ghost" size="sm" icon={<Sparkles className="w-4 h-4" />}>
            AI Suggestions
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {upcomingTasks.map((dayPlan, index) => (
            <motion.div
              key={dayPlan.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-white/5"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{dayPlan.day}</h4>
                <Badge variant="primary" size="sm">{dayPlan.tasks.length} tasks</Badge>
              </div>
              <ul className="space-y-2">
                {dayPlan.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {task}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Study Plan"
        size="lg"
      >
        <div className="space-y-4">
          <Input label="Plan Title" placeholder="e.g., Final Exam Preparation" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Exam Date" type="date" />
            <Input label="Daily Study Hours" type="number" placeholder="2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subjects to Focus On</label>
            <div className="flex flex-wrap gap-2">
              {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'ICT'].map(subject => (
                <Badge key={subject} variant="primary" className="cursor-pointer hover:bg-primary/30 transition-colors">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Weak Areas (Optional)</label>
            <textarea
              className="input-base h-24"
              placeholder="List topics you find challenging..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(false)}
              icon={<Sparkles className="w-4 h-4" />}
              className="flex-1"
            >
              Generate AI Plan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
