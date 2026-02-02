import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { LearningModeSelector } from '@/components/LearningModeSelector';
import { ICPalette } from '@/components/circuit/ICPalette';
import { TrainerBoard } from '@/components/circuit/TrainerBoard';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { ClockGenerator } from '@/components/circuit/ClockGenerator';
import { TruthTableDisplay } from '@/components/circuit/TruthTableDisplay';
import { useCircuitStore } from '@/store/circuit-store';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, User } from 'lucide-react';

const Index = () => {
  const showAIPanel = useCircuitStore(s => s.showAIPanel);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen overflow-hidden bg-background"
    >
      <Header />
      
      {/* Learning Mode Bar */}
      <div className="border-b border-border bg-gradient-to-r from-card/50 via-card/30 to-card/50 px-4 py-2 flex items-center justify-center">
        <LearningModeSelector />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - IC Palette & Tools */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={28}>
            <div className="h-full flex flex-col">
              <Tabs defaultValue="components" className="flex-1 flex flex-col">
                <TabsList className="mx-2 mt-2 grid grid-cols-2">
                  <TabsTrigger value="components" className="text-xs">Components</TabsTrigger>
                  <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
                </TabsList>
                
                <TabsContent value="components" className="flex-1 p-2 overflow-hidden">
                  <ICPalette />
                </TabsContent>
                
                <TabsContent value="tools" className="flex-1 p-2 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      <ClockGenerator />
                      <TruthTableDisplay />
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center Panel - Trainer Board */}
          <ResizablePanel defaultSize={showAIPanel ? 50 : 80}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full"
            >
              <TrainerBoard />
            </motion.div>
          </ResizablePanel>

          {showAIPanel && (
            <>
              <ResizableHandle withHandle />

              {/* Right Panel - AI Assistant */}
              <ResizablePanel defaultSize={30} minSize={22} maxSize={40}>
                <div className="h-full p-2">
                  <AIAssistant />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="border-t border-border bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-sm px-4 py-1.5 flex items-center justify-between text-[10px] text-muted-foreground"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Ready
          </span>
          <span>🔌 14 ICs available</span>
          <span className="hidden md:inline">📚 CSE-1201 aligned</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">⌨️ Space = Power | R = Reset</span>
          <div className="flex items-center gap-1.5">
            <Heart size={10} className="text-red-500 fill-red-500" />
            <span>by</span>
            <span className="font-semibold text-primary">Samin Yasar</span>
          </div>
          <span className="text-primary font-medium">v1.0</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
