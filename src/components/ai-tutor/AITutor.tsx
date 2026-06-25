import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  Trophy,
  Target,
  HelpCircle,
  MessageSquare,
  Wand2,
  Mic,
  MicOff,
  Image,
  FileText,
  Lightbulb,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Volume2,
  VolumeX,
  ChevronDown,
  GraduationCap,
  Clock,
  AlertTriangle,
  TrendingUp,
  History,
  X,
  Upload,
  Loader2,
  Check,
  Play,
  Pause,
  Eye,
  EyeOff,
  Settings,
  Zap,
} from 'lucide-react';
import { GlassCard, Button, Badge, Tabs } from '../ui/GlassCard';
import { useAuth } from '../../contexts/AuthContext';
import { useAIMemory } from '../../contexts/AIMemoryContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'explanation' | 'quiz' | 'flashcard' | 'example' | 'summary' | 'recommendation';
  isStreaming?: boolean;
  showHint?: boolean;
  hintContent?: string;
  attachments?: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
}

type TutorMode = 'teach' | 'quiz' | 'exam' | 'revision' | 'socratic' | 'homework';
type ExplanationLevel = 'simple' | 'standard' | 'detailed' | 'exam';

const modes: { id: TutorMode; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'teach', label: 'Teach Me', icon: <GraduationCap className="w-4 h-4" />, description: 'Step-by-step explanations' },
  { id: 'quiz', label: 'Quiz Me', icon: <Trophy className="w-4 h-4" />, description: 'Test your knowledge' },
  { id: 'exam', label: 'Exam Mode', icon: <Target className="w-4 h-4" />, description: 'Exam-style questions' },
  { id: 'revision', label: 'Revision', icon: <BookOpen className="w-4 h-4" />, description: 'Quick summaries' },
  { id: 'socratic', label: 'Socratic', icon: <HelpCircle className="w-4 h-4" />, description: 'Learn through questions' },
  { id: 'homework', label: 'Homework', icon: <MessageSquare className="w-4 h-4" />, description: 'Guided homework help' },
];

const explanationLevels: { id: ExplanationLevel; label: string; description: string }[] = [
  { id: 'simple', label: 'Simple', description: 'Basic concepts, easy language' },
  { id: 'standard', label: 'Standard', description: 'Balanced depth and clarity' },
  { id: 'detailed', label: 'Detailed', description: 'In-depth with examples' },
  { id: 'exam', label: 'Exam Focus', description: 'Keywords and mark schemes' },
];

export function AITutor() {
  const { profile } = useAuth();
  const {
    learningProfile,
    recentConversations,
    weakTopics,
    saveConversationMemory,
    clearConversationHistory,
    getConversationContext,
    getPersonalizedGreeting,
    getTopicsNeedingReview,
    generateRecommendations,
    updateWeakTopic,
  } = useAIMemory();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<TutorMode>('teach');
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('standard');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showHint, setShowHint] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const recommendations = useMemo(() => {
    const recs = generateRecommendations();
    return recs;
  }, [generateRecommendations]);

  const topicsNeedingReview = useMemo(() => getTopicsNeedingReview(), [getTopicsNeedingReview]);

  // Speech recognition setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Welcome message on load
  useEffect(() => {
    if (profile) {
      const greeting = getPersonalizedGreeting();
      const contextInfo = getConversationContext();

      const memoryIntro = contextInfo
        ? '\n\nI remember our previous discussions and I know your learning preferences. I\'ll adapt my teaching style accordingly!'
        : '';

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `${greeting}${memoryIntro}\n\nI can help you with:\n• **Explanations** - Concepts broken down step-by-step\n• **Quizzes** - Test your understanding\n• **Flashcards** - Quick revision cards\n• **Problem solving** - Guided homework help\n• **Exam prep** - Practice with mark schemes\n\nWhat would you like to explore today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [profile, getPersonalizedGreeting, getConversationContext]);

  // Text-to-speech
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, '').replace(/[#*`]/g, ''));
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onend = () => setIsSpeaking(false);

      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Voice input toggle
  const toggleListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    if (!isListening) {
      recognition.start();
      setIsListening(true);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // File handling
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment: FileAttachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          preview: file.type.startsWith('image/') ? e.target?.result as string : undefined,
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  // Generate AI response (simulated for demo)
  const generateResponse = useCallback(async (userMessage: string): Promise<string> => {
    const difficultyLevel = learningProfile?.difficulty_level || 'intermediate';
    const preferredStyle = learningProfile?.preferred_style || 'visual';
    const topic = detectTopicFromMessage(userMessage);

    // Simulated streaming delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const responses: Record<TutorMode, () => string> = {
      teach: () => {
        const styleAdaptation = getStyleAdaptation(preferredStyle);
        const difficultyNote = getDifficultyNote(difficultyLevel);

        return `Great question! Let me explain this step-by-step:\n\n**Concept Overview**\nUnderstanding this topic requires breaking it down into key components.\n\n**Key Points:**\n• First principle: Foundation understanding\n• Second component: Intermediate concepts\n• Third element: Advanced applications\n\n**Practical Example:**\nLet's apply this to a real-world scenario to solidify your understanding...\n\n${weakTopics.length > 0 ? `*Based on your learning history, let's focus on ${weakTopics[0].name}.*\n\n` : ''}Would you like me to dive deeper into any of these areas?\n\n${styleAdaptation}\n${difficultyNote}`;
      },

      quiz: () => {
        return `Here's a quiz question for you:\n\n**Question:** What is the primary function of the mitochondria in a cell?\n\n**A)** Protein synthesis\n**B)** Energy production (ATP)\n**C)** Cell division\n**D)** Waste removal\n\n**Hint:** ${showHint === 'current' ? 'Think about the "powerhouse of the cell"!' : 'Press the hint button if you need a clue.'}\n\nTake your time to think about it. When you're ready, tell me your answer and I'll explain why it's correct.\n\n*I've adjusted this quiz to your ${difficultyLevel} level.*`;
      },

      exam: () => {
        return `**Exam-Style Question:**\n\nExplain the relationship between force, mass, and acceleration as described by Newton's second law of motion. Include a practical example. (5 marks)\n\n**Marking Scheme:**\n• Correct formula statement (1 mark)\n• Explanation of relationship (1 mark)\n• Practical example (2 marks)\n• Clear scientific terminology (1 mark)\n\n**Model Answer (reveal after attempting):**\n${showHint === 'current' ? `F = ma is the fundamental equation. Force equals mass times acceleration. Example: A 1000kg car accelerating at 2m/s² requires 2000N of force.` : '*Try writing your answer first, then I\'ll show you the model response.*'}`;
      },

      revision: () => {
        return `**Quick Revision Summary:**\n\n📌 **Key Concept:** This topic involves three main processes:\n\n1. **Process A** - The starting phase where initial conditions are set\n2. **Process B** - The transformation stage where change occurs\n3. **Process C** - The final output with results\n\n**Remember:** Use the mnemonic **ABC** to recall: Always Be Curious!\n\n${topicsNeedingReview.length > 0 ? `**Focus Area:** Based on your history, pay attention to ${topicsNeedingReview[0].name}.\n\n` : ''}**Common Exam Questions:**\n- Define and explain each process\n- Compare and contrast approaches\n- Apply to real-world scenarios\n\nNeed more details on any specific part?`;
      },

      socratic: () => {
        return `Interesting question! Let me guide you to discover the answer yourself:\n\n**Question 1:** What do you already know about this topic?\n\nThink about the basic principles involved. What patterns do you notice?\n\n**Follow-up:** If we consider the fundamental rules that govern this area, what predictions can we make?\n\n${weakTopics.length > 0 ? `*Hint: Think back to our discussions about ${weakTopics[0].name}. How might that connect?*\n\n` : ''}Try to answer these, and I'll help you build your understanding step by step.`;
      },

      homework: () => {
        return `I can help you with this homework problem! Let me guide you through it:\n\n**Step 1:** First, identify what we're solving for. Read the problem carefully.\n\n**Step 2:** List the known information and what we need to find.\n\n**Hint:** Think about which formula or method applies here. ${weakTopics.length > 0 ? `I remember you found ${weakTopics[0].name} challenging - this problem actually reinforces that concept.` : 'What concepts from your recent lessons might be relevant?'}\n\n**Guiding Question:** What would be your first step in approaching this?\n\nTake a moment to try it yourself. Tell me your approach, and I'll provide feedback.`;
      },
    };

    return responses[mode]();
  }, [mode, learningProfile, weakTopics, topicsNeedingReview, showHint]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    if (isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    try {
      const responseContent = await generateResponse(input);
      const topic = detectTopicFromMessage(input);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        type: mode === 'quiz' || mode === 'exam' ? 'quiz' : 'explanation',
      };

      setMessages(prev => [...prev, aiMessage]);

      await saveConversationMemory(
        input,
        topic || undefined,
        { mode, message_count: 2 }
      );

      if (topic && weakTopics.length > 0) {
        const relevantWeak = weakTopics.find(t =>
          t.name.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(t.name.toLowerCase())
        );
        if (relevantWeak) {
          updateWeakTopic({
            ...relevantWeak,
            practice_count: relevantWeak.practice_count + 1,
            last_practiced: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper functions
  const detectTopicFromMessage = (message: string): string | null => {
    const topics = [
      'algebra', 'calculus', 'geometry', 'mathematics',
      'photosynthesis', 'cell biology', 'genetics', 'biology',
      'chemical reactions', 'periodic table', 'chemistry',
      'newton', 'force', 'energy', 'physics',
      'grammar', 'literature', 'english',
      'revolution', 'history',
    ];

    const lowerMessage = message.toLowerCase();
    for (const topic of topics) {
      if (lowerMessage.includes(topic)) {
        return topic.charAt(0).toUpperCase() + topic.slice(1);
      }
    }
    return null;
  };

  const getStyleAdaptation = (style: string): string => {
    const adaptations: Record<string, string> = {
      visual: '*Visual learners: Try to picture each concept as a diagram or flowchart...*',
      auditory: '*Auditory learners: Try reading this aloud to yourself...*',
      kinesthetic: '*Kinesthetic learners: Consider working through examples with pen and paper...*',
      reading: '*Reading learners: Write out the key points in your own words...*',
    };
    return adaptations[style] || '';
  };

  const getDifficultyNote = (level: string): string => {
    const notes: Record<string, string> = {
      beginner: '*Breaking this down into simple, easy-to-grasp pieces...*',
      intermediate: '*Let me explain this with a balance of depth and clarity...*',
      advanced: '*Providing a nuanced, sophisticated analysis...*',
    };
    return notes[level] || '';
  };

  // Quick actions
  const quickActions = [
    { icon: BookOpen, label: 'Generate Flashcards', action: () => setInput('Generate flashcards for: ') },
    { icon: Trophy, label: 'Create Practice Quiz', action: () => setInput('Create a practice quiz on: ') },
    { icon: Target, label: 'Summarize Topic', action: () => setInput('Summarize the topic: ') },
    { icon: HelpCircle, label: 'Explain Concept', action: () => setInput('Explain the concept of: ') },
  ];

  // Copy to clipboard
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // Clear history
  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all conversation history?')) {
      await clearConversationHistory();
      if (profile) {
        const freshMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Hello ${profile.full_name?.split(' ')[0] || 'there'}! I'm your AI Tutor, ready to help you learn. What would you like to explore today?`,
          timestamp: new Date(),
        };
        setMessages([freshMessage]);
      }
    }
  };

  // Render message content with formatting
  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={i} className="text-primary block mb-2">{line.slice(2, -2)}</strong>;
      }
      if (line.startsWith('• ')) {
        return <li key={i} className="ml-4 text-gray-300 list-disc">{line.slice(2)}</li>;
      }
      if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={i} className="text-sm text-gray-400 italic">{line.slice(1, -1)}</p>;
      }
      if (line.startsWith('**A)**') || line.startsWith('**B)**') || line.startsWith('**C)**') || line.startsWith('**D)**')) {
        return (
          <p key={i} className="my-1">
            <strong className="text-accent">{line.slice(2, 4)}</strong>{line.slice(4)}
          </p>
        );
      }
      return <p key={i} className={`text-gray-200 ${i > 0 ? 'mt-2' : ''}`}>{line}</p>;
    });
  };

  // Suggested questions
  const personalizedSuggestions = useMemo(() => {
    const suggestions = [
      'Explain photosynthesis in simple terms',
      'Help me solve: 3x + 5 = 14',
      'What is Newton\'s first law?',
      'Create a quiz about the human heart',
      'Summarize the French Revolution',
    ];

    if (weakTopics.length > 0) {
      const weakTopic = weakTopics[Math.floor(Math.random() * weakTopics.length)];
      suggestions.unshift(`Help me understand ${weakTopic.name} better`);
    }

    if (topicsNeedingReview.length > 0) {
      suggestions.unshift(`Quiz me on ${topicsNeedingReview[0].name}`);
    }

    return suggestions.slice(0, 6);
  }, [weakTopics, topicsNeedingReview]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <GlassCard padding="sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: isTyping ? 360 : 0 }}
                transition={{ duration: 2, repeat: isTyping ? Infinity : 0, ease: 'linear' }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow"
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-white">AI Tutor</h1>
                <p className="text-sm text-gray-400">
                  {learningProfile ? `Level: ${learningProfile.difficulty_level}` : 'Personalized learning'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tabs
                tabs={modes.map(m => ({ id: m.id, label: m.label, icon: m.icon }))}
                activeTab={mode}
                onChange={(id) => setMode(id as TutorMode)}
              />

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
              >
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Explanation Level</label>
                    <div className="flex gap-2">
                      {explanationLevels.map(level => (
                        <button
                          key={level.id}
                          onClick={() => setExplanationLevel(level.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                            explanationLevel === level.id
                              ? 'bg-primary text-white'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-gray-400 mt-3 hidden lg:block"
            >
              {modes.find(m => m.id === mode)?.description}
            </motion.p>
          </AnimatePresence>
        </GlassCard>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <GlassCard className="flex-1 flex flex-col overflow-hidden" padding="sm">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[70%] ${
                        message.role === 'user'
                          ? 'message-bubble message-bubble-sent'
                          : 'glass rounded-2xl rounded-bl-sm p-4'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-primary font-medium">AI Tutor</span>
                          {learningProfile && (
                            <Badge variant="accent" size="sm" className="ml-auto">
                              {learningProfile.difficulty_level}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Attachments preview */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {message.attachments.map(att => (
                            att.preview ? (
                              <img key={att.id} src={att.preview} alt={att.name} className="w-16 h-16 rounded-lg object-cover" />
                            ) : (
                              <div key={att.id} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{att.name}</span>
                              </div>
                            )
                          ))}
                        </div>
                      )}

                      <div className="text-white whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                        {renderMessageContent(message.content)}
                      </div>

                      {/* Message Actions */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                        {message.role === 'assistant' && (
                          <>
                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCopy(message.content)}
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => isSpeaking ? stopSpeaking() : speak(message.content)}
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            >
                              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            {mode === 'quiz' || mode === 'exam' ? (
                              <button
                                onClick={() => setShowHint(showHint === message.id ? null : message.id)}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-warning"
                              >
                                <Lightbulb className="w-4 h-4" />
                              </button>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Brain className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              {/* Suggestions */}
              <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
                {personalizedSuggestions.slice(0, 4).map((suggestion, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setInput(suggestion)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {attachments.map(att => (
                    <div key={att.id} className="relative group">
                      {att.preview ? (
                        <img src={att.preview} alt={att.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm truncate max-w-[100px]">{att.name}</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input with buttons */}
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg glass-hover"
                    title="Upload files"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg glass-hover"
                    title="Add image"
                  >
                    <Image className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-lg glass-hover ${isListening ? 'text-primary' : ''}`}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask anything... (Shift+Enter for new line)"
                    rows={1}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none min-h-[48px] max-h-[120px]"
                    style={{ height: 'auto' }}
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={handleSend}
                  disabled={(!input.trim() && attachments.length === 0) || isTyping}
                  icon={isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  className="px-4"
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="hidden xl:block w-80 flex-shrink-0 space-y-4 overflow-y-auto">
          {/* Quick Tools */}
          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              Quick Tools
            </h3>

            <div className="space-y-2">
              {quickActions.map((tool, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={tool.action}
                  className="w-full flex items-center gap-3 p-3 rounded-xl glass-hover transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <tool.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-white">{tool.label}</span>
                </motion.button>
              ))}
            </div>
          </GlassCard>

          {/* Topics Needing Review */}
          {topicsNeedingReview.length > 0 && (
            <GlassCard className="border-warning/30">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Topics Needing Review
              </h3>
              <div className="space-y-2">
                {topicsNeedingReview.slice(0, 3).map((topic, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setInput(`Help me understand ${topic.name}`)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{topic.name}</span>
                      <Badge variant="warning" size="sm">{topic.mastery_level}%</Badge>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-warning rounded-full"
                        style={{ width: `${topic.mastery_level}%` }}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Recent Conversations */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-secondary" />
                Recent Conversations
              </h3>
              <button
                onClick={handleClearHistory}
                className="text-xs text-gray-400 hover:text-danger transition-colors"
              >
                Clear
              </button>
            </div>

            {recentConversations.length > 0 ? (
              <div className="space-y-2">
                {recentConversations.slice(0, 5).map((conv, i) => (
                  <motion.button
                    key={conv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setInput(`Continue our discussion about ${conv.topic || 'this topic'}`)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <p className="text-sm text-white truncate">{conv.topic || conv.conversation_summary.substring(0, 40)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(conv.timestamp).toLocaleDateString()}
                    </p>
                  </motion.button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No previous conversations
              </p>
            )}
          </GlassCard>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <GlassCard className="bg-gradient-to-br from-accent/10 via-transparent to-primary/10 border-accent/20">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Recommendations
              </h3>
              <div className="space-y-2">
                {recommendations.slice(0, 3).map((rec, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setInput(`Help me with ${rec.topic || rec.title}`)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <Badge
                        variant={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'secondary'}
                        size="sm"
                      >
                        {rec.priority}
                      </Badge>
                      <div>
                        <p className="text-sm text-white">{rec.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">{rec.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Learning Tip */}
          <GlassCard className="bg-gradient-to-br from-accent/10 via-transparent to-primary/10 border-accent/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Learning Tip</p>
                <p className="text-xs text-gray-400 mt-1">
                  {learningProfile?.preferred_style
                    ? `Your preferred learning style is ${learningProfile.preferred_style}. I adapt explanations accordingly!`
                    : 'Set your learning style in settings for personalized teaching!'}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
