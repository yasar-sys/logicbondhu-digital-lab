import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCircuitStore } from '@/store/circuit-store';
import { ICChip } from './ICChip';
import { ToggleSwitchComponent } from './ToggleSwitch';
import { LEDComponent } from './LED';
import { PowerButton } from './PowerButton';
import { cn } from '@/lib/utils';
import { RotateCcw, Zap, AlertTriangle } from 'lucide-react';
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
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <PowerButton />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {circuit.powerOn ? (
                <span className="text-primary flex items-center gap-1">
                  <Zap size={14} /> POWER ON
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
          "relative flex-1 overflow-hidden pcb-texture",
          selectedIC && "cursor-crosshair",
          wireStart && "cursor-pointer"
        )}
      >
        {/* LED Row */}
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-border">
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

        {/* Placed ICs */}
        {circuit.ics.map(ic => (
          <ICChip
            key={ic.id}
            ic={ic}
            onDragEnd={(pos) => moveICPosition(ic.id, pos)}
          />
        ))}

        {/* Wire visualization would go here */}
        <svg className="absolute inset-0 pointer-events-none">
          {circuit.wires.map(wire => {
            // Simplified wire rendering - would need proper position calculation
            return null;
          })}
        </svg>

        {/* Switch Row */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-border">
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary text-sm text-center pointer-events-none"
          >
            <span className="text-primary font-medium">Click anywhere</span> to place the IC
          </motion.div>
        )}

        {wireStart && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent text-sm text-center pointer-events-none"
          >
            <span className="text-accent font-medium">Click a pin</span> to connect, or click elsewhere to cancel
          </motion.div>
        )}

        {/* Empty state */}
        {circuit.ics.length === 0 && !selectedIC && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-4xl mb-3">🔧</div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Start Building!
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Select an IC from the palette on the left, then click on the board to place it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
