import { 
  Circuit, 
  LogicState, 
  PlacedIC, 
  SimulationResult, 
  SimulationError,
  Wire 
} from '@/types/circuit';
import { IC_DEFINITIONS } from './ic-definitions';

// Logic gate evaluation functions
const evaluateNOT = (a: LogicState): LogicState => {
  if (a === 'X' || a === 'Z') return 'X';
  return a === 1 ? 0 : 1;
};

const evaluateAND = (a: LogicState, b: LogicState): LogicState => {
  if (a === 0 || b === 0) return 0;
  if (a === 'X' || b === 'X' || a === 'Z' || b === 'Z') return 'X';
  return 1;
};

const evaluateOR = (a: LogicState, b: LogicState): LogicState => {
  if (a === 1 || b === 1) return 1;
  if (a === 'X' || b === 'X' || a === 'Z' || b === 'Z') return 'X';
  return 0;
};

const evaluateNAND = (a: LogicState, b: LogicState): LogicState => {
  return evaluateNOT(evaluateAND(a, b));
};

const evaluateNOR = (a: LogicState, b: LogicState): LogicState => {
  return evaluateNOT(evaluateOR(a, b));
};

const evaluateXOR = (a: LogicState, b: LogicState): LogicState => {
  if (a === 'X' || b === 'X' || a === 'Z' || b === 'Z') return 'X';
  return a !== b ? 1 : 0;
};

// IC evaluation functions
export const evaluateIC = (
  ic: PlacedIC, 
  inputs: Record<string, LogicState>,
  prevClock?: LogicState
): Record<string, LogicState> => {
  const outputs: Record<string, LogicState> = {};
  const def = IC_DEFINITIONS[ic.type];
  
  switch (ic.type) {
    case '7404': // Hex Inverter
      outputs['pin-2'] = evaluateNOT(inputs['pin-1'] ?? 0);
      outputs['pin-4'] = evaluateNOT(inputs['pin-3'] ?? 0);
      outputs['pin-6'] = evaluateNOT(inputs['pin-5'] ?? 0);
      outputs['pin-8'] = evaluateNOT(inputs['pin-9'] ?? 0);
      outputs['pin-10'] = evaluateNOT(inputs['pin-11'] ?? 0);
      outputs['pin-12'] = evaluateNOT(inputs['pin-13'] ?? 0);
      break;

    case '7408': // Quad AND
      outputs['pin-3'] = evaluateAND(inputs['pin-1'] ?? 0, inputs['pin-2'] ?? 0);
      outputs['pin-6'] = evaluateAND(inputs['pin-4'] ?? 0, inputs['pin-5'] ?? 0);
      outputs['pin-8'] = evaluateAND(inputs['pin-9'] ?? 0, inputs['pin-10'] ?? 0);
      outputs['pin-11'] = evaluateAND(inputs['pin-12'] ?? 0, inputs['pin-13'] ?? 0);
      break;

    case '7432': // Quad OR
      outputs['pin-3'] = evaluateOR(inputs['pin-1'] ?? 0, inputs['pin-2'] ?? 0);
      outputs['pin-6'] = evaluateOR(inputs['pin-4'] ?? 0, inputs['pin-5'] ?? 0);
      outputs['pin-8'] = evaluateOR(inputs['pin-9'] ?? 0, inputs['pin-10'] ?? 0);
      outputs['pin-11'] = evaluateOR(inputs['pin-12'] ?? 0, inputs['pin-13'] ?? 0);
      break;

    case '7400': // Quad NAND
      outputs['pin-3'] = evaluateNAND(inputs['pin-1'] ?? 0, inputs['pin-2'] ?? 0);
      outputs['pin-6'] = evaluateNAND(inputs['pin-4'] ?? 0, inputs['pin-5'] ?? 0);
      outputs['pin-8'] = evaluateNAND(inputs['pin-9'] ?? 0, inputs['pin-10'] ?? 0);
      outputs['pin-11'] = evaluateNAND(inputs['pin-12'] ?? 0, inputs['pin-13'] ?? 0);
      break;

    case '7402': // Quad NOR
      outputs['pin-1'] = evaluateNOR(inputs['pin-2'] ?? 0, inputs['pin-3'] ?? 0);
      outputs['pin-4'] = evaluateNOR(inputs['pin-5'] ?? 0, inputs['pin-6'] ?? 0);
      outputs['pin-10'] = evaluateNOR(inputs['pin-8'] ?? 0, inputs['pin-9'] ?? 0);
      outputs['pin-13'] = evaluateNOR(inputs['pin-11'] ?? 0, inputs['pin-12'] ?? 0);
      break;

    case '7486': // Quad XOR
      outputs['pin-3'] = evaluateXOR(inputs['pin-1'] ?? 0, inputs['pin-2'] ?? 0);
      outputs['pin-6'] = evaluateXOR(inputs['pin-4'] ?? 0, inputs['pin-5'] ?? 0);
      outputs['pin-8'] = evaluateXOR(inputs['pin-9'] ?? 0, inputs['pin-10'] ?? 0);
      outputs['pin-11'] = evaluateXOR(inputs['pin-12'] ?? 0, inputs['pin-13'] ?? 0);
      break;

    case '7474': // Dual D Flip-Flop
      {
        // First flip-flop
        const clk1 = inputs['pin-3'] ?? 0;
        const d1 = inputs['pin-2'] ?? 0;
        const pre1 = inputs['pin-4'] ?? 1;
        const clr1 = inputs['pin-1'] ?? 1;
        
        let q1 = ic.internalState?.q1 ?? 0;
        
        if (clr1 === 0) {
          q1 = 0;
        } else if (pre1 === 0) {
          q1 = 1;
        } else if (prevClock === 0 && clk1 === 1) {
          // Rising edge
          q1 = d1 as 0 | 1;
        }
        
        outputs['pin-5'] = q1;
        outputs['pin-6'] = q1 === 1 ? 0 : 1;
        
        // Second flip-flop
        const clk2 = inputs['pin-11'] ?? 0;
        const d2 = inputs['pin-12'] ?? 0;
        const pre2 = inputs['pin-10'] ?? 1;
        const clr2 = inputs['pin-13'] ?? 1;
        
        let q2 = ic.internalState?.q2 ?? 0;
        
        if (clr2 === 0) {
          q2 = 0;
        } else if (pre2 === 0) {
          q2 = 1;
        } else if (prevClock === 0 && clk2 === 1) {
          q2 = d2 as 0 | 1;
        }
        
        outputs['pin-9'] = q2;
        outputs['pin-8'] = q2 === 1 ? 0 : 1;
        
        // Update internal state
        ic.internalState = { q1, q2 };
      }
      break;

    case '7476': // Dual JK Flip-Flop
      {
        // First flip-flop
        const clk1 = inputs['pin-1'] ?? 0;
        const j1 = inputs['pin-4'] ?? 0;
        const k1 = inputs['pin-16'] ?? 0;
        const pre1 = inputs['pin-2'] ?? 1;
        const clr1 = inputs['pin-3'] ?? 1;
        
        let q1 = ic.internalState?.q1 ?? 0;
        
        if (clr1 === 0) {
          q1 = 0;
        } else if (pre1 === 0) {
          q1 = 1;
        } else if (prevClock === 1 && clk1 === 0) {
          // Falling edge for JK
          if (j1 === 0 && k1 === 0) {
            // Hold
          } else if (j1 === 0 && k1 === 1) {
            q1 = 0;
          } else if (j1 === 1 && k1 === 0) {
            q1 = 1;
          } else {
            q1 = q1 === 1 ? 0 : 1; // Toggle
          }
        }
        
        outputs['pin-15'] = q1;
        outputs['pin-14'] = q1 === 1 ? 0 : 1;
        
        // Second flip-flop
        const clk2 = inputs['pin-6'] ?? 0;
        const j2 = inputs['pin-9'] ?? 0;
        const k2 = inputs['pin-12'] ?? 0;
        const pre2 = inputs['pin-7'] ?? 1;
        const clr2 = inputs['pin-8'] ?? 1;
        
        let q2 = ic.internalState?.q2 ?? 0;
        
        if (clr2 === 0) {
          q2 = 0;
        } else if (pre2 === 0) {
          q2 = 1;
        } else if (prevClock === 1 && clk2 === 0) {
          if (j2 === 0 && k2 === 0) {
            // Hold
          } else if (j2 === 0 && k2 === 1) {
            q2 = 0;
          } else if (j2 === 1 && k2 === 0) {
            q2 = 1;
          } else {
            q2 = q2 === 1 ? 0 : 1;
          }
        }
        
        outputs['pin-11'] = q2;
        outputs['pin-10'] = q2 === 1 ? 0 : 1;
        
        ic.internalState = { q1, q2 };
      }
      break;

    default:
      // Default: all outputs are 0
      def.pins.forEach(pin => {
        if (pin.type === 'output') {
          outputs[pin.id] = 0;
        }
      });
  }

  return outputs;
};

// Main simulation function
export const simulateCircuit = (circuit: Circuit): SimulationResult => {
  if (!circuit.powerOn) {
    return {
      outputs: {},
      errors: [],
      warnings: ['Power is OFF. Turn on power to simulate.'],
    };
  }

  const errors: SimulationError[] = [];
  const warnings: string[] = [];
  const outputs: Record<string, LogicState> = {};

  // Build connection graph
  const connectionGraph: Record<string, string[]> = {};
  
  circuit.wires.forEach(wire => {
    const fromKey = `${wire.from.componentId}:${wire.from.pinId}`;
    const toKey = `${wire.to.componentId}:${wire.to.pinId}`;
    
    if (!connectionGraph[fromKey]) connectionGraph[fromKey] = [];
    if (!connectionGraph[toKey]) connectionGraph[toKey] = [];
    
    connectionGraph[fromKey].push(toKey);
    connectionGraph[toKey].push(fromKey);
  });

  // Get switch states
  const switchStates: Record<string, LogicState> = {};
  circuit.switches.forEach(sw => {
    switchStates[sw.id] = sw.state;
  });

  // Simulate each IC
  const icOutputs: Record<string, Record<string, LogicState>> = {};
  
  // Multiple passes to handle propagation
  for (let pass = 0; pass < 5; pass++) {
    circuit.ics.forEach(ic => {
      // Gather inputs for this IC
      const inputs: Record<string, LogicState> = {};
      const def = IC_DEFINITIONS[ic.type];
      
      def.pins.forEach(pin => {
        if (pin.type === 'input' || pin.type === 'clock' || pin.type === 'control') {
          // Check if connected to a switch
          const pinKey = `${ic.id}:${pin.id}`;
          const connections = connectionGraph[pinKey] || [];
          
          let inputValue: LogicState = 0; // Default floating input
          
          connections.forEach(conn => {
            const [compId, connPinId] = conn.split(':');
            
            // Check if it's a switch
            const sw = circuit.switches.find(s => s.id === compId);
            if (sw) {
              inputValue = sw.state;
            }
            
            // Check if it's another IC's output
            const otherIc = circuit.ics.find(i => i.id === compId);
            if (otherIc && icOutputs[compId]) {
              const outputVal = icOutputs[compId][connPinId];
              if (outputVal !== undefined) {
                inputValue = outputVal;
              }
            }
          });
          
          inputs[pin.id] = inputValue;
        }
      });

      // Evaluate IC
      const prevClock = ic.internalState?.prevClock ?? 0;
      const icOutput = evaluateIC(ic, inputs, prevClock);
      icOutputs[ic.id] = icOutput;
      
      // Store clock state for edge detection
      if (ic.internalState) {
        ic.internalState.prevClock = inputs['pin-3'] ?? inputs['pin-1'] ?? 0;
      }
    });
  }

  // Update LED states based on connections
  circuit.leds.forEach(led => {
    const ledKey = `${led.id}:input`;
    const connections = connectionGraph[ledKey] || [];
    
    let ledState: LogicState = 0;
    
    connections.forEach(conn => {
      const [compId, connPinId] = conn.split(':');
      
      const ic = circuit.ics.find(i => i.id === compId);
      if (ic && icOutputs[compId]) {
        const outputVal = icOutputs[compId][connPinId];
        if (outputVal === 1) {
          ledState = 1;
        }
      }
    });
    
    outputs[led.id] = ledState;
  });

  // Check for floating inputs
  circuit.ics.forEach(ic => {
    const def = IC_DEFINITIONS[ic.type];
    def.pins.forEach(pin => {
      if (pin.type === 'input') {
        const pinKey = `${ic.id}:${pin.id}`;
        if (!connectionGraph[pinKey] || connectionGraph[pinKey].length === 0) {
          warnings.push(`Floating input: ${ic.type} ${pin.name}`);
        }
      }
    });
  });

  return { outputs, errors, warnings };
};

// Generate truth table for a circuit
export const generateTruthTable = (
  circuit: Circuit,
  inputIds: string[],
  outputIds: string[]
): { inputs: Record<string, 0 | 1>[]; outputs: Record<string, LogicState>[] } => {
  const rows = Math.pow(2, inputIds.length);
  const inputRows: Record<string, 0 | 1>[] = [];
  const outputRows: Record<string, LogicState>[] = [];

  for (let i = 0; i < rows; i++) {
    const inputRow: Record<string, 0 | 1> = {};
    
    inputIds.forEach((id, idx) => {
      inputRow[id] = ((i >> (inputIds.length - 1 - idx)) & 1) as 0 | 1;
    });
    
    inputRows.push(inputRow);

    // Create temporary circuit with these inputs
    const tempCircuit = { ...circuit };
    tempCircuit.switches = tempCircuit.switches.map(sw => ({
      ...sw,
      state: inputRow[sw.id] ?? sw.state,
    }));

    const result = simulateCircuit(tempCircuit);
    
    const outputRow: Record<string, LogicState> = {};
    outputIds.forEach(id => {
      outputRow[id] = result.outputs[id] ?? 0;
    });
    
    outputRows.push(outputRow);
  }

  return { inputs: inputRows, outputs: outputRows };
};
