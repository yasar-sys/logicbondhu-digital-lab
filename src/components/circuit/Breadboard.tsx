import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

interface BreadboardProps {
  rows?: number;
  cols?: number;
}

export const Breadboard = memo(({ rows = 30, cols = 10 }: BreadboardProps) => {
  const wireStart = useCircuitStore(s => s.wireStart);
  const startWire = useCircuitStore(s => s.startWire);
  const completeWire = useCircuitStore(s => s.completeWire);
  const powerOn = useCircuitStore(s => s.circuit.powerOn);

  const handleHoleClick = (row: number, col: number, section: 'top' | 'bottom', e: React.MouseEvent) => {
    e.stopPropagation();
    const holeId = `hole-${section}-${row}-${col}`;
    // Get position relative to the page for wire drawing
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const point = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      componentId: 'breadboard',
      pinId: holeId,
    };
    
    if (wireStart) {
      completeWire(point);
    } else {
      startWire(point);
    }
  };

  const renderHole = (row: number, col: number, section: 'top' | 'bottom') => {
    const holeId = `hole-${section}-${row}-${col}`;
    const isSelected = wireStart?.componentId === 'breadboard' && wireStart?.pinId === holeId;
    
    return (
      <button
        key={`${section}-${row}-${col}`}
        onClick={(e) => handleHoleClick(row, col, section, e)}
        className={cn(
          "w-2 h-2 rounded-full transition-all duration-150",
          "bg-gradient-to-b from-zinc-700 to-zinc-900",
          "border border-zinc-600/50",
          "hover:bg-zinc-500 hover:scale-125 hover:shadow-[0_0_6px_rgba(34,197,94,0.6)]",
          isSelected && "bg-primary scale-125 shadow-[0_0_8px_rgba(34,197,94,0.8)]",
          !powerOn && "opacity-60"
        )}
        title={`${section.toUpperCase()} Row ${row + 1}, Col ${col + 1}`}
      />
    );
  };

  const renderPowerRail = (type: 'positive' | 'negative', position: 'top' | 'bottom') => {
    const color = type === 'positive' ? 'bg-red-500' : 'bg-blue-500';
    const borderColor = type === 'positive' ? 'border-red-400' : 'border-blue-400';
    
    return (
      <div className="flex items-center gap-1">
        <span className={cn(
          "w-1.5 h-full rounded-sm",
          color,
          "opacity-80"
        )} />
        <div className="flex gap-[3px]">
          {[...Array(cols * 3)].map((_, i) => (
            <button
              key={`${position}-${type}-${i}`}
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                "bg-gradient-to-b from-zinc-600 to-zinc-800",
                "border border-zinc-500/50",
                "hover:scale-150 transition-transform",
                type === 'positive' ? "hover:bg-red-400" : "hover:bg-blue-400"
              )}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-gradient-to-b from-[#f5f0e6] to-[#e8e0d0] rounded-lg p-3 shadow-[inset_0_2px_8px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.3)]"
    >
      {/* Manufacturer label */}
      <div className="absolute top-1 left-3 text-[8px] font-bold text-zinc-500 tracking-wider">
        SOLDERLESS BREADBOARD
      </div>
      <div className="absolute top-1 right-3 text-[8px] text-zinc-400">
        830 TIE-POINTS
      </div>

      <div className="flex flex-col gap-2 mt-3">
        {/* Top power rails */}
        <div className="flex flex-col gap-1 pb-2 border-b border-zinc-300">
          {renderPowerRail('positive', 'top')}
          {renderPowerRail('negative', 'top')}
        </div>

        {/* Main grid - Top section */}
        <div className="flex gap-1">
          {/* Row labels left */}
          <div className="flex flex-col gap-[3px] justify-center">
            {['a', 'b', 'c', 'd', 'e'].map(label => (
              <span key={label} className="text-[7px] font-mono text-zinc-500 w-2 text-center leading-none">
                {label}
              </span>
            ))}
          </div>

          {/* Holes grid */}
          <div className="flex flex-col gap-[3px]">
            {[0, 1, 2, 3, 4].map(row => (
              <div key={row} className="flex gap-[3px]">
                {[...Array(cols * 3)].map((_, col) => (
                  <div key={col}>
                    {renderHole(row, col, 'top')}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Row labels right */}
          <div className="flex flex-col gap-[3px] justify-center">
            {['a', 'b', 'c', 'd', 'e'].map(label => (
              <span key={label} className="text-[7px] font-mono text-zinc-500 w-2 text-center leading-none">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Center divider with column numbers */}
        <div className="flex items-center gap-1 py-1">
          <div className="w-2" />
          <div className="flex gap-[3px]">
            {[...Array(cols * 3)].map((_, i) => (
              <span 
                key={i} 
                className={cn(
                  "w-2 text-center text-[6px] font-mono",
                  (i + 1) % 5 === 0 ? "text-zinc-600 font-bold" : "text-zinc-400"
                )}
              >
                {(i + 1) % 5 === 0 ? i + 1 : ''}
              </span>
            ))}
          </div>
          <div className="w-2" />
        </div>

        {/* Main grid - Bottom section */}
        <div className="flex gap-1">
          {/* Row labels left */}
          <div className="flex flex-col gap-[3px] justify-center">
            {['f', 'g', 'h', 'i', 'j'].map(label => (
              <span key={label} className="text-[7px] font-mono text-zinc-500 w-2 text-center leading-none">
                {label}
              </span>
            ))}
          </div>

          {/* Holes grid */}
          <div className="flex flex-col gap-[3px]">
            {[0, 1, 2, 3, 4].map(row => (
              <div key={row} className="flex gap-[3px]">
                {[...Array(cols * 3)].map((_, col) => (
                  <div key={col}>
                    {renderHole(row, col, 'bottom')}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Row labels right */}
          <div className="flex flex-col gap-[3px] justify-center">
            {['f', 'g', 'h', 'i', 'j'].map(label => (
              <span key={label} className="text-[7px] font-mono text-zinc-500 w-2 text-center leading-none">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom power rails */}
        <div className="flex flex-col gap-1 pt-2 border-t border-zinc-300">
          {renderPowerRail('positive', 'bottom')}
          {renderPowerRail('negative', 'bottom')}
        </div>
      </div>
    </motion.div>
  );
});

Breadboard.displayName = 'Breadboard';
