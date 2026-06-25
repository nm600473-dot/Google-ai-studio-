import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Trash2,
  Edit3,
  Save,
  X,
  AlertTriangle,
  BookOpen,
  Target,
  Trophy,
  Clock,
  TrendingUp,
  Settings,
  Shield,
  BarChart3,
  Calendar,
  Zap,
  RefreshCw,
  Clock3,
  Star,
  AlertCircle,
} from 'lucide-react';
import { GlassCard, Button, Badge, Tabs, ProgressRing } from '../ui/GlassCard';
import { useAIMemory, MemoryTopic, QuizRecord, Recommendation } from '../../contexts/AIMemoryContext';
import { useAuth } from '../../contexts/AuthContext';

type TabId = 'overview' | 'learning' | 'conversations' | 'preferences' | 'manage';

export function MemoryPage() {
  const { profile } = useAuth();
  const {
    loading,
    memories,
    learningProfile,
    recentConversations,
    weakTopics,
    strongTopics,
    quizHistory,
    updateDifficultyLevel,
    updateWeakTopic,
    updateStrongTopic,
    deleteMemory,
    clearConversationHistory,
    resetAllMemories,
    setPreferredStyle,
    setPreferredStudyTime,
    addStudyGoal,
    removeStudyGoal,
    addExamPreparation,
    removeExamPreparation,
    refreshMemories,
    generateRecommendations,
  } = useAIMemory();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MemoryTopic>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [newExam, setNewExam] = useState({ subject: '', date: '', type: 'mock' });
  const [showAddExam, setShowAddExam] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning', icon: <Target className="w-4 h-4" /> },
    { id: 'conversations', label: 'History', icon: <Clock3 className="w-4 h-4" /> },
    { id: 'preferences', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'manage', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
  ];

  const recommendations = useMemo(() => generateRecommendations(), [generateRecommendations]);

  const handleEditTopic = (topic: MemoryTopic, type: 'weak' | 'strong') => {
    setEditingTopicId(`${type}-${topic.id}`);
    setEditForm(topic);
  };

  const handleSaveEdit = async (type: 'weak' | 'strong') => {
    if (!editForm.name) return;

    const updatedTopic: MemoryTopic = {
      id: editForm.id || Date.now().toString(),
      name: editForm.name,
      mastery_level: editForm.mastery_level || 50,
      last_practiced: editForm.last_practiced || new Date().toISOString(),
      practice_count: editForm.practice_count || 0,
    };

    if (type === 'weak') {
      await updateWeakTopic(updatedTopic);
    } else {
      await updateStrongTopic(updatedTopic);
    }

    setEditingTopicId(null);
    setEditForm({});
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    await addStudyGoal(newGoal.trim());
    setNewGoal('');
  };

  const handleAddExam = async () => {
    if (!newExam.subject || !newExam.date) return;
    await addExamPreparation(newExam);
    setNewExam({ subject: '', date: '', type: 'mock' });
    setShowAddExam(false);
  };

  const handleResetAll = async () => {
    await resetAllMemories();
    setShowDeleteConfirm(false);
  };

  const averageMastery = useMemo(() => {
    const allTopics = [...weakTopics, ...strongTopics];
    if (allTopics.length === 0) return 0;
    const sum = allTopics.reduce((acc, t) => acc + t.mastery_level, 0);
    return Math.round(sum / allTopics.length);
  }, [weakTopics, strongTopics]);

  const totalPracticeSessions = useMemo(() => {
    return [...weakTopics, ...strongTopics].reduce((acc, t) => acc + t.practice_count, 0);
  }, [weakTopics, strongTopics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-glow">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">AI Memory Center</h1>
              <p className="text-gray-400">Manage your learning profile, preferences, and memory</p>
            </div>
          </div>

          <Button
            variant="secondary"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={refreshMemories}
          >
            Refresh
          </Button>
        </div>
      </motion.div>

      <GlassCard padding="sm">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
        />
      </GlassCard>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard hover>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{weakTopics.length}</p>
                      <p className="text-xs text-gray-400">Weak Areas</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard hover>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{strongTopics.length}</p>
                      <p className="text-xs text-gray-400">Strong Areas</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard hover>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{recentConversations.length}</p>
                      <p className="text-xs text-gray-400">Conversations</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard hover>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{quizHistory.length}</p>
                      <p className="text-xs text-gray-400">Quizzes Taken</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Learning Progress
                  </h3>

                  <div className="flex items-center justify-center py-6">
                    <ProgressRing
                      progress={averageMastery}
                      size={140}
                      strokeWidth={12}
                      color={averageMastery < 50 ? '#FF6B6B' : averageMastery < 70 ? '#FFA500' : '#00D084'}
                    >
                      <div className="text-center">
                        <p className="text-3xl font-bold text-white">{averageMastery}%</p>
                        <p className="text-xs text-gray-400">Avg Mastery</p>
                      </div>
                    </ProgressRing>
                  </div>

                  <div className="flex justify-around pt-4 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-xl font-bold text-primary">{totalPracticeSessions}</p>
                      <p className="text-xs text-gray-400">Practice Sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-accent">{memories.length}</p>
                      <p className="text-xs text-gray-400">Total Memories</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    Recommendations
                  </h3>

                  {recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {recommendations.slice(0, 5).map((rec, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 rounded-lg glass-hover"
                        >
                          <div className="flex items-start gap-3">
                            <Badge
                              variant={
                                rec.priority === 'high' ? 'danger' :
                                rec.priority === 'medium' ? 'warning' : 'secondary'
                              }
                              size="sm"
                            >
                              {rec.priority}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{rec.title}</p>
                              <p className="text-xs text-gray-400">{rec.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No recommendations yet</p>
                      <p className="text-xs text-gray-500">Complete some quizzes to get personalized suggestions</p>
                    </div>
                  )}
                </GlassCard>
              </div>

              {(learningProfile?.study_goals as string[])?.length > 0 && (
                <GlassCard>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-secondary" />
                    Study Goals
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(learningProfile?.study_goals as string[]).map((goal, i) => (
                      <Badge key={i} variant="primary" size="md">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="space-y-6">
              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  Weak Topics
                </h3>

                {weakTopics.length > 0 ? (
                  <div className="space-y-3">
                    {weakTopics.map((topic) => (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-lg glass-hover"
                      >
                        {editingTopicId === `weak-${topic.id}` ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                            />
                            <div className="flex items-center gap-4">
                              <label className="text-sm text-gray-400">Mastery:</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={editForm.mastery_level || 0}
                                onChange={(e) => setEditForm({ ...editForm, mastery_level: Number(e.target.value) })}
                                className="flex-1"
                              />
                              <span className="text-white font-medium">{editForm.mastery_level}%</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                icon={<Save className="w-4 h-4" />}
                                onClick={() => handleSaveEdit('weak')}
                              >
                                Save
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={<X className="w-4 h-4" />}
                                onClick={() => { setEditingTopicId(null); setEditForm({}); }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white font-medium">{topic.name}</span>
                                <Badge variant={topic.mastery_level < 30 ? 'danger' : 'warning'} size="sm">
                                  {topic.mastery_level}%
                                </Badge>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${topic.mastery_level}%` }}
                                  className={`h-full rounded-full ${
                                    topic.mastery_level < 30 ? 'bg-danger' :
                                    topic.mastery_level < 50 ? 'bg-warning' : 'bg-success'
                                  }`}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Practiced {topic.practice_count} times | Last: {new Date(topic.last_practiced).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleEditTopic(topic, 'weak')}
                              className="ml-4 p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No weak topics identified</p>
                    <p className="text-xs text-gray-500">Take quizzes to identify areas for improvement</p>
                  </div>
                )}
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Strong Topics
                </h3>

                {strongTopics.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {strongTopics.map((topic) => (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-lg glass-hover flex items-center justify-between"
                      >
                        <div>
                          <p className="text-white font-medium">{topic.name}</p>
                          <p className="text-xs text-gray-400">{topic.practice_count} practice sessions</p>
                        </div>
                        <Badge variant="success">{topic.mastery_level}%</Badge>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No strong topics yet</p>
                    <p className="text-xs text-gray-500">Keep learning to build your strengths!</p>
                  </div>
                )}
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Quiz History
                </h3>

                {quizHistory.length > 0 ? (
                  <div className="space-y-2">
                    {quizHistory.slice(0, 10).map((quiz, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{quiz.quiz_title}</p>
                          <p className="text-xs text-gray-400">{quiz.subject} | {new Date(quiz.date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={(quiz.score / quiz.total_points) >= 0.7 ? 'success' : 'warning'}>
                          {quiz.score}/{quiz.total_points}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No quiz history yet</p>
                    <p className="text-xs text-gray-500">Complete quizzes to track your progress</p>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {activeTab === 'conversations' && (
            <div className="space-y-6">
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock3 className="w-5 h-5 text-secondary" />
                    Recent Conversations
                  </h3>
                  {recentConversations.length > 0 && (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {recentConversations.length > 0 ? (
                  <div className="space-y-2">
                    {recentConversations.map((conv) => (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-lg glass-hover"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                            <Brain className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white font-medium truncate">
                                {conv.topic || 'General Discussion'}
                              </p>
                              {conv.message_count && (
                                <Badge variant="secondary" size="sm">{conv.message_count} msgs</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {conv.conversation_summary}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(conv.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No conversation history</p>
                    <p className="text-xs text-gray-500">Your AI Tutor conversations will be saved here</p>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-4">Learning Preferences</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Difficulty Level</label>
                    <div className="flex gap-2">
                      {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                        <Button
                          key={level}
                          variant={learningProfile?.difficulty_level === level ? 'primary' : 'secondary'}
                          onClick={() => updateDifficultyLevel(level)}
                          className="flex-1"
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Preferred Learning Style</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['visual', 'auditory', 'kinesthetic', 'reading'].map((style) => (
                        <Button
                          key={style}
                          variant={learningProfile?.preferred_style === style ? 'primary' : 'secondary'}
                          onClick={() => setPreferredStyle(style)}
                          className="capitalize"
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Preferred Study Time</label>
                    <select
                      value={learningProfile?.preferred_study_time || ''}
                      onChange={(e) => setPreferredStudyTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                    >
                      <option value="">Select preferred time</option>
                      <option value="morning">Morning (6AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 6PM)</option>
                      <option value="evening">Evening (6PM - 10PM)</option>
                      <option value="night">Night (10PM - 2AM)</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Study Goals</h3>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                    placeholder="Add a study goal..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
                  />
                  <Button variant="primary" onClick={handleAddGoal}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(learningProfile?.study_goals as string[])?.map((goal, i) => (
                    <Badge
                      key={i}
                      variant="primary"
                      size="md"
                      className="cursor-pointer hover:bg-primary/20"
                      onClick={() => removeStudyGoal(goal)}
                    >
                      {goal} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Exam Preparations
                  </h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddExam(true)}
                  >
                    Add Exam
                  </Button>
                </div>

                {showAddExam && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 p-4 rounded-lg glass"
                  >
                    <div className="grid md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={newExam.subject}
                        onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                        placeholder="Subject"
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      />
                      <input
                        type="date"
                        value={newExam.date}
                        onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      />
                      <select
                        value={newExam.type}
                        onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="mock">Mock Exam</option>
                        <option value="practice">Practice Test</option>
                        <option value="actual">Actual Exam</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button variant="secondary" size="sm" onClick={() => setShowAddExam(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleAddExam}>
                        Save
                      </Button>
                    </div>
                  </motion.div>
                )}

                {(learningProfile?.exam_preparations as Array<{ subject: string; date: string; type: string }>)?.length > 0 ? (
                  <div className="space-y-2">
                    {(learningProfile?.exam_preparations as Array<{ subject: string; date: string; type: string }>).map((exam, i) => {
                      const daysUntil = Math.ceil((new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-3 rounded-lg glass-hover"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{exam.subject}</p>
                              <p className="text-xs text-gray-400">
                                {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)} | {new Date(exam.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={daysUntil <= 7 ? 'danger' : daysUntil <= 30 ? 'warning' : 'secondary'}>
                              {daysUntil > 0 ? `${daysUntil} days` : 'Today'}
                            </Badge>
                            <button
                              onClick={() => removeExamPreparation(exam)}
                              className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-danger"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">No upcoming exams</p>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-6">
              <GlassCard className="border-warning/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Your Privacy Matters</h3>
                    <p className="text-sm text-gray-400">
                      The AI Memory system stores your learning preferences and conversation history to provide
                      personalized tutoring. Your data is protected by Row Level Security - only you can access
                      your memories. You have full control to view, edit, or delete your data at any time.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-4">Data Summary</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg glass">
                    <p className="text-sm text-gray-400 mb-1">Total AI Memories</p>
                    <p className="text-2xl font-bold text-white">{memories.length}</p>
                  </div>
                  <div className="p-4 rounded-lg glass">
                    <p className="text-sm text-gray-400 mb-1">Conversation Records</p>
                    <p className="text-2xl font-bold text-white">{recentConversations.length}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-4">Memory Types</h3>
                <div className="space-y-2">
                  {[
                    { type: 'conversation', label: 'Conversation Memories', count: memories.filter(m => m.memory_type === 'conversation').length },
                    { type: 'preference', label: 'Preference Settings', count: memories.filter(m => m.memory_type === 'preference').length },
                    { type: 'weak_topic', label: 'Weak Topic Records', count: memories.filter(m => m.memory_type === 'weak_topic').length },
                    { type: 'strong_topic', label: 'Strong Topic Records', count: memories.filter(m => m.memory_type === 'strong_topic').length },
                    { type: 'goal', label: 'Study Goals', count: memories.filter(m => m.memory_type === 'goal').length },
                  ].map((item) => (
                    <div key={item.type} className="flex items-center justify-between p-3 rounded-lg glass-hover">
                      <span className="text-white">{item.label}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="border-danger/30">
                <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg glass">
                    <div>
                      <p className="text-white font-medium">Clear Conversation History</p>
                      <p className="text-sm text-gray-400">Remove all AI tutor conversation records</p>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Clear
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg glass border border-danger/50">
                    <div>
                      <p className="text-white font-medium">Reset All AI Memory</p>
                      <p className="text-sm text-gray-400">Permanently delete all learning data, preferences, and conversations</p>
                    </div>
                    <Button
                      variant="danger"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Reset Everything
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="glass-card max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-danger/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-danger" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Reset AI Memory?</h3>
                  <p className="text-sm text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                This will permanently delete all your AI memory data, including:
              </p>

              <ul className="text-sm text-gray-400 space-y-1 mb-6">
                <li>• All conversation history</li>
                <li>• Learning preferences</li>
                <li>• Weak and strong topic records</li>
                <li>• Quiz history and practice data</li>
                <li>• Study goals and exam preparations</li>
              </ul>

              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleResetAll}>
                  Reset Everything
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
