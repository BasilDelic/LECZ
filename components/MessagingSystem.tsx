
import React, { useState } from 'react';
import { Send, Image, Package, Search, Phone, MoreVertical, Sparkles } from 'lucide-react';
import { chatAssistantReply } from '../services/gemini';

const MessagingSystem: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'seller', text: 'Hello! How can I help you today with the UltraTab?', time: '10:00 AM' },
    { id: '2', sender: 'me', text: 'Does this include the stylus?', time: '10:02 AM' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const myMsg = { id: Date.now().toString(), sender: 'me', text: input, time: 'Now' };
    setMessages([...messages, myMsg]);
    const currentInput = input;
    setInput('');
    
    // AI Assistant Help
    setIsTyping(true);
    const reply = await chatAssistantReply(currentInput, "Selling UltraTab Pro 12, stylus included in pro bundle.");
    setIsTyping(false);
    
    setMessages(prev => [...prev, { id: Date.now().toString() + 'r', sender: 'seller', text: reply || 'Checking...', time: 'Now' }]);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden"><img src="https://picsum.photos/seed/s1/100" /></div>
          <div><h2 className="font-bold text-sm">TechStore Support</h2><p className="text-[10px] text-green-500">Active Now</p></div>
        </div>
        <div className="flex gap-4 text-zinc-400"><Phone size={20} /><Search size={20} /><MoreVertical size={20} /></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.sender === 'me' ? 'bg-sky-600' : 'bg-zinc-900 border border-zinc-800'}`}>
              <p>{m.text}</p>
              <p className="text-[10px] opacity-50 mt-1">{m.time}</p>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-zinc-500 animate-pulse flex items-center gap-1"><Sparkles size={10} /> AI is thinking...</div>}
      </div>

      <div className="p-4 bg-black border-t border-zinc-900 pb-20">
        <div className="flex items-center gap-3 bg-zinc-900 rounded-2xl px-4 py-2 border border-zinc-800">
          <button className="text-zinc-500"><Image size={20} /></button>
          <button className="text-zinc-500"><Package size={20} /></button>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about shipping, stock..." 
            className="flex-1 bg-transparent border-none outline-none text-sm py-2" 
          />
          <button onClick={handleSend} className="text-sky-500"><Send size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;
