import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { chatWithTutor } from '../services/gemini';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export const AITutor = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: "Hi! I'm your LearnSphere tutor. Ask me anything about Machine Learning!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithTutor(userMsg, messages);
      setMessages(prev => [...prev, { role: 'bot', content: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "Oops, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-bottom border-black/5 bg-zinc-50 flex items-center gap-2">
        <Bot className="w-5 h-5 text-emerald-600" />
        <span className="font-semibold text-zinc-900">AI Tutor</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-zinc-100 text-zinc-800 rounded-tl-none'
              }`}>
                <div className="flex items-center gap-2 mb-1 opacity-70">
                  {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {msg.role === 'user' ? 'You' : 'LearnSphere AI'}
                  </span>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span className="text-xs text-zinc-500">Tutor is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-black/5 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-zinc-50 border border-black/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
