import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

interface VoltageOutput {
  label: string;
  voltage: number;
  color: string;
  fixed?: boolean;
}

export const DCPowerSupply = () => {
  const powerOn = useCircuitStore(s => s.circuit.powerOn);
  const [variableVoltage, setVariableVoltage] = useState(5);

  const outputs: VoltageOutput[] = [
    { label: '+5V', voltage: 5, color: 'text-red-500', fixed: true },
    { label: '+12V', voltage: 12, color: 'text-red-400', fixed: true },
    { label: '-12V', voltage: -12, color: 'text-blue-400', fixed: true },
    { label: '-5V', voltage: -5, color: 'text-blue-500', fixed: true },
    { label: 'GND', voltage: 0, color: 'text-zinc-400', fixed: true },
    { label: 'VAR', voltage: variableVoltage, color: 'text-yellow-500', fixed: false },
  ];

  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-3 border border-zinc-700">
      <div className="text-[8px] text-zinc-500 font-semibold tracking-wider mb-3 text-center">
        DC POWER SUPPLY
      </div>

      {/* Fixed outputs */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {outputs.slice(0, 5).map((output) => (
          <div key={output.label} className="flex flex-col items-center">
            <div className={cn(
              "w-4 h-4 rounded-full border-2 mb-1",
              powerOn ? output.color : "border-zinc-600",
              powerOn && output.voltage !== 0 && "shadow-[0_0_8px_currentColor]"
            )} 
            style={{ borderColor: powerOn ? 'currentColor' : undefined }}
            />
            <span className={cn(
              "text-[9px] font-mono font-bold",
              powerOn ? output.color : "text-zinc-600"
            )}>
              {output.label}
            </span>
          </div>
        ))}
      </div>

      {/* Variable output */}
      <div className="border-t border-zinc-700 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] text-zinc-400">Variable</span>
          <span className={cn(
            "text-xs font-mono font-bold",
            powerOn ? "text-yellow-500" : "text-zinc-600"
          )}>
            {variableVoltage.toFixed(1)}V
          </span>
        </div>
        
        {/* Knob simulation */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-zinc-500">0</span>
          <Slider
            value={[variableVoltage]}
            onValueChange={([v]) => setVariableVoltage(v)}
            min={0}
            max={18}
            step={0.5}
            disabled={!powerOn}
            className="flex-1"
          />
          <span className="text-[8px] text-zinc-500">+18V</span>
        </div>
      </div>
    </div>
  );
};
