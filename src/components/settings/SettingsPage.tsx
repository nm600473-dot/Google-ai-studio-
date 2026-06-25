import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Moon,
  Sun,
  Brain,
  Trash2,
  Download,
  ChevronRight,
  LogOut,
  HelpCircle,
  MessageCircle,
  Save,
  Camera,
} from 'lucide-react';
import { GlassCard, Button, Input, Badge, Avatar, Modal } from '../ui/GlassCard';
import { useAuth } from '../../contexts/AuthContext';

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'privacy' | 'memory' | 'help';

export function SettingsPage() {
  const { profile, updateProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    quizAvailable: true,
    achievement: true,
    streak: true,
    friendChallenge: true,
    examCountdown: true,
    weeklyReport: false,
  });
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    school: profile?.school_name || '',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'memory', label: 'AI Memory', icon: Brain },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const handleSaveProfile = async () => {
    await updateProfile({
      full_name: editData.fullName,
      school_name: editData.school,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-48 flex-shrink-0">
          <GlassCard padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </GlassCard>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" onClick={handleSaveProfile} icon={<Save className="w-4 h-4" />}>
                      Save
                    </Button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                  <div className="relative">
                    <Avatar
                      fallback={profile?.full_name || 'User'}
                      size="xl"
                    />
                    <button className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary text-white shadow-glow hover:bg-primary-400 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">{profile?.full_name}</h4>
                    <p className="text-gray-400">{profile?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="primary">{profile?.role || 'Student'}</Badge>
                      <Badge variant="accent">Level {profile?.level || 1}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={isEditing ? editData.fullName : profile?.full_name || ''}
                    onChange={e => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={isEditing ? editData.email : profile?.email || ''}
                    disabled
                  />

                  <Input
                    label="School"
                    value={isEditing ? editData.school : profile?.school_name || ''}
                    onChange={e => setEditData(prev => ({ ...prev, school: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your school name"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Language</label>
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className="input-base"
                      disabled={!isEditing}
                    >
                      <option value="en">English</option>
                      <option value="am">Amharic</option>
                      <option value="or">Afaan Oromo</option>
                      <option value="ti">Tigrinya</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-danger/5 border-danger/20">
                <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Delete Account
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {[
                    { key: 'dailyReminder', label: 'Daily Learning Reminder', desc: 'Get reminded to practice every day' },
                    { key: 'quizAvailable', label: 'New Quiz Available', desc: 'When new quizzes are added' },
                    { key: 'achievement', label: 'Achievement Unlocked', desc: 'When you earn a new badge or achievement' },
                    { key: 'streak', label: 'Streak Alert', desc: 'Warning when your streak is at risk' },
                    { key: 'friendChallenge', label: 'Friend Challenges', desc: 'When friends challenge you to battles' },
                    { key: 'examCountdown', label: 'Exam Countdown', desc: 'Reminders before scheduled exams' },
                    { key: 'weeklyReport', label: 'Weekly Progress Report', desc: 'Summary of your weekly learning' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                        className={`w-12 h-7 rounded-full transition-all relative ${
                          notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-white/20'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                          animate={{
                            left: notifications[item.key as keyof typeof notifications] ? '26px' : '4px',
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Appearance Settings
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5 text-secondary" /> : <Sun className="w-5 h-5 text-warning" />}
                      <div>
                        <p className="text-white font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-400">Use dark theme for better visibility</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-7 rounded-full transition-all relative ${
                        darkMode ? 'bg-primary' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                        animate={{ left: darkMode ? '26px' : '4px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-white font-medium mb-3">Accent Color</p>
                    <div className="flex gap-3">
                      {['#4F8CFF', '#7C4DFF', '#00D084', '#FF6B6B', '#FFA500'].map(color => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-full border-2 border-white/20 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Privacy & Security
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-400">Who can see your profile</p>
                    </div>
                    <select className="input-base w-auto">
                      <option>Everyone</option>
                      <option>Friends Only</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Leaderboard Appearance</p>
                      <p className="text-sm text-gray-400">Show your stats on leaderboards</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Data Collection</p>
                      <p className="text-sm text-gray-400">Help improve AI recommendations</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <Button variant="outline" icon={<Download className="w-4 h-4" />}>
                    Download My Data
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'memory' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-secondary" />
                  AI Memory Settings
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                    <div className="flex items-start gap-3">
                      <Brain className="w-6 h-6 text-secondary mt-1" />
                      <div>
                        <p className="text-white font-medium">About AI Memory</p>
                        <p className="text-sm text-gray-400 mt-1">
                          EduVerse AI remembers your learning preferences, weak topics, and study patterns to provide personalized recommendations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5">
                    <h4 className="text-white font-medium mb-3">What AI Remembers</h4>
                    <ul className="space-y-2">
                      {[
                        'Your strong and weak subjects',
                        'Preferred explanation style',
                        'Learning goals and objectives',
                        'Recent conversation topics',
                        'Quiz performance history',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="text-white font-medium">Memory Retention</p>
                      <p className="text-sm text-gray-400">How long to keep learning data</p>
                    </div>
                    <select className="input-base w-auto">
                      <option>Forever</option>
                      <option>6 months</option>
                      <option>3 months</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-danger/10 border border-danger/20">
                    <div>
                      <p className="text-white font-medium">Reset AI Memory</p>
                      <p className="text-sm text-gray-400">Clear all learned preferences</p>
                    </div>
                    <Button variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />}>
                      Clear Memory
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'help' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Help & Support
                </h3>

                <div className="space-y-4">
                  {[
                    { icon: MessageCircle, label: 'FAQ', desc: 'Frequently asked questions' },
                    { icon: HelpCircle, label: 'Contact Support', desc: 'Get help from our team' },
                    { icon: Globe, label: 'Community Forum', desc: 'Connect with other learners' },
                  ].map((item, index) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="p-2 rounded-lg bg-primary/20">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Having issues?</p>
                      <p className="text-white font-medium">Sign out and sign back in</p>
                    </div>
                    <Button variant="outline" icon={<LogOut className="w-4 h-4" />} onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to delete your account? This action cannot be undone and all your data including:
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-danger" />
              Learning progress and XP
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-danger" />
              Quiz results and achievements
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-danger" />
              Flashcards and study plans
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-danger" />
              AI memory and preferences
            </li>
          </ul>
          <div className="flex gap-4 pt-4">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(false)} className="flex-1">
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
