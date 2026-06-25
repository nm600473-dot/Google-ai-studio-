import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, GraduationCap, Brain, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input } from '../ui/GlassCard';

interface AuthPageProps {
  onSuccess?: () => void;
  onShowPreview?: () => void;
}

export function AuthPage({ onSuccess, onShowPreview }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) throw signUpError;
        onSuccess?.();
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: '20%', left: '10%', delay: 0 },
          { top: '60%', left: '20%', delay: 1 },
          { top: '40%', left: '80%', delay: 2 },
          { top: '80%', left: '70%', delay: 3 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full bg-primary/10 blur-3xl"
            style={{ top: pos.top, left: pos.left }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: pos.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-display font-bold gradient-text">EduVerse AI</span>
          </motion.div>
          <p className="text-gray-400 mt-2">
            {isSignUp ? 'Start your learning journey' : 'Welcome back, scholar!'}
          </p>
        </div>

        <motion.div
          layout
          className="glass-card"
        >
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                !isSignUp ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                isSignUp ? 'bg-secondary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {isSignUp && (
                <Input
                  label="Full Name"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  icon={<User className="w-5 h-5" />}
                  required
                />
              )}

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-danger text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                variant={isSignUp ? 'secondary' : 'primary'}
                className="w-full"
                isLoading={loading}
                icon={<Sparkles className="w-4 h-4" />}
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-6 text-center text-sm text-gray-400">
            {onShowPreview && (
              <button
                onClick={onShowPreview}
                className="block w-full text-gray-400 hover:text-white transition-colors mb-4"
              >
                Back to Preview
              </button>
            )}
            {isSignUp ? (
              <span>Already have an account?</span>
            ) : (
              <span>Don't have an account?</span>
            )}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: Brain, label: 'AI Tutor', value: '24/7' },
            { icon: Trophy, label: 'Gamified', value: 'XP System' },
            { icon: GraduationCap, label: 'Subjects', value: '8+' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass-hover rounded-xl p-4 text-center"
            >
              <item.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
              <div className="text-xs text-gray-400">{item.label}</div>
              <div className="text-sm font-semibold text-white">{item.value}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
