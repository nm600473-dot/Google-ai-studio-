import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AIMemoryProvider } from './contexts/AIMemoryContext';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/layout/Navigation';
import { Dashboard } from './components/dashboard/Dashboard';
import { AITutor } from './components/ai-tutor/AITutor';
import { QuizPage } from './components/quizzes/QuizPage';
import { FlashcardPage } from './components/flashcards/FlashcardPage';
import { LibraryPage } from './components/library/LibraryPage';
import { CommunityPage } from './components/community/CommunityPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { StudyPlanPage } from './components/study-plan/StudyPlanPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { SubjectsPage } from './components/subjects/SubjectsPage';
import { MemoryPage } from './components/memory/MemoryPage';
import { PreviewPage } from './components/preview/PreviewPage';
import { FloatingParticles } from './components/ui/Confetti';

function AppContent() {
  const { user, session, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (!user || !session) {
    if (showAuth) {
      return (
        <AuthPage
          onShowPreview={() => setShowAuth(false)}
        />
      );
    }
    return (
      <PreviewPage
        onGetStarted={() => setShowAuth(true)}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'subjects':
        return <SubjectsPage />;
      case 'ai-tutor':
        return <AITutor />;
      case 'quizzes':
        return <QuizPage />;
      case 'flashcards':
        return <FlashcardPage />;
      case 'library':
        return <LibraryPage />;
      case 'community':
        return <CommunityPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'study-plan':
        return <StudyPlanPage />;
      case 'settings':
        return <SettingsPage />;
      case 'memory':
        return <MemoryPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <FloatingParticles />
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </Layout>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AIMemoryProvider>
        <AppContent />
      </AIMemoryProvider>
    </AuthProvider>
  );
}

export default App;
