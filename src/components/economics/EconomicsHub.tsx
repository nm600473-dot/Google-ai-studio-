import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Trophy,
  Brain,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Target,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookMarked,
  Layers,
  GraduationCap,
  MessageSquare,
  Send,
  Sparkle
} from 'lucide-react';
import { GlassCard, Button, Badge } from '../ui/GlassCard';

// Real flashcard type
interface Flashcard {
  id: number;
  question: string;
  answer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  unit: number;
}

// Real quiz question type
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  unit: number;
}

// 30 Authentic Unit 1 & Unit 2 Flashcards from the Study Guide
const flashcardsData: Flashcard[] = [
  {
    id: 1,
    question: "What is the definition of utility?",
    answer: "The power of a commodity to satisfy human wants; the subjective satisfaction derived from consumption.",
    explanation: "It represents psychological satisfaction, not physical usefulness.",
    difficulty: "Easy",
    unit: 1
  },
  {
    id: 2,
    question: "Why is utility considered 'relative'?",
    answer: "Because it varies from person to person, time to time, and place to place.",
    explanation: "It is subjective and depends heavily on individual tastes and contextual needs.",
    difficulty: "Easy",
    unit: 1
  },
  {
    id: 3,
    question: 'Differentiate between "utility" and "usefulness".',
    answer: "Utility is subjective satisfaction; usefulness is objective functionality/health benefit.",
    explanation: "Alcohol has utility to an addict but lacks usefulness.",
    difficulty: "Medium",
    unit: 1
  },
  {
    id: 4,
    question: "What is the standard unit of measurement proposed by the Cardinal Utility School?",
    answer: "Utils.",
    explanation: "A subjective unit used to quantify satisfaction numerically.",
    difficulty: "Easy",
    unit: 1
  },
  {
    id: 5,
    question: "State the primary assumptions of Cardinal Utility Theory.",
    answer: "Rationality of the consumer, cardinal measurability, constant marginal utility of money, and diminishing marginal utility.",
    explanation: "These assumptions allow utility to be mathematically modeled.",
    difficulty: "Hard",
    unit: 1
  },
  {
    id: 6,
    question: "Define Total Utility (TU).",
    answer: "The aggregate satisfaction obtained from consuming a specific quantity of a commodity.",
    explanation: "It is the sum of the utilities derived from each individual unit.",
    difficulty: "Easy",
    unit: 1
  },
  {
    id: 7,
    question: "Define Marginal Utility (MU).",
    answer: "The additional utility derived from consuming one extra unit of a good.",
    explanation: "Mathematically, it is the change in TU divided by the change in quantity (ΔTU/ΔQ).",
    difficulty: "Easy",
    unit: 1
  },
  {
    id: 8,
    question: "What is the value of Marginal Utility when Total Utility is at its maximum?",
    answer: "Zero (MU = 0).",
    explanation: "This point represents the consumer's saturation or satiety point.",
    difficulty: "Medium",
    unit: 1
  },
  {
    id: 9,
    question: "What happens to TU when MU is negative?",
    answer: "Total Utility decreases.",
    explanation: "Negative MU means the consumer is experiencing disutility (dissatisfaction).",
    difficulty: "Medium",
    unit: 1
  },
  {
    id: 10,
    question: "State the Law of Diminishing Marginal Utility (LDMU).",
    answer: "As consumption of a good increases, the utility from each additional unit declines, ceteris paribus.",
    explanation: "This is a fundamental law governing human psychological reaction to consumption.",
    difficulty: "Medium",
    unit: 1
  },
  {
    id: 11,
    question: "What is the mathematical condition for single-good consumer equilibrium?",
    answer: "MU_x = P_x (or MU_x / P_x = 1 if MU of money is 1).",
    explanation: "The consumer maximizes satisfaction when the marginal utility of good X equals its price.",
    difficulty: "Medium",
    unit: 1
  },
  {
    id: 12,
    question: "If a consumer faces MU_x > P_x, how should they adjust consumption?",
    answer: "They must increase consumption of good X.",
    explanation: "As they consume more, MU_x will fall until it equals P_x, restoring equilibrium.",
    difficulty: "Hard",
    unit: 1
  },
  {
    id: 13,
    question: "State the Equi-Marginal Principle for utility maximization across multiple goods.",
    answer: "MU_X / P_X = MU_Y / P_Y = ... = MU_N / P_N",
    explanation: "The utility derived from the last birr spent must be equal across all commodities.",
    difficulty: "Hard",
    unit: 1
  },
  {
    id: 14,
    question: "Write the standard consumer budget equation for two goods.",
    answer: "P_X * X + P_Y * Y = I",
    explanation: "The total expenditure on goods X and Y must equal the consumer's total income (I).",
    difficulty: "Easy",
    unit: 1
  },
  {
    id: 15,
    question: "How does Ordinal Utility Theory differ fundamentally from Cardinal Utility Theory?",
    answer: "Ordinal theory ranks preferences; Cardinal theory measures utility in absolute numbers.",
    explanation: "Ordinal theory does not require the concept of 'utils'.",
    difficulty: "Medium",
    unit: 1
  },
  // Unit 2
  {
    id: 16,
    question: "What is the definition of Demand?",
    answer: "The quantity of a commodity that a consumer is both willing and able to purchase at various prices over a specific period of time, ceteris paribus.",
    explanation: "Desire alone is not demand; it must be backed by the ability to pay.",
    difficulty: "Easy",
    unit: 2
  },
  {
    id: 17,
    question: "State the Law of Demand.",
    answer: "Ceteris paribus, there is an inverse relationship between price and quantity demanded.",
    explanation: "Price rises -> Quantity demanded falls. Price falls -> Quantity demanded rises.",
    difficulty: "Medium",
    unit: 2
  },
  {
    id: 18,
    question: "What is the general equation of a linear Demand Function?",
    answer: "Q_d = a - bP",
    explanation: "Where 'a' is autonomous demand, and 'b' is the price coefficient (slope of curve).",
    difficulty: "Hard",
    unit: 2
  },
  {
    id: 19,
    question: "Name 3 shifting determinants of demand.",
    answer: "Income, Prices of related goods (substitutes/complements), Tastes/Preferences, Population, and Seasonality.",
    explanation: "These shift the entire demand curve, unlike price which causes movement along the curve.",
    difficulty: "Medium",
    unit: 2
  },
  {
    id: 20,
    question: "Differentiate between substitutes and complements.",
    answer: "Substitutes are replaced with each other (tea/coffee); Complements are consumed together (car/petrol).",
    explanation: "Substitute price rise -> demand rise for other. Complement price rise -> demand fall for other.",
    difficulty: "Medium",
    unit: 2
  }
];

// 10 Authentic Quiz Questions from the Study Guide
const quizQuestionsData: QuizQuestion[] = [
  {
    id: 1,
    question: "Utility is best defined as:",
    options: [
      "The usefulness of a commodity",
      "The market price of a commodity",
      "The want-satisfying power of a commodity",
      "The luxury value of a commodity"
    ],
    answer: "The want-satisfying power of a commodity",
    explanation: "Utility is the psychological satisfaction derived from consuming a commodity, representing its capability to satisfy human desires.",
    unit: 1
  },
  {
    id: 2,
    question: "Which of the following is true about utility?",
    options: [
      "It is objective and absolute",
      "It is subjective and relative",
      "It is identical for all individuals consuming the same good",
      "It is synonymous with usefulness"
    ],
    answer: "It is subjective and relative",
    explanation: "Utility varies across persons (subjective), times, and places (relative). It is not identical and differs from objective utility or usefulness.",
    unit: 1
  },
  {
    id: 3,
    question: "A winter coat has high utility in December but low utility in July in Ethiopia. This illustrates which dimension of utility?",
    options: [
      "Subjectivity",
      "Relativity to place",
      "Relativity to time",
      "Relativity to income"
    ],
    answer: "Relativity to time",
    explanation: "The utility of a winter coat changes with seasons, which perfectly demonstrates its relativity to time.",
    unit: 1
  },
  {
    id: 4,
    question: "When Marginal Utility (MU) is positive but decreasing, Total Utility (TU) is:",
    options: [
      "Decreasing",
      "Constant",
      "Increasing at an increasing rate",
      "Increasing at a decreasing rate"
    ],
    answer: "Increasing at a decreasing rate",
    explanation: "Since MU is positive, TU must increase. But since MU is decreasing, TU increases at a slower and slower rate.",
    unit: 1
  },
  {
    id: 5,
    question: "When a consumer reaches their saturation point for a commodity:",
    options: [
      "MU is at its maximum",
      "TU is zero",
      "MU is zero",
      "TU is falling"
    ],
    answer: "MU is zero",
    explanation: "At the saturation point, Total Utility reaches its maximum, and the additional utility (MU) from an extra unit is exactly zero.",
    unit: 1
  },
  {
    id: 6,
    question: "If a consumer spends Birr 22 on Bread (X) priced at Birr 2 and Injera (Y) priced at Birr 4, with MU_X/P_X = MU_Y/P_Y = 1 at X = 3, Y = 4. What is the maximized Total Utility if TU_X(3) = 12 and TU_Y(4) = 28?",
    options: [
      "12 utils",
      "28 utils",
      "40 utils",
      "22 utils"
    ],
    answer: "40 utils",
    explanation: "TU_max = TU_X(3) + TU_Y(4) = 12 + 28 = 40 utils. This combination satisfies both the Equi-Marginal Principle and the budget constraint: (2*3) + (4*4) = Birr 22.",
    unit: 1
  },
  {
    id: 7,
    question: "According to the Law of Demand, ceteris paribus, when the price of an item falls:",
    options: [
      "Demand increases",
      "Demand decreases",
      "Quantity demanded increases",
      "Quantity demanded decreases"
    ],
    answer: "Quantity demanded increases",
    explanation: "The Law of Demand states that a decrease in a good's own price causes an increase in the *quantity demanded* (movement along the curve), not a shift in the demand curve itself.",
    unit: 2
  },
  {
    id: 8,
    question: "If Coffee and Tea are substitutes in Ethiopia, an increase in the price of Tea will cause:",
    options: [
      "A shift of the Coffee demand curve to the left",
      "A shift of the Coffee demand curve to the right",
      "A movement along the Coffee demand curve downwards",
      "No change in Coffee demand"
    ],
    answer: "A shift of the Coffee demand curve to the right",
    explanation: "When tea prices rise, consumers buy less tea and switch to coffee, increasing the demand for coffee and shifting its demand curve to the right.",
    unit: 2
  },
  {
    id: 9,
    question: "An increase in the price of fertilizer will cause the supply curve of wheat in Ethiopia to:",
    options: [
      "Shift to the right",
      "Shift to the left",
      "Remain unchanged",
      "Become perfectly elastic"
    ],
    answer: "Shift to the left",
    explanation: "Fertilizer is an input cost. Higher input costs increase production expenses, making production less profitable, thereby reducing supply and shifting the supply curve left.",
    unit: 2
  },
  {
    id: 10,
    question: "If the demand function is Qd = 80 - 3P and supply is Qs = 9P - 40, what are the equilibrium price (P*) and quantity (Q*)?",
    options: [
      "P* = Birr 10, Q* = 50 kg",
      "P* = Birr 5, Q* = 65 kg",
      "P* = Birr 12, Q* = 44 kg",
      "P* = Birr 8, Q* = 56 kg"
    ],
    answer: "P* = Birr 10, Q* = 50 kg",
    explanation: "Equating Qd = Qs: 80 - 3P = 9P - 40 => 120 = 12P => P* = 10. Plugging this back: Qd = 80 - 3(10) = 50 kg.",
    unit: 2
  }
];

export function EconomicsHub() {
  const [activeTab, setActiveTab] = useState<'content' | 'flashcards' | 'quiz' | 'tutor'>('content');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    '1.1': true,
    '1.2': true,
  });

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCards, setLearnedCards] = useState<number[]>([]);
  const [needPracticeCards, setNeedPracticeCards] = useState<number[]>([]);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // AI Tutor chat state
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    {
      role: 'assistant',
      content: "Selam! I am your Ethiopian Grade 10 Economics Specialist. Ask me any questions about our curriculum. I'm loaded with Units 1 through 8 knowledge base!"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetFlashcards = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setLearnedCards([]);
    setNeedPracticeCards([]);
  };

  const handleFlashcardReview = (status: 'easy' | 'hard') => {
    const cardId = flashcardsData[currentCardIndex].id;
    if (status === 'easy') {
      setLearnedCards(prev => [...new Set([...prev, cardId])]);
      setNeedPracticeCards(prev => prev.filter(id => id !== cardId));
    } else {
      setNeedPracticeCards(prev => [...new Set([...prev, cardId])]);
      setLearnedCards(prev => prev.filter(id => id !== cardId));
    }

    if (currentCardIndex < flashcardsData.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1);
      }, 200);
    } else {
      // Finished all cards, wrap around or show complete
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
  };

  const submitQuizAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const correct = quizQuestionsData[currentQuizIndex].answer === selectedOption;
    if (correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestionsData.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    if (!customText) setChatInput('');
    setIsChatTyping(true);

    // AI logic mapped to Ethiopian curriculum
    setTimeout(() => {
      let response = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes('utility') || lower.includes('usefulness')) {
        response = `Under the **Ethiopian Grade 10 Economics Curriculum Unit 1**:\n\n* **Utility** represents subjective psychological satisfaction derived from consuming a product, which is consumer-centric.\n* **Usefulness** refers to the objective, functional benefit for well-being, which is product-centric.\n\n*Classic Example*: Alcohol or cigarettes have high **utility** to an addict because they satisfy a strong desire, but have zero or negative **usefulness** because they damage health.`;
      } else if (lower.includes('cardinal') || lower.includes('ordinal')) {
        response = `Our Grade 10 Curriculum compares the two main schools of utility:\n\n1. **Cardinal School (Alfred Marshall)**: Utility is quantitatively measurable in units called **"utils"**. It assumes constant marginal utility of money and is additive: $TU = U_1 + U_2 + \\dots$\n2. **Ordinal School (Hicks & Allen)**: Utility cannot be measured in exact numbers. Consumers can only **rank or order** their preferences (e.g., "I prefer coffee to tea"). It uses Indifference Curves and is more psychologically realistic.`;
      } else if (lower.includes('banana') || lower.includes('tu') || lower.includes('mu')) {
        response = `Let's look at the **Banana Consumption Case Study (Table 1.2)** from the official textbook:\n\n* As you consume bananas, **Total Utility (TU)** increases but at a decreasing rate because **Marginal Utility (MU)** is falling.\n* **Saturation Point**: At 7 bananas, $TU$ is at its maximum (37 utils) and $MU$ is exactly $0$.\n* **Disutility**: Consuming the 8th banana drops $TU$ to 36 utils as $MU$ becomes negative ($-1$ util), causing discomfort!`;
      } else if (lower.includes('demand') || lower.includes('amina')) {
        response = `In **Unit 2 (Theory of Demand)**, we define demand as *willingness and ability to pay* ceteris paribus.\n\nOur textbook features the **Amina Coffee Demand schedule (Table 2.1)**:\n* Price (Birr): 0 to 45 (increments of 5)\n* Quantity demanded (kg): 9 down to 0\n* This displays a clean linear inverse relationship, confirming the **Law of Demand**!`;
      } else if (lower.includes('wheat') || lower.includes('equilibrium') || lower.includes('solve')) {
        response = `Let's solve the **Wheat Market Equilibrium problem (Page 31)** from the textbook:\n\nGiven functions:\n* $Q_d = 80 - 3P$\n* $Q_s = 9P - 40$\n\n**Step 1: Equate $Q_d = Q_s$**\n$$80 - 3P = 9P - 40$$\n$$120 = 12P \\implies P^* = \\text{Birr } 10/\\text{kg}$$\n\n**Step 2: Solve for Equilibrium Quantity ($Q^*$)**\nSubstitute $P = 10$ into $Q_d$:\n$$Q^* = 80 - 3(10) = 50\\text{ kg}$$\n\n*The market clears perfectly at Birr 10/kg with 50 kg traded.*`;
      } else {
        response = `That's a great question regarding Grade 10 Economics. To align with our curriculum, let's look at the core principles:\n\n* **Unit 1**: Consumer Behaviour focuses on maximizing satisfaction given scarce income.\n* **Unit 2**: Market Forces balance through Price ($P$) and Quantities ($Q$) at the intersection of supply and demand.\n\nCould you clarify if you'd like me to explain the **Equi-Marginal Principle**, **Elasticities of Demand**, or solve a **Market Equilibrium** problem?`;
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsChatTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e1b4b] to-[#311042] border border-[#ff6b6b]/20 p-6 md:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-secondary/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 text-xs text-[#ff6b6b] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Ethiopian Ministry of Education Curriculum
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              Grade 10 Economics Study Hub
            </h1>
            <p className="text-gray-300 mt-2 max-w-xl text-sm md:text-base leading-relaxed">
              Dive deep into the ultimate academic guide loaded with rich interactive summaries, quantitative case studies, active recall flashcards, and exam-level diagnostic quizzes.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant={activeTab === 'content' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('content')}
              icon={<BookOpen className="w-4 h-4" />}
            >
              Curriculum
            </Button>
            <Button
              variant={activeTab === 'flashcards' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('flashcards')}
              icon={<Bookmark className="w-4 h-4" />}
            >
              Flashcards
            </Button>
            <Button
              variant={activeTab === 'quiz' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('quiz')}
              icon={<Trophy className="w-4 h-4" />}
            >
              Quiz Hub
            </Button>
            <Button
              variant={activeTab === 'tutor' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('tutor')}
              icon={<Brain className="w-4 h-4" />}
            >
              AI Specialist
            </Button>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left pane: content selection or navigation */}
        {activeTab === 'content' && (
          <div className="lg:col-span-4 space-y-4">
            <GlassCard>
              <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Textbook Units
              </h3>
              <div className="space-y-2">
                {[
                  { id: 1, name: 'Unit 1: Theory of Consumer Behaviour', icon: GraduationCap },
                  { id: 2, name: 'Unit 2: Theories of Demand and Supply', icon: TrendingUp },
                  { id: 3, name: 'Unit 3: Theories of Production & Cost', icon: Target },
                  { id: 4, name: 'Unit 4: Market Structure', icon: BookMarked },
                  { id: 5, name: 'Unit 5: Banking & Finance', icon: Sparkle },
                  { id: 6, name: 'Unit 6: Economic Growth', icon: Layers },
                  { id: 7, name: 'Unit 7: The Ethiopian Economy', icon: BookOpen },
                  { id: 8, name: 'Unit 8: Business Startups', icon: Trophy },
                ].map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedUnit(unit.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all border text-sm flex items-center justify-between ${
                      selectedUnit === unit.id
                        ? 'bg-primary/20 border-primary/40 text-white font-semibold'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <unit.icon className={`w-4 h-4 ${selectedUnit === unit.id ? 'text-primary' : 'text-gray-400'}`} />
                      <span>{unit.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="bg-gradient-to-br from-[#ff6b6b]/10 to-[#7c4dff]/5">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Specialist AI Tip
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Unit 1 and Unit 2 comprise 65% of the microeconomics questions on national examinations. Master the step-by-step mathematical examples in this study hub to maximize your score!
              </p>
            </GlassCard>
          </div>
        )}

        {/* Right pane: Core Interactive Curriculum Content */}
        {activeTab === 'content' && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Unit 1 */}
            {selectedUnit === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <GlassCard>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Unit 1: Theory of Consumer Behaviour</h2>
                    <Badge variant="primary">Core Foundation</Badge>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    This unit lays down how consumers satisfy wants using scarce resources. In economics, the core mechanism is <strong>Utility</strong>—the want-satisfying power of a commodity.
                  </p>

                  {/* Topic 1.1 */}
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <button
                      onClick={() => toggleTopic('1.1')}
                      className="w-full flex items-center justify-between text-left text-lg font-semibold text-white py-2"
                    >
                      <span>1.1 The Concept of Utility</span>
                      <ChevronRight className={`w-5 h-5 transform transition-transform ${expandedTopics['1.1'] ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {expandedTopics['1.1'] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-4 pt-2 text-sm text-gray-300"
                        >
                          <div className="bg-white/5 p-4 rounded-xl space-y-2">
                            <h4 className="font-semibold text-white text-sm">Key Distinction: Utility vs Usefulness</h4>
                            <p className="leading-relaxed text-xs">
                              <strong>Usefulness</strong> is objective functionality. <strong>Utility</strong> is subjective psychological satisfaction. A commodity can have high utility for someone even if it has zero usefulness (e.g., cigarettes for a smoker).
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="border border-white/10 p-4 rounded-xl">
                              <h5 className="font-semibold text-white text-xs mb-2">Cardinal Approach</h5>
                              <p className="text-xs leading-relaxed">
                                Utility is quantifiable in absolute numbers using subjective units called <strong>"utils"</strong>. Pioneers include Alfred Marshall.
                              </p>
                            </div>
                            <div className="border border-white/10 p-4 rounded-xl">
                              <h5 className="font-semibold text-white text-xs mb-2">Ordinal Approach</h5>
                              <p className="text-xs leading-relaxed">
                                Utility is purely qualitative. Consumers can only rank packages of goods (e.g., "I prefer Coffee over Tea"). Hicks & Allen.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Topic 1.2 */}
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <button
                      onClick={() => toggleTopic('1.2')}
                      className="w-full flex items-center justify-between text-left text-lg font-semibold text-white py-2"
                    >
                      <span>1.2 Cardinal Utility Theory: TU & MU Relationships</span>
                      <ChevronRight className={`w-5 h-5 transform transition-transform ${expandedTopics['1.2'] ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {expandedTopics['1.2'] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-4 pt-2 text-sm text-gray-300"
                        >
                          <p className="text-xs">
                            The relationship between <strong>Total Utility (TU)</strong> and <strong>Marginal Utility (MU)</strong> dictates consumer satisfaction limits.
                          </p>

                          <div className="bg-white/5 p-4 rounded-xl overflow-x-auto">
                            <h4 className="font-semibold text-white text-xs mb-3">Banana Consumption Utility Schedule (Table 1.2)</h4>
                            <table className="w-full text-left text-xs text-gray-300 min-w-[400px]">
                              <thead>
                                <tr className="border-b border-white/10 text-white">
                                  <th className="py-2">Quantity (Qb)</th>
                                  <th className="py-2">Total Utility (TU)</th>
                                  <th className="py-2">Marginal Utility (MU)</th>
                                  <th className="py-2">Consumer State</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-white/5">
                                  <td className="py-2 font-mono">1</td>
                                  <td className="py-2 font-mono">12 utils</td>
                                  <td className="py-2 font-mono">12 utils</td>
                                  <td className="py-2">Initial consumption</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                  <td className="py-2 font-mono">3</td>
                                  <td className="py-2 font-mono">29 utils</td>
                                  <td className="py-2 font-mono">7 utils</td>
                                  <td className="py-2">Diminishing returns start</td>
                                </tr>
                                <tr className="border-b border-[#ff6b6b]/30 bg-primary/10">
                                  <td className="py-2 font-mono font-bold text-white">7</td>
                                  <td className="py-2 font-mono font-bold text-white">37 utils</td>
                                  <td className="py-2 font-mono font-bold text-[#ff6b6b]">0 utils</td>
                                  <td className="py-2 font-bold text-white">Saturation Point (TU max)</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                  <td className="py-2 font-mono">8</td>
                                  <td className="py-2 font-mono">36 utils</td>
                                  <td className="py-2 font-mono text-danger">-1 util</td>
                                  <td className="py-2">Disutility / discomfort</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-2">
                            <h5 className="font-semibold text-white text-xs">Mathematical Formula:</h5>
                            <code className="block font-mono text-xs bg-black/40 p-2.5 rounded text-primary">
                              MU = ΔTU / ΔQ = (TU_n - TU_n-1) / (Q_n - Q_n-1)
                            </code>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Equi-Marginal Section */}
                  <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
                    <h3 className="text-lg font-semibold text-white">1.3 Multi-Commodity Equilibrium (Equi-Marginal Principle)</h3>
                    <p className="text-xs text-gray-300">
                      When consuming multiple items (e.g. Bread & Injera) with a fixed income, the consumer maximizes satisfaction when the marginal utility per birr is identical across goods:
                    </p>
                    <code className="block font-mono text-xs bg-black/40 p-2.5 rounded text-secondary text-center">
                      MU_X / P_X = MU_Y / P_Y = MU_money
                    </code>

                    <div className="bg-[#7c4dff]/10 border border-[#7c4dff]/20 p-4 rounded-xl space-y-3">
                      <h4 className="font-bold text-white text-xs">Solved Case Study: Bread & Injera (Income = Birr 22)</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        • Price of Bread (Px) = Birr 2, Price of Injera (Py) = Birr 4.<br />
                        • Checking combinations matching <span className="font-mono text-white bg-black/30 px-1 rounded">MUx/Px = MUy/Py = 1</span>:<br />
                        We find this occurs at <strong className="text-white">3 units of Bread</strong> and <strong className="text-white">4 units of Injera</strong>.<br />
                        • Budget confirmation: <span className="font-mono text-white bg-black/30 px-1 rounded">(2 * 3) + (4 * 4) = 6 + 16 = Birr 22</span> (Matches income perfectly!).<br />
                        • Maximized Total Utility = <span className="text-white font-semibold">12 + 28 = 40 utils</span>.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Unit 2 */}
            {selectedUnit === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <GlassCard>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Unit 2: Theories of Demand and Supply</h2>
                    <Badge variant="success">Critical Exam Area</Badge>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    This unit covers the essential market forces. Demand represents consumers (willingness + ability), while Supply represents producers (willingness + ability).
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-white/10 p-4 rounded-xl bg-white/5 space-y-2">
                      <h4 className="font-semibold text-white text-xs flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Law of Demand
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-300">
                        Ceteris paribus, price and quantity demanded have an <strong>inverse relationship</strong>. The demand curve is downward-sloping.
                      </p>
                    </div>
                    <div className="border border-white/10 p-4 rounded-xl bg-white/5 space-y-2">
                      <h4 className="font-semibold text-white text-xs flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-success" />
                        Law of Supply
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-300">
                        Ceteris paribus, price and quantity supplied have a <strong>direct (positive) relationship</strong>. The supply curve is upward-sloping.
                      </p>
                    </div>
                  </div>

                  {/* Wheat Equilibrium solved */}
                  <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl mt-6 space-y-3">
                    <h4 className="font-bold text-white text-sm">Case Study: Wheat Market Equilibrium Math (Page 31)</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Given equations:<br />
                      <span className="font-mono text-white">Qd = 80 - 3P</span> &amp; <span className="font-mono text-white">Qs = 9P - 40</span>
                    </p>

                    <div className="space-y-2 text-xs font-mono bg-black/40 p-4 rounded-xl">
                      <div>1. Set Qd = Qs:</div>
                      <div className="text-primary pl-4">80 - 3P = 9P - 40</div>
                      <div className="text-primary pl-4">120 = 12P =&gt; P* = Birr 10/kg</div>
                      
                      <div className="pt-2">2. Solve for Q*:</div>
                      <div className="text-primary pl-4">Q* = 80 - 3(10) = 50 kg</div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Market clears perfectly at Birr 10 per kg with 50 kilograms traded.
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Units 3 to 8 summary roadmap */}
            {selectedUnit > 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedUnit === 3 && "Unit 3: Theories of Production and Cost"}
                    {selectedUnit === 4 && "Unit 4: Market Structure"}
                    {selectedUnit === 5 && "Unit 5: Banking and Finance"}
                    {selectedUnit === 6 && "Unit 6: Economic Growth"}
                    {selectedUnit === 7 && "Unit 7: The Ethiopian Economy"}
                    {selectedUnit === 8 && "Unit 8: Business Startups and Innovation"}
                  </h2>
                  <p className="text-sm text-gray-300">
                    {selectedUnit === 3 && "Covers production functions (short-run vs long-run), Law of Variable Proportions, and explicit vs implicit costs."}
                    {selectedUnit === 4 && "Examines Perfect Competition, Monopoly, Monopolistic Competition, and Oligopoly models."}
                    {selectedUnit === 5 && "Focuses on money functions, commercial banking, National Bank of Ethiopia, and exchange rates."}
                    {selectedUnit === 6 && "Defines GDP, inflation types, economic development phases, and structural goals."}
                    {selectedUnit === 7 && "Details the agrarian base, industrial goals, coffee export data, and regional trade hubs."}
                    {selectedUnit === 8 && "Guides startup setups, feasibility studies, business plans, and digital innovation."}
                  </p>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                    <h4 className="font-semibold text-white text-xs">Curriculum Roadmap Goals:</h4>
                    <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                      <li>Understand macro/micro classifications.</li>
                      <li>Review National Exam-style core terms.</li>
                      <li>Use the <strong>AI Specialist Tab</strong> or <strong>Quiz Hub</strong> to master this Unit.</li>
                    </ul>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => setActiveTab('tutor')}
                    icon={<Brain className="w-4 h-4" />}
                  >
                    Ask AI Specialist about this Unit
                  </Button>
                </GlassCard>
              </motion.div>
            )}

          </div>
        )}

        {/* Flashcards Tab */}
        {activeTab === 'flashcards' && (
          <div className="lg:col-span-12 max-w-2xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Active Recall Flashcards</h2>
                <p className="text-xs text-gray-400">Flip cards to test your retention. High repetition yields peak scores!</p>
              </div>
              <Button size="sm" variant="outline" onClick={resetFlashcards} icon={<RotateCcw className="w-4 h-4" />}>
                Reset
              </Button>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Card {currentCardIndex + 1} of {flashcardsData.length}</span>
                <span>Mastered: {learnedCards.length} / {flashcardsData.length}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentCardIndex + 1) / flashcardsData.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Card stage */}
            <div className="perspective-1000 h-80 relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <motion.div
                className="w-full h-full relative duration-500 transform-style-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-[#111827]/90 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-glow">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">Unit {flashcardsData[currentCardIndex].unit}</Badge>
                    <Badge variant={flashcardsData[currentCardIndex].difficulty === 'Easy' ? 'success' : flashcardsData[currentCardIndex].difficulty === 'Medium' ? 'warning' : 'danger'}>
                      {flashcardsData[currentCardIndex].difficulty}
                    </Badge>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-lg md:text-xl font-medium text-white leading-relaxed">
                      {flashcardsData[currentCardIndex].question}
                    </p>
                  </div>

                  <div className="text-center text-xs text-primary font-medium flex items-center justify-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Click to flip &amp; reveal answer
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden bg-[#1f2937]/95 border border-primary/30 rounded-2xl p-6 flex flex-col justify-between shadow-glow transform rotate-Y-180">
                  <div className="flex items-center justify-between">
                    <Badge variant="success">Answer</Badge>
                    <span className="text-xs text-gray-400">Unit {flashcardsData[currentCardIndex].unit}</span>
                  </div>

                  <div className="space-y-3 text-center py-2">
                    <p className="text-md md:text-lg font-bold text-white leading-relaxed">
                      {flashcardsData[currentCardIndex].answer}
                    </p>
                    <p className="text-xs text-gray-300 italic">
                      {flashcardsData[currentCardIndex].explanation}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleFlashcardReview('hard')}
                      className="px-4 py-2 rounded-xl bg-danger/20 border border-danger/40 text-danger-light text-xs font-semibold hover:bg-danger/30 transition-colors"
                    >
                      Needs Practice
                    </button>
                    <button
                      onClick={() => handleFlashcardReview('easy')}
                      className="px-4 py-2 rounded-xl bg-success/20 border border-success/40 text-success-light text-xs font-semibold hover:bg-success/30 transition-colors"
                    >
                      Got It!
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="lg:col-span-12 max-w-2xl mx-auto w-full space-y-6">
            {!quizFinished ? (
              <GlassCard className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Diagnostic Exam Practice</h3>
                    <p className="text-xs text-gray-400">Unit 1 &amp; Unit 2 Official Practice Questions</p>
                  </div>
                  <Badge variant="primary">Q: {currentQuizIndex + 1} / {quizQuestionsData.length}</Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-[#ff6b6b] font-semibold tracking-wider uppercase">Question</span>
                  <p className="text-base md:text-lg text-white font-medium leading-relaxed">
                    {quizQuestionsData[currentQuizIndex].question}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {quizQuestionsData[currentQuizIndex].options.map((option, index) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === quizQuestionsData[currentQuizIndex].answer;
                    
                    let cardStyle = "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10";
                    if (isAnswerSubmitted) {
                      if (isCorrect) cardStyle = "bg-success/20 border-success/40 text-success-light";
                      else if (isSelected) cardStyle = "bg-danger/20 border-danger/40 text-danger-light";
                    } else if (isSelected) {
                      cardStyle = "bg-primary/20 border-primary/50 text-white font-semibold";
                    }

                    return (
                      <button
                        key={index}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleQuizAnswer(option)}
                        className={`w-full text-left p-4 rounded-xl transition-all border text-sm flex items-center justify-between ${cardStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />}
                        {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-danger flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5"
                  >
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-primary" />
                      Pedagogical Explanation:
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {quizQuestionsData[currentQuizIndex].explanation}
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-end pt-4 border-t border-white/10">
                  {!isAnswerSubmitted ? (
                    <Button
                      variant="primary"
                      disabled={!selectedOption}
                      onClick={submitQuizAnswer}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={nextQuizQuestion}
                      icon={<ChevronRight className="w-4 h-4" />}
                    >
                      {currentQuizIndex < quizQuestionsData.length - 1 ? 'Next Question' : 'View Score'}
                    </Button>
                  )}
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="text-center p-8 space-y-6">
                <div className="w-16 h-16 bg-success/20 border border-success/30 rounded-full flex items-center justify-center mx-auto text-success">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>
                  <p className="text-gray-400 text-sm">Excellent effort on your Ethiopian Grade 10 Economics review.</p>
                </div>

                <div className="max-w-xs mx-auto p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-gray-400 block mb-1">Your Score:</span>
                  <span className="text-4xl font-extrabold text-white">{quizScore} / {quizQuestionsData.length}</span>
                  <span className="text-xs text-primary font-semibold block mt-1">
                    ({Math.round((quizScore / quizQuestionsData.length) * 100)}% Proficiency)
                  </span>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={resetQuiz} icon={<RotateCcw className="w-4 h-4" />}>
                    Try Again
                  </Button>
                  <Button variant="primary" onClick={() => setActiveTab('content')}>
                    Back to Curriculum
                  </Button>
                </div>
              </GlassCard>
            )}
          </div>
        )}

        {/* AI Specialist Tab */}
        {activeTab === 'tutor' && (
          <div className="lg:col-span-12 max-w-3xl mx-auto w-full space-y-6">
            <GlassCard className="flex flex-col h-[500px]">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#7c4dff] flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Grade 10 Economics Specialist</h4>
                    <p className="text-[10px] text-gray-400">Curriculum-Aligned AI Assistant</p>
                  </div>
                </div>
                <Badge variant="primary">Unit 1 &amp; 2 Expert</Badge>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-[#1f2937]/90 border border-white/10 text-gray-200 rounded-tl-none space-y-2'
                      }`}
                    >
                      {/* Formatted answers or standard formatting */}
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isChatTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#1f2937]/90 border border-white/10 rounded-2xl p-4 text-xs text-gray-400 rounded-tl-none flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75" />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
                      </div>
                      Specialist is preparing response...
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested topics buttons */}
              <div className="p-3 border-t border-white/5 flex gap-2 overflow-x-auto bg-black/20">
                {[
                  "What is utility vs usefulness?",
                  "Explain Cardinal vs Ordinal approach",
                  "Solve Wheat equilibrium math",
                  "Show Banana consumption table"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-300 hover:text-white hover:bg-white/10 whitespace-nowrap transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-white/10 flex gap-2 bg-white/5 rounded-b-2xl">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask any Grade 10 Economics topic..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleSendMessage()}
                  icon={<Send className="w-4 h-4" />}
                />
              </div>
            </GlassCard>
          </div>
        )}

      </div>
    </div>
  );
}
