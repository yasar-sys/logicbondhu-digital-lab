import { motion } from 'framer-motion';
import { IC_DEFINITIONS, IC_CATEGORIES } from '@/lib/ic-definitions';
import { useCircuitStore } from '@/store/circuit-store';
import { ICType } from '@/types/circuit';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ICPalette = () => {
  const selectedIC = useCircuitStore(s => s.selectedIC);
  const selectIC = useCircuitStore(s => s.selectIC);

  return (
    <div className="panel h-full">
      <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
        <span className="text-lg">🔌</span>
        IC Components
      </h3>
      
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="space-y-4 pr-2">
          {Object.entries(IC_CATEGORIES).map(([category, info]) => (
            <div key={category}>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <span>{info.icon}</span>
                {info.name}
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {info.ics.map(icType => {
                  const def = IC_DEFINITIONS[icType];
                  const isSelected = selectedIC === icType;
                  
                  return (
                    <motion.button
                      key={icType}
                      onClick={() => selectIC(isSelected ? null : icType)}
                      className={cn(
                        "p-2 rounded-md text-left transition-colors border",
                        isSelected
                          ? "bg-primary/20 border-primary text-primary-foreground"
                          : "bg-muted/50 border-transparent hover:bg-muted hover:border-border"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-xs font-mono font-semibold">
                        {def.name}
                      </div>
                      <div className="text-[9px] text-muted-foreground line-clamp-1">
                        {def.description}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
