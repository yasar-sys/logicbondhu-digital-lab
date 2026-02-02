import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

interface PotentiometerProps {
  id: string;
  label: string;
  maxResistance: number; // in ohms
  unit: string;
}

export const Potentiometer = ({ id, label, maxResistance, unit }: PotentiometerProps) => {
  const powerOn = useCircuitStore(s => s.circuit.powerOn);
  const [value, setValue] = useState(maxResistance / 2);

  const formatResistance = (r: number): string => {
    if (r >= 1000000) return `${(r / 1000000).toFixed(1)}MΩ`;
    if (r >= 1000) return `${(r / 1000).toFixed(1)}kΩ`;
    return `${r.toFixed(0)}Ω`;
  };

  // Calculate rotation angle (0-270 degrees)
  const rotation = (value / maxResistance) * 270 - 135;

  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] text-zinc-500 font-semibold mb-1">{label}</span>
      
      {/* Knob */}
      <div 
        className={cn(
          "relative w-10 h-10 rounded-full",
          "bg-gradient-to-b from-zinc-600 to-zinc-800",
          "border-2 border-zinc-500",
          "shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)]",
          !powerOn && "opacity-60"
        )}
      >
        {/* Indicator line */}
        <div 
          className="absolute top-1 left-1/2 w-0.5 h-3 bg-white rounded-full origin-bottom"
          style={{ 
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            transformOrigin: 'center 16px'
          }}
        />
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-900" />
      </div>

      {/* Slider (hidden, for value control) */}
      <div className="w-full mt-2">
        <Slider
          value={[value]}
          onValueChange={([v]) => setValue(v)}
          min={0}
          max={maxResistance}
          step={maxResistance / 100}
          disabled={!powerOn}
          className="w-full"
        />
      </div>

      <span className={cn(
        "text-[9px] font-mono mt-1",
        powerOn ? "text-primary" : "text-zinc-600"
      )}>
        {formatResistance(value)}
      </span>
    </div>
  );
};

export const PotentiometerBank = () => {
  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-3 border border-zinc-700">
      <div className="text-[8px] text-zinc-500 font-semibold tracking-wider mb-3 text-center">
        POTENTIOMETER
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <Potentiometer id="pot-1" label="10KΩ" maxResistance={10000} unit="kΩ" />
        <Potentiometer id="pot-2" label="100KΩ" maxResistance={100000} unit="kΩ" />
        <Potentiometer id="pot-3" label="1MΩ" maxResistance={1000000} unit="MΩ" />
      </div>
    </div>
  );
};
