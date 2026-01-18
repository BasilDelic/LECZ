
import React, { useState, useEffect } from 'react';
import { Send, Image, Package, Search, Phone, MoreVertical, Sparkles, Truck, DollarSign, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { chatAssistantReply, negotiateShipping } from '../services/gemini';
import { Order, OrderStatus } from '../types';

const MessagingSystem: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'seller', text: 'Hello! I see you are interested in the Industrial Tablet X-9. For B2B orders, we need to calculate specific logistics based on your warehouse location.', time: '10:00 AM' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Mock Order for Negotiation Flow
  const [activeOrder, setActiveOrder] = useState<Order | null>({
    id: 'ord_123',
    productId: 'p1',
    buyerId: 'me',
    sellerId: 'u1',
    productPrice: 450.00,
    quantity: 50,
    status: OrderStatus.SHIPPING_DISCUSSION,
    timestamp: new Date().toISOString()
  });

  const [shippingInput, setShippingInput] = useState<string>('');
  const [logisticsFeedback, setLogisticsFeedback] = useState<any>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const myMsg = { id: Date.now().toString(), sender: 'me', text: input, time: 'Now' };
    setMessages([...messages, myMsg]);
    const currentInput = input;
    setInput('');
    
    setIsTyping(true);
    const reply = await chatAssistantReply(currentInput, "B2B Store Support. Discussing shipping for Tablet X-9 bulk order (50 units). Location: New York Port.");
    setIsTyping(false);
    
    setMessages(prev => [...prev, { id: Date.now().toString() + 'r', sender: 'seller', text: reply || 'Checking...', time: 'Now' }]);
  };

  const proposeShipping = async () => {
    if (!shippingInput) return;
    setIsTyping(true);
    const cost = parseFloat(shippingInput);
    const feedback = await negotiateShipping("Industrial Tablet X-9 (50 units)", "approx 75kg, 2 large crates", "New York Port", cost, messages);
    setLogisticsFeedback(feedback);
    setIsTyping(false);
    
    if (activeOrder) {
      setActiveOrder({
        ...activeOrder,
        shippingCost: cost,
        status: OrderStatus.SHIPPING_PROPOSED
      });
      setMessages(prev => [...prev, { 
        id: 'ship_' + Date.now(), 
        sender: 'seller', 
        text: `LOGISTICS PROPOSAL: I have calculated the shipping to your port. It will be $${cost}. ${feedback.feedback}`, 
        time: 'Now' 
      }]);
    }
  };

  const confirmOrder = () => {
    if (activeOrder) {
      setActiveOrder({ ...activeOrder, status: OrderStatus.AWAITING_PAYMENT });
      setMessages(prev => [...prev, { 
        id: 'conf_' + Date.now(), 
        sender: 'me', 
        text: `SHIPPING CONFIRMED: I agree to the $${activeOrder.shippingCost} logistics fare. Proceeding to checkout.`, 
        time: 'Now' 
      }]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-950 transition-colors">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center bg-white dark:bg-black z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800">
            <img src="https://picsum.photos/seed/s1/100" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-black dark:text-white">Titan Support</h2>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Direct Merchant
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-zinc-400">
          <button className="hover:text-sky-500 transition-colors"><Phone size={20} /></button>
          <button className="hover:text-sky-500 transition-colors"><Search size={20} /></button>
          <button className="hover:text-sky-500 transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Shipping Negotiation Widget */}
        {activeOrder && (
          <div className="bg-sky-500/5 border border-sky-500/20 rounded-[2rem] p-5 mb-6 animate-in slide-in-from-top duration-500 shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-sky-500 rounded-2xl text-white shadow-lg shadow-sky-500/20">
                   <Truck size={20} />
                </div>
                <div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-black dark:text-white">Logistics Negotiation</h3>
                   <p className="text-[9px] text-zinc-500 font-bold">Order #ORD-123-BULK</p>
                </div>
             </div>

             <div className="space-y-4">
                {activeOrder.status === OrderStatus.SHIPPING_DISCUSSION && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">Discuss and finalize the shipping cost with the seller below. The seller will propose a fee once logistics are calculated.</p>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <input 
                          type="number"
                          placeholder="Seller: Propose Fare"
                          value={shippingInput}
                          onChange={(e) => setShippingInput(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-8 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                      <button 
                        onClick={proposeShipping}
                        className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-lg active:scale-95"
                      >
                        PROPOSE
                      </button>
                    </div>
                  </div>
                )}

                {activeOrder.status === OrderStatus.SHIPPING_PROPOSED && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Proposed Fare</span>
                       <span className="text-xl font-black text-sky-500">${activeOrder.shippingCost}</span>
                    </div>
                    {logisticsFeedback && (
                      <div className="flex items-start gap-2 bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
                        <Info size={14} className="text-sky-500 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-zinc-400 leading-tight italic">{logisticsFeedback.feedback}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                       <button className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">Reject</button>
                       <button 
                        onClick={confirmOrder}
                        className="flex-[2] py-3 bg-sky-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
                       >
                         Confirm & Pay
                       </button>
                    </div>
                  </div>
                )}

                {activeOrder.status === OrderStatus.AWAITING_PAYMENT && (
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-2xl">
                     <CheckCircle2 size={24} className="text-green-500" />
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-green-500 uppercase">Fare Confirmed</p>
                        <p className="text-[10px] text-zinc-400 font-bold">Total: ${(activeOrder.productPrice * activeOrder.quantity + (activeOrder.shippingCost || 0)).toLocaleString()}</p>
                     </div>
                     <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Checkout</button>
                  </div>
                )}
             </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
              m.sender === 'me' 
                ? 'bg-sky-600 text-white rounded-tr-none' 
                : 'bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-tl-none'
            }`}>
              {m.text.includes('LOGISTICS PROPOSAL') ? (
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase text-sky-400 tracking-widest">
                      <Truck size={14} /> System Alert
                   </div>
                   <p className="font-medium">{m.text.replace('LOGISTICS PROPOSAL: ', '')}</p>
                </div>
              ) : (
                <p className="font-medium">{m.text}</p>
              )}
              <p className="text-[9px] opacity-40 mt-2 font-bold uppercase tracking-tighter text-right">{m.time}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-black uppercase tracking-widest animate-pulse ml-2">
            <Sparkles size={12} className="text-sky-500" />
            Merchant is typing...
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-900 pb-28 md:pb-6 sticky bottom-0 z-20 transition-colors">
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl px-4 py-3 border border-zinc-100 dark:border-zinc-800 shadow-inner group-focus-within:border-sky-500/50 transition-all">
          <button className="text-zinc-400 hover:text-sky-500 transition-colors"><Image size={20} /></button>
          <button className="text-zinc-400 hover:text-sky-500 transition-colors"><Package size={20} /></button>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Discuss shipping, MOQ, or lead times..." 
            className="flex-1 bg-transparent border-none outline-none text-sm py-1 text-black dark:text-white font-medium placeholder:text-zinc-500" 
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 bg-sky-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 active:scale-90 disabled:opacity-30 disabled:grayscale transition-all"
          >
            <Send size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;
