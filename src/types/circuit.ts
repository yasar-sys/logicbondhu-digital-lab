// Core circuit types for DLD Trainer Board

export type LogicState = 0 | 1 | 'Z' | 'X'; // 0, 1, High-Z, Unknown

export type ICType = 
  | '7400' // Quad 2-input NAND
  | '7402' // Quad 2-input NOR
  | '7404' // Hex Inverter
  | '7408' // Quad 2-input AND
  | '7432' // Quad 2-input OR
  | '7486' // Quad 2-input XOR
  | '7474' // Dual D Flip-Flop
  | '7476' // Dual JK Flip-Flop
  | '7490' // Decade Counter
  | '7493' // 4-bit Binary Counter
  | '74138' // 3-to-8 Decoder
  | '74151' // 8-to-1 MUX
  | '7447' // BCD to 7-Segment Decoder

export interface Pin {
  id: string;
  name: string;
  type: 'input' | 'output' | 'power' | 'ground' | 'clock' | 'control';
  position: { x: number; y: number };
  side: 'top' | 'bottom' | 'left' | 'right';
  state: LogicState;
}

export interface ICDefinition {
  type: ICType;
  name: string;
  description: string;
  pinCount: number;
  pins: Pin[];
  category: 'gate' | 'flip-flop' | 'counter' | 'decoder' | 'mux' | 'display';
  truthTable?: Record<string, LogicState>;
}

export interface PlacedIC {
  id: string;
  type: ICType;
  position: { x: number; y: number };
  rotation: number;
  pinStates: Record<string, LogicState>;
  internalState?: Record<string, any>; // For flip-flops, counters
}

export interface Wire {
  id: string;
  from: {
    componentId: string;
    pinId: string;
  };
  to: {
    componentId: string;
    pinId: string;
  };
  color: string;
  state: LogicState;
}

export interface ToggleSwitch {
  id: string;
  position: { x: number; y: number };
  state: 0 | 1;
  label: string;
}

export interface LED {
  id: string;
  position: { x: number; y: number };
  color: 'red' | 'green' | 'yellow';
  state: 0 | 1;
  label: string;
}

export interface ClockGenerator {
  id: string;
  frequency: number; // Hz
  running: boolean;
  state: 0 | 1;
}

export interface SevenSegmentDisplay {
  id: string;
  position: { x: number; y: number };
  segments: {
    a: 0 | 1;
    b: 0 | 1;
    c: 0 | 1;
    d: 0 | 1;
    e: 0 | 1;
    f: 0 | 1;
    g: 0 | 1;
    dp: 0 | 1;
  };
}

export interface Circuit {
  id: string;
  name: string;
  ics: PlacedIC[];
  wires: Wire[];
  switches: ToggleSwitch[];
  leds: LED[];
  clock: ClockGenerator;
  sevenSegments: SevenSegmentDisplay[];
  powerOn: boolean;
}

export interface SimulationResult {
  outputs: Record<string, LogicState>;
  errors: SimulationError[];
  warnings: string[];
}

export interface SimulationError {
  type: 'short-circuit' | 'floating-input' | 'invalid-connection' | 'power-issue';
  message: string;
  componentIds: string[];
}

export type LearningMode = 'beginner' | 'lab-exam' | 'challenge' | 'theory' | 'viva';

export interface UserProgress {
  completedExercises: string[];
  currentLevel: number;
  points: number;
  badges: string[];
}
