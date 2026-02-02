import { motion } from 'framer-motion';
import { useCircuitStore } from '@/store/circuit-store';
import { LearningMode } from '@/types/circuit';
import { cn } from '@/lib/utils';
import { GraduationCap, FlaskConical, Zap, BookOpen, MessageSquare } from 'lucide-react';

const MODES: { id: LearningMode; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'beginner', label: 'Beginner', icon: <GraduationCap size={14} />, description: 'Guided mode' },
  { id: 'lab-exam', label: 'Lab Exam', icon: <FlaskConical size={14} />, description: 'No hints' },
  { id: 'challenge', label: 'Challenge', icon: <Zap size={14} />, description: 'Time-based' },
  { id: 'theory', label: 'Theory', icon: <BookOpen size={14} />, description: 'Learn concepts' },
  { id: 'viva', label: 'Viva Prep', icon: <MessageSquare size={14} />, description: 'Q&A practice' },
];

export const LearningModeSelector = () => {
  const currentMode = useCircuitStore(s => s.learningMode);
  const setLearningMode = useCircuitStore(s => s.setLearningMode);

  return (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
      {MODES.map(mode => (
        <motion.button
          key={mode.id}
          onClick={() => setLearningMode(mode.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            currentMode === mode.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={mode.description}
        >
          {mode.icon}
          <span className="hidden sm:inline">{mode.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
