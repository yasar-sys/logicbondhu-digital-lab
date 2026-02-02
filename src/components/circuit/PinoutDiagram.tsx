import { useCircuitStore } from '@/store/circuit-store';
import { IC_DEFINITIONS } from '@/lib/ic-definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PinoutDiagramProps {
  icId: string;
}

export const PinoutDiagram = ({ icId }: PinoutDiagramProps) => {
  const circuit = useCircuitStore(s => s.circuit);
  const ic = circuit.ics.find(i => i.id === icId);
  
  if (!ic) return null;
  
  const definition = IC_DEFINITIONS[ic.type];
  const pinCount = definition.pinCount;
  const leftPins = definition.pins.slice(0, pinCount / 2);
  const rightPins = definition.pins.slice(pinCount / 2).reverse();

  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="font-mono">{definition.name}</span>
          <span className="text-xs text-muted-foreground font-normal">
            {definition.description}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          {/* IC Diagram */}
          <div className="relative bg-ic-body rounded-sm p-4 min-w-[120px]">
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full bg-muted/50" />
            
            <div className="flex justify-between">
              {/* Left pins */}
              <div className="flex flex-col gap-2">
                {leftPins.map((pin, idx) => (
                  <div key={pin.id} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">
                      {idx + 1}
                    </span>
                    <div className="w-2 h-4 bg-ic-pin rounded-sm" />
                    <span className="text-[10px] font-mono text-foreground">
                      {pin.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right pins */}
              <div className="flex flex-col gap-2">
                {rightPins.map((pin, idx) => (
                  <div key={pin.id} className="flex items-center gap-2 flex-row-reverse">
                    <span className="text-[10px] font-mono text-muted-foreground w-6 text-left">
                      {pinCount - idx}
                    </span>
                    <div className="w-2 h-4 bg-ic-pin rounded-sm" />
                    <span className="text-[10px] font-mono text-foreground">
                      {pin.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pin Table */}
        <ScrollArea className="h-32">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-xs">Pin</TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {definition.pins.map((pin, idx) => (
                <TableRow key={pin.id}>
                  <TableCell className="text-xs font-mono">{idx + 1}</TableCell>
                  <TableCell className="text-xs font-mono">{pin.name}</TableCell>
                  <TableCell className="text-xs capitalize text-muted-foreground">
                    {pin.type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
