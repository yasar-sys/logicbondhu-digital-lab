import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

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
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={() => !disabled && powerOn && toggleSwitch(id)}
        disabled={disabled || !powerOn}
        className={cn(
          "relative w-6 h-10 rounded-md cursor-pointer transition-all duration-200",
          "bg-gradient-to-b from-zinc-700 to-zinc-900",
          "border border-zinc-600",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]",
          !powerOn && "opacity-50 cursor-not-allowed"
        )}
      >
        <motion.div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-4 h-3.5 rounded-sm",
            "bg-gradient-to-b",
            state === 1 
              ? "from-zinc-400 to-zinc-500" 
              : "from-zinc-500 to-zinc-600"
          )}
          animate={{
            top: state === 1 ? '3px' : '22px',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        />
        
        {/* LED indicator */}
        <div
          className={cn(
            "absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all",
            state === 1 && powerOn 
              ? "bg-green-500 shadow-[0_0_6px_#22c55e]" 
              : "bg-zinc-700"
          )}
        />
      </button>
      
      <span className={cn(
        "text-[8px] font-mono",
        state === 1 && powerOn ? "text-primary font-bold" : "text-zinc-500"
      )}>
        {label}
      </span>
      
      <span className={cn(
        "text-[9px] font-mono font-bold",
        state === 1 && powerOn ? "text-green-500" : "text-zinc-600"
      )}>
        {state}
      </span>
    </div>
  );
};
