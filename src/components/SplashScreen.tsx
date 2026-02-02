import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, CircuitBoard } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, hsl(220 20% 12%) 0%, hsl(220 20% 6%) 100%)',
      }}
    >
      {/* Animated circuit traces background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              left: 0,
              right: 0,
            }}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 1, 0] }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-primary to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              top: 0,
              bottom: 0,
            }}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: '100%', opacity: [0, 1, 0] }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1, delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30 backdrop-blur-sm">
            <Cpu size={56} className="text-primary" />
          </div>
          
          {/* Orbiting elements */}
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1, repeat: Infinity },
            }}
          >
            <Zap size={14} className="text-primary-foreground" />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-secondary flex items-center justify-center"
            animate={{ 
              rotate: -360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1.5, repeat: Infinity },
            }}
          >
            <CircuitBoard size={12} className="text-secondary-foreground" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            <span className="text-foreground">DLD</span>
            <span className="text-primary ml-2">Trainer</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Digital Logic Design Simulator
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-muted-foreground mb-8 max-w-md bengali"
        >
          আপনার ভার্চুয়াল ডিজিটাল ইলেকট্রনিক্স ল্যাব
          <br />
          <span className="text-primary">with AI-Powered Learning</span>
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 240 }}
          transition={{ delay: 0.6 }}
          className="relative h-1.5 bg-muted rounded-full overflow-hidden"
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground mt-3 font-mono"
        >
          {progress < 100 ? 'Initializing simulation engine...' : 'Ready!'}
        </motion.span>

        {/* Developer credit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Developed by
            </span>
            <span className="text-sm font-semibold text-foreground">
              Samin Yasar
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
