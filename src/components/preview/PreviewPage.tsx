import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Flame,
  Star,
  Play,
  ArrowRight,
  Check,
  Sparkles,
  GraduationCap,
  Zap,
  Timer,
  Medal,
  BarChart3,
  MessageSquare,
  Library,
  Layers,
  ChevronRight,
  Quote,
  Heart,
} from 'lucide-react';
import { GlassCard, Button, Badge, ProgressRing } from '../ui/GlassCard';

interface PreviewPageProps {
  onGetStarted: () => void;
}

export function PreviewPage({ onGetStarted }: PreviewPageProps) {
  const [activeDemo, setActiveDemo] = useState<'ai' | 'quiz' | 'library' | 'progress'>('ai');
  const [animatedStats, setAnimatedStats] = useState({ students: 0, lessons: 0, quizzes: 0, hours: 0 });

  useEffect(() => {
    const targets = { students: 50000, lessons: 1200, quizzes: 8500, hours: 250000 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        students: Math.floor(targets.students * progress),
        lessons: Math.floor(targets.lessons * progress),
        quizzes: Math.floor(targets.quizzes * progress),
        hours: Math.floor(targets.hours * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Tutoring',
      description: 'Personalized explanations that adapt to your learning style and pace',
      color: 'from-primary to-secondary',
    },
    {
      icon: Trophy,
      title: 'Gamified Learning',
      description: 'Earn XP, unlock achievements, and compete on leaderboards',
      color: 'from-accent to-warning',
    },
    {
      icon: Target,
      title: 'Smart Quizzes',
      description: 'Adaptive assessments that target your weak areas',
      color: 'from-secondary to-primary',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your learning journey with detailed insights',
      color: 'from-success to-accent',
    },
    {
      icon: BookOpen,
      title: 'Rich Library',
      description: 'Access thousands of curated educational resources',
      color: 'from-warning to-danger',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Learn together with study groups and peer support',
      color: 'from-primary to-accent',
    },
  ];

  const stats = [
    { value: animatedStats.students.toLocaleString() + '+', label: 'Active Students', icon: Users },
    { value: animatedStats.lessons.toLocaleString() + '+', label: 'Video Lessons', icon: BookOpen },
    { value: animatedStats.quizzes.toLocaleString() + '+', label: 'Practice Questions', icon: Trophy },
    { value: animatedStats.hours.toLocaleString() + '+', label: 'Learning Hours', icon: Timer },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'High School Senior',
      content: 'Areka helped me improve my math grade from C to A in just two months. The AI tutor explains things in a way that finally makes sense!',
      avatar: 'S',
    },
    {
      name: 'James K.',
      role: 'College Student',
      content: 'The gamification keeps me motivated. I love competing on the leaderboard while actually learning useful material.',
      avatar: 'J',
    },
    {
      name: 'Emily R.',
      role: 'Parent',
      content: 'My daughter used to hate studying. Now she asks to use Areka every day. The progress tracking helps me stay involved too.',
      avatar: 'E',
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20" />

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="accent" size="md" className="mb-6">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Learning Platform
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6">
                <span className="text-white">Learn Smarter, </span>
                <span className="gradient-text">Not Harder</span>
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Transform your educational journey with personalized AI tutoring,
                adaptive quizzes, and gamified learning that keeps you engaged.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onGetStarted}
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Start Learning Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Play className="w-5 h-5" />}
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          >
            {stats.map((stat, i) => (
              <GlassCard key={i} className="text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </GlassCard>
            ))}
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="glass-card p-4 lg:p-6 rounded-2xl overflow-hidden">
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary/30 transition-colors"
                      onClick={() => {}}
                    >
                      <Play className="w-10 h-10 text-primary" fill="currentColor" />
                    </motion.div>
                    <p className="text-gray-400">Click to watch platform demo</p>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-8 left-8 glass rounded-xl p-3 flex items-center gap-2"
                >
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-sm text-white">AI Tutor</span>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-8 right-8 glass rounded-xl p-3 flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5 text-warning" />
                  <span className="text-sm text-white">+50 XP</span>
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute top-1/2 right-12 glass rounded-full p-2"
                >
                  <Star className="w-4 h-4 text-accent" fill="currentColor" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Experience the Platform
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Try our interactive demos to see how Areka transforms learning
            </p>
          </motion.div>

          {/* Demo Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'ai', label: 'AI Tutor', icon: MessageSquare },
              { id: 'quiz', label: 'Quiz Demo', icon: Trophy },
              { id: 'library', label: 'Library', icon: Library },
              { id: 'progress', label: 'Progress', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDemo(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  activeDemo === tab.id
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Demo Content */}
          <GlassCard className="min-h-[400px] lg:min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeDemo === 'ai' && <AITutorDemo />}
                {activeDemo === 'quiz' && <QuizDemo />}
                {activeDemo === 'library' && <LibraryDemo />}
                {activeDemo === 'progress' && <ProgressDemo />}
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive tools designed to make learning effective and enjoyable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover className="h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Loved by Learners
            </h2>
            <p className="text-gray-400 text-lg">
              See what students and parents are saying about Areka
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="h-full">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-gray-300 mb-6">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="text-center bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 border-primary/30">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-glow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Start Your Learning Journey
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students who are already learning smarter with Areka.
                Get started free today.
              </p>
              <Button
                variant="accent"
                size="lg"
                onClick={onGetStarted}
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Create Free Account
              </Button>
              <p className="text-sm text-gray-400 mt-4">
                No credit card required. Start learning in minutes.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// AI Tutor Demo Component
function AITutorDemo() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI Tutor. Try asking me about any topic - I'll break it down step by step!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    'Explain photosynthesis',
    'How does gravity work?',
    'Teach me algebra basics',
  ];

  const handleSuggestion = async (suggestion: string) => {
    setInput(suggestion);
    setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Great question! Let me explain **${suggestion.toLowerCase()}** step by step:\n\n**Step 1:** First, let's understand the basic concept...\n\n**Step 2:** Now we'll look at how it works in practice...\n\n**Key Takeaway:** This is the most important point to remember!\n\nWould you like me to go deeper into any part?`
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[400px] lg:h-[500px]">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
        <Brain className="w-5 h-5 text-primary" />
        <span className="font-medium text-white">AI Tutor Demo</span>
        <Badge variant="success" size="sm">Live</Badge>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 ${
              msg.role === 'user' ? 'bg-primary text-white' : 'glass'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl p-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSuggestion(s)}
            className="px-3 py-1.5 rounded-full text-sm bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
            disabled={isTyping}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// Quiz Demo Component
function QuizDemo() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = {
    text: 'What is the chemical formula for water?',
    options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correct: 0,
    explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, giving it the formula H2O.',
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const reset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
        <Trophy className="w-5 h-5 text-warning" />
        <span className="font-medium text-white">Quiz Demo</span>
        <Badge variant="warning" size="sm">Science</Badge>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-medium text-white mb-6">{question.text}</h3>

        <div className="space-y-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => !showResult && handleAnswer(i)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                showResult
                  ? i === question.correct
                    ? 'border-success bg-success/10 text-success'
                    : i === selectedAnswer
                    ? 'border-danger bg-danger/10 text-danger'
                    : 'border-white/10 text-gray-400'
                  : 'border-white/10 hover:border-primary/50 hover:bg-white/5 text-white'
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {option}
              {showResult && i === question.correct && (
                <Check className="w-5 h-5 inline ml-2" />
              )}
            </button>
          ))}
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-white/5"
          >
            <p className="text-gray-300">{question.explanation}</p>
            <Button variant="outline" size="sm" onClick={reset} className="mt-4">
              Try Another
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Library Demo Component
function LibraryDemo() {
  const subjects = [
    { name: 'Mathematics', books: 245, color: '#4F8CFF', icon: Target },
    { name: 'Science', books: 189, color: '#00D084', icon: Brain },
    { name: 'History', books: 156, color: '#FFA500', icon: BookOpen },
    { name: 'Literature', books: 134, color: '#7C4DFF', icon: Library },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
        <Library className="w-5 h-5 text-accent" />
        <span className="font-medium text-white">Library Demo</span>
        <Badge variant="accent" size="sm">724 Resources</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {subjects.map((subject, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: subject.color + '20' }}>
                <subject.icon className="w-5 h-5" style={{ color: subject.color }} />
              </div>
              <span className="font-medium text-white">{subject.name}</span>
            </div>
            <p className="text-sm text-gray-400">{subject.books} resources</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Featured</h4>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h5 className="font-medium text-white">Introduction to Algebra</h5>
              <p className="text-sm text-gray-400">Master the fundamentals of algebraic thinking</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="primary" size="sm">Beginner</Badge>
                <span className="text-xs text-gray-400">12 lessons</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Progress Demo Component
function ProgressDemo() {
  const weeklyXP = [
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 85 },
    { day: 'Wed', xp: 150 },
    { day: 'Thu', xp: 90 },
    { day: 'Fri', xp: 200 },
    { day: 'Sat', xp: 45 },
    { day: 'Sun', xp: 0 },
  ];

  const maxXP = Math.max(...weeklyXP.map(d => d.xp));

  const subjects = [
    { name: 'Mathematics', progress: 78, color: '#4F8CFF' },
    { name: 'Science', progress: 65, color: '#00D084' },
    { name: 'English', progress: 82, color: '#FFA500' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
        <BarChart3 className="w-5 h-5 text-primary" />
        <span className="font-medium text-white">Progress Demo</span>
        <Badge variant="success" size="sm">+450 XP This Week</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <ProgressRing progress={72} size={80} strokeWidth={6}>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">72</span>
              <span className="text-xs text-gray-400">Level</span>
            </div>
          </ProgressRing>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <Flame className="w-5 h-5 text-warning mx-auto mb-1" />
          <div className="text-xl font-bold text-white">7</div>
          <p className="text-xs text-gray-400">Day Streak</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <Medal className="w-5 h-5 text-accent mx-auto mb-1" />
          <div className="text-xl font-bold text-white">15</div>
          <p className="text-xs text-gray-400">Badges</p>
        </div>
      </div>

      <h4 className="text-sm font-medium text-gray-400 mb-3">Weekly Activity</h4>
      <div className="flex items-end gap-2 h-24 mb-6">
        {weeklyXP.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(day.xp / maxXP) * 100}%` }}
              transition={{ delay: i * 0.1 }}
              className="w-full max-w-8 bg-gradient-to-t from-primary to-secondary rounded-t-lg"
              style={{ minHeight: '4px' }}
            />
            <span className="text-xs text-gray-400 mt-1">{day.day}</span>
          </div>
        ))}
      </div>

      <h4 className="text-sm font-medium text-gray-400 mb-3">Subject Mastery</h4>
      <div className="space-y-3">
        {subjects.map((subject, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-white">{subject.name}</span>
              <span className="text-sm text-gray-400">{subject.progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${subject.progress}%` }}
                transition={{ delay: i * 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: subject.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreviewPage;
