import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  BarChart3,
  Star,
  Sparkles,
  Play,
  Pause,
  Volume2,
  HelpCircle,
} from 'lucide-react';
import { GlassCard, Button, ProgressRing, Badge } from '../ui/GlassCard';
import { Confetti } from '../ui/Confetti';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionsCount: number;
  timeLimit?: number;
  xpReward: number;
  color: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

const sampleQuizzes: Quiz[] = [
  { id: '1', title: 'Algebra Fundamentals', subject: 'Mathematics', difficulty: 'intermediate', questionsCount: 10, timeLimit: 15, xpReward: 100, color: '#4F8CFF' },
  { id: '2', title: 'Cell Biology', subject: 'Biology', difficulty: 'beginner', questionsCount: 8, timeLimit: 12, xpReward: 80, color: '#00D084' },
  { id: '3', title: 'Chemical Reactions', subject: 'Chemistry', difficulty: 'intermediate', questionsCount: 10, timeLimit: 15, xpReward: 100, color: '#7C4DFF' },
  { id: '4', title: 'Newton\'s Laws', subject: 'Physics', difficulty: 'advanced', questionsCount: 12, timeLimit: 20, xpReward: 150, color: '#FF6B6B' },
  { id: '5', title: 'Literary Devices', subject: 'English', difficulty: 'intermediate', questionsCount: 10, timeLimit: 15, xpReward: 100, color: '#FFA500' },
];

const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the value of x in the equation 2x + 5 = 13?',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correctAnswer: 1,
    explanation: 'Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4.',
    points: 10,
  },
  {
    id: '2',
    question: 'Which organelle is responsible for protein synthesis?',
    options: ['Mitochondria', 'Ribosome', 'Nucleus', 'Golgi apparatus'],
    correctAnswer: 1,
    explanation: 'Ribosomes are the cellular structures responsible for protein synthesis, translating mRNA into polypeptide chains.',
    points: 10,
  },
  {
    id: '3',
    question: 'What type of reaction is: 2H₂ + O₂ → 2H₂O?',
    options: ['Decomposition', 'Synthesis', 'Single replacement', 'Double replacement'],
    correctAnswer: 1,
    explanation: 'This is a synthesis reaction where two or more simple substances combine to form a more complex substance.',
    points: 10,
  },
  {
    id: '4',
    question: 'According to Newton\'s first law, an object at rest will:',
    options: ['Accelerate', 'Decelerate', 'Remain at rest', 'Change direction'],
    correctAnswer: 2,
    explanation: 'Newton\'s first law (inertia) states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.',
    points: 10,
  },
  {
    id: '5',
    question: 'What literary device is used in: "The wind whispered through the trees"?',
    options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
    correctAnswer: 2,
    explanation: 'Personification gives human qualities to non-human things. The wind cannot literally whisper, but this device creates imagery.',
    points: 10,
  },
];

type QuizState = 'list' | 'taking' | 'result';

export function QuizPage() {
  const { profile, refreshProfile } = useAuth();
  const [state, setState] = useState<QuizState>('list');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (state !== 'taking' || !currentQuiz?.timeLimit) return;

    setTimeLeft(currentQuiz.timeLimit * 60);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, currentQuiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers(new Array(sampleQuestions.length).fill(null));
    setScore(0);
    setState('taking');
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    if (showExplanation) return;

    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowExplanation(false);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    let totalScore = 0;
    answers.forEach((answer, index) => {
      if (answer === sampleQuestions[index].correctAnswer) {
        totalScore += sampleQuestions[index].points;
      }
    });
    setScore(totalScore);
    setState('result');

    if (totalScore >= (sampleQuestions.reduce((sum, q) => sum + q.points, 0) * 0.8)) {
      setShowConfetti(true);
    }
  };

  const handleRetakeQuiz = () => {
    setState('list');
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const question = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
  const correctAnswers = answers.filter(
    (a, i) => a === sampleQuestions[i].correctAnswer
  ).length;

  return (
    <div className="space-y-6">
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {state === 'list' && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Quizzes</h1>
              <p className="text-gray-400">Test your knowledge and earn XP!</p>
            </div>
            <Button
              variant="primary"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {}}
            >
              Generate Quiz
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  hover
                  onClick={() => handleStartQuiz(quiz)}
                  className="relative overflow-hidden group"
                >
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 blur-xl"
                    style={{ backgroundColor: quiz.color }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${quiz.color}20` }}
                      >
                        <Trophy className="w-6 h-6" style={{ color: quiz.color }} />
                      </div>
                      <Badge
                        variant={
                          quiz.difficulty === 'beginner' ? 'success' :
                          quiz.difficulty === 'intermediate' ? 'warning' : 'danger'
                        }
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">{quiz.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{quiz.subject}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-400">
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-4 h-4" />
                          {quiz.questionsCount} questions
                        </span>
                        {quiz.timeLimit && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {quiz.timeLimit}m
                          </span>
                        )}
                      </div>
                      <span className="text-accent font-semibold">+{quiz.xpReward} XP</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Start Quiz</span>
                      <motion.div
                        className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors"
                        whileHover={{ x: 3 }}
                      >
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </motion.div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {state === 'taking' && currentQuiz && (
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${currentQuiz.color}20` }}
                >
                  <Trophy className="w-5 h-5" style={{ color: currentQuiz.color }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{currentQuiz.title}</h2>
                  <p className="text-sm text-gray-400">
                    Question {currentQuestion + 1} of {sampleQuestions.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {currentQuiz.timeLimit && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    timeLeft < 60 ? 'bg-danger/20 text-danger' : 'bg-white/5 text-gray-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                  </div>
                )}
                <button
                  onClick={handleFinishQuiz}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  End Quiz
                </button>
              </div>
            </div>

            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: currentQuiz.color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card"
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      className={`
                        w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-4
                        ${!showResult && isSelected ? 'bg-primary/20 border-primary border' : 'glass-hover'}
                        ${showResult && isCorrect ? 'bg-accent/20 border-accent border' : ''}
                        ${showResult && isSelected && !isCorrect ? 'bg-danger/20 border-danger border' : ''}
                      `}
                      whileHover={!showResult ? { scale: 1.01 } : undefined}
                      whileTap={!showResult ? { scale: 0.99 } : undefined}
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-semibold
                        ${!showResult && isSelected ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'}
                        ${showResult && isCorrect ? 'bg-accent text-background' : ''}
                        ${showResult && isSelected && !isCorrect ? 'bg-danger text-white' : ''}
                      `}>
                        {showResult && isCorrect ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : showResult && isSelected && !isCorrect ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="flex-1 text-white">{option}</span>
                    </motion.button>
                  );
                })}
              </div>

              {selectedAnswer !== null && !showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Button
                    variant="primary"
                    onClick={() => setShowExplanation(true)}
                    icon={<CheckCircle className="w-4 h-4" />}
                    className="w-full"
                  >
                    Check Answer
                  </Button>
                </motion.div>
              )}

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6"
                >
                  <div className={`p-4 rounded-xl ${
                    selectedAnswer === question.correctAnswer
                      ? 'bg-accent/10 border border-accent/30'
                      : 'bg-danger/10 border border-danger/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      {selectedAnswer === question.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-white mb-1">
                          {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                        </p>
                        <p className="text-sm text-gray-300">{question.explanation}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleNextQuestion}
                    icon={<ChevronRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="w-full mt-4"
                  >
                    {currentQuestion < sampleQuestions.length - 1 ? 'Next Question' : 'See Results'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {state === 'result' && currentQuiz && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          <GlassCard className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="mb-6"
            >
              <ProgressRing
                progress={(correctAnswers / sampleQuestions.length) * 100}
                size={150}
                color={correctAnswers / sampleQuestions.length >= 0.8 ? '#00D084' : correctAnswers / sampleQuestions.length >= 0.5 ? '#FFA500' : '#FF6B6B'}
              >
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold gradient-text">{correctAnswers}</span>
                  <span className="text-sm text-gray-400">of {sampleQuestions.length}</span>
                </div>
              </ProgressRing>
            </motion.div>

            <h2 className="text-2xl font-display font-bold text-white mb-2">
              {correctAnswers / sampleQuestions.length >= 0.8
                ? 'Excellent Work!'
                : correctAnswers / sampleQuestions.length >= 0.5
                ? 'Good Job!'
                : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-400 mb-6">
              You answered {correctAnswers} out of {sampleQuestions.length} questions correctly
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-primary">{score}</p>
                <p className="text-sm text-gray-400">Points Earned</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-accent">{Math.round((correctAnswers / sampleQuestions.length) * 100)}%</p>
                <p className="text-sm text-gray-400">Accuracy</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-secondary">+{currentQuiz.xpReward}</p>
                <p className="text-sm text-gray-400">XP Reward</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleRetakeQuiz}
                icon={<RotateCcw className="w-4 h-4" />}
                className="flex-1"
              >
                Back to Quizzes
              </Button>
              <Button
                variant="primary"
                onClick={() => handleStartQuiz(currentQuiz)}
                icon={<Play className="w-4 h-4" />}
                className="flex-1"
              >
                Retry Quiz
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
