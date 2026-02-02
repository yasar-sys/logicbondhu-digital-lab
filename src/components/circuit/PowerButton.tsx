import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import { useCircuitStore } from '@/store/circuit-store';
import { cn } from '@/lib/utils';

export const PowerButton = () => {
  const powerOn = useCircuitStore(s => s.circuit.powerOn);
  const togglePower = useCircuitStore(s => s.togglePowerState);

  return (
    <motion.button
      onClick={togglePower}
      className={cn(
        "power-button flex items-center justify-center",
        powerOn && "power-button-on"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={powerOn ? 'Turn OFF' : 'Turn ON'}
    >
      <Power
        size={24}
        className={cn(
          "transition-colors",
          powerOn ? "text-primary" : "text-muted-foreground"
        )}
      />
      {powerOn && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};
