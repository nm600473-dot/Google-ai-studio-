import React, { useState, useEffect } from 'react';
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
import { WifiOff, Download, X } from 'lucide-react';

function AppContent() {
  const { user, session, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA installation outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

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

      {/* Offline Notification Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-200 p-3.5 rounded-2xl flex items-center justify-between shadow-glow gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/30 rounded-xl text-amber-300">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Offline Mode</h4>
                  <p className="text-xs text-amber-200/80 mt-0.5">Using locally cached study plans & flashcards.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOffline(false)} 
                className="p-1 hover:bg-white/10 rounded-lg text-amber-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Promotion Card */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm"
          >
            <div className="bg-[#0b172a]/95 backdrop-blur-md border border-primary/30 p-4 rounded-2xl shadow-glow text-white">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/20 rounded-xl text-primary">
                    <Download className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-white">Install Areka App</h4>
                </div>
                <button 
                  onClick={() => setShowInstallBanner(false)} 
                  className="text-gray-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Add Areka to your home screen for full-screen view, faster load times, and streamlined learning offline.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 text-white font-semibold text-xs py-2 px-3 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install Now
                </button>
                <button
                  onClick={() => setShowInstallBanner(false)}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-2 px-3 rounded-xl border border-white/10 transition-all duration-200"
                >
                  Later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
