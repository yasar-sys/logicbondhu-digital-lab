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
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
      <motion.div
        className={cn(
          "led",
          isOn ? (
            color === 'red' ? 'led-on-red' :
            color === 'green' ? 'led-on-green' :
            'bg-led-yellow'
          ) : 'led-off'
        )}
        animate={{
          scale: isOn ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: isOn ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      <span className={cn(
        "text-[10px] font-mono font-bold",
        isOn ? (
          color === 'red' ? 'text-red-500' :
          color === 'green' ? 'text-green-500' :
          'text-yellow-500'
        ) : 'text-muted-foreground'
      )}>
        {state}
      </span>
    </div>
  );
};
