import { useCircuitStore } from '@/store/circuit-store';
import { IC_DEFINITIONS } from '@/lib/ic-definitions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const TruthTableDisplay = () => {
  const circuit = useCircuitStore(s => s.circuit);
  const simulationResult = useCircuitStore(s => s.simulationResult);

  if (circuit.ics.length === 0) {
    return (
      <div className="panel h-full flex items-center justify-center text-center">
        <div className="text-muted-foreground">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm">Add ICs to see truth table</p>
        </div>
      </div>
    );
  }

  // Get current switch states and LED outputs
  const switches = circuit.switches;
  const leds = circuit.leds;

  return (
    <div className="panel h-full">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="text-lg">📊</span>
        Current State
      </h3>

      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="space-y-4">
          {/* Input States */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Inputs</h4>
            <div className="grid grid-cols-4 gap-1">
              {switches.slice(0, 4).map(sw => (
                <div
                  key={sw.id}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-md",
                    sw.state === 1 ? "bg-primary/20" : "bg-muted/50"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground">{sw.label}</span>
                  <span className={cn(
                    "text-lg font-mono font-bold",
                    sw.state === 1 ? "text-primary" : "text-muted-foreground"
                  )}>
                    {sw.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Output States */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Outputs</h4>
            <div className="grid grid-cols-4 gap-1">
              {leds.slice(0, 4).map(led => (
                <div
                  key={led.id}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-md",
                    led.state === 1 ? (
                      led.color === 'red' ? "bg-red-500/20" :
                      led.color === 'green' ? "bg-green-500/20" :
                      "bg-yellow-500/20"
                    ) : "bg-muted/50"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground">{led.label}</span>
                  <span className={cn(
                    "text-lg font-mono font-bold",
                    led.state === 1 ? (
                      led.color === 'red' ? "text-red-500" :
                      led.color === 'green' ? "text-green-500" :
                      "text-yellow-500"
                    ) : "text-muted-foreground"
                  )}>
                    {led.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Placed ICs */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              Active ICs ({circuit.ics.length})
            </h4>
            <div className="space-y-1">
              {circuit.ics.map(ic => {
                const def = IC_DEFINITIONS[ic.type];
                return (
                  <div
                    key={ic.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-xs"
                  >
                    <span className="font-mono font-medium">{def.name}</span>
                    <span className="text-muted-foreground">{def.category}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warnings */}
          {simulationResult?.warnings.length ? (
            <div>
              <h4 className="text-xs font-medium text-yellow-500 mb-2">⚠️ Warnings</h4>
              <div className="space-y-1">
                {simulationResult.warnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-md bg-yellow-500/10 text-[10px] text-yellow-500"
                  >
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
};
