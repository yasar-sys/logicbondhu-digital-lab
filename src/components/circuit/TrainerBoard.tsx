import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCircuitStore } from '@/store/circuit-store';
import { ICChip } from './ICChip';
import { ToggleSwitchComponent } from './ToggleSwitch';
import { LEDComponent } from './LED';
import { PowerButton } from './PowerButton';
import { Breadboard } from './Breadboard';
import { cn } from '@/lib/utils';
import { RotateCcw, Zap, AlertTriangle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TrainerBoard = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const circuit = useCircuitStore(s => s.circuit);
  const selectedIC = useCircuitStore(s => s.selectedIC);
  const addIC = useCircuitStore(s => s.addIC);
  const moveICPosition = useCircuitStore(s => s.moveICPosition);
  const wireStart = useCircuitStore(s => s.wireStart);
  const cancelWire = useCircuitStore(s => s.cancelWire);
  const resetCircuit = useCircuitStore(s => s.resetCircuit);
  const simulationResult = useCircuitStore(s => s.simulationResult);

  const handleBoardClick = useCallback((e: React.MouseEvent) => {
    if (!boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedIC) {
      addIC(selectedIC, { x: x - 50, y: y - 40 });
    } else if (wireStart) {
      cancelWire();
    }
  }, [selectedIC, addIC, wireStart, cancelWire]);

  return (
    <div className="flex flex-col h-full">
      {/* Board Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <PowerButton />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {circuit.powerOn ? (
                <span className="text-primary flex items-center gap-1">
                  <Zap size={14} className="animate-pulse" /> POWER ON
                </span>
              ) : (
                <span className="text-muted-foreground">POWER OFF</span>
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              {circuit.name}
            </span>
          </div>
        </div>

        {/* Center title */}
        <div className="hidden md:flex items-center gap-2">
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
            <span className="text-xs font-semibold tracking-wide">
              ANALOG & DIGITAL TRAINING SYSTEM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {simulationResult?.warnings.length ? (
            <div className="flex items-center gap-1 text-yellow-500 text-xs">
              <AlertTriangle size={14} />
              {simulationResult.warnings.length} warning(s)
            </div>
          ) : null}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCircuit}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Main Board */}
      <div 
        ref={boardRef}
        onClick={handleBoardClick}
        className={cn(
          "relative flex-1 overflow-auto",
          selectedIC && "cursor-crosshair",
          wireStart && "cursor-pointer"
        )}
        style={{
          background: `
            linear-gradient(135deg, hsl(0 60% 25%) 0%, hsl(0 50% 18%) 100%)
          `,
        }}
      >
        {/* Corner screws */}
        {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
          <div 
            key={i}
            className={cn(
              "absolute w-4 h-4 rounded-full",
              "bg-gradient-to-br from-zinc-400 to-zinc-600",
              "shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.4)]",
              pos
            )}
          >
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700" />
          </div>
        ))}

        {/* LED Display Row - Top */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg px-6 py-4 border border-zinc-700 shadow-lg">
            <div className="text-[8px] text-zinc-500 text-center mb-2 font-semibold tracking-wider">
              LED DATA DISPLAYS
            </div>
            <div className="flex items-center gap-4">
              {circuit.leds.map(led => (
                <LEDComponent
                  key={led.id}
                  id={led.id}
                  label={led.label}
                  color={led.color}
                  state={led.state}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Breadboard - Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Breadboard rows={30} cols={10} />
        </div>

        {/* Placed ICs */}
        {circuit.ics.map(ic => (
          <ICChip
            key={ic.id}
            ic={ic}
            onDragEnd={(pos) => moveICPosition(ic.id, pos)}
          />
        ))}

        {/* Switch Row - Bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg px-6 py-4 border border-zinc-700 shadow-lg">
            <div className="text-[8px] text-zinc-500 text-center mb-2 font-semibold tracking-wider">
              DATA SWITCHES
            </div>
            <div className="flex items-center gap-3">
              {circuit.switches.map(sw => (
                <ToggleSwitchComponent
                  key={sw.id}
                  id={sw.id}
                  label={sw.label}
                  state={sw.state}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Instructions overlay */}
        {selectedIC && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary text-sm text-center pointer-events-none z-20"
          >
            <span className="text-primary font-medium">Click anywhere</span> to place the IC
          </motion.div>
        )}

        {wireStart && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent text-sm text-center pointer-events-none z-20"
          >
            <span className="text-accent font-medium">Click a pin</span> to connect, or click elsewhere to cancel
          </motion.div>
        )}

        {/* Empty state hint */}
        {circuit.ics.length === 0 && !selectedIC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-24 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border max-w-[200px] z-10"
          >
            <div className="text-2xl mb-2">💡</div>
            <h4 className="text-sm font-semibold mb-1">Get Started</h4>
            <p className="text-xs text-muted-foreground">
              Select an IC from the left panel and click on the board to place it!
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer credit bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gradient-to-r from-zinc-900 to-zinc-800 border-t border-zinc-700">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="font-mono">M21-7000</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">Virtual DLD Trainer Board</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <User size={10} className="text-primary" />
          <span className="text-zinc-400">Developed by</span>
          <span className="font-semibold text-primary">Samin Yasar</span>
        </div>
      </div>
    </div>
  );
};
