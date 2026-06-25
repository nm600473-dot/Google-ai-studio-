import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  Sparkles,
  Clock,
  Star,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { GlassCard, Button, Input, Badge, Modal } from '../ui/GlassCard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  confidence: number;
  isAIGenerated: boolean;
}

const sampleCards: FlashcardData[] = [
  { id: '1', front: 'What is the formula for the area of a circle?', back: 'A = πr² where r is the radius', subject: 'Mathematics', difficulty: 'easy', confidence: 0, isAIGenerated: true },
  { id: '2', front: 'Define photosynthesis', back: 'The process by which plants convert light energy, CO₂, and H₂O into glucose and O₂', subject: 'Biology', difficulty: 'medium', confidence: 0, isAIGenerated: false },
  { id: '3', front: 'What is Newton\'s Second Law?', back: 'F = ma (Force equals mass times acceleration)', subject: 'Physics', difficulty: 'easy', confidence: 0, isAIGenerated: true },
  { id: '4', front: 'What is the periodic table?', back: 'A tabular arrangement of chemical elements ordered by atomic number', subject: 'Chemistry', difficulty: 'easy', confidence: 0, isAIGenerated: false },
  { id: '5', front: 'What is a metaphor?', back: 'A figure of speech comparing two unlike things without using "like" or "as"', subject: 'English', difficulty: 'medium', confidence: 0, isAIGenerated: true },
];

type StudyMode = 'swipe' | 'spaced' | 'review';

export function FlashcardPage() {
  const { profile } = useAuth();
  const [cards, setCards] = useState<FlashcardData[]>(sampleCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>('swipe');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCard, setNewCard] = useState<{ front: string; back: string; subject: string; difficulty: 'easy' | 'medium' | 'hard' }>({ front: '', back: '', subject: 'mathematics', difficulty: 'medium' });
  const [reviewedToday, setReviewedToday] = useState(0);
  const [streak, setStreak] = useState(7);

  const currentCard = cards[currentCardIndex];
  const totalCards = cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleRate = (rating: 'easy' | 'medium' | 'hard') => {
    const updatedCards = [...cards];
    const card = updatedCards[currentCardIndex];

    const confidenceMap = { easy: 1, medium: 0.5, hard: 0.2 };
    card.confidence = confidenceMap[rating];
    card.lastReviewed = new Date();

    setCards(updatedCards);
    setReviewedToday(prev => prev + 1);

    if (currentCardIndex < totalCards - 1) {
      handleNext();
    }
  };

  const handleCreateCard = () => {
    const card: FlashcardData = {
      id: Date.now().toString(),
      front: newCard.front,
      back: newCard.back,
      subject: newCard.subject,
      difficulty: newCard.difficulty,
      confidence: 0,
      isAIGenerated: false,
    };
    setCards(prev => [...prev, card]);
    setShowCreateModal(false);
    setNewCard({ front: '', back: '', subject: 'mathematics', difficulty: 'medium' });
  };

  const handleDeleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    if (currentCardIndex >= cards.length - 1) {
      setCurrentCardIndex(Math.max(0, cards.length - 2));
    }
  };

  const stats = [
    { label: 'Cards Due', value: totalCards - reviewedToday, icon: Layers, color: 'primary' },
    { label: 'Reviewed Today', value: reviewedToday, icon: CheckCircle, color: 'accent' },
    { label: 'Day Streak', value: streak, icon: TrendingUp, color: 'warning' },
    { label: 'Total Cards', value: totalCards, icon: Star, color: 'secondary' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Flashcards</h1>
          <p className="text-gray-400">Master concepts through spaced repetition</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Card
          </Button>
          <Button
            variant="accent"
            onClick={() => {}}
            icon={<Sparkles className="w-4 h-4" />}
          >
            AI Generate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard hover>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
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

      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl">
          {(['swipe', 'spaced', 'review'] as StudyMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setStudyMode(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                studyMode === mode ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="relative h-72 sm:h-80 perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCardIndex}
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: isFlipped ? 180 : 0, opacity: 1 }}
                exit={{ rotateY: -180, opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={handleFlip}
              >
                <div
                  className={`absolute inset-0 w-full h-full glass-card flex flex-col items-center justify-center p-8 backface-hidden ${
                    isFlipped ? 'invisible' : ''
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="absolute top-4 right-4">
                    <Badge variant={
                      currentCard?.difficulty === 'easy' ? 'success' :
                      currentCard?.difficulty === 'medium' ? 'warning' : 'danger'
                    }>
                      {currentCard?.difficulty}
                    </Badge>
                  </div>

                  {currentCard?.isAIGenerated && (
                    <div className="absolute top-4 left-4">
                      <Sparkles className="w-4 h-4 text-secondary" />
                    </div>
                  )}

                  <p className="text-sm text-gray-400 mb-4">{currentCard?.subject}</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-white text-center">
                    {currentCard?.front}
                  </h3>
                  <p className="text-sm text-gray-400 mt-6">Tap to reveal answer</p>
                </div>

                <div
                  className={`absolute inset-0 w-full h-full glass-card flex flex-col items-center justify-center p-8 ${
                    isFlipped ? '' : 'invisible'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <p className="text-sm text-accent mb-4">Answer</p>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white text-center">
                    {currentCard?.back}
                  </h3>
                  <p className="text-sm text-gray-400 mt-6">Tap to flip back</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 mb-6">
            {cards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentCardIndex ? 'w-6 bg-primary' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentCardIndex === 0}
              icon={<ChevronLeft className="w-5 h-5" />}
            />

            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRate('hard')}
                className="px-4"
              >
                Hard
              </Button>
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleRate('medium')}
                className="px-4"
              >
                Medium
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleRate('easy')}
                className="px-4"
              >
                Easy
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={currentCardIndex === totalCards - 1}
              icon={<ChevronRight className="w-5 h-5" />}
            />
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentCardIndex(0)}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShuffle}
              icon={<Shuffle className="w-4 h-4" />}
            >
              Shuffle
            </Button>
          </div>
        </div>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Card Library</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.slice(0, 6).map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant="primary" size="sm">{card.subject}</Badge>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-1 rounded hover:bg-danger/20 text-gray-400 hover:text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-white line-clamp-2">{card.front}</p>
              <p className="text-xs text-gray-400 mt-2 line-clamp-1">{card.back}</p>
            </motion.div>
          ))}
        </div>

        {cards.length > 6 && (
          <button className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
            View All {cards.length} Cards
          </button>
        )}
      </GlassCard>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Flashcard"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Question (Front)"
            value={newCard.front}
            onChange={e => setNewCard(prev => ({ ...prev, front: e.target.value }))}
            placeholder="Enter the question or term"
          />

          <Input
            label="Answer (Back)"
            value={newCard.back}
            onChange={e => setNewCard(prev => ({ ...prev, back: e.target.value }))}
            placeholder="Enter the answer or definition"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <select
                value={newCard.subject}
                onChange={e => setNewCard(prev => ({ ...prev, subject: e.target.value }))}
                className="input-base"
              >
                <option value="mathematics">Mathematics</option>
                <option value="biology">Biology</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="english">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={newCard.difficulty}
                onChange={e => setNewCard(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                className="input-base"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateCard}
              disabled={!newCard.front || !newCard.back}
              className="flex-1"
            >
              Create Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
