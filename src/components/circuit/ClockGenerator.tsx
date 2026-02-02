import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

export const ClockGenerator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [frequency, setFrequency] = useState(1);
  const [clockState, setClockState] = useState<0 | 1>(0);
  const powerOn = useCircuitStore(s => s.circuit.powerOn);

  // Clock pulse generator
  useEffect(() => {
    if (!isRunning || !powerOn) return;

    const interval = setInterval(() => {
      setClockState(prev => prev === 0 ? 1 : 0);
    }, 500 / frequency);

    return () => clearInterval(interval);
  }, [isRunning, frequency, powerOn]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setClockState(0);
  }, []);

  const handleManualPulse = useCallback(() => {
    if (!powerOn) return;
    setClockState(1);
    setTimeout(() => setClockState(0), 100);
  }, [powerOn]);

  return (
    <div className="panel">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Clock size={16} className="text-primary" />
        Clock Generator
      </h3>

      <div className="space-y-4">
        {/* Clock indicator */}
        <div className="flex items-center justify-center">
          <motion.div
            className={cn(
              "w-16 h-16 rounded-full border-4 flex items-center justify-center",
              clockState === 1 && powerOn
                ? "border-primary bg-primary/20"
                : "border-muted bg-muted/50"
            )}
            animate={{
              scale: clockState === 1 && powerOn ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.1 }}
          >
            <span className={cn(
              "text-2xl font-mono font-bold",
              clockState === 1 && powerOn ? "text-primary" : "text-muted-foreground"
            )}>
              {clockState}
            </span>
          </motion.div>
        </div>

        {/* Frequency control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Frequency</span>
            <span className="font-mono text-primary">{frequency} Hz</span>
          </div>
          <Slider
            value={[frequency]}
            onValueChange={([v]) => setFrequency(v)}
            min={0.5}
            max={10}
            step={0.5}
            disabled={!powerOn}
            className="w-full"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            disabled={!powerOn}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <Pause size={14} className="mr-1" />
                Stop
              </>
            ) : (
              <>
                <Play size={14} className="mr-1" />
                Auto
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualPulse}
            disabled={!powerOn || isRunning}
          >
            Pulse
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            disabled={!powerOn}
            className="h-8 w-8"
          >
            <RotateCcw size={14} />
          </Button>
        </div>

        {/* Visual clock waveform */}
        <div className="h-8 bg-muted/50 rounded-md overflow-hidden relative">
          <motion.div
            className="absolute inset-0"
            style={{
              background: powerOn 
                ? `repeating-linear-gradient(
                    90deg,
                    hsl(var(--primary)) 0px,
                    hsl(var(--primary)) ${100 / frequency}px,
                    transparent ${100 / frequency}px,
                    transparent ${200 / frequency}px
                  )`
                : 'transparent'
            }}
            animate={{
              x: isRunning ? [-200, 0] : 0,
            }}
            transition={{
              duration: 1 / frequency,
              repeat: isRunning ? Infinity : 0,
              ease: 'linear',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground font-mono">
              {isRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
