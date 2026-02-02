import { Circuit, PlacedIC, ToggleSwitch, LED, Wire, ICType } from '@/types/circuit';
import { v4 as uuidv4 } from 'uuid';

export const createEmptyCircuit = (name: string = 'Untitled Circuit'): Circuit => ({
  id: uuidv4(),
  name,
  ics: [],
  wires: [],
  switches: createDefaultSwitches(),
  leds: createDefaultLEDs(),
  clock: {
    id: 'clock-1',
    frequency: 1,
    running: false,
    state: 0,
  },
  sevenSegments: [],
  powerOn: false,
});

const createDefaultSwitches = (): ToggleSwitch[] => {
  const switches: ToggleSwitch[] = [];
  for (let i = 0; i < 8; i++) {
    switches.push({
      id: `switch-${i}`,
      position: { x: 60 + i * 50, y: 520 },
      state: 0,
      label: `S${i}`,
    });
  }
  return switches;
};

const createDefaultLEDs = (): LED[] => {
  const leds: LED[] = [];
  for (let i = 0; i < 8; i++) {
    leds.push({
      id: `led-${i}`,
      position: { x: 60 + i * 50, y: 60 },
      color: i < 4 ? 'red' : 'green',
      state: 0,
      label: `L${i}`,
    });
  }
  return leds;
};

export const addICToCircuit = (
  circuit: Circuit,
  type: ICType,
  position: { x: number; y: number }
): Circuit => {
  const newIC: PlacedIC = {
    id: uuidv4(),
    type,
    position,
    rotation: 0,
    pinStates: {},
    internalState: {},
  };

  return {
    ...circuit,
    ics: [...circuit.ics, newIC],
  };
};

export const removeICFromCircuit = (circuit: Circuit, icId: string): Circuit => {
  return {
    ...circuit,
    ics: circuit.ics.filter(ic => ic.id !== icId),
    wires: circuit.wires.filter(
      w => w.from.componentId !== icId && w.to.componentId !== icId
    ),
  };
};

export const addWireToCircuit = (
  circuit: Circuit,
  from: { componentId: string; pinId: string },
  to: { componentId: string; pinId: string },
  color: string = '#3b82f6'
): Circuit => {
  const newWire: Wire = {
    id: uuidv4(),
    from,
    to,
    color,
    state: 0,
  };

  return {
    ...circuit,
    wires: [...circuit.wires, newWire],
  };
};

export const removeWireFromCircuit = (circuit: Circuit, wireId: string): Circuit => {
  return {
    ...circuit,
    wires: circuit.wires.filter(w => w.id !== wireId),
  };
};

export const updateSwitchState = (
  circuit: Circuit,
  switchId: string,
  state: 0 | 1
): Circuit => {
  return {
    ...circuit,
    switches: circuit.switches.map(sw =>
      sw.id === switchId ? { ...sw, state } : sw
    ),
  };
};

export const togglePower = (circuit: Circuit): Circuit => {
  return {
    ...circuit,
    powerOn: !circuit.powerOn,
  };
};

export const moveIC = (
  circuit: Circuit,
  icId: string,
  position: { x: number; y: number }
): Circuit => {
  return {
    ...circuit,
    ics: circuit.ics.map(ic =>
      ic.id === icId ? { ...ic, position } : ic
    ),
  };
};
