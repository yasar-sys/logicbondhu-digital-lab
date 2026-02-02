import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useCircuitStore } from '@/store/circuit-store';
import { ICChip } from './ICChip';
import { ToggleSwitchComponent } from './ToggleSwitch';
import { LEDComponent } from './LED';
import { PowerButton } from './PowerButton';
import { Breadboard } from './Breadboard';
import { DCPowerSupply } from './DCPowerSupply';
import { FunctionGenerator } from './FunctionGenerator';
import { PotentiometerBank } from './Potentiometer';
import { PulseSwitchBank } from './PulseSwitch';
import { BCDDisplayBank } from './BCDDisplay';
import { Speaker } from './Speaker';
import { AdapterBank } from './Adapters';
import { cn } from '@/lib/utils';
import { RotateCcw, Zap, AlertTriangle, User, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [bcdValues] = useState([0, 0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleBoardClick = useCallback((e: React.MouseEvent) => {
    if (!boardRef.current) return;
    
    // Don't place IC if clicking on a component
    if ((e.target as HTMLElement).closest('.no-ic-place')) return;
    
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
    <div className={cn(
      "flex flex-col h-full",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Board Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900">
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
            <span className="text-xs text-muted-foreground font-mono">
              MCP M21-7000
            </span>
          </div>
        </div>

        {/* Center title */}
        <div className="hidden lg:flex items-center">
          <div className="px-6 py-2 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 border border-zinc-600 shadow-lg">
            <span className="text-sm font-bold tracking-wider text-foreground">
              ANALOG & DIGITAL TRAINING SYSTEM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {simulationResult?.warnings.length ? (
            <div className="flex items-center gap-1 text-yellow-500 text-xs">
              <AlertTriangle size={14} />
              {simulationResult.warnings.length}
            </div>
          ) : null}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
          
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
        className={cn(
          "relative flex-1 overflow-hidden",
          selectedIC && "cursor-crosshair",
          wireStart && "cursor-pointer"
        )}
        style={{
          background: `
            linear-gradient(135deg, hsl(0 55% 22%) 0%, hsl(0 45% 15%) 100%)
          `,
        }}
      >
        {/* Corner screws */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
          <div 
            key={i}
            className={cn(
              "absolute w-4 h-4 rounded-full z-10",
              "bg-gradient-to-br from-zinc-400 to-zinc-600",
              "shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.4)]",
              pos
            )}
          >
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700" />
          </div>
        ))}

        <ScrollArea className="h-full">
          <div 
            ref={boardRef}
            onClick={handleBoardClick}
            className="min-h-full p-4"
            style={{ minWidth: '1200px', minHeight: '800px' }}
          >
            {/* Top Row - LED Displays and Controls */}
            <div className="flex gap-3 mb-4">
              {/* Left column - Power & Potentiometers */}
              <div className="w-48 space-y-3 no-ic-place">
                <DCPowerSupply />
                <PotentiometerBank />
              </div>

              {/* Center - LED Display */}
              <div className="flex-1 no-ic-place">
                <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-4 border border-zinc-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[8px] text-zinc-500 font-semibold tracking-wider">
                      LED DATA DISPLAYS
                    </div>
                    <div className="flex gap-4 text-[8px]">
                      <span className="text-green-500">● HIGH: GREEN</span>
                      <span className="text-red-500">● LOW: RED</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-2">
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

              {/* Right column - BCD & Adapters */}
              <div className="w-48 space-y-3 no-ic-place">
                <BCDDisplayBank values={bcdValues} label="BCD DISPLAYS" />
                <AdapterBank />
              </div>
            </div>

            {/* Middle Row - Function Generator, Breadboard, Controls */}
            <div className="flex gap-3 mb-4">
              {/* Left - Function Generator */}
              <div className="w-48 no-ic-place">
                <FunctionGenerator />
              </div>

              {/* Center - Breadboard */}
              <div className="flex-1 flex items-center justify-center relative">
                <Breadboard rows={30} cols={10} />
                
                {/* Placed ICs */}
                {circuit.ics.map(ic => (
                  <ICChip
                    key={ic.id}
                    ic={ic}
                    onDragEnd={(pos) => moveICPosition(ic.id, pos)}
                  />
                ))}

                {/* Instructions overlay */}
                {selectedIC && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary text-sm text-center pointer-events-none z-20"
                  >
                    <span className="text-primary font-medium">Click</span> to place IC
                  </motion.div>
                )}
              </div>

              {/* Right - Pulse switches & Speaker */}
              <div className="w-48 space-y-3 no-ic-place">
                <PulseSwitchBank />
                <Speaker />
              </div>
            </div>

            {/* Bottom Row - Data Switches */}
            <div className="no-ic-place">
              <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-4 border border-zinc-700">
                <div className="text-[8px] text-zinc-500 font-semibold tracking-wider mb-3 text-center">
                  DATA SWITCHES
                </div>
                <div className="flex justify-center gap-2">
                  {circuit.switches.map(sw => (
                    <ToggleSwitchComponent
                      key={sw.id}
                      id={sw.id}
                      label={sw.label}
                      state={sw.state}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-8 mt-2">
                  <span className="text-[8px] text-zinc-500">SW15 - SW8</span>
                  <span className="text-[8px] text-zinc-500">SW7 - SW0</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Footer credit bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-t border-zinc-700">
        <div className="flex items-center gap-3 text-[10px] text-zinc-500">
          <span className="font-mono font-bold text-zinc-400">MCP</span>
          <span>M21-7000</span>
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
