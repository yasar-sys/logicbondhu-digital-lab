import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

interface LEDProps {
  id: string;
  label: string;
  color: 'red' | 'green' | 'yellow';
  state: 0 | 1;
}

export const LEDComponent = ({ id, label, color, state }: LEDProps) => {
  const powerOn = useCircuitStore(s => s.circuit.powerOn);
  const isOn = state === 1 && powerOn;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[7px] font-mono text-zinc-500">{label}</span>
      
      <motion.div
        className={cn(
          "w-3 h-3 rounded-full transition-all duration-150",
          "border border-zinc-600",
          isOn ? (
            color === 'red' 
              ? 'bg-red-500 shadow-[0_0_8px_#ef4444,0_0_16px_#ef4444]' 
              : color === 'green' 
                ? 'bg-green-500 shadow-[0_0_8px_#22c55e,0_0_16px_#22c55e]'
                : 'bg-yellow-500 shadow-[0_0_8px_#eab308,0_0_16px_#eab308]'
          ) : 'bg-zinc-800'
        )}
        animate={{
          scale: isOn ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.3,
          repeat: isOn ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
