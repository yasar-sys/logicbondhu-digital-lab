import { memo } from 'react';
import { motion } from 'framer-motion';
import { useCircuitStore } from '@/store/circuit-store';
import { X } from 'lucide-react';

interface JumperWireDisplayProps {
  boardRef: React.RefObject<HTMLDivElement>;
}

export const JumperWireDisplay = memo(({ boardRef }: JumperWireDisplayProps) => {
  const jumperWires = useCircuitStore(s => s.jumperWires);
  const wireStart = useCircuitStore(s => s.wireStart);
  const selectedWireColor = useCircuitStore(s => s.selectedWireColor);
  const removeJumperWire = useCircuitStore(s => s.removeJumperWire);
  const isWiringMode = useCircuitStore(s => s.isWiringMode);

  if (!boardRef.current) return null;

  const rect = boardRef.current.getBoundingClientRect();

  // Calculate control points for curved wire
  const getWirePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const midX = (from.x + to.x) / 2;
    const midY = Math.min(from.y, to.y) - 30; // Curve upward
    
    return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
  };

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        {/* Wire gradient for 3D effect */}
        {jumperWires.map(wire => (
          <linearGradient key={`grad-${wire.id}`} id={`wire-gradient-${wire.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: wire.color, stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: wire.color, stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: wire.color, stopOpacity: 1 }} />
          </linearGradient>
        ))}
        
        {/* Drop shadow filter */}
        <filter id="wire-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Placed wires */}
      {jumperWires.map(wire => (
        <g key={wire.id} className="pointer-events-auto">
          {/* Wire shadow */}
          <path
            d={getWirePath(wire.from, wire.to)}
            fill="none"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="6"
            strokeLinecap="round"
            transform="translate(1, 2)"
          />
          
          {/* Main wire body */}
          <motion.path
            d={getWirePath(wire.from, wire.to)}
            fill="none"
            stroke={`url(#wire-gradient-${wire.id})`}
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
            filter="url(#wire-shadow)"
          />
          
          {/* Wire highlight */}
          <path
            d={getWirePath(wire.from, wire.to)}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transform: 'translateY(-1px)' }}
          />
          
          {/* End connectors */}
          <circle
            cx={wire.from.x}
            cy={wire.from.y}
            r="4"
            fill={wire.color}
            stroke="#333"
            strokeWidth="1"
          />
          <circle
            cx={wire.to.x}
            cy={wire.to.y}
            r="4"
            fill={wire.color}
            stroke="#333"
            strokeWidth="1"
          />
          
          {/* Delete button on hover - center of wire */}
          <g 
            className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => removeJumperWire(wire.id)}
          >
            <circle
              cx={(wire.from.x + wire.to.x) / 2}
              cy={Math.min(wire.from.y, wire.to.y) - 30}
              r="10"
              fill="#ef4444"
              className="hover:fill-red-600"
            />
            <text
              x={(wire.from.x + wire.to.x) / 2}
              y={Math.min(wire.from.y, wire.to.y) - 26}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              ×
            </text>
          </g>
        </g>
      ))}

      {/* Preview wire while placing */}
      {wireStart && isWiringMode && (
        <g>
          <circle
            cx={wireStart.x}
            cy={wireStart.y}
            r="6"
            fill={selectedWireColor}
            stroke="#fff"
            strokeWidth="2"
            className="animate-pulse"
          />
          <text
            x={wireStart.x}
            y={wireStart.y - 15}
            textAnchor="middle"
            fill="#fff"
            fontSize="10"
            className="pointer-events-none"
          >
            Click to complete
          </text>
        </g>
      )}
    </svg>
  );
});

JumperWireDisplay.displayName = 'JumperWireDisplay';
