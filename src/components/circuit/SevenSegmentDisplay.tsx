import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SevenSegmentProps {
  segments: {
    a: 0 | 1;
    b: 0 | 1;
    c: 0 | 1;
    d: 0 | 1;
    e: 0 | 1;
    f: 0 | 1;
    g: 0 | 1;
    dp?: 0 | 1;
  };
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'green' | 'blue';
}

export const SevenSegmentDisplay = ({ 
  segments, 
  size = 'md',
  color = 'red' 
}: SevenSegmentProps) => {
  const sizes = {
    sm: { width: 30, height: 50 },
    md: { width: 45, height: 75 },
    lg: { width: 60, height: 100 },
  };

  const { width, height } = sizes[size];
  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;

  const colorClasses = {
    red: { on: 'stroke-red-500', glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' },
    green: { on: 'stroke-green-500', glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' },
    blue: { on: 'stroke-blue-500', glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' },
  };

  const segmentPath = (id: keyof typeof segments) => {
    const isOn = segments[id] === 1;
    return cn(
      "transition-all duration-150",
      isOn ? colorClasses[color].on : "stroke-muted/30",
      isOn && colorClasses[color].glow
    );
  };

  // Segment coordinates (relative positions)
  const padding = 4;
  const segmentLength = width - padding * 2 - strokeWidth;
  const halfHeight = (height - padding * 2 - strokeWidth) / 2;

  return (
    <div 
      className="relative bg-card/80 rounded-lg p-2 border border-border"
      style={{ width: width + 16, height: height + 16 }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Segment A (top) */}
        <line
          x1={padding + strokeWidth / 2}
          y1={padding}
          x2={width - padding - strokeWidth / 2}
          y2={padding}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={segmentPath('a')}
        />

        {/* Segment B (top-right) */}
        <line
          x1={width - padding}
          y1={padding + strokeWidth / 2}
          x2={width - padding}
          y2={halfHeight + padding - strokeWidth / 2}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={segmentPath('b')}
        />

        {/* Segment C (bottom-right) */}
        <line
          x1={width - padding}
          y1={halfHeight + padding + strokeWidth / 2}
          x2={width - padding}
          y2={height - padding - strokeWidth / 2}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={segmentPath('c')}
        />

        {/* Segment D (bottom) */}
        <line
          x1={padding + strokeWidth / 2}
          y1={height - padding}
          x2={width - padding - strokeWidth / 2}
          y2={height - padding}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={segmentPath('d')}
        />

        {/* Segment E (bottom-left) */}
        <line
          x1={padding}
          y1={halfHeight + padding + strokeWidth / 2}
          x2={padding}
          y2={height - padding - strokeWidth / 2}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={segmentPath('e')}
        />

        {/* Segment F (top-left) */}
        <line
          x1={padding}
          y1={padding + strokeWidth / 2}
          x2={padding}
          y2={halfHeight + padding - strokeWidth / 2}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={segmentPath('f')}
        />

        {/* Segment G (middle) */}
        <line
          x1={padding + strokeWidth / 2}
          y1={halfHeight + padding}
          x2={width - padding - strokeWidth / 2}
          y2={halfHeight + padding}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={segmentPath('g')}
        />

        {/* Decimal point */}
        {segments.dp !== undefined && (
          <circle
            cx={width - padding / 2 + 4}
            cy={height - padding}
            r={strokeWidth / 2}
            className={cn(
              "transition-all duration-150",
              segments.dp === 1 
                ? `fill-${color}-500 ${colorClasses[color].glow}`
                : "fill-muted/30"
            )}
          />
        )}
      </svg>
    </div>
  );
};

// Helper to convert number to segments
export const numberToSegments = (num: number): SevenSegmentProps['segments'] => {
  const patterns: Record<number, string> = {
    0: 'abcdef',
    1: 'bc',
    2: 'abdeg',
    3: 'abcdg',
    4: 'bcfg',
    5: 'acdfg',
    6: 'acdefg',
    7: 'abc',
    8: 'abcdefg',
    9: 'abcdfg',
  };

  const pattern = patterns[num % 10] || '';
  
  return {
    a: pattern.includes('a') ? 1 : 0,
    b: pattern.includes('b') ? 1 : 0,
    c: pattern.includes('c') ? 1 : 0,
    d: pattern.includes('d') ? 1 : 0,
    e: pattern.includes('e') ? 1 : 0,
    f: pattern.includes('f') ? 1 : 0,
    g: pattern.includes('g') ? 1 : 0,
  };
};
