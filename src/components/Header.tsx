import { motion } from 'framer-motion';
import { Cpu, Github, Heart } from 'lucide-react';

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Cpu size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              DLD Trainer
              <span className="text-primary ml-1">Board</span>
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">
              Digital Logic Design Simulator
            </p>
          </div>
        </div>

        {/* Center - Made with love badge */}
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span>Made with</span>
          <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
          <span>for CSE students</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="mode-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="bengali">বাংলা</span> Supported
          </div>
        </div>
      </div>
    </motion.header>
  );
};
