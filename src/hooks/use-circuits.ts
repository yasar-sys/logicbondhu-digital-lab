import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCircuitStore } from '@/store/circuit-store';
import { toast } from 'sonner';
import { Circuit } from '@/types/circuit';
import { Json } from '@/integrations/supabase/types';

interface SavedCircuit {
  id: string;
  name: string;
  data: Circuit & { jumperWires: any[] };
  created_at: string;
  updated_at: string;
}

export function useCircuits() {
  const [savedCircuits, setSavedCircuits] = useState<SavedCircuit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const circuit = useCircuitStore(s => s.circuit);
  const jumperWires = useCircuitStore(s => s.jumperWires);
  const setCircuit = useCircuitStore(s => s.setCircuit);

  const fetchCircuits = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setSavedCircuits((data || []).map(d => ({
        ...d,
        data: d.data as unknown as SavedCircuit['data']
      })));
    } catch (error) {
      console.error("Error fetching circuits:", error);
      toast.error("Failed to load saved circuits");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCircuit = useCallback(async (name: string) => {
    if (!name.trim()) {
      toast.error("Please enter a circuit name");
      return null;
    }

    setIsSaving(true);
    try {
      const circuitData = {
        ...circuit,
        jumperWires,
      };

      const { data, error } = await supabase
        .from('circuits')
        .insert([{
          name: name.trim(),
          data: circuitData as unknown as Json,
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success(`Circuit "${name}" saved! ✅`);
      await fetchCircuits();
      return data;
    } catch (error) {
      console.error("Error saving circuit:", error);
      toast.error("Failed to save circuit");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [circuit, jumperWires, fetchCircuits]);

  const loadCircuit = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const circuitData = data.data as unknown as SavedCircuit['data'];
      
      // Update the store with loaded circuit
      const { jumperWires: loadedWires, ...loadedCircuit } = circuitData;
      setCircuit(loadedCircuit as Circuit);
      
      // Update jumper wires separately in the store
      useCircuitStore.setState({ jumperWires: loadedWires || [] });
      
      toast.success(`Loaded "${data.name}" 📂`);
    } catch (error) {
      console.error("Error loading circuit:", error);
      toast.error("Failed to load circuit");
    } finally {
      setIsLoading(false);
    }
  }, [setCircuit]);

  const deleteCircuit = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('circuits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Circuit deleted 🗑️");
      await fetchCircuits();
    } catch (error) {
      console.error("Error deleting circuit:", error);
      toast.error("Failed to delete circuit");
    }
  }, [fetchCircuits]);

  return {
    savedCircuits,
    isLoading,
    isSaving,
    fetchCircuits,
    saveCircuit,
    loadCircuit,
    deleteCircuit,
  };
}
