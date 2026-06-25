import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Leaf,
  FlaskConical,
  Atom,
  BookOpen,
  Landmark,
  Globe,
  Laptop,
  ArrowRight,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Users,
  Star,
} from 'lucide-react';
import { GlassCard, Button, Badge, ProgressRing } from '../ui/GlassCard';
import { useAuth } from '../../contexts/AuthContext';

interface Subject {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  progress: number;
  quizzes: number;
  flashcards: number;
  hours: number;
  rank: string;
}

const subjects: Subject[] = [
  { id: 'mathematics', name: 'Mathematics', icon: Calculator, color: '#4F8CFF', description: 'Algebra, Geometry, Calculus', progress: 78, quizzes: 24, flashcards: 150, hours: 28, rank: 'A' },
  { id: 'biology', name: 'Biology', icon: Leaf, color: '#00D084', description: 'Cell Biology, Genetics, Ecology', progress: 65, quizzes: 18, flashcards: 120, hours: 22, rank: 'B+' },
  { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: '#7C4DFF', description: 'Chemical Reactions, Organic Chemistry', progress: 82, quizzes: 20, flashcards: 180, hours: 25, rank: 'A-' },
  { id: 'physics', name: 'Physics', icon: Atom, color: '#FF6B6B', description: 'Mechanics, Thermodynamics, Waves', progress: 71, quizzes: 16, flashcards: 100, hours: 18, rank: 'B' },
  { id: 'english', name: 'English', icon: BookOpen, color: '#FFA500', description: 'Literature, Grammar, Composition', progress: 90, quizzes: 22, flashcards: 85, hours: 20, rank: 'A' },
  { id: 'history', name: 'History', icon: Landmark, color: '#8B4513', description: 'World History, National History', progress: 48, quizzes: 12, flashcards: 60, hours: 12, rank: 'C+' },
  { id: 'geography', name: 'Geography', icon: Globe, color: '#20B2AA', description: 'Physical Geography, Human Geography', progress: 55, quizzes: 10, flashcards: 45, hours: 10, rank: 'B-' },
  { id: 'ict', name: 'ICT', icon: Laptop, color: '#4169E1', description: 'Computer Science, Digital Skills', progress: 88, quizzes: 15, flashcards: 95, hours: 15, rank: 'A' },
];

export function SubjectsPage() {
  const { profile } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Subjects</h1>
        <p className="text-gray-400">Explore and master all your subjects</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Subjects Active', value: 8, icon: BookOpen, color: 'primary' },
          { label: 'Total Quizzes', value: 137, icon: Trophy, color: 'accent' },
          { label: 'Study Hours', value: 150, icon: Clock, color: 'secondary' },
          { label: 'Average Score', value: '85%', icon: Target, color: 'success' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard hover>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${stat.color}/20`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard
              hover
              onClick={() => setSelectedSubject(subject)}
              className="group relative overflow-hidden"
            >
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition-opacity"
                style={{ backgroundColor: subject.color }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <subject.icon className="w-7 h-7" style={{ color: subject.color }} />
                  </div>
                  <Badge
                    variant={subject.progress >= 80 ? 'success' : subject.progress >= 60 ? 'warning' : 'danger'}
                  >
                    Rank {subject.rank}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{subject.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {subject.quizzes}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {subject.flashcards}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {subject.hours}h
                  </span>
                </div>

                <div className="relative pt-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{subject.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: subject.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <span className="text-sm text-gray-400">Continue Learning</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {selectedSubject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedSubject.color}20` }}
              >
                <selectedSubject.icon className="w-10 h-10" style={{ color: selectedSubject.color }} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedSubject.name}</h3>
                <p className="text-gray-400 mb-4">{selectedSubject.description}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Button variant="primary" icon={<Trophy className="w-4 h-4" />}>
                    Start Quiz
                  </Button>
                  <Button variant="outline" icon={<BookOpen className="w-4 h-4" />}>
                    Study Materials
                  </Button>
                  <Button variant="ghost" icon={<Users className="w-4 h-4" />}>
                    Join Group
                  </Button>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <ProgressRing progress={selectedSubject.progress} size={80} color={selectedSubject.color}>
                    <span className="text-lg font-bold text-white">{selectedSubject.progress}%</span>
                  </ProgressRing>
                  <p className="text-sm text-gray-400 mt-2">Mastery</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Recommended for You
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.filter(s => s.progress < 70).slice(0, 3).map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${subject.color}20` }}
              >
                <subject.icon className="w-6 h-6" style={{ color: subject.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{subject.name}</p>
                <p className="text-sm text-gray-400">Focus on improving this subject</p>
              </div>
              <Badge variant="warning">{subject.progress}%</Badge>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
