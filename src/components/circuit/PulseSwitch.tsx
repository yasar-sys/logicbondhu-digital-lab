import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

interface PulseSwitchProps {
  id: string;
  label: string;
  color?: 'red' | 'white';
  onPulse?: () => void;
}

export const PulseSwitch = ({ id, label, color = 'red', onPulse }: PulseSwitchProps) => {
  const powerOn = useCircuitStore(s => s.circuit.powerOn);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = useCallback(() => {
    if (!powerOn) return;
    setIsPressed(true);
    onPulse?.();
  }, [powerOn, onPulse]);

  const handleRelease = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        disabled={!powerOn}
        className={cn(
          "w-8 h-8 rounded-full transition-all",
          "shadow-[0_4px_0_0] active:shadow-[0_2px_0_0] active:translate-y-[2px]",
          color === 'red' 
            ? "bg-gradient-to-b from-red-500 to-red-700 shadow-red-900" 
            : "bg-gradient-to-b from-zinc-300 to-zinc-400 shadow-zinc-600",
          !powerOn && "opacity-50 cursor-not-allowed",
          isPressed && "translate-y-[2px] shadow-[0_2px_0_0]"
        )}
        whileTap={{ scale: 0.95 }}
      >
        {isPressed && powerOn && (
          <div className={cn(
            "absolute inset-0 rounded-full",
            color === 'red' ? "bg-red-400" : "bg-zinc-200"
          )} />
        )}
      </motion.button>
      <span className="text-[8px] text-zinc-500 font-mono">{label}</span>
      
      {/* LED indicator */}
      <div className={cn(
        "w-2 h-2 rounded-full transition-all",
        isPressed && powerOn 
          ? "bg-green-500 shadow-[0_0_6px_#22c55e]" 
          : "bg-zinc-700"
      )} />
    </div>
  );
};

export const PulseSwitchBank = () => {
  const simulate = useCircuitStore(s => s.simulate);

  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-3 border border-zinc-700">
      <div className="text-[8px] text-zinc-500 font-semibold tracking-wider mb-3 text-center">
        PULSE SWITCHES
      </div>
      
      <div className="flex justify-center gap-4">
        <PulseSwitch id="pulse-a" label="A" color="red" onPulse={simulate} />
        <PulseSwitch id="pulse-b" label="B" color="red" onPulse={simulate} />
        <PulseSwitch id="pulse-c" label="C" color="white" onPulse={simulate} />
      </div>
    </div>
  );
};
