import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

interface AdapterProps {
  type: 'bnc' | 'banana' | 'binding';
  label: string;
  color?: 'red' | 'black' | 'green' | 'yellow';
}

export const Adapter = ({ type, label, color = 'red' }: AdapterProps) => {
  const powerOn = useCircuitStore(s => s.circuit.powerOn);

  const colorClasses = {
    red: 'bg-red-600 border-red-500',
    black: 'bg-zinc-800 border-zinc-600',
    green: 'bg-green-600 border-green-500',
    yellow: 'bg-yellow-500 border-yellow-400',
  };

  if (type === 'bnc') {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={cn(
          "w-6 h-6 rounded-full",
          "bg-gradient-to-b from-zinc-400 to-zinc-600",
          "border-2 border-zinc-500",
          "flex items-center justify-center",
          "shadow-md"
        )}>
          <div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-600" />
        </div>
        <span className="text-[7px] text-zinc-500">{label}</span>
      </div>
    );
  }

  if (type === 'banana') {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={cn(
          "w-4 h-6 rounded-t-full rounded-b-sm",
          colorClasses[color],
          "border-2",
          "shadow-md"
        )} />
        <span className="text-[7px] text-zinc-500">{label}</span>
      </div>
    );
  }

  // Binding post
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn(
        "w-5 h-5 rounded-full",
        colorClasses[color],
        "border-2",
        "shadow-md",
        "flex items-center justify-center"
      )}>
        <div className="w-2 h-2 rounded-full bg-zinc-900" />
      </div>
      <span className="text-[7px] text-zinc-500">{label}</span>
    </div>
  );
};

export const AdapterBank = () => {
  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-3 border border-zinc-700">
      <div className="text-[8px] text-zinc-500 font-semibold tracking-wider mb-3 text-center">
        ADAPTERS
      </div>
      
      <div className="space-y-3">
        {/* BNC connectors */}
        <div className="flex justify-center gap-3">
          <Adapter type="bnc" label="BNC" />
          <Adapter type="bnc" label="GND" />
        </div>
        
        {/* Banana jacks */}
        <div className="flex justify-center gap-2">
          <Adapter type="banana" label="+" color="red" />
          <Adapter type="banana" label="-" color="black" />
          <Adapter type="banana" label="GND" color="green" />
        </div>
      </div>
    </div>
  );
};
