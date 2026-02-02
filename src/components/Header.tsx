import { motion } from 'framer-motion';
import { Cpu, Heart } from 'lucide-react';
import { CircuitManager } from './circuit/CircuitManager';

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-border bg-gradient-to-r from-card via-card/95 to-card backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Cpu size={22} className="text-primary" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-1.5">
              <span className="text-foreground">Trainer</span>
              <span className="text-primary">Board</span>
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">
              Digital Logic Simulator
            </p>
          </div>
        </div>

        {/* Center - Developer credit */}
        <motion.div 
          className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Made with</span>
            <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
          </div>
          <span className="text-sm font-semibold text-foreground">Samin Yasar</span>
        </motion.div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <CircuitManager />
          <div className="mode-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="bengali">বাংলা</span> Supported
          </div>
        </div>
      </div>
    </motion.header>
  );
};
