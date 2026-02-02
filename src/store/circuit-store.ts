import { create } from 'zustand';
import { Circuit, LearningMode, PlacedIC, Wire } from '@/types/circuit';
import { ICType } from '@/types/circuit';
import { 
  createEmptyCircuit, 
  addICToCircuit, 
  removeICFromCircuit, 
  updateSwitchState,
  togglePower,
  moveIC,
  addWireToCircuit,
  removeWireFromCircuit
} from '@/lib/circuit-utils';
import { simulateCircuit } from '@/lib/simulation-engine';
import { SimulationResult } from '@/types/circuit';

export type WireColor = '#ef4444' | '#22c55e' | '#3b82f6' | '#eab308' | '#f97316' | '#8b5cf6' | '#06b6d4' | '#000000';

export const WIRE_COLORS: { color: WireColor; name: string }[] = [
  { color: '#ef4444', name: 'Red' },
  { color: '#22c55e', name: 'Green' },
  { color: '#3b82f6', name: 'Blue' },
  { color: '#eab308', name: 'Yellow' },
  { color: '#f97316', name: 'Orange' },
  { color: '#8b5cf6', name: 'Purple' },
  { color: '#06b6d4', name: 'Cyan' },
  { color: '#000000', name: 'Black' },
];

interface WirePoint {
  x: number;
  y: number;
  componentId?: string;
  pinId?: string;
}

interface JumperWire {
  id: string;
  from: WirePoint;
  to: WirePoint;
  color: WireColor;
}

interface CircuitState {
  circuit: Circuit;
  simulationResult: SimulationResult | null;
  selectedIC: ICType | null;
  selectedComponent: string | null;
  wireStart: WirePoint | null;
  selectedWireColor: WireColor;
  jumperWires: JumperWire[];
  isWiringMode: boolean;
  learningMode: LearningMode;
  showAIPanel: boolean;
  
  // Actions
  setCircuit: (circuit: Circuit) => void;
  addIC: (type: ICType, position: { x: number; y: number }) => void;
  removeIC: (icId: string) => void;
  selectIC: (type: ICType | null) => void;
  selectComponent: (id: string | null) => void;
  toggleSwitch: (switchId: string) => void;
  togglePowerState: () => void;
  moveICPosition: (icId: string, position: { x: number; y: number }) => void;
  
  // Wire actions
  setWiringMode: (mode: boolean) => void;
  setSelectedWireColor: (color: WireColor) => void;
  startWire: (point: WirePoint) => void;
  completeWire: (point: WirePoint) => void;
  cancelWire: () => void;
  removeJumperWire: (wireId: string) => void;
  clearAllWires: () => void;
  
  simulate: () => void;
  setLearningMode: (mode: LearningMode) => void;
  toggleAIPanel: () => void;
  resetCircuit: () => void;
}

export const useCircuitStore = create<CircuitState>((set, get) => ({
  circuit: createEmptyCircuit('My First Circuit'),
  simulationResult: null,
  selectedIC: null,
  selectedComponent: null,
  wireStart: null,
  selectedWireColor: '#ef4444',
  jumperWires: [],
  isWiringMode: false,
  learningMode: 'beginner',
  showAIPanel: true,

  setCircuit: (circuit) => set({ circuit }),

  addIC: (type, position) => {
    const { circuit } = get();
    const newCircuit = addICToCircuit(circuit, type, position);
    set({ circuit: newCircuit, selectedIC: null });
    get().simulate();
  },

  removeIC: (icId) => {
    const { circuit, jumperWires } = get();
    // Also remove wires connected to this IC
    const filteredWires = jumperWires.filter(
      w => w.from.componentId !== icId && w.to.componentId !== icId
    );
    set({ 
      circuit: removeICFromCircuit(circuit, icId), 
      selectedComponent: null,
      jumperWires: filteredWires,
    });
    get().simulate();
  },

  selectIC: (type) => set({ selectedIC: type, isWiringMode: false }),

  selectComponent: (id) => set({ selectedComponent: id }),

  toggleSwitch: (switchId) => {
    const { circuit } = get();
    const sw = circuit.switches.find(s => s.id === switchId);
    if (sw) {
      const newCircuit = updateSwitchState(circuit, switchId, sw.state === 0 ? 1 : 0);
      set({ circuit: newCircuit });
      get().simulate();
    }
  },

  togglePowerState: () => {
    const { circuit } = get();
    set({ circuit: togglePower(circuit) });
    get().simulate();
  },

  moveICPosition: (icId, position) => {
    const { circuit } = get();
    set({ circuit: moveIC(circuit, icId, position) });
  },

  setWiringMode: (mode) => set({ isWiringMode: mode, selectedIC: null, wireStart: null }),

  setSelectedWireColor: (color) => set({ selectedWireColor: color }),

  startWire: (point) => {
    set({ wireStart: point, isWiringMode: true });
  },

  completeWire: (point) => {
    const { wireStart, selectedWireColor, jumperWires } = get();
    if (wireStart && (wireStart.x !== point.x || wireStart.y !== point.y)) {
      const newWire: JumperWire = {
        id: `wire-${Date.now()}`,
        from: wireStart,
        to: point,
        color: selectedWireColor,
      };
      set({ 
        jumperWires: [...jumperWires, newWire], 
        wireStart: null,
      });
      get().simulate();
    }
  },

  cancelWire: () => set({ wireStart: null }),

  removeJumperWire: (wireId) => {
    const { jumperWires } = get();
    set({ jumperWires: jumperWires.filter(w => w.id !== wireId) });
    get().simulate();
  },

  clearAllWires: () => {
    set({ jumperWires: [], wireStart: null });
    get().simulate();
  },

  simulate: () => {
    const { circuit } = get();
    const result = simulateCircuit(circuit);
    
    // Update LED states based on simulation
    const updatedCircuit = {
      ...circuit,
      leds: circuit.leds.map(led => ({
        ...led,
        state: (result.outputs[led.id] === 1 ? 1 : 0) as 0 | 1,
      })),
    };
    
    set({ circuit: updatedCircuit, simulationResult: result });
  },

  setLearningMode: (mode) => set({ learningMode: mode }),

  toggleAIPanel: () => set(state => ({ showAIPanel: !state.showAIPanel })),

  resetCircuit: () => {
    set({ 
      circuit: createEmptyCircuit('My First Circuit'),
      simulationResult: null,
      selectedIC: null,
      selectedComponent: null,
      wireStart: null,
      jumperWires: [],
      isWiringMode: false,
    });
  },
}));
