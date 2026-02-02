import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FolderOpen, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCircuits } from '@/hooks/use-circuits';
import { cn } from '@/lib/utils';

export const CircuitManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  
  const {
    savedCircuits,
    isLoading,
    isSaving,
    fetchCircuits,
    saveCircuit,
    loadCircuit,
    deleteCircuit,
  } = useCircuits();

  useEffect(() => {
    if (isOpen) {
      fetchCircuits();
    }
  }, [isOpen, fetchCircuits]);

  const handleSave = async () => {
    const result = await saveCircuit(newName);
    if (result) {
      setNewName('');
      setShowSaveInput(false);
    }
  };

  const handleLoad = async (id: string) => {
    await loadCircuit(id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderOpen size={16} />
          Circuits
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen size={20} />
            Circuit Manager
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Save New Section */}
          <div className="border-b pb-4">
            <AnimatePresence mode="wait">
              {showSaveInput ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Circuit name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    autoFocus
                  />
                  <Button onClick={handleSave} disabled={isSaving || !newName.trim()}>
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setShowSaveInput(false)}>
                    <X size={16} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Button 
                    onClick={() => setShowSaveInput(true)} 
                    className="w-full gap-2"
                    variant="secondary"
                  >
                    <Plus size={16} />
                    Save Current Circuit
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Saved Circuits List */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Saved Circuits ({savedCircuits.length})
            </h4>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-muted-foreground" size={24} />
              </div>
            ) : savedCircuits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No saved circuits yet. Save your first circuit above!
              </div>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2 pr-2">
                  {savedCircuits.map((saved) => (
                    <motion.div
                      key={saved.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        "bg-muted/50 hover:bg-muted transition-colors group"
                      )}
                    >
                      <button
                        onClick={() => handleLoad(saved.id)}
                        className="flex-1 text-left"
                      >
                        <p className="font-medium text-sm">{saved.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(saved.updated_at).toLocaleDateString()}
                        </p>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={() => deleteCircuit(saved.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
