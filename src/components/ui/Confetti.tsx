import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleProps {
  x: number;
  y: number;
  color: string;
  delay: number;
}

function Particle({ x, y, color, delay }: ParticleProps) {
  const angle = Math.random() * Math.PI * 2;
  const velocity = 50 + Math.random() * 100;
  const endX = x + Math.cos(angle) * velocity;
  const endY = y + Math.sin(angle) * velocity - 50;

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm pointer-events-none"
      style={{ backgroundColor: color, left: x, top: y }}
      initial={{ scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }}
      animate={{
        scale: 0,
        opacity: 0,
        x: endX - x,
        y: endY - y,
        rotate: 720,
      }}
      transition={{ duration: 1, delay, ease: 'easeOut' }}
    />
  );
}

interface ConfettiProps {
  trigger: boolean;
  origin?: { x: number; y: number };
  colors?: string[];
  onComplete?: () => void;
}

export function Confetti({ trigger, origin, colors = ['#4F8CFF', '#7C4DFF', '#00D084', '#FFA500', '#FF6B6B'], onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles: ParticleProps[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          x: origin?.x ?? window.innerWidth / 2,
          y: origin?.y ?? window.innerHeight / 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.2,
        });
      }
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [trigger, origin, colors, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}
    </div>
  );
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="floating-particles">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/20"
        style={{
          borderTopColor: '#4F8CFF',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function PulseLoader() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

interface AchievementUnlockProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    name: string;
    description: string;
    icon: string;
    xpReward: number;
  };
}

export function AchievementUnlock({ isOpen, onClose, achievement }: AchievementUnlockProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="glass-card text-center max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(79, 140, 255, 0.3)',
                  '0 0 40px rgba(79, 140, 255, 0.6)',
                  '0 0 20px rgba(79, 140, 255, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl">{achievement.icon}</span>
            </motion.div>

            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Achievement Unlocked!
            </motion.h3>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-semibold gradient-text mb-1"
            >
              {achievement.name}
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mb-4"
            >
              {achievement.description}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-accent font-bold"
            >
              <span>+{achievement.xpReward} XP</span>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className="mt-6 btn-primary"
            >
              Awesome!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface XPNotificationProps {
  xp: number;
  onClose: () => void;
}

export function XPNotification({ xp, onClose }: XPNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.5 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass px-6 py-3 rounded-full flex items-center gap-2"
    >
      <span className="text-accent font-bold text-xl">+{xp} XP</span>
    </motion.div>
  );
}
