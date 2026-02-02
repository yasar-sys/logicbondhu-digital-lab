import { motion } from 'framer-motion';
import { useCircuitStore } from '@/store/circuit-store';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  id: string;
  label: string;
  state: 0 | 1;
  disabled?: boolean;
}

export const ToggleSwitchComponent = ({ id, label, state, disabled }: ToggleSwitchProps) => {
  const toggleSwitch = useCircuitStore(s => s.toggleSwitch);
  const powerOn = useCircuitStore(s => s.circuit.powerOn);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
      <button
        onClick={() => !disabled && powerOn && toggleSwitch(id)}
        disabled={disabled || !powerOn}
        className={cn(
          "toggle-switch",
          !powerOn && "opacity-50 cursor-not-allowed"
        )}
      >
        <motion.div
          className="toggle-switch-handle"
          animate={{
            top: state === 1 ? '4px' : '36px',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        <div
          className={cn(
            "absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors",
            state === 1 && powerOn ? "bg-switch-on shadow-glow-green" : "bg-switch-off"
          )}
        />
      </button>
      <span className={cn(
        "text-[10px] font-mono font-bold",
        state === 1 && powerOn ? "text-primary" : "text-muted-foreground"
      )}>
        {state}
      </span>
    </div>
  );
};
