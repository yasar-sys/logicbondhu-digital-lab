import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Lightbulb, HelpCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCircuitStore } from '@/store/circuit-store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: `হ্যালো! 👋 আমি LogicBondhu, তোমার DLD lab এর AI বন্ধু! 

আমি তোমাকে digital logic circuits শিখতে সাহায্য করব। তুমি যেকোনো প্রশ্ন করতে পারো - circuit design, IC pinout, truth tables, বা viva preparation!

**Quick tips:**
- 🔌 Left panel থেকে IC select করো
- ⚡ Power ON করতে ভুলো না!
- 🔗 Pin এ click করে wire connect করো

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
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const circuit = useCircuitStore(s => s.circuit);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (in production, this would call an AI API)
    setTimeout(() => {
      const response = generateResponse(input, circuit);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
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
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
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
      {messages.length <= 2 && (
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
            disabled={!input.trim() || isTyping}
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

// Simple response generator (would be replaced with actual AI API)
function generateResponse(input: string, circuit: any): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('nand') || lowerInput.includes('7400')) {
    return `NAND gate হলো universal gate! 🎯

**74LS00 IC তে 4টা NAND gate আছে।**

Truth Table:
| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

মনে রাখো: "AND এর উল্টা" - দুইটাই HIGH হলে output LOW!

Pin diagram:
- Pin 1, 2 → Input A, B
- Pin 3 → Output Y
- Pin 7 → GND
- Pin 14 → VCC (+5V)

এই IC দিয়ে তুমি যেকোনো logic gate বানাতে পারবে! 💪`;
  }

  if (lowerInput.includes('jk') || lowerInput.includes('flip') || lowerInput.includes('7476')) {
    return `JK Flip-Flop সবচেয়ে versatile flip-flop! 🔄

**74LS76 IC তে 2টা JK flip-flop আছে।**

| J | K | Q(next) |
|---|---|---------|
| 0 | 0 | Q (no change) |
| 0 | 1 | 0 (reset) |
| 1 | 0 | 1 (set) |
| 1 | 1 | Q̄ (toggle) |

**Important:** এটা negative edge triggered - মানে clock HIGH থেকে LOW যাওয়ার সময় কাজ করে!

Pro tip: J=K=1 দিলে output toggle করে - এটা counter বানাতে কাজে লাগে! 😊`;
  }

  if (lowerInput.includes('truth') || lowerInput.includes('table')) {
    return `Truth table generate করতে:

1️⃣ প্রথমে তোমার circuit সাজাও
2️⃣ Input switches connect করো
3️⃣ Output LEDs connect করো
4️⃣ Power ON করো

তারপর আমি automatically truth table বানিয়ে দিব!

তোমার current circuit এ ${circuit.ics.length}টা IC আছে।
${circuit.powerOn ? '✅ Power ON আছে' : '❌ Power ON করো!'}`;
  }

  if (lowerInput.includes('check') || lowerInput.includes('circuit')) {
    const icCount = circuit.ics.length;
    const wireCount = circuit.wires.length;
    
    if (icCount === 0) {
      return `তোমার board এ এখনো কোনো IC নেই! 

👉 Left panel থেকে একটা IC select করো
👉 Board এ click করে place করো
👉 তারপর আমাকে বলো!`;
    }

    return `তোমার circuit analysis:

📊 **Components:**
- ICs: ${icCount}টা
- Wires: ${wireCount}টা
- Power: ${circuit.powerOn ? '✅ ON' : '❌ OFF'}

${!circuit.powerOn ? '⚠️ Power ON করতে ভুলো না!' : ''}

কোনো specific সমস্যা আছে? আমাকে জানাও! 🔍`;
  }

  // Default response
  return `ভালো প্রশ্ন! 👍

আমি তোমাকে সাহায্য করতে পারি:
- 🔌 IC selection ও pinout
- 📊 Truth table generation
- 🔍 Circuit debugging
- 📚 Viva preparation
- ⚡ Timing diagrams

কী নিয়ে জানতে চাও? 😊`;
}
