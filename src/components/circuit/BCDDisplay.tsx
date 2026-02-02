import { memo } from 'react';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

interface BCDDisplayProps {
  value: number; // 0-9
  label: string;
  color?: 'red' | 'green' | 'blue';
}

export const BCDDisplay = memo(({ value, label, color = 'red' }: BCDDisplayProps) => {
  const powerOn = useCircuitStore(s => s.circuit.powerOn);
  
  // Segment patterns for digits 0-9
  const patterns: Record<number, string> = {
    0: 'abcdef',
    1: 'bc',
    2: 'abdeg',
    3: 'abcdg',
    4: 'bcfg',
    5: 'acdfg',
    6: 'acdefg',
    7: 'abc',
    8: 'abcdefg',
    9: 'abcdfg',
  };

  const pattern = patterns[value % 10] || '';
  const isSegmentOn = (seg: string) => pattern.includes(seg) && powerOn;

  const colorClasses = {
    red: { on: 'bg-red-500 shadow-[0_0_8px_#ef4444]', off: 'bg-zinc-800' },
    green: { on: 'bg-green-500 shadow-[0_0_8px_#22c55e]', off: 'bg-zinc-800' },
    blue: { on: 'bg-blue-500 shadow-[0_0_8px_#3b82f6]', off: 'bg-zinc-800' },
  };

  const segmentStyle = (seg: string) => cn(
    "absolute transition-all duration-100",
    isSegmentOn(seg) ? colorClasses[color].on : colorClasses[color].off
  );

  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] text-zinc-500 font-mono mb-1">{label}</span>
      
      <div className="relative w-8 h-14 bg-zinc-950 rounded border border-zinc-700 p-1">
        {/* Segment A (top) */}
        <div className={cn(segmentStyle('a'), "top-1 left-1.5 right-1.5 h-1 rounded-sm")} />
        
        {/* Segment B (top-right) */}
        <div className={cn(segmentStyle('b'), "top-1.5 right-1 w-1 h-5 rounded-sm")} />
        
        {/* Segment C (bottom-right) */}
        <div className={cn(segmentStyle('c'), "top-7 right-1 w-1 h-5 rounded-sm")} />
        
        {/* Segment D (bottom) */}
        <div className={cn(segmentStyle('d'), "bottom-1 left-1.5 right-1.5 h-1 rounded-sm")} />
        
        {/* Segment E (bottom-left) */}
        <div className={cn(segmentStyle('e'), "top-7 left-1 w-1 h-5 rounded-sm")} />
        
        {/* Segment F (top-left) */}
        <div className={cn(segmentStyle('f'), "top-1.5 left-1 w-1 h-5 rounded-sm")} />
        
        {/* Segment G (middle) */}
        <div className={cn(segmentStyle('g'), "top-[25px] left-1.5 right-1.5 h-1 rounded-sm")} />
      </div>
    </div>
  );
});

BCDDisplay.displayName = 'BCDDisplay';

interface BCDDisplayBankProps {
  values: number[];
  label: string;
}

export const BCDDisplayBank = ({ values, label }: BCDDisplayBankProps) => {
  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-3 border border-zinc-700">
      <div className="text-[8px] text-zinc-500 font-semibold tracking-wider mb-2 text-center">
        {label}
      </div>
      
      <div className="flex justify-center gap-1">
        {values.map((val, idx) => (
          <BCDDisplay key={idx} value={val} label={`D${idx}`} color="red" />
        ))}
      </div>
    </div>
  );
};
