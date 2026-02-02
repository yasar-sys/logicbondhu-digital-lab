import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

export const Speaker = () => {
  const powerOn = useCircuitStore(s => s.circuit.powerOn);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(50);
  const [frequency, setFrequency] = useState(440);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!powerOn || isMuted) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      return;
    }

    // Create audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    
    // Create oscillator
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    gain.gain.value = volume / 500;
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.start();
    
    oscillatorRef.current = oscillator;
    gainRef.current = gain;

    return () => {
      oscillator.stop();
    };
  }, [powerOn, isMuted, frequency, volume]);

  // Update frequency
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = frequency;
    }
  }, [frequency]);

  // Update volume
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume / 500;
    }
  }, [volume]);

  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-3 border border-zinc-700">
      <div className="text-[8px] text-zinc-500 font-semibold tracking-wider mb-3 text-center">
        SPEAKER
      </div>

      {/* Speaker grille */}
      <div className="flex justify-center mb-3">
        <div className={cn(
          "w-12 h-12 rounded-full",
          "bg-gradient-to-br from-zinc-700 to-zinc-900",
          "border-2 border-zinc-600",
          "flex items-center justify-center",
          "shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]"
        )}>
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
            <div className={cn(
              "w-4 h-4 rounded-full",
              !isMuted && powerOn ? "bg-zinc-600 animate-pulse" : "bg-zinc-700"
            )} />
          </div>
        </div>
      </div>

      {/* Mute toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        disabled={!powerOn}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-1.5 rounded mb-3",
          "transition-colors",
          isMuted ? "bg-zinc-700 text-zinc-400" : "bg-primary text-primary-foreground"
        )}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        <span className="text-[10px] font-medium">
          {isMuted ? 'Muted' : 'Playing'}
        </span>
      </button>

      {/* Volume */}
      <div className="space-y-2 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-zinc-400">Volume</span>
          <span className="text-[9px] font-mono text-zinc-300">{volume}%</span>
        </div>
        <Slider
          value={[volume]}
          onValueChange={([v]) => setVolume(v)}
          min={0}
          max={100}
          step={5}
          disabled={!powerOn || isMuted}
        />
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-zinc-400">Frequency</span>
          <span className="text-[9px] font-mono text-zinc-300">{frequency}Hz</span>
        </div>
        <Slider
          value={[frequency]}
          onValueChange={([v]) => setFrequency(v)}
          min={100}
          max={2000}
          step={10}
          disabled={!powerOn || isMuted}
        />
      </div>
    </div>
  );
};
