import { motion } from 'framer-motion';
import { useCircuitStore } from '@/store/circuit-store';
import { IC_DEFINITIONS } from '@/lib/ic-definitions';
import { PlacedIC } from '@/types/circuit';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ICChipProps {
  ic: PlacedIC;
  onDragEnd?: (position: { x: number; y: number }) => void;
}

export const ICChip = ({ ic, onDragEnd }: ICChipProps) => {
  const definition = IC_DEFINITIONS[ic.type];
  const selectComponent = useCircuitStore(s => s.selectComponent);
  const selectedComponent = useCircuitStore(s => s.selectedComponent);
  const removeIC = useCircuitStore(s => s.removeIC);
  const startWire = useCircuitStore(s => s.startWire);
  const completeWire = useCircuitStore(s => s.completeWire);
  const wireStart = useCircuitStore(s => s.wireStart);
  const powerOn = useCircuitStore(s => s.circuit.powerOn);

  const isSelected = selectedComponent === ic.id;
  const pinCount = definition.pinCount;
  const leftPins = definition.pins.slice(0, pinCount / 2);
  const rightPins = definition.pins.slice(pinCount / 2).reverse();

  const handlePinClick = (pinId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const point = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      componentId: ic.id,
      pinId: pinId,
    };
    
    if (wireStart) {
      completeWire(point);
    } else {
      startWire(point);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (onDragEnd) {
          onDragEnd({
            x: ic.position.x + info.offset.x,
            y: ic.position.y + info.offset.y,
          });
        }
      }}
      onClick={() => selectComponent(ic.id)}
      className={cn(
        "absolute cursor-grab active:cursor-grabbing",
        isSelected && "z-10"
      )}
      style={{
        left: ic.position.x,
        top: ic.position.y,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Delete button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeIC(ic.id);
          }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center z-20 hover:scale-110 transition-transform"
        >
          <X size={12} />
        </button>
      )}

      <div
        className={cn(
          "ic-chip flex gap-1 px-1 py-2",
          isSelected && "ring-2 ring-accent ring-offset-1 ring-offset-background"
        )}
      >
        {/* Left pins */}
        <div className="flex flex-col justify-between gap-1">
          {leftPins.map((pin, idx) => (
            <button
              key={pin.id}
              onClick={(e) => handlePinClick(pin.id, e)}
              className={cn(
                "connection-point",
                wireStart?.componentId === ic.id && wireStart?.pinId === pin.id && "ring-2 ring-accent"
              )}
              title={`Pin ${idx + 1}: ${pin.name}`}
            />
          ))}
        </div>

        {/* IC body */}
        <div className="flex flex-col items-center justify-center px-3 py-1 min-w-[60px]">
          <div className="w-3 h-1.5 rounded-full bg-muted/50 mb-2" />
          <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
            {definition.name}
          </span>
          <span className="text-[8px] text-muted-foreground/60 mt-0.5">
            {definition.category}
          </span>
          {/* Power indicator */}
          <div className={cn(
            "w-1.5 h-1.5 rounded-full mt-2",
            powerOn ? "bg-primary animate-pulse-glow" : "bg-muted"
          )} />
        </div>

        {/* Right pins */}
        <div className="flex flex-col justify-between gap-1">
          {rightPins.map((pin, idx) => (
            <button
              key={pin.id}
              onClick={(e) => handlePinClick(pin.id, e)}
              className={cn(
                "connection-point",
                wireStart?.componentId === ic.id && wireStart?.pinId === pin.id && "ring-2 ring-accent"
              )}
              title={`Pin ${pinCount - idx}: ${pin.name}`}
            />
          ))}
        </div>
      </div>

      {/* Pin labels on hover */}
      <div className="absolute -left-6 top-2 flex flex-col justify-between h-[calc(100%-16px)] text-[8px] text-muted-foreground font-mono">
        {leftPins.map((pin, idx) => (
          <span key={pin.id} className="leading-none">{idx + 1}</span>
        ))}
      </div>
      <div className="absolute -right-6 top-2 flex flex-col justify-between h-[calc(100%-16px)] text-[8px] text-muted-foreground font-mono">
        {rightPins.map((_, idx) => (
          <span key={idx} className="leading-none">{pinCount - idx}</span>
        ))}
      </div>
    </motion.div>
  );
};
