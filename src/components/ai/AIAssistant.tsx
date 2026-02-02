import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Lightbulb, Minimize2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAIChat } from '@/hooks/use-ai-chat';
import ReactMarkdown from 'react-markdown';

const INITIAL_MESSAGE = {
  id: '1',
  role: 'assistant' as const,
  content: `হ্যালো! 👋 আমি LogicBondhu, Trainer Board এর AI বন্ধু! 

আমি তোমাকে digital logic circuits শিখতে সাহায্য করব। তুমি যেকোনো প্রশ্ন করতে পারো - circuit design, IC pinout, truth tables, বা viva preparation!

**Quick tips:**
- 🔌 Left panel থেকে IC select করো
- 🔗 Wires tab থেকে jumper wire যোগ করো  
- ⚡ Power ON করতে ভুলো না!
- ❌ Wire/IC remove করতে hover করে X click করো

কোথা থেকে শুরু করতে চাও? 😊`,
  timestamp: new Date(),
};

const SUGGESTIONS = [
  { icon: '🔌', text: 'How does a NAND gate work?', bengali: 'NAND gate কিভাবে কাজ করে?' },
  { icon: '🔄', text: 'Explain JK flip-flop', bengali: 'JK flip-flop explain করো' },
  { icon: '📊', text: 'Generate truth table', bengali: 'Truth table বানাও' },
  { icon: '🎯', text: 'Check my circuit', bengali: 'আমার circuit check করো' },
];

export const AIAssistant = () => {
  const { messages: aiMessages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine initial message with AI messages
  const messages = aiMessages.length === 0 ? [INITIAL_MESSAGE] : aiMessages;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const messageText = input;
    setInput('');
    await sendMessage(messageText);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  const handleClear = () => {
    clearMessages();
  };

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        <Bot size={24} />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-1">
              LogicBondhu
              <Sparkles size={12} className="text-primary" />
            </h3>
            <p className="text-[10px] text-muted-foreground">
              AI Lab Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {aiMessages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleClear}
              title="Clear chat"
            >
              <Trash2 size={14} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 size={14} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 py-3">
        <div className="space-y-3 pr-2" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-2",
                  message.role === 'user' && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === 'assistant' 
                    ? "bg-primary/20" 
                    : "bg-secondary/20"
                )}>
                  {message.role === 'assistant' 
                    ? <Bot size={14} className="text-primary" />
                    : <User size={14} className="text-secondary" />
                  }
                </div>
                <div className={cn(
                  "max-w-[85%] text-sm",
                  message.role === 'assistant' ? "ai-bubble" : "user-bubble"
                )}>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot size={14} className="text-primary" />
              </div>
              <div className="ai-bubble">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Suggestions */}
      {aiMessages.length === 0 && (
        <div className="py-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1">
            <Lightbulb size={10} /> Quick questions:
          </p>
          <div className="flex flex-wrap gap-1">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="text-[10px] px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                {suggestion.icon} {suggestion.bengali}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="pt-3 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about DLD..."
            className="flex-1 text-sm h-9 bg-muted border-border"
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9"
            disabled={!input.trim() || isLoading}
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
