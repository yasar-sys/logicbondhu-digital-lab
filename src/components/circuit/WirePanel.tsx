import { motion } from 'framer-motion';
import { useCircuitStore, WIRE_COLORS, WireColor } from '@/store/circuit-store';
import { cn } from '@/lib/utils';
import { Cable, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const WirePanel = () => {
  const isWiringMode = useCircuitStore(s => s.isWiringMode);
  const setWiringMode = useCircuitStore(s => s.setWiringMode);
  const selectedWireColor = useCircuitStore(s => s.selectedWireColor);
  const setSelectedWireColor = useCircuitStore(s => s.setSelectedWireColor);
  const jumperWires = useCircuitStore(s => s.jumperWires);
  const removeJumperWire = useCircuitStore(s => s.removeJumperWire);
  const clearAllWires = useCircuitStore(s => s.clearAllWires);
  const cancelWire = useCircuitStore(s => s.cancelWire);
  const wireStart = useCircuitStore(s => s.wireStart);

  return (
    <div className="panel h-full flex flex-col">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Cable size={16} className="text-primary" />
        Jumper Wires
      </h3>

      {/* Wiring mode toggle */}
      <Button
        variant={isWiringMode ? "default" : "outline"}
        size="sm"
        onClick={() => setWiringMode(!isWiringMode)}
        className="mb-3"
      >
        <Cable size={14} className="mr-1" />
        {isWiringMode ? 'Exit Wiring Mode' : 'Start Wiring'}
      </Button>

      {/* Cancel current wire */}
      {wireStart && (
        <Button
          variant="ghost"
          size="sm"
          onClick={cancelWire}
          className="mb-3 text-yellow-500"
        >
          <X size={14} className="mr-1" />
          Cancel Current Wire
        </Button>
      )}

      {/* Color selector */}
      <div className="mb-4">
        <p className="text-[10px] text-muted-foreground mb-2">Wire Color</p>
        <div className="grid grid-cols-4 gap-1.5">
          {WIRE_COLORS.map(({ color, name }) => (
            <button
              key={color}
              onClick={() => setSelectedWireColor(color)}
              className={cn(
                "w-full aspect-square rounded-md border-2 transition-all",
                selectedWireColor === color 
                  ? "border-white scale-110 shadow-lg" 
                  : "border-transparent hover:border-zinc-500"
              )}
              style={{ backgroundColor: color }}
              title={name}
            />
          ))}
        </div>
      </div>

      {/* Wire list */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-muted-foreground">
            Placed Wires ({jumperWires.length})
          </p>
          {jumperWires.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllWires}
              className="h-6 text-[10px] text-destructive hover:text-destructive"
            >
              <Trash2 size={10} className="mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100%-24px)]">
          <div className="space-y-1.5 pr-2">
            {jumperWires.length === 0 ? (
              <p className="text-[10px] text-muted-foreground text-center py-4">
                No wires placed yet.
                <br />
                Click on the board to start wiring!
              </p>
            ) : (
              jumperWires.map((wire, idx) => (
                <motion.div
                  key={wire.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/50 group"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: wire.color }}
                  />
                  <span className="text-[10px] flex-1 truncate">
                    Wire {idx + 1}
                  </span>
                  <button
                    onClick={() => removeJumperWire(wire.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                  >
                    <X size={12} className="text-destructive" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Instructions */}
      {isWiringMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 rounded-md bg-primary/10 border border-primary/30"
        >
          <p className="text-[10px] text-primary">
            {wireStart 
              ? "Click another point to complete the wire" 
              : "Click on the board to start a wire"}
          </p>
        </motion.div>
      )}
    </div>
  );
};
