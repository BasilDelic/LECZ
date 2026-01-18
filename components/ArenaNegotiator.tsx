
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { negotiateBulkPrice } from '../services/gemini';
import { X, TrendingDown, TrendingUp, Send, CheckCircle2, AlertCircle, Sparkles, Loader2, Scale } from 'lucide-react';

interface ArenaNegotiatorProps {
  product: Product;
  onClose: () => void;
  onFinalize: (price: number, qty: number) => void;
}

const ArenaNegotiator: React.FC<ArenaNegotiatorProps> = ({ product, onClose, onFinalize }) => {
  const [qty, setQty] = useState(100);
  const [offer, setOffer] = useState(Math.floor(product.price * 0.9));
  const [history, setHistory] = useState<{ sender: 'user' | 'ai', price: number, text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'REJECTED'>('IDLE');

  const handleNegotiate = async () => {
    setIsLoading(true);
    const result = await negotiateBulkPrice(product.name, product.price, offer, qty, history);
    
    setHistory([...history, 
      { sender: 'user', price: offer, text: `I want ${qty} units at $${offer} each.` },
      { sender: 'ai', price: result.counterPrice, text: result.message }
    ]);

    if (result.decision === 'ACCEPTED') {
      setStatus('SUCCESS');
      setOffer(result.counterPrice);
    } else if (result.decision === 'REJECTED') {
      setStatus('REJECTED');
    } else {
      setOffer(result.counterPrice);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-zinc-950 w-full max-w-sm rounded-[3rem] border border-zinc-800 p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Animated Background Element */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="flex justify-between items-center relative">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Scale className="text-sky-500" />
              NEGOTIATOR
            </h2>
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em]">B2B Bulk Pricing AI Agent</p>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 relative">
          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Quantity</span>
                <span className="text-xl font-black text-white">{qty.toLocaleString()} units</span>
              </div>
              <input 
                type="range" min="10" max="2000" step="10" 
                value={qty} onChange={(e) => setQty(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">My Offer</span>
                <span className="text-xl font-black text-sky-500">${offer.toFixed(2)}/u</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setOffer(offer - 1)} className="flex-1 py-3 bg-zinc-800 rounded-xl flex items-center justify-center"><TrendingDown size={18}/></button>
                <button onClick={() => setOffer(offer + 1)} className="flex-1 py-3 bg-zinc-800 rounded-xl flex items-center justify-center"><TrendingUp size={18}/></button>
              </div>
            </div>
          </div>

          {/* Chat History (latest only) */}
          <div className="min-h-[80px] flex flex-col justify-center text-center px-4">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 text-zinc-500 animate-pulse">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Agent is calculating ROI...</span>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-2 animate-in slide-in-from-bottom duration-300">
                <p className="text-xs font-medium text-zinc-300 italic leading-relaxed">"{history[history.length - 1].text}"</p>
              </div>
            ) : (
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Merchant is waiting for your proposal</p>
            )}
          </div>

          {status === 'SUCCESS' ? (
            <button 
              onClick={() => onFinalize(offer, qty)}
              className="w-full py-5 bg-green-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-green-500/20"
            >
              <CheckCircle2 size={20} />
              ACCEPT & CHECKOUT
            </button>
          ) : (
            <button 
              onClick={handleNegotiate}
              disabled={isLoading}
              className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={18} />
              SEND PROPOSAL
            </button>
          )}

          <div className="flex items-center justify-center gap-2 text-zinc-700 text-[9px] font-black uppercase tracking-widest">
            <Sparkles size={10} />
            Negotiation backed by Arena AI logic
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaNegotiator;
