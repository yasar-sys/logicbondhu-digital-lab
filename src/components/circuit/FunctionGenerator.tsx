import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Triangle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

type WaveformType = 'sine' | 'square' | 'triangle';

export const FunctionGenerator = () => {
  const powerOn = useCircuitStore(s => s.circuit.powerOn);
  const [isRunning, setIsRunning] = useState(false);
  const [frequency, setFrequency] = useState(1000); // Hz
  const [amplitude, setAmplitude] = useState(5); // Volts peak
  const [waveform, setWaveform] = useState<WaveformType>('sine');
  const [ttlMode, setTtlMode] = useState(false);
  const [phase, setPhase] = useState(0);

  // Animate waveform
  useEffect(() => {
    if (!isRunning || !powerOn) return;
    
    const interval = setInterval(() => {
      setPhase(p => (p + 0.1) % (Math.PI * 2));
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, powerOn]);

  const getWaveformPath = () => {
    const width = 120;
    const height = 40;
    const centerY = height / 2;
    const points: string[] = [];

    for (let x = 0; x < width; x++) {
      const t = (x / width) * Math.PI * 4 + phase;
      let y: number;

      switch (waveform) {
        case 'sine':
          y = centerY - Math.sin(t) * (height / 2 - 4) * (amplitude / 10);
          break;
        case 'square':
          y = centerY - (Math.sin(t) > 0 ? 1 : -1) * (height / 2 - 4) * (amplitude / 10);
          break;
        case 'triangle':
          const period = Math.PI * 2;
          const normalized = ((t % period) + period) % period;
          const triangleValue = normalized < Math.PI 
            ? (normalized / Math.PI) * 2 - 1 
            : 1 - ((normalized - Math.PI) / Math.PI) * 2;
          y = centerY - triangleValue * (height / 2 - 4) * (amplitude / 10);
          break;
        default:
          y = centerY;
      }

      points.push(`${x},${y}`);
    }

    return `M ${points.join(' L ')}`;
  };

  const waveformButtons: { type: WaveformType; icon: React.ReactNode; label: string }[] = [
    { type: 'sine', icon: <Activity size={12} />, label: 'Sine' },
    { type: 'square', icon: <Square size={12} />, label: 'Square' },
    { type: 'triangle', icon: <Triangle size={12} />, label: 'Triangle' },
  ];

  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-3 border border-zinc-700">
      <div className="text-[8px] text-zinc-500 font-semibold tracking-wider mb-3 text-center">
        FUNCTION GENERATOR
      </div>

      {/* Waveform display */}
      <div className="bg-zinc-950 rounded-md p-2 mb-3 border border-zinc-700">
        <svg width="120" height="40" className="w-full">
          <rect width="100%" height="100%" fill="transparent" />
          {/* Grid lines */}
          <line x1="0" y1="20" x2="120" y2="20" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="60" y1="0" x2="60" y2="40" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
          
          {/* Waveform */}
          <motion.path
            d={getWaveformPath()}
            fill="none"
            stroke={powerOn && isRunning ? "#22c55e" : "#555"}
            strokeWidth="2"
            className={cn(powerOn && isRunning && "drop-shadow-[0_0_4px_#22c55e]")}
          />
        </svg>
      </div>

      {/* Waveform selector */}
      <div className="flex gap-1 mb-3">
        {waveformButtons.map(({ type, icon, label }) => (
          <button
            key={type}
            onClick={() => setWaveform(type)}
            disabled={!powerOn}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[9px] font-medium transition-colors",
              waveform === type
                ? "bg-primary text-primary-foreground"
                : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Frequency control */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-zinc-400">FREQUENCY</span>
          <span className={cn(
            "text-xs font-mono font-bold",
            powerOn ? "text-primary" : "text-zinc-600"
          )}>
            {frequency >= 1000 ? `${(frequency / 1000).toFixed(1)}kHz` : `${frequency}Hz`}
          </span>
        </div>
        <Slider
          value={[frequency]}
          onValueChange={([v]) => setFrequency(v)}
          min={1}
          max={100000}
          step={10}
          disabled={!powerOn}
        />
      </div>

      {/* Amplitude control */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-zinc-400">AMPLITUDE</span>
          <span className={cn(
            "text-xs font-mono font-bold",
            powerOn ? "text-yellow-500" : "text-zinc-600"
          )}>
            {amplitude.toFixed(1)}Vpp
          </span>
        </div>
        <Slider
          value={[amplitude]}
          onValueChange={([v]) => setAmplitude(v)}
          min={0.1}
          max={10}
          step={0.1}
          disabled={!powerOn}
        />
      </div>

      {/* TTL Mode toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] text-zinc-400">TTL MODE</span>
        <button
          onClick={() => setTtlMode(!ttlMode)}
          disabled={!powerOn}
          className={cn(
            "w-8 h-4 rounded-full transition-colors relative",
            ttlMode && powerOn ? "bg-primary" : "bg-zinc-700"
          )}
        >
          <div className={cn(
            "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform",
            ttlMode ? "translate-x-4" : "translate-x-0.5"
          )} />
        </button>
      </div>

      {/* Output indicator */}
      <div className="flex gap-2">
        <Button
          variant={isRunning ? "destructive" : "default"}
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          disabled={!powerOn}
          className="flex-1 text-xs"
        >
          {isRunning ? (
            <>
              <Pause size={12} className="mr-1" />
              Stop
            </>
          ) : (
            <>
              <Play size={12} className="mr-1" />
              Start
            </>
          )}
        </Button>
        
        <div className="flex items-center gap-2 px-2 bg-zinc-950 rounded border border-zinc-700">
          <span className="text-[8px] text-zinc-500">OUTPUT</span>
          <div className={cn(
            "w-2 h-2 rounded-full",
            isRunning && powerOn ? "bg-green-500 animate-pulse shadow-[0_0_6px_#22c55e]" : "bg-zinc-600"
          )} />
          <span className="text-[8px] text-zinc-500">GND</span>
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
        </div>
      </div>
    </div>
  );
};
