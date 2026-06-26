import React from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  Brain,
  Trophy,
  MessageCircle,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  GraduationCap,
  Database,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'ai-tutor', label: 'AI Tutor', icon: Brain },
  { id: 'quizzes', label: 'Quizzes', icon: Trophy },
  { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'community', label: 'Community', icon: MessageCircle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'study-plan', label: 'Study Plan', icon: Calendar },
];

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const displayName = profile?.full_name || 'Student';
  const greetings = ['Hello', 'Hey there', 'Welcome back', 'Good to see you'];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <div className="hidden md:flex w-16 lg:w-64 min-h-screen flex-col glass-nav fixed left-0 top-0 z-40">
        <div className="p-4 lg:p-6">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="hidden lg:block text-xl font-display font-bold gradient-text">
              Areka
            </span>
          </motion.div>
        </div>

        <nav className="flex-1 px-2 lg:px-4 py-4 space-y-1">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                ${currentPage === item.id
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block font-medium">{item.label}</span>
              {currentPage === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-8 bg-primary rounded-r-full hidden lg:block"
                />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="p-2 lg:p-4 border-t border-white/10">
          <button
            onClick={() => onNavigate('memory')}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 mb-2
              ${currentPage === 'memory'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <Database className="w-5 h-5" />
            <span className="hidden lg:block font-medium">AI Memory</span>
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 mb-2
              ${currentPage === 'settings'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <Settings className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Settings</span>
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-danger hover:bg-danger/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 md:ml-16 lg:ml-64">
        <header className="sticky top-0 z-30 glass-nav safe-top">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-white">
                  {greeting}, {displayName.split(' ')[0]}!
                </h1>
                <p className="text-sm text-gray-400">
                  Ready to learn something amazing today?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-40 lg:w-60"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl glass-hover"
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
                </button>

                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 glass-card"
                  >
                    <h3 className="text-white font-semibold mb-3">Notifications</h3>
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {[
                        { title: 'Daily Quiz Available', desc: 'Complete today\'s challenge for +50 XP', time: '2m ago' },
                        { title: 'Achievement Unlocked!', desc: 'Quick Learner badge earned', time: '1h ago' },
                        { title: 'Streak Reminder', desc: 'Keep your 12-day streak alive!', time: '3h ago' },
                      ].map((notif, i) => (
                        <div key={i} className="p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                          <div className="flex justify-between items-start">
                            <h4 className="text-white text-sm font-medium">{notif.title}</h4>
                            <span className="text-xs text-gray-500">{notif.time}</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">{notif.desc}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      View All Notifications
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-glow transition-shadow">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 pb-20 md:pb-6">
          {children}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 md:hidden glass-nav z-40 safe-bottom">
          <div className="flex justify-around py-2">
            {[
              { id: 'dashboard', icon: Home },
              { id: 'subjects', icon: BookOpen },
              { id: 'ai-tutor', icon: Brain },
              { id: 'memory', icon: Database },
              { id: 'settings', icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  p-3 rounded-xl transition-all duration-200
                  ${currentPage === item.id
                    ? 'text-primary bg-primary/20'
                    : 'text-gray-400 hover:text-white'}
                `}
              >
                <item.icon className="w-6 h-6" />
              </button>
            ))}
          </div>
        </nav>
      </div>

      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-72 h-full glass-nav p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold gradient-text">
                  Areka
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                    ${currentPage === item.id
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-danger hover:bg-danger/10 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
