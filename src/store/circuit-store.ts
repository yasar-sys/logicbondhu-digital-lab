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

interface CircuitState {
  circuit: Circuit;
  simulationResult: SimulationResult | null;
  selectedIC: ICType | null;
  selectedComponent: string | null;
  wireStart: { componentId: string; pinId: string } | null;
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
  startWire: (componentId: string, pinId: string) => void;
  completeWire: (componentId: string, pinId: string) => void;
  cancelWire: () => void;
  removeWire: (wireId: string) => void;
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
    const { circuit } = get();
    set({ circuit: removeICFromCircuit(circuit, icId), selectedComponent: null });
    get().simulate();
  },

  selectIC: (type) => set({ selectedIC: type }),

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

  startWire: (componentId, pinId) => {
    set({ wireStart: { componentId, pinId } });
  },

  completeWire: (componentId, pinId) => {
    const { circuit, wireStart } = get();
    if (wireStart && (wireStart.componentId !== componentId || wireStart.pinId !== pinId)) {
      const newCircuit = addWireToCircuit(circuit, wireStart, { componentId, pinId });
      set({ circuit: newCircuit, wireStart: null });
      get().simulate();
    }
  },

  cancelWire: () => set({ wireStart: null }),

  removeWire: (wireId) => {
    const { circuit } = get();
    set({ circuit: removeWireFromCircuit(circuit, wireId) });
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
    });
  },
}));
